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
    if (menuOptions.style.display === 'block') {
        menuOptions.style.display = 'none';
    } else {
        menuOptions.style.display = 'block';
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
    if (sortOptions.style.display === 'block') {
        sortOptions.style.display = 'none';
    } else {
        sortOptions.style.display = 'block';
    }
});

document.addEventListener('click', function (event) {
    const sortOptions = document.getElementById('sort-options');
    const buttonMenu = document.querySelector('.button-menu');
    if (sortOptions.style.display === 'block' && !sortOptions.contains(event.target) && event.target !== buttonMenu) {
        sortOptions.style.display = 'none';
    }
});

function updateCardCounter() {
    const cardsContainer = document.querySelector('.cards-container');
    const counterButton = document.querySelector('.counter-top-right');
    const cardCount = cardsContainer.children.length;
    counterButton.innerHTML = `<i class="fas fa-seedling"></i> ${cardCount}`;
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
    const endpoint = `http://localhost:3000/icons`;

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
            ? `http://localhost:3000/icons?${isNext ? 'next_page' : 'prev_page'}=${pageToken}`
            : `http://localhost:3000/icons`;

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
        imageUrl: card.querySelector('.card-icon img')?.src || null,
        iconUrl: card.querySelector('.card-icon i.noun-icon')?.style.backgroundImage?.slice(5, -2) || null
    }));
    localStorage.setItem('plants', JSON.stringify(plants));
}

function loadPlantsFromLocalStorage() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = '';

    plants.forEach(plant => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.dataset.timestamp = plant.timestamp;
        newCard.dataset.plantType = plant.type;
        newCard.dataset.waterLevel = plant.waterLevel;
        newCard.dataset.temperature = plant.temperature;
        newCard.dataset.lightLevel = plant.lightLevel;
        newCard.innerHTML = `
            <div class="card-favorite ${plant.favorited ? 'favorited' : ''}">
                <i class="fas fa-heart"></i>
            </div>
            <div class="card-icon">
                ${
                    plant.imageUrl 
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

document.getElementById('add-card-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const plantName = document.getElementById('plant-name').value;
    const plantType = document.getElementById('plant-type').value;
    const recommendations = plantRecommendations[plantType];

    const selectedIcon = document.querySelector('.icon-selector img.selected');
    const iconUrl = selectedIcon ? selectedIcon.src : null;

    const imageUpload = document.getElementById('image-upload').files[0];
    let imageUrl = null;

    if (imageUpload) {
        imageUrl = URL.createObjectURL(imageUpload);
    }

    const cardsContainer = document.querySelector('.cards-container');
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.dataset.timestamp = Date.now();
    newCard.dataset.plantType = plantType;
    newCard.dataset.waterLevel = recommendations.waterLevel;
    newCard.dataset.temperature = recommendations.temperature;
    newCard.dataset.lightLevel = recommendations.lightLevel;
    newCard.innerHTML = `
        <div class="card-favorite">
            <i class="fas fa-heart"></i>
        </div>
        <div class="card-icon">
            ${
                imageUrl 
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
});

const plantRecommendations = {
    azaleia: {
        temperature: 18,
        waterLevel: 60,
        lightLevel: 50,
    },
    suculenta: {
        temperature: 25,
        waterLevel: 20,
        lightLevel: 80,
    },
    orquidea: {
        temperature: 22,
        waterLevel: 70,
        lightLevel: 60,
    },
    cacto: {
        temperature: 30,
        waterLevel: 10,
        lightLevel: 90,
    },
};

document.getElementById('plant-type').addEventListener('change', function () {
    const selectedType = this.value;
    const recommendations = plantRecommendations[selectedType];

    if (recommendations) {
        console.log(`Valores recomendados para ${selectedType}:`, recommendations);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadPlantsFromLocalStorage();
    checkForCards();
    updateCardCounter();
    getUserLocation();

    // Remover evento de clique do ícone de favoritar nos cards
    document.querySelectorAll('.card-favorite').forEach(favoriteIcon => {
        favoriteIcon.onclick = null;
    });
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
    const waterLevel = card.dataset.waterLevel || 'N/A';
    const temperature = card.dataset.temperature || 'N/A';
    const lightLevel = card.dataset.lightLevel || 'N/A';

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
    document.getElementById('view-plant-water').textContent = `${waterLevel}`;
    document.getElementById('view-plant-temperature').textContent = `${temperature}`;
    document.getElementById('view-plant-light').textContent = `${lightLevel}`;

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

async function fetchWeather(lat, lon) {
    const endpoint = `http://localhost:3000/weather?lat=${lat}&lon=${lon}`;

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
            },
            error => {
                console.error("Erro ao obter localização do usuário:", error);
            }
        );
    } else {
        console.error("Geolocalização não é suportada pelo navegador.");
    }
}