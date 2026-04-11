const loadBtn = document.getElementById("loadBtn");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const typeFilter = document.getElementById("typeFilter");
const sortOption = document.getElementById("sortOption");
const displayData = document.getElementById("displayData");

const typeColors = {
    normal: "#a8a29e",
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
    fairy: "#f9a8d4"
};

const lightTypes = ["electric", "ice", "steel", "fairy", "normal"];

let allPokemon = [];

loadBtn.addEventListener("click", function () {
    loadPokemon();
});

searchInput.addEventListener("input", function () {
    applyFilters();
});

regionFilter.addEventListener("change", function () {
    applyFilters();
});

typeFilter.addEventListener("change", function () {
    applyFilters();
});

sortOption.addEventListener("change", function () {
    applyFilters();
});

function loadPokemon() {
    displayData.innerHTML = "<p>Loading Pokémon... Please wait.</p>";

    const promises = [];

    for (let i = 1; i <= 1025; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }

    Promise.all(promises)
        .then(function (responses) {
            return Promise.all(
                responses.map(function (response) {
                    return response.json();
                })
            );
        })
        .then(function (data) {
            allPokemon = data;
            applyFilters();
        })
        .catch(function () {
            displayData.innerHTML = "<p>Failed to load Pokémon.</p>";
        });
}

function getRegionNameById(id) {
    if (id >= 1 && id <= 151) {
        return "kanto";
    } else if (id >= 152 && id <= 251) {
        return "johto";
    } else if (id >= 252 && id <= 386) {
        return "hoenn";
    } else if (id >= 387 && id <= 493) {
        return "sinnoh";
    } else if (id >= 494 && id <= 649) {
        return "unova";
    } else if (id >= 650 && id <= 721) {
        return "kalos";
    } else if (id >= 722 && id <= 809) {
        return "alola";
    } else if (id >= 810 && id <= 905) {
        return "galar";
    } else if (id >= 906) {
        return "paldea";
    } else {
        return "unknown";
    }
}

function applyFilters() {
    let filteredPokemon = [...allPokemon];

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;
    const selectedType = typeFilter.value;
    const selectedSort = sortOption.value;

    filteredPokemon = filteredPokemon.filter(function (pokemon) {
        const pokemonName = pokemon.name.toLowerCase();
        const pokemonId = pokemon.id.toString();

        return pokemonName.includes(searchText) || pokemonId.includes(searchText);
    });

    if (selectedRegion !== "all") {
        filteredPokemon = filteredPokemon.filter(function (pokemon) {
            return getRegionNameById(pokemon.id) === selectedRegion;
        });
    }

    if (selectedType !== "all") {
        filteredPokemon = filteredPokemon.filter(function (pokemon) {
            return pokemon.types.some(function (typeInfo) {
                return typeInfo.type.name === selectedType;
            });
        });
    }

    if (selectedSort === "az") {
        filteredPokemon.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (selectedSort === "za") {
        filteredPokemon.sort(function (a, b) {
            return b.name.localeCompare(a.name);
        });
    } else if (selectedSort === "dex-asc") {
        filteredPokemon.sort(function (a, b) {
            return a.id - b.id;
        });
    } else if (selectedSort === "dex-desc") {
        filteredPokemon.sort(function (a, b) {
            return b.id - a.id;
        });
    }

    displayPokemon(filteredPokemon);
}

function displayPokemon(pokemonList) {
    displayData.innerHTML = "";

    if (pokemonList.length === 0) {
        displayData.innerHTML = "<p>No Pokémon found.</p>";
        return;
    }

    pokemonList.forEach(function (pokemon) {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");

        const name = document.createElement("h2");
        name.textContent = pokemon.name;

        const dexNumber = document.createElement("p");
        dexNumber.classList.add("dex-number");
        dexNumber.textContent = "Dex #" + pokemon.id;

        const regionName = document.createElement("p");
        regionName.classList.add("region-name");
        regionName.textContent = "Region: " + getRegionNameById(pokemon.id);

        const img = document.createElement("img");
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        const typeContainer = document.createElement("div");
        typeContainer.classList.add("type-container");

        pokemon.types.forEach(function (t) {
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
        card.appendChild(dexNumber);
        card.appendChild(regionName);
        card.appendChild(img);
        card.appendChild(typeContainer);

        displayData.appendChild(card);
    });
}