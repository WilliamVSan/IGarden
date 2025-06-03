var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
}

function scrollToCenter(event, targetId) {
    event.preventDefault();
    const element = document.getElementById(targetId);

    if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;

        const scrollOffset = window.scrollY + elementTop - (windowHeight / 2) + (elementHeight / 2);

        window.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
        });
    }
}

document.querySelector('.counter-top-right').addEventListener('click', toggleMenuOptions);
document.querySelector('.counter-top-right i').addEventListener('click', toggleMenuOptions);

function toggleMenuOptions() {
    const menuOptions = document.getElementById('menu-options');
    const counterButton = document.querySelector('.counter-top-right');
    if (menuOptions.style.display === 'block') {
        menuOptions.style.display = 'none';
    } else {
        const rect = counterButton.getBoundingClientRect();
        menuOptions.style.display = 'block';
        menuOptions.style.position = 'absolute';
        menuOptions.style.top = `${rect.bottom + window.scrollY}px`;
        menuOptions.style.right = `${window.innerWidth - rect.right}px`;
    }
}

document.addEventListener('click', function (event) {
    const menuOptions = document.getElementById('menu-options');
    const counterButton = document.querySelector('.counter-top-right');
    if (menuOptions.style.display === 'block' && !menuOptions.contains(event.target) && event.target !== counterButton) {
        menuOptions.style.display = 'none';
    }
});

document.querySelector('.button-menu').addEventListener('click', function () {
    const sortOptions = document.getElementById('sort-options');
    const buttonMenu = document.querySelector('.button-menu');
    if (sortOptions.style.display === 'block') {
        sortOptions.style.display = 'none';
    } else {
        const rect = buttonMenu.getBoundingClientRect();
        sortOptions.style.display = 'block';
        sortOptions.style.position = 'absolute';
        sortOptions.style.top = `${rect.bottom + window.scrollY}px`;
        sortOptions.style.right = `${window.innerWidth - rect.right}px`;
    }
});

document.addEventListener('click', function (event) {
    const sortOptions = document.getElementById('sort-options');
    const buttonMenu = document.querySelector('.button-menu');
    if (sortOptions.style.display === 'block' && !sortOptions.contains(event.target) && event.target !== buttonMenu) {
        sortOptions.style.display = 'none';
    }
});

document.querySelector('.button-top-left').addEventListener('click', function () {
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu.style.display === 'block') {
        profileMenu.style.display = 'none';
    } else {
        const rect = this.getBoundingClientRect();
        profileMenu.style.display = 'block';
        profileMenu.style.position = 'absolute';
        profileMenu.style.top = `${rect.bottom + window.scrollY}px`;
        profileMenu.style.left = `${rect.left + window.scrollX}px`;
    }
});

document.addEventListener('click', function (event) {
    const profileMenu = document.getElementById('profile-menu');
    const buttonTopLeft = document.querySelector('.button-top-left');
    if (
        profileMenu.style.display === 'block' &&
        !profileMenu.contains(event.target) &&
        event.target !== buttonTopLeft
    ) {
        profileMenu.style.display = 'none';
    }
});

document.getElementById('profile-menu-notifications').addEventListener('click', function () {
    window.location.href = 'notificacoes.html';
});

async function hasPendingNotifications() {
    const recommendations = await fetch('data/plantRecommendations.json').then(r => r.json()).catch(() => ({}));
    const plants = JSON.parse(localStorage.getItem('plants') || '[]');
    const now = new Date(localStorage.getItem('userCurrentTime') || new Date());
    const removed = JSON.parse(localStorage.getItem('removedNotifications') || '[]');

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
        return notifications.filter(n =>
            !removed.some(r =>
                r.plantName === n.plantName &&
                r.message === n.message &&
                r.dueDate === n.dueDate?.toISOString()
            )
        );
    }

    const due = getDueNotifications(plants, recommendations, now);
    return due.length > 0;
}

async function updateCardCounter() {
    const cardsContainer = document.querySelector('.cards-container');
    const counterButton = document.querySelector('.counter-top-right');
    const cardCount = cardsContainer.children.length;

    let globalAlert = document.querySelector('.global-notification-alert');
    if (globalAlert) globalAlert.remove();

    counterButton.innerHTML = `<i class="fas fa-seedling"></i> ${cardCount}`;

    const btnLeft = document.querySelector('.button-top-left');
    if (await hasPendingNotifications()) {
        if (btnLeft && !btnLeft.querySelector('.global-notification-alert')) {
            const alert = document.createElement('span');
            alert.className = 'global-notification-alert';
            alert.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            btnLeft.appendChild(alert);
        }

        const notifBtn = document.getElementById('profile-menu-notifications');
        if (notifBtn && !notifBtn.querySelector('.profile-menu-notification-alert')) {
            const alert = document.createElement('span');
            alert.className = 'profile-menu-notification-alert';
            alert.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            notifBtn.appendChild(alert);
        }
    } else {
        if (btnLeft) {
            const alert = btnLeft.querySelector('.global-notification-alert');
            if (alert) alert.remove();
        }
        
        const notifBtn = document.getElementById('profile-menu-notifications');
        if (notifBtn) {
            const alert = notifBtn.querySelector('.profile-menu-notification-alert');
            if (alert) alert.remove();
        }
    }
}

function checkForCards() {
    const cardsContainer = document.querySelector('.cards-container');
    const noCardsMessage = document.getElementById('no-cards-message');

    if (cardsContainer.children.length === 0) {
        if (!noCardsMessage) {
            const message = document.createElement('p');
            message.id = 'no-cards-message';
            message.textContent = 'Ainda não existem plantas cadastradas';
            message.style.textAlign = 'center';
            message.style.color = '#585952';
            cardsContainer.parentElement.appendChild(message);
        }
    } else {
        if (noCardsMessage) {
            noCardsMessage.remove();
        }
    }

    updateCardCounter();
}

async function fetchNounProjectIcons() {
    const endpoint = `/icons`;


    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ícones: ${response.statusText}`);
        }
        const data = await response.json();
        return data.icons.map(icon => icon.preview_url);
    } catch (error) {
        console.error("Erro ao carregar os ícones:", error);
        return [];
    }
}

let nextPageToken = null;
let prevPageToken = null;

async function loadIconSelector(pageToken = null, isNext = true) {
    const iconSelector = document.getElementById('icon-selector');
    iconSelector.innerHTML = '';

    try {
        const endpoint = pageToken
            ? `/icons?${isNext ? 'next_page' : 'prev_page'}=${pageToken}`
            : `/icons`;

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ícones: ${response.statusText}`);
        }

        const data = await response.json();
        const icons = data.icons;

        if (icons.length === 0 && !pageToken) {
            iconSelector.innerHTML = '<p>Não foi possível carregar os ícones.</p>';
            return;
        }

        icons.forEach(icon => {
            const img = document.createElement('img');
            img.src = icon.thumbnail_url;
            img.alt = icon.term;
            img.title = icon.term;
            img.classList.add('icon-option');

            img.addEventListener('click', () => {
                document.querySelectorAll('.icon-selector img').forEach(img => img.classList.remove('selected'));
                img.classList.add('selected');
            });

            iconSelector.appendChild(img);
        });

        nextPageToken = data.next_page || null;
        prevPageToken = data.prev_page || null;

        let prevPageButton = document.querySelector('.prev-page-button');
        if (!prevPageButton) {
            prevPageButton = document.createElement('button');
            prevPageButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
            prevPageButton.classList.add('prev-page-button');
            iconSelector.appendChild(prevPageButton);
        }
        if (!prevPageToken) {
            prevPageButton.disabled = true;
            prevPageButton.style.backgroundColor = '#d3d3d3';
            prevPageButton.style.cursor = 'not-allowed';
            prevPageButton.removeEventListener('click', handlePrevPageClick);
        } else {
            prevPageButton.disabled = false;
            prevPageButton.style.backgroundColor = '';
            prevPageButton.style.cursor = 'pointer';
            prevPageButton.addEventListener('click', handlePrevPageClick);
        }

        let nextPageButton = document.querySelector('.next-page-button');
        if (!nextPageButton) {
            nextPageButton = document.createElement('button');
            nextPageButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
            nextPageButton.classList.add('next-page-button');
            iconSelector.appendChild(nextPageButton);
        }
        if (!nextPageToken) {
            nextPageButton.disabled = true;
            nextPageButton.style.backgroundColor = '#d3d3d3';
            nextPageButton.style.cursor = 'not-allowed';
            nextPageButton.removeEventListener('click', handleNextPageClick);
        } else {
            nextPageButton.disabled = false;
            nextPageButton.style.backgroundColor = '';
            nextPageButton.style.cursor = 'pointer';
            nextPageButton.addEventListener('click', handleNextPageClick);
        }
    } catch (error) {
        console.error('Erro ao carregar os ícones:', error);
        if (!pageToken) {
            iconSelector.innerHTML = '<p>Erro ao carregar os ícones.</p>';
        }
    }
}

function handlePrevPageClick() {
    if (prevPageToken) {
        loadIconSelector(prevPageToken, false);
    }
}

function handleNextPageClick() {
    if (nextPageToken) {
        loadIconSelector(nextPageToken, true);
    }
}

async function addCard() {
    const cardsContainer = document.querySelector('.cards-container');
    const iconUrl = await fetchNounProjectIcon('plant');

    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.dataset.timestamp = Date.now();
    newCard.dataset.plantType = 'Nova Planta';
    newCard.dataset.waterLevel = 50;
    newCard.dataset.temperature = 25;
    newCard.dataset.lightLevel = 60;
    newCard.innerHTML = `
        <div class="card-favorite">
            <i class="fas fa-heart"></i>
        </div>
        <div class="card-icon">
            ${iconUrl ? `<img src="${iconUrl}" alt="Ícone de planta" class="noun-icon">` : '<i class="noun-icon">🌱</i>'}
        </div>
        <div class="card-icons">
            <i class="fas fa-tint"></i>
            <i class="fas fa-sun"></i>
            <i class="fas fa-lightbulb"></i>
        </div>
    `;
    cardsContainer.appendChild(newCard);

    newCard.addEventListener('click', () => showCardDetails(newCard));

    checkForCards();
    savePlantsToLocalStorage();
}

function savePlantsToLocalStorage() {
    const cardsContainer = document.querySelector('.cards-container');
    const plants = Array.from(cardsContainer.children).map(card => ({
        name: card.querySelector('.card-subtitle')?.textContent || 'N/A',
        type: card.dataset.plantType || 'N/A',
        waterLevel: card.dataset.waterLevel || 'N/A',
        temperature: card.dataset.temperature || 'N/A',
        lightLevel: card.dataset.lightLevel || 'N/A',
        favorited: card.querySelector('.card-favorite').classList.contains('favorited'),
        timestamp: card.dataset.timestamp || Date.now(),
        createdAt: card.dataset.createdAt || new Date().toISOString(),
        imageUrl: card.querySelector('.card-icon img')?.src || null,
        iconUrl: card.querySelector('.card-icon i.noun-icon')?.style.backgroundImage?.slice(5, -2) || null
    }));
    setUserPlants(plants);
    updateResumoBarras();
}

function loadPlantsFromLocalStorage() {
    const plants = getUserPlants();
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = '';

    plants.forEach(plant => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.dataset.timestamp = plant.timestamp;
        newCard.dataset.createdAt = plant.createdAt || new Date().toISOString();
        newCard.dataset.plantType = plant.type;
        newCard.dataset.waterLevel = plant.waterLevel;
        newCard.dataset.temperature = plant.temperature;
        newCard.dataset.lightLevel = plant.lightLevel;
        newCard.innerHTML = `
            <div class="card-favorite ${plant.favorited ? 'favorited' : ''}">
                <i class="fas fa-heart"></i>
            </div>
            <div class="card-icon">
                ${plant.imageUrl
                ? `<img src="${plant.imageUrl}" alt="Imagem carregada" class="noun-icon">`
                : plant.iconUrl
                    ? `<i class="noun-icon" style="background-image: url('${plant.iconUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center;"></i>`
                    : '<i class="noun-icon">🌱</i>'
            }
            </div>
            <h4 class="card-subtitle">${plant.name}</h4> <!-- Adicionado para garantir que o título seja exibido -->
            <div class="card-icons">
                <i class="fas fa-tint"></i>
                <i class="fas fa-sun"></i>
                <i class="fas fa-lightbulb"></i>
            </div>
        `;
        cardsContainer.appendChild(newCard);

        newCard.addEventListener('click', () => showCardDetails(newCard));
    });

    checkForCards();
    updateCardCounter();
    updateResumoBarras();
}

document.getElementById('menu-add-card').addEventListener('click', function () {
    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'flex';
    loadIconSelector();
});

document.querySelector('.close-modal').addEventListener('click', function () {
    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'none';
});

document.getElementById('add-card-modal').addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

window.capturedImageDataUrl = window.capturedImageDataUrl || null;
window.isCapturedImageSelected = window.isCapturedImageSelected || false;

document.getElementById('add-card-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const plantName = document.getElementById('plant-name').value;
    const plantType = document.getElementById('plant-type').value;
    const recommendations = plantRecommendations[plantType];

    const selectedIcon = document.querySelector('.icon-selector img.selected');
    const iconUrl = selectedIcon ? selectedIcon.src : null;

    const imageUpload = document.getElementById('image-upload').files[0];
    let imageUrl = null;

    if (window.capturedImageDataUrl && window.isCapturedImageSelected) {
        imageUrl = window.capturedImageDataUrl;
    } else if (imageUpload) {
        imageUrl = URL.createObjectURL(imageUpload);
    }

    const cardsContainer = document.querySelector('.cards-container');
    const createdAt = new Date().toISOString();
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.dataset.timestamp = Date.now();
    newCard.dataset.createdAt = createdAt;
    newCard.dataset.plantType = plantType;
    newCard.dataset.waterLevel = recommendations.waterLevel;
    newCard.dataset.temperature = recommendations.temperature;
    newCard.dataset.lightLevel = recommendations.lightLevel;
    newCard.innerHTML = `
        <div class="card-favorite">
            <i class="fas fa-heart"></i>
        </div>
        <div class="card-icon">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="Imagem carregada" class="noun-icon">`
            : iconUrl
                ? `<i class="noun-icon" style="background-image: url('${iconUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center;"></i>`
                : '<i class="noun-icon">🌱</i>'
        }
        </div>
        <h4 class="card-subtitle">${plantName}</h4>
        <div class="card-icons">
            <i class="fas fa-tint"></i>
            <i class="fas fa-sun"></i>
            <i class="fas fa-lightbulb"></i>
        </div>
    `;
    cardsContainer.appendChild(newCard);

    const favoriteIcon = newCard.querySelector('.card-favorite');
    favoriteIcon.addEventListener('click', () => {
        favoriteIcon.classList.toggle('favorited');
        savePlantsToLocalStorage();
    });

    checkForCards();
    savePlantsToLocalStorage();

    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'none';

    document.getElementById('add-card-form').reset();
    document.querySelectorAll('.icon-selector img').forEach(img => img.classList.remove('selected'));

    window.capturedImageDataUrl = null;
    window.isCapturedImageSelected = false;
    if (typeof updateImagePreview === 'function') updateImagePreview(null);
});

let plantRecommendations = {};

async function loadPlantRecommendations() {
    try {
        const response = await fetch('data/plantRecommendations.json');
        plantRecommendations = await response.json();
    } catch (error) {
        console.error('Erro ao carregar recomendações de plantas:', error);
        plantRecommendations = {};
    }
}

document.getElementById('plant-type').addEventListener('change', function () {
    const selectedType = this.value;
    const recommendations = plantRecommendations[selectedType];

    if (recommendations) {
        console.log(`Valores recomendados para ${selectedType}:`, recommendations);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadPlantRecommendations();
    loadPlantsFromLocalStorage();
    checkForCards();
    updateCardCounter();
    getUserLocation();
    updateResumoBarras();

    document.querySelectorAll('.card-favorite').forEach(favoriteIcon => {
        favoriteIcon.onclick = null;
    });

    const toggleResumoBtn = document.getElementById('toggle-resumo-btn');
    const userWeather = document.getElementById('user-weather');
    const resumoBarras = document.getElementById('resumo-barras');
    if (toggleResumoBtn && userWeather && resumoBarras) {
        toggleResumoBtn.addEventListener('click', function () {
            if (userWeather.classList.contains('collapsed')) {
                userWeather.classList.remove('collapsed');
                resumoBarras.classList.remove('collapsed');
                toggleResumoBtn.classList.remove('collapsed');
            } else {
                userWeather.classList.add('collapsed');
                resumoBarras.classList.add('collapsed');
                toggleResumoBtn.classList.add('collapsed');
            }
        });
    }

    loadCustomOrder();
});

function sortCards(criteria) {
    const cardsContainer = document.querySelector('.cards-container');
    const cards = Array.from(cardsContainer.children);

    if (criteria === 'favorites') {
        cards.sort((a, b) => {
            const aFavorited = a.querySelector('.card-favorite').classList.contains('favorited');
            const bFavorited = b.querySelector('.card-favorite').classList.contains('favorited');
            return bFavorited - aFavorited;
        });
    } else if (criteria === 'date-asc') {
        cards.sort((a, b) => a.dataset.timestamp - b.dataset.timestamp);
    } else if (criteria === 'date-desc') {
        cards.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
    }

    cards.forEach(card => cardsContainer.appendChild(card));
}

document.getElementById('sort-by-favorites').addEventListener('click', () => sortCards('favorites'));
document.getElementById('sort-by-date').addEventListener('click', () => {
    const sortByDateButton = document.getElementById('sort-by-date');
    if (sortByDateButton.dataset.order === 'asc') {
        sortCards('date-desc');
        sortByDateButton.dataset.order = 'desc';
        sortByDateButton.innerHTML = '<i class="fas fa-hourglass-end"></i>';
    } else {
        sortCards('date-asc');
        sortByDateButton.dataset.order = 'asc';
        sortByDateButton.innerHTML = '<i class="fas fa-hourglass-start"></i>';
    }
});

function showCardDetails(card) {
    const modal = document.getElementById('view-card-modal');
    const plantName = card.querySelector('.card-subtitle')?.textContent || 'N/A';
    const plantType = card.dataset.plantType || 'N/A';
    const lightLevel = card.dataset.lightLevel || 'N/A';

    const userWeather = JSON.parse(localStorage.getItem('userWeather')) || {};
    const currentTemperature = userWeather.temperature || 'N/A';
    const currentHumidity = userWeather.humidity || 'N/A';

    const iconElement = card.querySelector('.card-icon img') || card.querySelector('.card-icon i.noun-icon');
    const viewPlantIcon = document.getElementById('view-plant-icon');
    viewPlantIcon.innerHTML = '';
    if (iconElement) {
        if (iconElement.tagName === 'IMG') {
            const img = document.createElement('img');
            img.src = iconElement.src;
            img.alt = 'Plant Icon';
            viewPlantIcon.appendChild(img);
        } else if (iconElement.tagName === 'I') {
            const icon = document.createElement('i');
            icon.className = iconElement.className;
            icon.style.backgroundImage = iconElement.style.backgroundImage;
            icon.style.backgroundSize = iconElement.style.backgroundSize;
            icon.style.backgroundRepeat = iconElement.style.backgroundRepeat;
            icon.style.backgroundPosition = iconElement.style.backgroundPosition;
            viewPlantIcon.appendChild(icon);
        }
    }

    document.getElementById('view-plant-title').textContent = plantName;
    document.getElementById('view-plant-type').textContent = plantType;

    document.getElementById('view-plant-temperature').textContent = `${currentTemperature}ºC`;
    document.getElementById('view-plant-water').textContent = `${currentHumidity}%`;
    document.getElementById('view-plant-light').textContent = `${lightLevel}`;

    const recommendations = plantRecommendations[plantType];
    if (recommendations) {
        const tempAvg = ((recommendations.temperature.min + recommendations.temperature.max) / 2).toFixed(1);
        const waterAvg = ((recommendations.waterLevel.min + recommendations.waterLevel.max) / 2).toFixed(1);

        document.querySelector('#view-plant-temperature + .recommended-value').textContent = `(Média Recomendada: ${tempAvg}ºC)`;
        document.querySelector('#view-plant-water + .recommended-value').textContent = `(Média Recomendada: ${waterAvg}%)`;
    }

    const favoriteButton = document.getElementById('modal-favorite-button');
    const favoriteIcon = favoriteButton.querySelector('i');
    const isFavorited = card.querySelector('.card-favorite').classList.contains('favorited');

    favoriteIcon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';

    favoriteButton.onclick = () => {
        const cardFavoriteIcon = card.querySelector('.card-favorite');
        cardFavoriteIcon.classList.toggle('favorited');
        favoriteIcon.className = cardFavoriteIcon.classList.contains('favorited') ? 'fas fa-heart' : 'far fa-heart';
        savePlantsToLocalStorage();
    };

    modal.style.display = 'flex';
}

document.querySelector('.cards-container').addEventListener('click', function (event) {
    const card = event.target.closest('.card');
    if (card) {
        showCardDetails(card);
    }
});

function updateFavoritesList() {
    const cardsContainer = document.querySelector('.cards-container');
    const favoriteCards = Array.from(cardsContainer.children).filter(card =>
        card.querySelector('.card-favorite').classList.contains('favorited')
    );

    console.log('Lista de favoritos atualizada:', favoriteCards.map(card => ({
        name: card.querySelector('.card-subtitle')?.textContent || 'N/A',
        type: card.dataset.plantType || 'N/A'
    })));
}

let cardToDelete = null;

document.querySelector('.close-view-modal').addEventListener('click', function () {
    const modal = document.getElementById('view-card-modal');
    cardToDelete = Array.from(document.querySelector('.cards-container').children).find(card =>
        card.querySelector('.card-subtitle')?.textContent === document.getElementById('view-plant-title').textContent
    );

    if (cardToDelete) {
        const confirmDeleteModal = document.getElementById('confirm-delete-modal');
        confirmDeleteModal.style.display = 'flex';
    }
});

document.getElementById('confirm-delete-button').addEventListener('click', function () {
    if (cardToDelete) {
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.removeChild(cardToDelete);
        savePlantsToLocalStorage();
        checkForCards();
        cardToDelete = null;
    }

    document.getElementById('confirm-delete-modal').style.display = 'none';
    document.getElementById('view-card-modal').style.display = 'none';
});

document.getElementById('cancel-delete-button').addEventListener('click', function () {
    cardToDelete = null;
    document.getElementById('confirm-delete-modal').style.display = 'none';
});

document.getElementById('view-card-modal').addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

function adjustIconColorsBasedOnConditions(temperature, humidity) {
    const tolWarning = 0.2;
    const tolCritical = 0.4;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const plantType = card.dataset.plantType;
        const recommendations = plantRecommendations[plantType];

        let hasCritical = false;

        if (recommendations) {
            const { min: tempMin, max: tempMax } = recommendations.temperature;
            const { min: humidityMin, max: humidityMax } = recommendations.waterLevel;

            const sunIcon = card.querySelector('.card-icons i.fa-sun');
            const waterIcon = card.querySelector('.card-icons i.fa-tint');

            const tempDiff = temperature < tempMin ? tempMin - temperature : temperature > tempMax ? temperature - tempMax : 0;
            const tempDiffPct = tempDiff / (tempMax - tempMin);

            if (tempDiffPct === 0) {
                sunIcon.style.color = '#585952';
            } else if (tempDiffPct <= tolWarning) {
                sunIcon.style.color = '#DBC501';
            } else {
                sunIcon.style.color = '#994948';
                hasCritical = true;
            }

            const humidityDiff = humidity < humidityMin ? humidityMin - humidity : humidity > humidityMax ? humidity - humidityMax : 0;
            const humidityDiffPct = humidityDiff / (humidityMax - humidityMin);

            if (humidityDiffPct === 0) {
                waterIcon.style.color = '#585952';
            } else if (humidityDiffPct <= tolWarning) {
                waterIcon.style.color = '#DBC501';
            } else {
                waterIcon.style.color = '#994948';
                hasCritical = true;
            }
        }

        let alertIcon = card.querySelector('.card-alert');
        if (hasCritical) {
            if (!alertIcon) {
                alertIcon = document.createElement('span');
                alertIcon.className = 'card-alert';
                alertIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                card.appendChild(alertIcon);
            }
        } else if (alertIcon) {
            alertIcon.remove();
        }
    });
}

async function fetchWeather(lat, lon) {
    const endpoint = `/weather?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Erro ao buscar informações de clima: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Clima atual:", data);

        document.getElementById("user-weather").innerHTML = `
            <p><b>Temperatura:</b> ${data.temperature}ºC</p>
            <p><b>Umidade:</b> ${data.humidity}%</p>
            <p><b>Descrição:</b> ${data.description}</p>
        `;

        localStorage.setItem('userWeather', JSON.stringify(data));

        adjustIconColorsBasedOnConditions(data.temperature, data.humidity);
    } catch (error) {
        console.error("Erro ao carregar informações de clima:", error);
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
                const now = new Date();
                localStorage.setItem('userCurrentTime', now.toISOString());
            },
            error => {
                console.error("Erro ao obter localização do usuário:", error);
                const now = new Date();
                localStorage.setItem('userCurrentTime', now.toISOString());
            }
        );
    } else {
        console.error("Geolocalização não é suportada pelo navegador.");
        const now = new Date();
        localStorage.setItem('userCurrentTime', now.toISOString());
    }
}

function updateResumoBarras() {
    const plants = getUserPlants();
    const userWeather = JSON.parse(localStorage.getItem('userWeather') || '{}');
    const currentHumidity = typeof userWeather.humidity === 'number' ? userWeather.humidity : null;

    if (!plants.length || currentHumidity === null) {
        document.getElementById('bar-saudavel').style.width = '0%';
        document.getElementById('bar-excesso').style.width = '0%';
        document.getElementById('bar-pouca').style.width = '0%';
        document.getElementById('val-saudavel').textContent = '0%(0)';
        document.getElementById('val-excesso').textContent = '0%(0)';
        document.getElementById('val-pouca').textContent = '0%(0)';
        document.getElementById('bar-excesso').style.background = '';
        document.getElementById('bar-pouca').style.background = '';
        return;
    }

    let saudavel = 0, excesso = 0, pouca = 0;

    plants.forEach(plant => {
        const rec = plantRecommendations[plant.type];
        if (!rec) return;
        const min = Number(rec.waterLevel.min);
        const max = Number(rec.waterLevel.max);
        const val = currentHumidity;

        const tolCritical = 0.4;
        const range = max - min;

        if (val >= min && val <= max) {
            saudavel++;
        } else if (val > max && range > 0) {
            const diff = val - max;
            const pct = diff / range;
            if (pct > tolCritical) {
                excesso++;
            }
        } else if (val < min && range > 0) {
            const diff = min - val;
            const pct = diff / range;
            if (pct > tolCritical) {
                pouca++;
            }
        } else if (val > max && range === 0) {
            excesso++;
        } else if (val < min && range === 0) {
            pouca++;
        }
    });

    const total = saudavel + excesso + pouca;
    const pctSaudavel = total > 0 ? Math.round((saudavel / total) * 100) : 0;
    const pctExcesso = total > 0 ? Math.round((excesso / total) * 100) : 0;
    const pctPouca = total > 0 ? Math.round((pouca / total) * 100) : 0;

    document.getElementById('bar-saudavel').style.width = pctSaudavel + '%';
    document.getElementById('bar-excesso').style.width = pctExcesso + '%';
    document.getElementById('bar-pouca').style.width = pctPouca + '%';
    document.getElementById('val-saudavel').textContent = `${pctSaudavel}%(${saudavel})`;
    document.getElementById('val-excesso').textContent = `${pctExcesso}%(${excesso})`;
    document.getElementById('val-pouca').textContent = `${pctPouca}%(${pouca})`;

    const barExcesso = document.getElementById('bar-excesso');
    const barPouca = document.getElementById('bar-pouca');

    barExcesso.style.background = '#B3E5FC';
    barPouca.style.background = '#FFD6D6';
}

let isCustomSortMode = false;
let dragSrcEl = null;

function enableCustomSortMode() {
    isCustomSortMode = true;
    const cards = document.querySelectorAll('.cards-container .card');
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.style.cursor = 'move';

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function disableCustomSortMode() {
    isCustomSortMode = false;
    const cards = document.querySelectorAll('.cards-container .card');
    cards.forEach(card => {
        card.removeAttribute('draggable');
        card.style.cursor = '';
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragover', handleDragOver);
        card.removeEventListener('drop', handleDrop);
        card.removeEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (dragSrcEl !== this) {
        this.parentNode.removeChild(dragSrcEl);
        const dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin', dropHTML);
        const droppedElem = this.previousSibling;
        enableCustomSortMode();
        saveCustomOrder();
    }
    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
}

function saveCustomOrder() {
    const cards = document.querySelectorAll('.cards-container .card');
    const order = Array.from(cards).map(card => card.dataset.timestamp);
    localStorage.setItem('customCardOrder', JSON.stringify(order));
}

function loadCustomOrder() {
    const order = JSON.parse(localStorage.getItem('customCardOrder') || '[]');
    if (!order.length) return;
    const cardsContainer = document.querySelector('.cards-container');
    const cards = Array.from(cardsContainer.children);
    order.forEach(ts => {
        const card = cards.find(c => c.dataset.timestamp == ts);
        if (card) cardsContainer.appendChild(card);
    });
}

document.getElementById('sort-by-custom').addEventListener('click', () => {
    enableCustomSortMode();
    loadCustomOrder();
    document.getElementById('sort-by-custom').classList.add('active');
    document.getElementById('sort-by-favorites').classList.remove('active');
    document.getElementById('sort-by-date').classList.remove('active');
});

document.getElementById('sort-by-favorites').addEventListener('click', () => {
    disableCustomSortMode();
    document.getElementById('sort-by-custom').classList.remove('active');
});
document.getElementById('sort-by-date').addEventListener('click', () => {
    disableCustomSortMode();
    document.getElementById('sort-by-custom').classList.remove('active');
});

function reapplyCustomSortIfNeeded() {
    if (isCustomSortMode) {
        enableCustomSortMode();
        loadCustomOrder();
    }
}

    cardsContainer.appendChild(newCard);
    reapplyCustomSortIfNeeded();

    cardsContainer.removeChild(cardToDelete);
    reapplyCustomSortIfNeeded();

document.addEventListener('DOMContentLoaded', async () => {
    await loadPlantRecommendations();
    loadPlantsFromLocalStorage();
    checkForCards();
    updateCardCounter();
    getUserLocation();
    updateResumoBarras();

    document.querySelectorAll('.card-favorite').forEach(favoriteIcon => {
        favoriteIcon.onclick = null;
    });

    const toggleResumoBtn = document.getElementById('toggle-resumo-btn');
    const userWeather = document.getElementById('user-weather');
    const resumoBarras = document.getElementById('resumo-barras');
    if (toggleResumoBtn && userWeather && resumoBarras) {
        toggleResumoBtn.addEventListener('click', function () {
            if (userWeather.classList.contains('collapsed')) {
                userWeather.classList.remove('collapsed');
                resumoBarras.classList.remove('collapsed');
                toggleResumoBtn.classList.remove('collapsed');
            } else {
                userWeather.classList.add('collapsed');
                resumoBarras.classList.add('collapsed');
                toggleResumoBtn.classList.add('collapsed');
            }
        });
    }

    loadCustomOrder();
});

function getCurrentUser() {
    return localStorage.getItem('igarden-user');
}
function getUserPlants() {
    const user = getCurrentUser();
    if (!user) return [];
    const key = 'igarden-plants-' + user;
    return JSON.parse(localStorage.getItem(key) || '[]');
}
function setUserPlants(plants) {
    const user = getCurrentUser();
    if (!user) return;
    const key = 'igarden-plants-' + user;
    localStorage.setItem(key, JSON.stringify(plants));
}