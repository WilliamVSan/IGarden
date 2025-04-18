document.addEventListener("DOMContentLoaded", () => {
    const cardCount = document.querySelectorAll(".card").length;
    const counter = document.querySelector(".counter-top-right");
    if (counter) {
        counter.innerHTML = `<i class='fas fa-seedling'></i> ${cardCount}`;
    }
});

document.getElementById("add-card-button").addEventListener("click", () => {
    const modal = document.getElementById("add-card-modal");
    modal.style.display = "flex"; // Exibe o modal
});

document.querySelector(".close-modal").addEventListener("click", () => {
    const modal = document.getElementById("add-card-modal");
    modal.style.display = "none"; // Oculta o modal
});

document.getElementById("add-card-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o envio padrão do formulário

    const plantName = document.getElementById("plant-name").value;
    const waterLevel = document.getElementById("water-level").value;
    const temperature = document.getElementById("temperature").value;
    const lightLevel = document.getElementById("light-level").value;

    const cardsContainer = document.querySelector(".cards-container");
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.innerHTML = `
        <img src="path/to/image.jpg" alt="Imagem representativa do novo Card" class="card-image">
        <div class="card-content">
            <h3 class="card-subtitle">${plantName}</h3>
            <div class="card-icons">
                <i class="fas fa-tint"></i><span>${waterLevel}%</span>
                <i class="fas fa-sun"></i><span>${temperature}°C</span>
                <i class="fas fa-lightbulb"></i><span>${lightLevel}%</span>
            </div>
        </div>
    `;
    cardsContainer.appendChild(newCard);

    // Atualiza o contador
    const cardCount = document.querySelectorAll(".card").length;
    const counter = document.querySelector(".counter-top-right");
    if (counter) {
        counter.innerHTML = `<i class='fas fa-seedling'></i> ${cardCount}`;
    }

    // Fecha o modal
    document.getElementById("add-card-modal").style.display = "none";
    e.target.reset(); // Reseta o formulário
});

document.getElementById("remove-card-button").addEventListener("click", () => {
    const cardsContainer = document.querySelector(".cards-container");
    const lastCard = cardsContainer.lastElementChild;
    if (lastCard) {
        cardsContainer.removeChild(lastCard);

        // Atualiza o contador
        const cardCount = document.querySelectorAll(".card").length;
        const counter = document.querySelector(".counter-top-right");
        if (counter) {
            counter.innerHTML = `<i class='fas fa-seedling'></i> ${cardCount}`;
        }
    }
});

document.querySelector(".button-menu").addEventListener("click", () => {
    const menuOptions = document.getElementById("menu-options");
    menuOptions.style.display = menuOptions.style.display === "flex" ? "none" : "flex"; // Alterna visibilidade
});

document.querySelector(".button-menu").addEventListener("click", (event) => {
    event.stopPropagation(); // Impede o clique de se propagar para o document
    const sortOptions = document.getElementById("sort-options");
    sortOptions.style.display = sortOptions.style.display === "block" ? "none" : "block"; // Alterna visibilidade
});

document.addEventListener("click", (event) => {
    const sortOptions = document.getElementById("sort-options");
    const sortButton = document.querySelector(".button-menu");

    // Verifica se o clique foi fora do menu e do botão de sortear
    if (sortOptions.style.display === "block" && !sortOptions.contains(event.target) && !sortButton.contains(event.target)) {
        sortOptions.style.display = "none"; // Fecha o menu
    }
});

document.getElementById("sort-by-favorites").addEventListener("click", () => {
    const cardsContainer = document.querySelector(".cards-container");
    const cards = Array.from(cardsContainer.children);

    // Ordena os cards por favoritos (simulação: cards com classe 'favorite' primeiro)
    cards.sort((a, b) => {
        const isAFavorite = a.classList.contains("favorite");
        const isBFavorite = b.classList.contains("favorite");
        return isBFavorite - isAFavorite; // Favoritos primeiro
    });

    // Reorganiza os cards no container
    cards.forEach((card) => cardsContainer.appendChild(card));

    // Fecha o menu
    document.getElementById("sort-options").style.display = "none";
});

document.getElementById("sort-by-date").addEventListener("click", () => {
    const cardsContainer = document.querySelector(".cards-container");
    const cards = Array.from(cardsContainer.children);

    // Ordena os cards por data de adição (simulação: atributo 'data-added')
    cards.sort((a, b) => {
        const dateA = new Date(a.getAttribute("data-added"));
        const dateB = new Date(b.getAttribute("data-added"));
        return dateA - dateB; // Mais antigos primeiro
    });

    // Reorganiza os cards no container
    cards.forEach((card) => cardsContainer.appendChild(card));

    // Fecha o menu
    document.getElementById("sort-options").style.display = "none";
});

document.getElementById("menu-add-card").addEventListener("click", () => {
    const modal = document.getElementById("add-card-modal");
    modal.style.display = "flex"; // Exibe o modal
});

document.getElementById("menu-remove-card").addEventListener("click", () => {
    const cardsContainer = document.querySelector(".cards-container");
    const lastCard = cardsContainer.lastElementChild;
    if (lastCard) {
        cardsContainer.removeChild(lastCard);

        // Atualiza o contador
        const cardCount = document.querySelectorAll(".card").length;
        const counter = document.querySelector(".counter-top-right");
        if (counter) {
            counter.innerHTML = `<i class='fas fa-seedling'></i> ${cardCount}`;
        }
    }

    // Oculta o menu após a ação
    document.getElementById("menu-options").style.display = "none";
});

document.addEventListener("click", (event) => {
    const menuOptions = document.getElementById("menu-options");
    const menuButton = document.querySelector(".button-menu");

    // Verifica se o clique foi fora do menu e do botão de menu
    if (menuOptions.style.display === "flex" && !menuOptions.contains(event.target) && !menuButton.contains(event.target)) {
        menuOptions.style.display = "none"; // Fecha o menu
    }
});

document.querySelector(".counter-top-right").addEventListener("click", (event) => {
    event.stopPropagation(); // Impede o clique de se propagar para o document
    const menuOptions = document.getElementById("menu-options");
    menuOptions.style.display = menuOptions.style.display === "none" || menuOptions.style.display === "" ? "flex" : "none"; // Alterna visibilidade
});

document.addEventListener("click", (event) => {
    const menuOptions = document.getElementById("menu-options");
    const counterButton = document.querySelector(".counter-top-right");

    // Verifica se o clique foi fora do menu e do botão de contador
    if (menuOptions.style.display === "flex" && !menuOptions.contains(event.target) && !counterButton.contains(event.target)) {
        menuOptions.style.display = "none"; // Fecha o menu
    }
});

document.querySelector(".button-top-left").addEventListener("click", (event) => {
    event.stopPropagation(); // Impede o clique de se propagar para o document
    const menuOptions = document.getElementById("menu-options");
    menuOptions.style.display = menuOptions.style.display === "none" || menuOptions.style.display === "" ? "flex" : "none"; // Alterna visibilidade
});

document.addEventListener("click", (event) => {
    const menuOptions = document.getElementById("menu-options");
    const backButton = document.querySelector(".button-top-left");

    // Verifica se o clique foi fora do menu e do botão de voltar
    if (menuOptions.style.display === "flex" && !menuOptions.contains(event.target) && !backButton.contains(event.target)) {
        menuOptions.style.display = "none"; // Fecha o menu
    }
});
