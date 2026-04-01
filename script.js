const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const displayData = document.getElementById("displayData");

const typeColors = {
    fire: "#f97316",
    water: "#3b82f6",
    grass: "#22c55e",
    electric: "#facc15",
    ice: "#67e8f9",
    fighting: "#dc2626",
    poison: "#a855f7",
    ground: "#a16207",
    flying: "#60a5fa",
    psychic: "#ec4899",
    bug: "#84cc16",
    rock: "#78716c",
    ghost: "#7c3aed",
    dragon: "#4f46e5",
    dark: "#292524",
    steel: "#94a3b8",
    fairy: "#f9a8d4",
    normal: "#a8a29e"
};

const lightTypes = ["electric", "ice", "steel", "fairy", "normal"];

searchBtn.addEventListener("click", function () {
    const pokemonName = searchInput.value.toLowerCase();
    fetchData(pokemonName);
});

function fetchData(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            showData(data);
        })
        .catch(function () {
            displayData.innerHTML = "<p>Pokémon not found</p>";
        });
}

function showData(data) {
    displayData.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const name = document.createElement("h2");
    name.textContent = data.name;

    const img = document.createElement("img");
    img.src = data.sprites.front_default;

    const typeContainer = document.createElement("div");
    typeContainer.classList.add("type-container");

    data.types.forEach(function (t) {
        const badge = document.createElement("span");
        badge.classList.add("type-badge");
        badge.textContent = t.type.name;

        const color = typeColors[t.type.name];
        badge.style.backgroundColor = color;

        if (lightTypes.includes(t.type.name)) {
            badge.style.color = "black";
        } else {
            badge.style.color = "white";
        }

        typeContainer.appendChild(badge);
    });

    card.appendChild(name);
    card.appendChild(img);
    card.appendChild(typeContainer);

    displayData.appendChild(card);
}