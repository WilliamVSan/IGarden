async function loadPlantRecommendations() {
    try {
        const response = await fetch('data/plantRecommendations.json');
        return await response.json();
    } catch (error) {
        return {};
    }
}

function getDueNotifications(plants, recommendations, now) {
    const notifications = [];
    plants.forEach(plant => {
        const rec = recommendations[plant.type];
        if (!rec || !rec.notifications) return;
        const createdAt = new Date(plant.createdAt || plant.timestamp || Date.now());
        rec.notifications.forEach(notif => {

            const intervalMs = notif.intervalDays * 24 * 60 * 60 * 1000;
            let nextDue = new Date(createdAt);
            while (nextDue <= now) {
                nextDue = new Date(nextDue.getTime() + intervalMs);
            }

            const lastDue = new Date(nextDue.getTime() - intervalMs);

            if (now >= lastDue && now < nextDue) {
                notifications.push({
                    plantName: plant.name,
                    plantType: plant.type,
                    message: notif.message,
                    dueDate: lastDue
                });
            }
        });
    });
    return notifications;
}

function getNotificationIcon(type) {
    switch (type) {
        case "Rega":
            return '<i class="fas fa-tint" style="color:#4FC3F7"></i>';
        case "Cuidado":
            return '<i class="fas fa-cut" style="color:#81C784"></i>';
        case "Extra":
            return '<i class="fas fa-info-circle" style="color:#FFD54F"></i>';
        default:
            return '<i class="fas fa-bell"></i>';
    }
}

async function renderNotifications() {
    const list = document.getElementById('notifications-list');
    list.innerHTML = '';
    const plants = JSON.parse(localStorage.getItem('plants') || '[]');
    const recommendations = await loadPlantRecommendations();
    const now = new Date(localStorage.getItem('userCurrentTime') || new Date());

    const removed = JSON.parse(localStorage.getItem('removedNotifications') || '[]');

    const notifications = getDueNotifications(plants, recommendations, now)
        .filter(n => !removed.some(r =>
            r.plantName === n.plantName &&
            r.message === n.message &&
            r.dueDate === n.dueDate?.toISOString()
        ));

    if (notifications.length === 0) {
        list.innerHTML = '<li>Nenhuma notificação no momento.</li>';
        return;
    }

    notifications.forEach(n => {
        const rec = recommendations[n.plantType];
        let notifType = "Extra";
        if (rec && rec.notifications) {
            const found = rec.notifications.find(notif => notif.message === n.message);
            if (found && found.type) notifType = found.type;
        }
        const li = document.createElement('li');
        li.innerHTML = `${getNotificationIcon(notifType)} <span>${n.message} <b>(${n.plantName})</b></span>`;
        li.classList.add('notification-' + notifType.toLowerCase());

        let startX = null;
        li.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        li.addEventListener('touchmove', function(e) {
            if (startX === null) return;
            const diffX = e.touches[0].clientX - startX;
            li.style.transform = `translateX(${diffX}px)`;
            li.style.opacity = `${1 - Math.abs(diffX) / 120}`;
        });
        li.addEventListener('touchend', function(e) {
            if (startX === null) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            if (Math.abs(diffX) > 80) {
                removeNotification(n, li);
            } else {
                li.style.transform = '';
                li.style.opacity = '';
            }
            startX = null;
        });

        let mouseStartX = null;
        li.addEventListener('mousedown', function(e) {
            mouseStartX = e.clientX;
        });
        li.addEventListener('mousemove', function(e) {
            if (mouseStartX === null) return;
            const diffX = e.clientX - mouseStartX;
            li.style.transform = `translateX(${diffX}px)`;
            li.style.opacity = `${1 - Math.abs(diffX) / 120}`;
        });
        li.addEventListener('mouseup', function(e) {
            if (mouseStartX === null) return;
            const diffX = e.clientX - mouseStartX;
            if (Math.abs(diffX) > 80) {
                removeNotification(n, li);
            } else {
                li.style.transform = '';
                li.style.opacity = '';
            }
            mouseStartX = null;
        });
        li.addEventListener('mouseleave', function() {
            mouseStartX = null;
            li.style.transform = '';
            li.style.opacity = '';
        });

        list.appendChild(li);
    });
}

function removeNotification(notification, li) {
    const removed = JSON.parse(localStorage.getItem('removedNotifications') || '[]');
    removed.push({
        plantName: notification.plantName,
        message: notification.message,
        dueDate: notification.dueDate?.toISOString?.() || ''
    });
    localStorage.setItem('removedNotifications', JSON.stringify(removed));
    li.style.transition = 'transform 0.2s, opacity 0.2s';
    li.style.transform = 'translateX(-120%)';
    li.style.opacity = '0';
    setTimeout(() => {
        li.remove();

        if (!document.querySelector('#notifications-list li')) {
            document.getElementById('notifications-list').innerHTML = '<li>Nenhuma notificação no momento.</li>';
        }
    }, 200);
}

document.addEventListener('DOMContentLoaded', renderNotifications);
