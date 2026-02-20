

const bouton = document.getElementById('btnEnvoi');

function showAlert(msg, isError = false) {
    const fond = document.querySelector("#fondNoirA");
    const para = document.querySelector("#paraAlerte");
    const titre = document.querySelector("#titreAlerte");
    const img = document.querySelector("#imgAlerte");

    if (!fond || !para || !titre || !img) return;

    // Style selon type
    if (isError) {
        titre.textContent = `Envoi Impossible`;
        img.src = "/IMAGES/logo.png";
        para.style.color = "white";
        para.style.fontWeight = "bold";
        console.log("Message :", msg, "Erreur :", isError)
    } else {
        titre.textContent = `Envoi effectué`;
        img.src = "/IMAGES/logo.png";
        para.style.color = "white";
        para.style.fontWeight = "normal";
    }

    para.textContent = msg;
    fond.style.display = "flex";
}


const form = document.getElementById("formulaireConnexion");

form.addEventListener("submit", async function(e) {
    e.preventDefault(); // empêche le rechargement
    const motif = document.getElementById('motif').value;
    const message = document.getElementById('message').value;

    // Vérifier connexion
    const resUser = await fetch("/users/me", {
        credentials: "include"
    });

    const user = await resUser.json();

    if (!user.connected) {
        console.log("Utilisateur non connecté");
        showAlert("Veuillez vous connecter à votre compte si vous souhaitez envoyer une demande", true);
        return;
      };

    if (motif === '' || message === '') {
        showAlert("Veuillez remplir tous les champs avant d'envoyer votre demande.", true);
        return;
    } 

     // ENVOI AU SERVEUR
    try {

        const res = await fetch("/users/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                motif: motif,
                message: message
            })
        });

        const data = await res.json();

        if (data.success) {
            showAlert("Votre demande a été envoyée avec succès !");
        } else {
            showAlert("Erreur lors de l'envoi.", true);
        }

    } catch (err) {
        console.error(err);
        showAlert("Erreur serveur.", true);
    }

});


const fond = document.getElementById("fondNoirA");
const btn = document.getElementById("btnAlerte");

btn.addEventListener("click", (e) => {
    fond.style.display = "none"; // ferme l'alerte
});


