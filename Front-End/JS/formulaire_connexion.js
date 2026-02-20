// Permet de switch entre la connexion et l'inscription

    const btnConnexion = document.getElementById("paraCo");
    const btnInscription = document.getElementById("paraInscription");

    const texteCo = document.getElementById("paraPrincipalCo");
    const texteIn = document.getElementById("paraPrincipalIn");

    const boitePseudo = document.getElementById("boitePseudo");
    const btnCo = document.getElementById("btnCo");
    const btnIn = document.getElementById("btnIn");
    const mdpOublie = document.getElementById("mdpOublie");

    btnInscription.addEventListener("click", () => {
        texteCo.style.display = "none";
        texteIn.style.display = "flex";

        boitePseudo.style.display = "flex";

        btnCo.style.display = "none";
        btnIn.style.display = "flex";

        mdpOublie.style.display = "none";

        btnInscription.classList.add("active", "from-left");
        btnConnexion.classList.remove("active", "from-left", "from-right");
    });


    btnConnexion.addEventListener("click", () => {
        texteCo.style.display = "flex";
        texteIn.style.display = "none";

        boitePseudo.style.display = "none";

        btnCo.style.display = "flex";
        btnIn.style.display = "none";

        mdpOublie.style.display = "flex";

        btnConnexion.classList.add("active", "from-right");
        btnInscription.classList.remove("active", "from-left", "from-right");
    });


// Permet d'afficher le mot de passe du formulaire grace à l'oeil

    const mdp = document.getElementById("mdp");
    const oeilMdp = document.getElementById("oeilMdp");

    oeilMdp.addEventListener("click", () => {
        const isPassword = mdp.type === "password";
        mdp.type = isPassword ? "text" : "password";

        oeilMdp.src = isPassword
            ? "/IMAGES/Icons_site/Oeil ouvert.png"
            : "/IMAGES/Icons_site/Oeil fermé.png";
    });


// Récupération des données du formulaire

// Fonction pour afficher les alertes
function showAlert(message, isError = false) {
    const fond = document.querySelector("#fondNoirA");
    const para = document.querySelector("#paraAlerte");
    const titre = document.querySelector("#titreAlerte");
    const img = document.querySelector("#imgAlerte");

    if (!fond || !para || !titre || !img) return;

    const inscription = document.querySelector("#btnIn").style.display !== "none";
    const etat = inscription ? "Inscription" : "Connexion";

    // Style selon type
    if (isError) {
        titre.textContent = `${etat} Impossible`;
        img.src = "/IMAGES/logo.png";
        para.style.color = "white";
        para.style.fontWeight = "bold";
        console.log("Message :", message, "Erreur :", isError)
    } else {
        titre.textContent = `${etat} à Esportify`;
        img.src = "/IMAGES/logo.png";
        para.style.color = "white";
        para.style.fontWeight = "normal";
    }

    para.textContent = message;

    // Affiche
    fond.style.display = "flex";
}


function isValidEmail(mail) {
    // Regex simple pour vérifier la structure mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}


// Gestion du formulaire
document.querySelector("#formulaireConnexion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pseudo = document.querySelector("#pseudo")?.value;
    const email = document.querySelector("#email").value;
    const mdp = document.querySelector("#mdp").value;

    const isRegister = document.querySelector("#btnIn").style.display !== "none";

    // ✅ Validation email ici, au moment du submit
    if (!isValidEmail(email)) {
        showAlert("Adresse e-mail invalide !", true);
        return; // stop l'envoi au serveur
    }

    // ✅ Validation mot de passe (8 à 20 caractères)
    if (mdp.length < 8 || mdp.length > 20) {
        showAlert("Le mot de passe doit contenir entre 8 et 20 caractères.", true);
        return;
    }

    const endpoint = isRegister
        ? "/users/register"
        : "/users/login";

    const payload = isRegister ? { pseudo, email, mdp } : { email, mdp };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include" // <-- important pour la session
        });

        const result = await response.json();

        if (result.success) {

            showAlert(result.message, false);

            if (isRegister) {
                 setTimeout(() => window.location.href = "/HTML/Header/connexion.html", 2000);
                 
        } else {
            setTimeout(() => window.location.href = "/HTML/accueil.html", 100);
              
        }

      
    } else {
        showAlert(result.message, true); // erreur
        console.log(result.message);
    }

    } catch (err) {
        console.error(err);
        console.log(err);
        showAlert(`Erreur de connexion au serveur. ${err.message}`, true);
    }
});

const btn = document.getElementById("btnAlerte");
const fond = document.getElementById("fondNoirA");

btn.addEventListener("click", (e) => {
    fond.style.display = "none"; // ferme l'alerte
});







