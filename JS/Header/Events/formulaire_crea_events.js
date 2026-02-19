// Récupérer la value dans la simulation du select de jeu
  const options = document.querySelectorAll(".optionFiltre");
  const filtre = document.getElementById("filtreJeu");
  const hiddenInput = document.getElementById("jeuSelectionne");

  options.forEach(option => {
      option.addEventListener("click", function(e) {
          e.preventDefault(); // empêche le rafraichissement de la page

          const value = this.dataset.value;

          // Met à jour le texte affiché
          filtre.querySelector("p").textContent = value;

          // Met à jour la vraie valeur envoyée au form
          hiddenInput.value = value;

          // Ferme le menu
          this.parentElement.style.display = "none";
      });
  });


// Verifie que le joueur est connecté, si oui -> envoie 
  const bouton = document.getElementById('btnEnvoyer');

  function showAlert(msg, isError = false) {
      const fond = document.querySelector("#fondNoirA");
      const para = document.querySelector("#paraAlerte");
      const titre = document.querySelector("#titreAlerte");
      const img = document.querySelector("#imgAlerte");

      if (!fond || !para || !titre || !img) return;

      // Style selon type
      if (isError) {
          titre.textContent = `Création Impossible`;
          img.src = "../../../IMAGES/logo.png";
          para.style.color = "white";
          para.style.fontWeight = "bold";
          console.log("Message :", msg, "Erreur :", isError)
      } else {
          titre.textContent = `Demande de création envoyé`;
          img.src = "../../../IMAGES/logo.png";
          para.style.color = "white";
          para.style.fontWeight = "normal";
      }

      para.textContent = msg;
      fond.style.display = "flex";
  }


  const form = document.getElementById("formulaireCreationEvents");

  form.addEventListener("submit", async function(e) {
      e.preventDefault(); // empêche le rechargement

      const jeu = document.getElementById('jeuSelectionne').value;
      const titre = document.getElementById('titre').value;
      const description = document.getElementById('description').value;
      const nbrParticipant = document.getElementById('nbrParticipant').value;
      const dateDebut = document.getElementById('dateDebut').value;
      const heureDebut = document.getElementById('heureDebut').value;
      const dateFin = document.getElementById('dateFin').value;
      const heureFin = document.getElementById('heureFin').value;

      const recompense = document.getElementById('recompense').value || "Aucune récompense";
      const statut = "En attente";
      const NbrParticipants = "0";

      // Vérifier connexion
      const resUser = await fetch("http://127.0.0.1:3000/users/me", {
          credentials: "include"
      });

      const user = await resUser.json();

      if (!user.connected) {
          console.log("Utilisateur non connecté");
          showAlert("Veuillez vous connecter à votre compte si vous souhaitez envoyer une demande", true);
          return;
        };

      // ENVOI AU SERVEUR
      try {

          const res = await fetch("http://127.0.0.1:3000/users/creation_events", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                titre: titre,
                description: description,
                jeu: jeu,
                participants: nbrParticipant,

                date_debut: dateDebut,
                heure_debut: heureDebut,
                date_fin: dateFin,
                heure_fin: heureFin,

                récompense: recompense,
                statut: statut,

                NbrParticipants: NbrParticipants
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



// Gère fermeture de l'alerte
  const fond = document.getElementById("fondNoirA");
  const btn = document.getElementById("btnAlerte");

  btn.addEventListener("click", (e) => {
      fond.style.display = "none"; // ferme l'alerte
  });


