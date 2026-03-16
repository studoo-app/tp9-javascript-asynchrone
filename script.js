console.log("loaded !");

function ajouterLog(message, type) {
    const logContainer = document.querySelector("#activityLogs");
    const logEntry = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString();
    const types = {
        "info": "text-info",
        "success": "text-success",
        "erreur": "text-danger"
    }

    if (Object.keys(types).includes(type)) {
        logEntry.textContent = `[${timestamp}] ${message}`;
        logEntry.classList.add("log-entry", types[type]);
        logContainer.prepend(logEntry);
    }
}

function clearLogs() {
    const logContainer = document.querySelector("#activityLogs");
    logContainer.innerHTML = "";
    logContainer.textContent = "En attente de nouvelles opérations.";
}

function attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAvecRetry(url, tentativesMax = 3) {
    for (let i = 0; i < tentativesMax; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            throw new Error("HTTP " + response.status);
        } catch (erreur) {
            if (i === tentativesMax - 1) throw erreur;
            const delai = Math.pow(2, i) * 1000;
            ajouterLog(`Tentative ${i + 2}/${tentativesMax} après ${delai / 1000}s...`, "info");
            await attendre(delai);
        }
    }
}

// EXERCICE 1

async function loadUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();

        // Utiliser les données...
        ajouterLog("Utilisateurs chargés avec succès.", "success");

        const usersContainer = document.querySelector("#usersContent");
        usersContainer.innerHTML = ""; // Clear previous content

        const list = document.createElement("ul");

        donnees.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.name} (${user.email})`;
            list.appendChild(listItem);
        })

        usersContainer.appendChild(list);

    } catch (erreur) {
        ajouterLog("Erreur HTTP : " + erreur.message, "erreur");
        console.error(erreur.message);
    } finally {
        // Exécuté dans TOUS les cas (succès ou erreur)
        ajouterLog("Opération de chargement terminée.", "info");
    }
}

async function chargerUtilisateurs() {
    const bouton = document.querySelector("#loadUsers");
    const zone = document.querySelector("#usersContent");

    try {
        bouton.disabled = true;
        zone.innerHTML = `
            <div class="text-center text-info py-2">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Chargement en cours...
            </div>`;
        ajouterLog("Chargement des utilisateurs...", "info");

        // ... votre code fetch ici ...
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();

        // Utiliser les données...

        const usersContainer = document.querySelector("#usersContent");
        const list = document.createElement("ul");

        donnees.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.name} (${user.email})`;
            list.appendChild(listItem);
        })
        usersContainer.innerHTML = ""; // Clear previous content
        usersContainer.appendChild(list);

        ajouterLog("Utilisateurs chargés avec succès.", "success");
    } catch (erreur) {
        zone.innerHTML = `
            <div class="alert alert-danger py-2 mb-0">
                <i class="bi bi-exclamation-triangle me-1"></i>${erreur.message}
            </div>`;
        ajouterLog(erreur.message, "erreur");

    } finally {
        bouton.disabled = false;
        //zone.innerHTML = "";
    }
}

async function ajouterUtilisateur() {
    try {
        const nouvelUtilisateur = {
            name: "Utilisateur " + Math.floor(Math.random() * 1000),
            email: "test@exemple.com",
            address: {city: "Paris"}
        };

        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nouvelUtilisateur)
        });

        if (!response.ok) throw new Error("HTTP " + response.status);

        const resultat = await response.json();
        ajouterLog(`Utilisateur créé (id: ${resultat.id})`, "succes");

    } catch (erreur) {
        ajouterLog(erreur.message, "erreur");
    }
}

//EXERCICE 2

async function chargerBlague(categorie) {
    const bouton = document.querySelector("#loadJoke");
    const zone = document.querySelector("#jokeContent");
    try {

        bouton.disabled = true;
        zone.innerHTML = `
            <div class="text-center text-info py-2">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Chargement en cours...
            </div>`;
        ajouterLog("Chargement de la blague...", "info");

        const response = await fetchAvecRetry(`https://v2.jokeapi.dev/joke/${categorie}`);

        const donnees = await response.json();

        // Utiliser les données...
        ajouterLog("Blagues chargées avec succès.", "success");

        console.log(donnees);
        const jokeContainer = document.querySelector("#jokeContent");
        jokeContainer.innerHTML = ""; // Clear previous content

        if (donnees.type === "single") {
            jokeContainer.textContent = donnees.joke;
        } else {
            jokeContainer.innerHTML = `
                <div>${donnees.setup}</div>
                <div class="text-success mt-2">${donnees.delivery}</div>
            `;
        }

    } catch (erreur) {
        zone.innerHTML = `
            <div class="alert alert-danger py-2 mb-0">
                <i class="bi bi-exclamation-triangle me-1"></i>${erreur.message}
            </div>`;
        ajouterLog(erreur.message, "erreur");
    } finally {
        bouton.disabled = false;
        // Exécuté dans TOUS les cas (succès ou erreur)
        ajouterLog("Opération de chargement terminée.", "info");
    }
}

//EXERCICE 3

async function chargerCrypto() {
    const bouton = document.querySelector("#loadCrypto");
    const zone = document.querySelector("#cryptoContent");
    try {
        bouton.disabled = true;
        zone.innerHTML = `
            <div class="text-center text-info py-2">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Chargement en cours...
            </div>`;
        ajouterLog("Chargement des cryptos...", "info");

        const response = await fetchAvecRetry("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=eur");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();
        // Utiliser les données...
        const cryptoContainer = document.querySelector("#cryptoContent");
        cryptoContainer.innerHTML = ""; // Clear previous content

        const list = document.createElement("ul");
        for (const [crypto, info] of Object.entries(donnees)) {
            const listItem = document.createElement("li");
            listItem.textContent = `${crypto.toUpperCase()} : ${info.eur} €`;
            list.appendChild(listItem);
        }
        cryptoContainer.appendChild(list);

        ajouterLog("Prix des cryptos chargés avec succès.", "success");

    } catch (erreur) {
        zone.innerHTML = `
            <div class="alert alert-danger py-2 mb-0">
                <i class="bi bi-exclamation-triangle me-1"></i>${erreur.message}
            </div>`;
        ajouterLog(erreur.message, "erreur");
        console.error(erreur.message);

    } finally {
        bouton.disabled = false;
        // Exécuté dans TOUS les cas (succès ou erreur)
    }
}


// Events
const btnClearLogs = document.querySelector("#clearLogs");
btnClearLogs.addEventListener("click", clearLogs);

const btnLoadUsers = document.querySelector("#loadUsers");
btnLoadUsers.addEventListener("click", chargerUtilisateurs);

const btnAddUser = document.querySelector("#addUser");
btnAddUser.addEventListener("click", ajouterUtilisateur);

const btnLoadBlagues = document.querySelector("#loadJoke");
btnLoadBlagues.addEventListener("click", () => {
    chargerBlague(document.querySelector("#jokeCategory").value);
});

const btnLoadCrypto = document.querySelector("#loadCrypto");
btnLoadCrypto.addEventListener("click", chargerCrypto);