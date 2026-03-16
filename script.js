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

    if(Object.keys(types).includes(type)) {
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

// EXERCICE 1

async function loadUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users",{
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
        ajouterLog("Erreur HTTP : " + erreur.message,"erreur");
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

//EXERCICE 2



const btnClearLogs = document.querySelector("#clearLogs");
btnClearLogs.addEventListener("click", clearLogs);

const btnLoadUsers = document.querySelector("#loadUsers");
btnLoadUsers.addEventListener("click", chargerUtilisateurs);
