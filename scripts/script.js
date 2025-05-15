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
        temperature: { min: 15, max: 22 }, // Azaleias preferem temperaturas amenas
        waterLevel: { min: 50, max: 70 }, // Necessitam de solo úmido, mas não encharcado
        lightLevel: 50, // Luz indireta ou meia-sombra
    },
    suculenta: {
        temperature: { min: 18, max: 30 }, // Suculentas toleram calor, mas não geadas
        waterLevel: { min: 10, max: 30 }, // Solo seco entre regas
        lightLevel: 80, // Luz solar direta
    },
    orquidea: {
        temperature: { min: 18, max: 25 }, // Orquídeas gostam de temperaturas estáveis
        waterLevel: { min: 60, max: 80 }, // Solo levemente úmido
        lightLevel: 60, // Luz indireta brilhante
    },
    cacto: {
        temperature: { min: 20, max: 35 }, // Cactos prosperam em calor
        waterLevel: { min: 5, max: 15 }, // Solo muito seco
        lightLevel: 90, // Luz solar direta
    },
    samambaia: {
        temperature: { min: 16, max: 24 }, // Samambaias preferem temperaturas moderadas
        waterLevel: { min: 60, max: 80 }, // Solo constantemente úmido
        lightLevel: 40, // Meia-sombra ou luz indireta
    },
    hortela: {
        temperature: { min: 15, max: 25 }, // Hortelã cresce bem em temperaturas amenas
        waterLevel: { min: 50, max: 70 }, // Solo úmido, mas bem drenado
        lightLevel: 70, // Luz solar indireta ou parcial
    },
    manjericao: {
        temperature: { min: 18, max: 30 }, // Manjericão prefere calor
        waterLevel: { min: 40, max: 60 }, // Solo levemente úmido
        lightLevel: 80, // Luz solar direta ou parcial
    },
    alecrim: {
        temperature: { min: 20, max: 30 }, // Alecrim gosta de calor
        waterLevel: { min: 20, max: 40 }, // Solo seco entre regas
        lightLevel: 90, // Luz solar direta
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
    const lightLevel = card.dataset.lightLevel || 'N/A';

    // Get current weather data from localStorage
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

    // Display current temperature and humidity
    document.getElementById('view-plant-temperature').textContent = `${currentTemperature}ºC`;
    document.getElementById('view-plant-water').textContent = `${currentHumidity}%`;
    document.getElementById('view-plant-light').textContent = `${lightLevel}`;

    // Calculate and display average recommended values
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
    const tolWarning = 0.2; // 20% de tolerância para aviso (amarelo)
    const tolCritical = 0.4; // 40% de tolerância para crítico (vermelho)

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const plantType = card.dataset.plantType;
        const recommendations = plantRecommendations[plantType];

        if (recommendations) {
            const { min: tempMin, max: tempMax } = recommendations.temperature;
            const { min: humidityMin, max: humidityMax } = recommendations.waterLevel;

            const sunIcon = card.querySelector('.card-icons i.fa-sun');
            const waterIcon = card.querySelector('.card-icons i.fa-tint');

            // Adjust sun icon based on temperature
            const tempDiff = temperature < tempMin ? tempMin - temperature : temperature > tempMax ? temperature - tempMax : 0;
            const tempDiffPct = tempDiff / (tempMax - tempMin);

            if (tempDiffPct === 0) {
                sunIcon.style.color = '#585952'; // Verde
            } else if (tempDiffPct <= tolWarning) {
                sunIcon.style.color = '#DBC501'; // Amarelo
            } else {
                sunIcon.style.color = '#994948'; // Vermelho
            }

            // Adjust water icon based on humidity
            const humidityDiff = humidity < humidityMin ? humidityMin - humidity : humidity > humidityMax ? humidity - humidityMax : 0;
            const humidityDiffPct = humidityDiff / (humidityMax - humidityMin);

            if (humidityDiffPct === 0) {
                waterIcon.style.color = '#585952'; // Verde
            } else if (humidityDiffPct <= tolWarning) {
                waterIcon.style.color = '#DBC501'; // Amarelo
            } else {
                waterIcon.style.color = '#994948'; // Vermelho
            }
        }
    });
}

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

        // Store weather data in localStorage for later use
        localStorage.setItem('userWeather', JSON.stringify(data));

        // Adjust icon colors based on temperature and humidity
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
            },
            error => {
                console.error("Erro ao obter localização do usuário:", error);
            }
        );
    } else {
        console.error("Geolocalização não é suportada pelo navegador.");
    }
}