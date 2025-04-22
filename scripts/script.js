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
    event.preventDefault(); // prevent default anchor behavior
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

// Toggle visibility of menu-options when counter-top-right or its icon is clicked
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

// Close menu-options when clicking outside
document.addEventListener('click', function (event) {
    const menuOptions = document.getElementById('menu-options');
    const counterButton = document.querySelector('.counter-top-right');
    if (menuOptions.style.display === 'block' && !menuOptions.contains(event.target) && event.target !== counterButton) {
        menuOptions.style.display = 'none';
    }
});

// Toggle visibility of sort-options when button-menu is clicked
document.querySelector('.button-menu').addEventListener('click', function () {
    const sortOptions = document.getElementById('sort-options');
    if (sortOptions.style.display === 'block') {
        sortOptions.style.display = 'none';
    } else {
        sortOptions.style.display = 'block';
    }
});

// Close sort-options when clicking outside
document.addEventListener('click', function (event) {
    const sortOptions = document.getElementById('sort-options');
    const buttonMenu = document.querySelector('.button-menu');
    if (sortOptions.style.display === 'block' && !sortOptions.contains(event.target) && event.target !== buttonMenu) {
        sortOptions.style.display = 'none';
    }
});

// Function to update the counter on the counter-top-right button
function updateCardCounter() {
    const cardsContainer = document.querySelector('.cards-container');
    const counterButton = document.querySelector('.counter-top-right');
    const cardCount = cardsContainer.children.length;
    counterButton.innerHTML = `<i class="fas fa-seedling"></i> ${cardCount}`;
}

// Function to check if there are any cards and display a message if none exist
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

    updateCardCounter(); // Update the counter whenever cards are checked
}

// Load API credentials from environment variables
const apiKey = "25e7d5ab8d16408daba9929d7e60122a"; // Substitua pelo valor do .env
const apiSecret = "0e05027a6ffb406f8088e5ddbec22101"; // Substitua pelo valor do .env

// Function to generate OAuth 1.0a headers
function generateOAuthHeaders(method, url, params = {}) {
    const oauth = {
        oauth_consumer_key: "25e7d5ab8d16408daba9929d7e60122a", // Substitua pelo valor do .env
        oauth_nonce: Math.random().toString(36).substring(2),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_version: "1.0",
    };

    // Combine OAuth parameters and query parameters
    const allParams = { ...oauth, ...params };
    const sortedParams = Object.keys(allParams)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
        .join("&");

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${"0e05027a6ffb406f8088e5ddbec22101"}&`; // Substitua pelo valor do .env

    const oauthSignature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);
    oauth.oauth_signature = oauthSignature;

    const authHeader = `OAuth ${Object.keys(oauth)
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauth[key])}"`)
        .join(", ")}`;

    return authHeader;
}

// Function to fetch icons from the proxy server
async function fetchNounProjectIcons() {
    const endpoint = `http://localhost:3000/icons`; // Corrige a URL para acessar o servidor proxy corretamente

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ícones: ${response.statusText}`);
        }
        const data = await response.json();
        return data.icons.map(icon => icon.preview_url); // Retorna as URLs dos ícones
    } catch (error) {
        console.error("Erro ao carregar os ícones:", error);
        return []; // Retorna uma lista vazia em caso de erro
    }
}

let nextPageToken = null; // Variável para armazenar o token da próxima página
let prevPageToken = null; // Variável para armazenar o token da página anterior

async function loadIconSelector(pageToken = null, isNext = true) {
    const iconSelector = document.getElementById('icon-selector');
    iconSelector.innerHTML = ''; // Limpa os ícones atuais antes de exibir os próximos ou anteriores

    try {
        const endpoint = pageToken
            ? `http://localhost:3000/icons?${isNext ? 'next_page' : 'prev_page'}=${pageToken}`
            : `http://localhost:3000/icons`;

        const response = await fetch(endpoint); // Faz a requisição para o servidor proxy com paginação
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
            img.src = icon.thumbnail_url; // Usa a URL do thumbnail
            img.alt = icon.term; // Usa o termo como texto alternativo
            img.title = icon.term; // Exibe o termo ao passar o mouse
            img.classList.add('icon-option');

            img.addEventListener('click', () => {
                document.querySelectorAll('.icon-selector img').forEach(img => img.classList.remove('selected'));
                img.classList.add('selected');
            });

            iconSelector.appendChild(img);
        });

        // Atualiza os tokens de paginação
        nextPageToken = data.next_page || null;
        prevPageToken = data.prev_page || null;

        // Adiciona ou atualiza o botão de página anterior
        let prevPageButton = document.querySelector('.prev-page-button');
        if (!prevPageButton) {
            prevPageButton = document.createElement('button');
            prevPageButton.innerHTML = '<i class="fas fa-arrow-left"></i>'; // Ícone de seta para a esquerda
            prevPageButton.classList.add('prev-page-button');
            prevPageButton.addEventListener('click', () => {
                if (prevPageToken) {
                    loadIconSelector(prevPageToken, false); // Carrega a página anterior usando o token
                }
            });
            iconSelector.appendChild(prevPageButton);
        } else if (!prevPageToken) {
            prevPageButton.style.display = 'none'; // Esconde o botão se não houver página anterior
        } else {
            prevPageButton.style.display = 'block'; // Mostra o botão se houver página anterior
        }

        // Adiciona ou atualiza o botão de próxima página
        let nextPageButton = document.querySelector('.next-page-button');
        if (!nextPageButton) {
            nextPageButton = document.createElement('button');
            nextPageButton.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Ícone de seta para a direita
            nextPageButton.classList.add('next-page-button');
            nextPageButton.addEventListener('click', () => {
                if (nextPageToken) {
                    loadIconSelector(nextPageToken, true); // Carrega a próxima página usando o token
                }
            });
            iconSelector.appendChild(nextPageButton);
        } else if (!nextPageToken) {
            nextPageButton.style.display = 'none'; // Esconde o botão se não houver próxima página
        } else {
            nextPageButton.style.display = 'block'; // Mostra o botão se houver próxima página
        }
    } catch (error) {
        console.error('Erro ao carregar os ícones:', error);
        if (!pageToken) {
            iconSelector.innerHTML = '<p>Erro ao carregar os ícones.</p>';
        }
    }
}

// Function to add a new card with an icon from the Noun Project
async function addCard() {
    const cardsContainer = document.querySelector('.cards-container');
    const iconUrl = await fetchNounProjectIcon('plant'); // Busca um ícone relacionado a "plant"

    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.innerHTML = `
        <div class="card-icon">
            ${iconUrl ? `<img src="${iconUrl}" alt="Ícone de planta" class="noun-icon">` : '<i class="noun-icon">🌱</i>'}
        </div>
        <h4 class="card-subtitle">Nova Planta</h4>
        <div class="card-icons">
            <i class="fas fa-tint"></i><span><b>50%</b></span>
            <i class="fas fa-sun"></i><span><b>25ºC</b></span>
            <i class="fas fa-lightbulb"></i><span><b>60%</b></span>
        </div>
    `;
    cardsContainer.appendChild(newCard);
    checkForCards(); // Check for cards after adding
}

// Function to remove the last card
function removeLastCard() {
    const cardsContainer = document.querySelector('.cards-container');
    if (cardsContainer.lastElementChild) {
        cardsContainer.removeChild(cardsContainer.lastElementChild);
    }
    checkForCards(); // Check for cards after removing
}

// Show the modal for adding a new card
document.getElementById('menu-add-card').addEventListener('click', function () {
    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'flex'; // Exibe o modal
    loadIconSelector(); // Carrega os ícones no seletor
});

// Close the modal when clicking the close button
document.querySelector('.close-modal').addEventListener('click', function () {
    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'none'; // Hide the modal
});

// Add a new card with data from the modal form and fetch an icon
document.getElementById('add-card-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const plantName = document.getElementById('plant-name').value;
    const plantType = document.getElementById('plant-type').value; // Tipo de planta selecionado
    const recommendations = plantRecommendations[plantType]; // Obtém os valores recomendados

    const selectedIcon = document.querySelector('.icon-selector img.selected');
    const iconUrl = selectedIcon ? selectedIcon.src : null;

    const imageUpload = document.getElementById('image-upload').files[0];
    let imageUrl = null;

    if (imageUpload) {
        // Cria uma URL para a imagem carregada
        imageUrl = URL.createObjectURL(imageUpload);
    }

    const cardsContainer = document.querySelector('.cards-container');
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.dataset.timestamp = Date.now(); // Adiciona um timestamp ao card
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
        <p class="card-type"><b>Tipo:</b> ${plantType}</p>
        <div class="card-icons">
            <i class="fas fa-tint"></i><span><b>${recommendations.waterLevel}%</b></span>
            <i class="fas fa-sun"></i><span><b>${recommendations.temperature}ºC</b></span>
            <i class="fas fa-lightbulb"></i><span><b>${recommendations.lightLevel}%</b></span>
        </div>
    `;
    cardsContainer.appendChild(newCard);

    // Adiciona evento de clique para favoritar/desfavoritar
    const favoriteIcon = newCard.querySelector('.card-favorite');
    favoriteIcon.addEventListener('click', () => {
        favoriteIcon.classList.toggle('favorited');
    });

    checkForCards(); // Check for cards after adding

    // Hide the modal after adding the card
    const modal = document.getElementById('add-card-modal');
    modal.style.display = 'none';

    // Reset the form
    document.getElementById('add-card-form').reset();
    document.querySelectorAll('.icon-selector img').forEach(img => img.classList.remove('selected'));
});

// Dados de plantas com valores recomendados
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

// Atualiza os campos com base no tipo de planta selecionado
document.getElementById('plant-type').addEventListener('change', function () {
    const selectedType = this.value;
    const recommendations = plantRecommendations[selectedType];

    if (recommendations) {
        // Preenche os valores recomendados automaticamente (não há mais campos para o usuário preencher)
        console.log(`Valores recomendados para ${selectedType}:`, recommendations);
    }
});

// Add event listeners for "Adicionar planta" and "Remover última planta"
document.getElementById('menu-remove-card').addEventListener('click', removeLastCard);

// Initial check for cards and counter update on page load
document.addEventListener('DOMContentLoaded', () => {
    checkForCards();
    updateCardCounter();
});

// Função para organizar os cards
function sortCards(criteria) {
    const cardsContainer = document.querySelector('.cards-container');
    const cards = Array.from(cardsContainer.children);

    if (criteria === 'favorites') {
        // Ordena os cards por favoritos (favoritados primeiro)
        cards.sort((a, b) => {
            const aFavorited = a.querySelector('.card-favorite').classList.contains('favorited');
            const bFavorited = b.querySelector('.card-favorite').classList.contains('favorited');
            return bFavorited - aFavorited; // Favoritados primeiro
        });
    } else if (criteria === 'date-asc') {
        // Ordena os cards por data de adição (mais antigos primeiro)
        cards.sort((a, b) => a.dataset.timestamp - b.dataset.timestamp);
    } else if (criteria === 'date-desc') {
        // Ordena os cards por data de adição (mais novos primeiro)
        cards.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
    }

    // Reorganiza os cards no container
    cards.forEach(card => cardsContainer.appendChild(card));
}

// Adiciona eventos aos botões de ordenação
document.getElementById('sort-by-favorites').addEventListener('click', () => sortCards('favorites'));
document.getElementById('sort-by-date').addEventListener('click', () => {
    const sortByDateButton = document.getElementById('sort-by-date');
    if (sortByDateButton.dataset.order === 'asc') {
        sortCards('date-desc');
        sortByDateButton.dataset.order = 'desc';
        sortByDateButton.innerHTML = '<i class="fas fa-hourglass-end"></i>'; // Ícone para "Mais Novos"
    } else {
        sortCards('date-asc');
        sortByDateButton.dataset.order = 'asc';
        sortByDateButton.innerHTML = '<i class="fas fa-hourglass-start"></i>'; // Ícone para "Mais Antigos"
    }
});