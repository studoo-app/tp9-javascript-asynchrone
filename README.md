# TP 9 — Communication Asynchrone JavaScript

**Durée :** 4 heures **Objectif :** Maîtriser la communication asynchrone avec Fetch API, async/await, try/catch et la gestion d'erreurs robuste

---

## Contexte du projet

Vous développez un **tableau de bord personnel** qui agrège des données provenant de plusieurs APIs publiques : des utilisateurs fictifs, la météo en temps réel, les cours de cryptomonnaies et des photos en ligne. Chaque exercice vous fait travailler avec une API différente, tout en construisant progressivement une application complète et robuste.

---

## Matériel fourni

Créez un fichier `index.html` avec la structure suivante :

```html
<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Tableau de Bord</title>
    <!-- Bootstrap 5.3 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          rel="stylesheet">
    <style>
        body { background-color: #121826; min-height: 100vh; }
        #activityLogs {
            max-height: 200px;
            overflow-y: auto;
            font-family: "Consolas", monospace;
            font-size: 0.75rem;
        }
    </style>
</head>
<body>
<div class="container py-4">

    <header class="text-center mb-4">
        <h1 class="display-6 fw-bold">
            <i class="bi bi-speedometer2 me-2"></i>Mon Tableau de Bord
        </h1>
        <p class="text-secondary">Données agrégées depuis plusieurs APIs</p>
    </header>

    <div class="row g-4">

        <!-- Utilisateurs (JSONPlaceholder) -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    <i class="bi bi-people me-2"></i>Utilisateurs
                </div>
                <div class="card-body">
                    <div class="d-flex gap-2 mb-3">
                        <button class="btn btn-primary btn-sm" id="loadUsers">
                            Charger les utilisateurs
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" id="addUser">
                            Ajouter un utilisateur
                        </button>
                    </div>
                    <div id="usersContent"></div>
                </div>
            </div>
        </div>

        <!-- Blagues (JokeAPI) -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    <i class="bi bi-emoji-laughing me-2"></i>Blagues
                </div>
                <div class="card-body">
                    <div class="input-group input-group-sm mb-3">
                        <select class="form-select" id="jokeCategory">
                            <option value="Any">Toutes catégories</option>
                            <option value="Programming">Programmation</option>
                            <option value="Misc">Divers</option>
                            <option value="Pun">Jeux de mots</option>
                            <option value="Spooky">Horreur</option>
                            <option value="Christmas">Noël</option>
                        </select>
                        <button class="btn btn-primary" id="loadJoke">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                    <div id="jokeContent">
                        <p class="text-secondary mb-0">
                            Choisissez une catégorie
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cryptomonnaies (CoinGecko) -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    <i class="bi bi-currency-bitcoin me-2"></i>Cryptomonnaies
                </div>
                <div class="card-body">
                    <div class="d-flex gap-2 mb-3">
                        <button class="btn btn-primary btn-sm" id="loadCrypto">
                            Actualiser les cours
                        </button>
                        <button class="btn btn-outline-secondary btn-sm"
                                id="compareCrypto">
                            Comparaison étendue
                        </button>
                    </div>
                    <div id="cryptoContent">
                        <p class="text-secondary mb-0">
                            Cliquez pour charger les cours
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Articles d'un utilisateur (JSONPlaceholder) -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    <i class="bi bi-journal-text me-2"></i>Articles
                </div>
                <div class="card-body">
                    <button class="btn btn-primary btn-sm mb-3" id="loadArticles">
                        Charger les articles
                    </button>
                    <div id="articlesContent"></div>
                </div>
            </div>
        </div>

        <!-- Actions globales -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    <i class="bi bi-lightning-charge me-2"></i>Actions globales
                </div>
                <div class="card-body">
                    <div class="d-flex gap-2 mb-3">
                        <button class="btn btn-primary btn-sm" id="loadAll">
                            Tout actualiser
                        </button>
                        <button class="btn btn-outline-danger btn-sm" id="testErrors">
                            Simuler des erreurs
                        </button>
                    </div>
                    <div id="globalStatus"></div>
                </div>
            </div>
        </div>

        <!-- Journal d'activité -->
        <div class="col-12 col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-header fw-bold d-flex justify-content-between
                            align-items-center">
                    <span><i class="bi bi-terminal me-2"></i>Journal d'activité</span>
                    <button class="btn btn-outline-secondary btn-sm" id="clearLogs">
                        Vider
                    </button>
                </div>
                <div class="card-body p-2">
                    <div id="activityLogs" class="bg-black bg-opacity-25 rounded p-2">
                        Les opérations asynchrones s'afficheront ici...
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="script.js"></script>
</body>
</html>
```

Créez ensuite un fichier `script.js` vide à côté. C'est dans ce fichier que vous écrirez tout votre code.

---

## Rappel : structure de base d'une fonction asynchrone

Tout au long de ce TP, vous utiliserez exclusivement la syntaxe `async/await` avec `try/catch/finally` :

```javascript
async function maFonction() {
    try {
        const response = await fetch("https://une-api.com/donnees");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();
        // Utiliser les données...

    } catch (erreur) {
        console.error(erreur.message);

    } finally {
        // Exécuté dans TOUS les cas (succès ou erreur)
    }
}
```

**Points clés :**

- `async` devant la fonction : elle contient du code asynchrone
- `await` : met la fonction en pause jusqu'au résultat, sans bloquer la page
- `try / catch / finally` : gestion des erreurs et nettoyage
- `fetch()` ne rejette **pas** sur une erreur HTTP (404, 500…) — il faut tester `response.ok`

---

## Exercice 1 — JSONPlaceholder : premiers appels asynchrones (1h)

**API utilisée :** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — API de test gratuite sans authentification, qui fournit des données fictives (utilisateurs, posts, commentaires, etc.).

### 1.1 — Système de logging

Avant de faire des requêtes, mettez en place un système de traces pour observer le déroulement des opérations asynchrones.

**Consignes :**

Créez une fonction `ajouterLog(message, type)` qui :

- Accepte un `message` (string) et un `type` parmi `'info'`, `'erreur'`, `'succes'`
- Génère un timestamp au format `HH:MM:SS` via `new Date().toLocaleTimeString()`
- Crée un élément `<div>` contenant le timestamp et le message, coloré avec les classes Bootstrap `text-info`, `text-danger` ou `text-success` selon le type
- Insère le message **en haut** du conteneur `#activityLogs` (événements récents d'abord)

```javascript
ajouterLog("Système initialisé", "info");
ajouterLog("Connexion échouée", "erreur");
ajouterLog("3 utilisateurs chargés", "succes");

// Le journal affiche :
// [14:32:15] ✅ 3 utilisateurs chargés
// [14:32:14] ❌ Connexion échouée
// [14:32:12] ℹ️ Système initialisé
```

Connectez aussi le bouton `#clearLogs` pour vider le journal.

> **Indice :** Pensez à `document.createElement()`, `element.prepend()` et aux template literals.

---

### 1.2 — Charger la liste des utilisateurs

Votre première requête asynchrone : récupérer des utilisateurs depuis JSONPlaceholder.

**Endpoint :** `GET https://jsonplaceholder.typicode.com/users`

**Consignes :**

Créez une fonction `async chargerUtilisateurs()` qui :

- Appelle `await fetch(...)` sur l'endpoint ci-dessus
- Vérifie `response.ok` — sinon, lance une erreur avec `throw`
- Extrait le JSON avec `await response.json()`
- Affiche chaque utilisateur dans `#usersContent` avec son **nom**, son **email** et sa **ville** (`address.city`). Utilisez par exemple une `list-group` Bootstrap.
- Gère les erreurs dans le `catch` avec `ajouterLog()`
- Connectez-la au bouton `#loadUsers`

**Structure d'un objet retourné :**

```json
{
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz",
    "address": { "city": "Gwenborough" }
}
```

> **Rappel :** `fetch()` retourne une promesse et `response.json()` aussi — d'où les deux `await` successifs.

---

### 1.3 — Gestion de l'état de chargement

L'utilisateur doit voir que quelque chose se passe et ne pas pouvoir cliquer deux fois.

**Consignes :**

Modifiez `chargerUtilisateurs()` pour :

- **Au début du `try`** : afficher un spinner Bootstrap dans `#usersContent` et désactiver le bouton
- **En cas de succès** : remplacer le spinner par les données
- **Dans le `catch`** : afficher une alerte Bootstrap `alert-danger`
- **Dans le `finally`** : réactiver le bouton

```javascript
async function chargerUtilisateurs() {
    const bouton = document.getElementById("loadUsers");
    const zone = document.getElementById("usersContent");

    try {
        bouton.disabled = true;
        zone.innerHTML = `
            <div class="text-center text-info py-2">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Chargement en cours...
            </div>`;
        ajouterLog("Chargement des utilisateurs...", "info");

        // ... votre code fetch ici ...

    } catch (erreur) {
        zone.innerHTML = `
            <div class="alert alert-danger py-2 mb-0">
                <i class="bi bi-exclamation-triangle me-1"></i>${erreur.message}
            </div>`;
        ajouterLog(erreur.message, "erreur");

    } finally {
        bouton.disabled = false;
    }
}
```

---

### 1.4 — Provoquer et observer les erreurs

Testez votre gestion d'erreurs en conditions dégradées.

**Consignes :**

- Changez temporairement l'URL (ex : `.../usersXXX`) et observez le comportement
- Rappel : `fetch()` ne rejette **pas** sur un 404 — c'est votre `if (!response.ok) throw ...` qui déclenche l'erreur

**Questions de réflexion :**

- Placez des `console.log()` avant le `await fetch`, après, et après l'appel de la fonction. Dans quel ordre apparaissent-ils ?
- Que se passe-t-il si vous supprimez le `finally` et qu'une erreur survient ?
- Pourquoi `fetch()` ne rejette-t-il pas sur un code 404 ?

---

## Exercice 2 — JokeAPI : gestion robuste des erreurs (1h15)

**API utilisée :** [JokeAPI](https://v2.jokeapi.dev/) — API de blagues gratuite, sans authentification, avec support du français.

### 2.1 — Classification des erreurs

Avant de requêter l'API météo, mettez en place un système de gestion d'erreurs réutilisable.

**Les trois catégories d'erreurs :**

- **Erreur réseau** (`TypeError`) : pas de connexion, serveur inaccessible
- **Erreur HTTP** (`response.ok === false`) : 404, 500, 403…
- **Erreur de parsing** (`SyntaxError` lors de `.json()`) : données corrompues

**Consignes :**

Créez une fonction `gererErreur(erreur, contexte)` qui :

- Identifie le type d'erreur avec `instanceof`
- Retourne un objet `{ message, suggestion, type }` avec un message compréhensible
- Consigne l'erreur technique dans les logs

```javascript
// Exemple de retour :
{
    message: "Impossible de contacter le serveur.",
    suggestion: "Vérifiez votre connexion internet.",
    type: "reseau"
}
```

---

### 2.2 — Récupérer une blague

Connectez-vous à JokeAPI pour récupérer une blague selon la catégorie sélectionnée.

**Endpoint :** `GET https://v2.jokeapi.dev/joke/{catégorie}?lang=fr`

Les catégories disponibles sont : `Any`, `Programming`, `Misc`, `Pun`, `Spooky`, `Christmas`.

L'API retourne deux formats de blague :

- **single** : une blague en une seule phrase (`joke`)
- **twopart** : une blague en deux temps (`setup` + `delivery`)

**Consignes :**

Créez une fonction `async chargerBlague(categorie)` qui :

- Vérifie qu'une catégorie est sélectionnée (sinon, `return` avec avertissement)
- Appelle l'API avec un template literal pour injecter la catégorie dans l'URL
- Teste le champ `type` de la réponse pour afficher correctement les deux formats
- Gère spécifiquement le cas `error: true` dans la réponse (certaines combinaisons catégorie/langue n'existent pas)
- Utilise `gererErreur()` pour les erreurs réseau/HTTP
- Gère le loading et le bouton dans `try/catch/finally`
- Connectez-la au bouton `#loadJoke`

**Structure des réponses possibles :**

```json
// Format "single"
{
    "error": false,
    "category": "Programming",
    "type": "single",
    "joke": "Il y a 10 types de personnes...",
    "lang": "fr"
}

// Format "twopart"
{
    "error": false,
    "category": "Misc",
    "type": "twopart",
    "setup": "Pourquoi les plongeurs plongent-ils toujours en arrière ?",
    "delivery": "Parce que sinon ils tomberaient dans le bateau.",
    "lang": "fr"
}

// Cas d'erreur API
{
    "error": true,
    "message": "No matching joke found..."
}
```

> **Indice :** Testez `data.error === true` avant de tenter d'afficher la blague, et `data.type === "twopart"` pour savoir si vous avez un `setup`/`delivery` ou un simple `joke`.

---

### 2.3 — Système de retry automatique

Les APIs peuvent être temporairement instables. Implémentez une relance automatique avec délai croissant.

**Consignes :**

Créez une fonction `async fetchAvecRetry(url, tentativesMax = 3)` qui :

- Boucle avec `for` sur le nombre de tentatives
- À chaque itération, tente un `await fetch(url)`
- Si `response.ok`, retourne la réponse
- Sinon, attend un délai croissant (1s, 2s, 4s) avant de réessayer
- Affiche "Tentative 2/3 après 2s..." dans les logs
- Après la dernière tentative, lance l'erreur avec `throw`

```javascript
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
```

Intégrez `fetchAvecRetry` dans votre fonction `chargerBlague` à la place de `fetch` direct.

---

### 2.4 — Validation des données

Ne faites jamais confiance aveuglément aux données d'une API externe.

**Consignes :**

Créez des fonctions de validation :

- `validerUtilisateurs(data)` : vérifie que c'est un tableau, que chaque élément a `name`, `email`, `address.city`
- `validerBlague(data)` : vérifie que `data.error` est `false`, que `data.type` est `"single"` ou `"twopart"`, et que les champs correspondants (`joke` ou `setup`/`delivery`) existent et sont des chaînes non vides

Intégrez-les entre le `await response.json()` et l'affichage. Si invalide → `throw`.

> **Indice :** `Array.isArray()`, `typeof`, et l'opérateur `?.` (optional chaining) sont vos alliés.

---

### 2.5 — Ajouter un utilisateur (requête POST)

Envoyez des données vers un serveur avec une requête POST.

**Endpoint :** `POST https://jsonplaceholder.typicode.com/users`

**Consignes :**

Créez une fonction `async ajouterUtilisateur()` qui :

- Prépare un objet utilisateur avec des données fictives
- Envoie un `POST` avec `Content-Type: application/json` et `JSON.stringify()`
- Affiche un message de confirmation (alerte Bootstrap `alert-success`)
- Connectez-la au bouton `#addUser`

```javascript
async function ajouterUtilisateur() {
    try {
        const nouvelUtilisateur = {
            name: "Utilisateur " + Math.floor(Math.random() * 1000),
            email: "test@exemple.com",
            address: { city: "Paris" }
        };

        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nouvelUtilisateur)
        });

        if (!response.ok) throw new Error("HTTP " + response.status);

        const resultat = await response.json();
        ajouterLog(`Utilisateur créé (id: ${resultat.id})`, "succes");

    } catch (erreur) {
        ajouterLog(erreur.message, "erreur");
    }
}
```

> **Note :** JSONPlaceholder simule le POST et retourne un `id` fictif, sans réellement enregistrer la donnée.

---

## Exercice 3 — CoinGecko + opérations séquentielles (1h15)

**API utilisée :** [CoinGecko](https://www.coingecko.com/en/api) — API crypto gratuite, sans authentification. Limite : 10-30 requêtes/minute.

**Endpoint principal :** `GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=eur`

### 3.1 — Afficher les cours des cryptomonnaies

Requêtez une nouvelle API pour diversifier vos sources de données.

**Consignes :**

Créez une fonction `async chargerCrypto()` qui :

- Appelle l'endpoint CoinGecko ci-dessus
- Affiche le prix en euros de chaque crypto dans `#cryptoContent`
- Ajoute une couleur Bootstrap : `text-success` si BTC > 50000, ETH > 2000, ADA > 0.5 ; `text-danger` sinon
- Intègre `fetchAvecRetry` de l'exercice 2 pour gérer l'instabilité
- Gère loading et bouton dans `try/catch/finally`
- Connectez-la au bouton `#loadCrypto`

**Structure de la réponse :**

```json
{
    "bitcoin": { "eur": 62345.12 },
    "ethereum": { "eur": 3421.56 },
    "cardano": { "eur": 0.72 }
}
```

---

### 3.2 — Opérations séquentielles : utilisateur puis articles

Certaines requêtes dépendent du résultat d'une autre. Ici, vous récupérez un utilisateur, puis ses articles.

**Endpoints :**

- `GET https://jsonplaceholder.typicode.com/users/{id}` — un utilisateur
- `GET https://jsonplaceholder.typicode.com/posts?userId={id}` — ses articles

**Consignes :**

Créez une fonction `async chargerArticles(userId)` qui :

- **Étape 1 :** Récupère l'utilisateur (son nom) via le premier endpoint
- **Étape 2 :** Utilise son `id` pour récupérer ses articles via le second endpoint
- Affiche le nom de l'auteur puis la liste des titres de ses articles dans `#articlesContent`
- Ajoute un log à chaque étape pour montrer la séquence
- Connectez-la au bouton `#loadArticles` avec un `userId` aléatoire entre 1 et 10

```javascript
async function chargerArticles(userId) {
    try {
        ajouterLog("Récupération de l'utilisateur...", "info");
        const respUser = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!respUser.ok) throw new Error("Utilisateur introuvable");
        const user = await respUser.json();

        ajouterLog(`Chargement des articles de ${user.name}...`, "info");
        const respPosts = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!respPosts.ok) throw new Error("Articles inaccessibles");
        const posts = await respPosts.json();

        ajouterLog(`${posts.length} articles chargés`, "succes");
        // Affichage dans #articlesContent...

    } catch (erreur) {
        ajouterLog(erreur.message, "erreur");
    }
}
```

> **Question :** Pourrait-on lancer les deux `fetch` en parallèle ? Non : le deuxième a besoin du résultat du premier.

---

### 3.3 — Timeout avec AbortController

Ajoutez un garde-fou pour ne pas attendre indéfiniment une réponse.

**Consignes :**

Créez une fonction `async fetchAvecTimeout(url, options, timeoutMs)` qui :

- Crée un `AbortController` et passe son `signal` dans les options de fetch
- Déclenche `controller.abort()` après `timeoutMs` ms via `setTimeout`
- Gère l'erreur `AbortError` avec un message spécifique
- Nettoie le timer dans `finally`
- Timeout par défaut : **10 secondes**

```javascript
async function fetchAvecTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } catch (erreur) {
        if (erreur.name === "AbortError") {
            throw new Error("Timeout dépassé : le serveur n'a pas répondu");
        }
        throw erreur;
    } finally {
        clearTimeout(timer);
    }
}
```

Intégrez cette fonction dans vos requêtes. Testez avec un timeout de `1` ms pour voir l'erreur en action.

---

### 3.4 — Refactorisation globale

Vous disposez maintenant de plusieurs utilitaires : `fetchAvecRetry`, `fetchAvecTimeout`, `gererErreur`, `validerUtilisateurs`, `validerBlague`. Rendez votre code cohérent.

**Consignes :**

- Toutes les fonctions d'appel API utilisent `fetchAvecTimeout` ou `fetchAvecRetry` au lieu de `fetch` direct
- Toutes passent par `gererErreur` dans leur `catch`
- Toutes valident les données avant affichage
- Toutes gèrent l'état du bouton dans `finally`

**Questions de réflexion :**

- Comment combineriez-vous retry ET timeout dans une seule fonction utilitaire ?
- Que se passe-t-il si vous oubliez `clearTimeout` dans le `finally` ?
- Quand utiliser le retry (erreur temporaire) vs le timeout (serveur trop lent) ?

---

## Exercice 4 — Opérations parallèles et optimisation (30 min)

Dans les exercices précédents, chaque requête était lancée individuellement. Quand plusieurs requêtes sont **indépendantes**, les lancer en parallèle accélère considérablement l'application.

### 4.1 — Tout actualiser en parallèle avec Promise.all

Implémentez le bouton "Tout actualiser" qui charge toutes les données simultanément.

**Consignes :**

Créez une fonction `async toutActualiser()` qui :

- Lance en parallèle : `chargerUtilisateurs()`, `chargerCrypto()` et `chargerBlague()` pour la catégorie sélectionnée
- Utilise `await Promise.all([...])`
- Mesure le temps total avec `performance.now()`
- Affiche "Actualisation complète en X.XXs" dans les logs
- Connectez-la au bouton `#loadAll`

```javascript
async function toutActualiser() {
    const debut = performance.now();
    try {
        await Promise.all([
            chargerUtilisateurs(),
            chargerCrypto(),
            chargerBlague(document.getElementById("jokeCategory").value)
        ]);
        const duree = ((performance.now() - debut) / 1000).toFixed(2);
        ajouterLog(`Actualisation complète en ${duree}s`, "succes");
    } catch (erreur) {
        ajouterLog("Échec : " + erreur.message, "erreur");
    }
}
```

**Bonus :** Créez une version séquentielle (trois `await` l'un après l'autre) et comparez les temps.

---

### 4.2 — Résilience avec Promise.allSettled

`Promise.all` échoue dès qu'**une seule** promesse échoue. Pour un tableau de bord, on préfère afficher ce qui fonctionne.

**Consignes :**

Créez une fonction `async actualisationResiliente()` qui :

- Lance les mêmes opérations avec `await Promise.allSettled([...])`
- Parcourt les résultats : `status === "fulfilled"` → succès, `status === "rejected"` → échec
- Affiche les données disponibles et des messages pour les services en panne
- Connectez le bouton `#testErrors` pour simuler une URL invalide sur un service et observer le comportement

```javascript
const resultats = await Promise.allSettled([
    chargerUtilisateurs(),
    chargerCrypto(),
    chargerBlague(categorie)
]);

for (const r of resultats) {
    if (r.status === "fulfilled") {
        ajouterLog("Service OK", "succes");
    } else {
        ajouterLog("Service en panne : " + r.reason.message, "erreur");
    }
}
```

---

### 4.3 — Cache en mémoire

Évitez de bombarder les APIs avec des requêtes répétées.

**Consignes :**

- Créez un objet `cache` global : `{ cle: { donnees, timestamp } }`
- Avant chaque fetch, vérifiez si le cache a moins de **30 secondes**
- Si valide → utilisez le cache, affichez "Données en cache (Xs restantes)"
- Sinon → fetch normal + mise à jour du cache
- Appliquez-le à `chargerCrypto()`

```javascript
const cache = {};

async function chargerCrypto() {
    const cle = "crypto";
    const maintenant = Date.now();

    if (cache[cle] && (maintenant - cache[cle].timestamp) < 30000) {
        const restant = Math.round((30000 - (maintenant - cache[cle].timestamp)) / 1000);
        ajouterLog(`Données en cache (${restant}s restantes)`, "info");
        // Afficher cache[cle].donnees...
        return;
    }

    try {
        const response = await fetchAvecRetry("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=eur");
        const data = await response.json();
        cache[cle] = { donnees: data, timestamp: Date.now() };
        // Affichage...
    } catch (erreur) {
        // Gestion d'erreur...
    }
}
```

---

### 4.4 — Comparaison étendue (bonus)

Récupérez les cours de nombreuses cryptos en parallèle avec gestion individuelle des échecs.

**Consignes :**

- Lancez des requêtes pour 5+ cryptos (bitcoin, ethereum, cardano, solana, polkadot…)
- Utilisez `Promise.allSettled`
- Affichez un tableau comparatif avec nom, prix et indicateur visuel
- Marquez les cryptos en échec
- Connectez au bouton `#compareCrypto`

---

## Récapitulatif des APIs utilisées

|API|Endpoint principal|Auth|Limite|
|---|---|---|---|
|**JSONPlaceholder**|`jsonplaceholder.typicode.com/users`, `/posts`|Aucune|Illimitée|
|**JokeAPI**|`v2.jokeapi.dev/joke/{catégorie}?lang=fr`|Aucune|120 req/min|
|**CoinGecko**|`api.coingecko.com/api/v3/simple/price`|Aucune|10-30 req/min|

Ces APIs peuvent être lentes ou temporairement indisponibles — c'est un excellent terrain d'entraînement pour tester votre gestion d'erreurs.

---

## Critères d'évaluation

**Compréhension des concepts (30 %)** — Utilisation correcte de `async/await` et `try/catch`. Les logs montrent la compréhension de l'ordre d'exécution. Capacité à expliquer pourquoi `fetch` nécessite deux `await`.

**Robustesse de la gestion d'erreurs (30 %)** — L'application reste utilisable en cas de problème réseau. Les messages d'erreur sont clairs. Le retry fonctionne.

**Qualité du code et UX (25 %)** — Fonctions bien nommées et focalisées. Spinners de chargement présents. Boutons désactivés pendant les requêtes. `finally` utilisé systématiquement.

**Optimisation (15 %)** — `Promise.all` utilisé quand pertinent. Cache fonctionnel. Code structuré logiquement.

---

## Extension optionnelle

Si vous terminez en avance, implémentez une actualisation automatique des cours crypto toutes les 60 secondes avec `setInterval`, intégrée au cache. Ajoutez un bouton on/off pour contrôler cette actualisation.