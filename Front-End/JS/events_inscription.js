document.addEventListener("DOMContentLoaded", async () => {

  const containerEventsEnCours = document.querySelector(".events");
  const aucunEvents = document.querySelector(".aucunEvents");

  const toutEvents = document.querySelector(".toutEvents");
  const aucunEventsContent = document.querySelector(".aucunEventsContent");

  try {
    // Récupérer les événements validés
    const res = await fetch("http://127.0.0.1:3000/users/events_en_cours", {
      credentials: "include"
    });
    console.log(res.status, res.headers.get("content-type"));
   const text = await res.text();

    const resUser = await fetch("http://127.0.0.1:3000/users/me", {
          credentials: "include"
      });

    const user = await resUser.json();


if (!res.headers.get("content-type")?.includes("application/json")) {
    console.error("Le serveur n’a pas renvoyé du JSON :", text);
    containerEventsEnCours.innerHTML = "<p>Impossible de charger les événements.</p>";
    return;
}

const data = JSON.parse(text);

    if (!data.success || !data.demandes || data.demandes.length === 0) {
      aucunEvents.style.display = "flex";
      return;
    }

    // Masquer le message "aucun événement"
    aucunEvents.style.display = "none";

    data.demandes.forEach(demande => {

      const articleEvent = document.createElement("article");

      // Couleurs, fonds et logos selon le jeu
      let fondJeu, logoJeu, colorJeu;
      switch(demande.jeu) {
        case "Call of Duty : Warzone":
          fondJeu = "fond_cod"; logoJeu = "logo_cod_warzone"; colorJeu = "rgb(160, 221, 28)"; break;
        case "Counter Strike 2":
          fondJeu = "fond_cs"; logoJeu = "logo_counter"; colorJeu = "rgb(255, 153, 0)"; break;
        case "League Of Legends":
          fondJeu = "fond_lol"; logoJeu = "logo_lol"; colorJeu = "rgba(0, 255, 200)"; break;
        case "Rocket League":
          fondJeu = "fond_rl"; logoJeu = "rl"; colorJeu = "rgba(51, 139, 212)"; break;
        case "Valorant":
          fondJeu = "fond_valo"; logoJeu = "logo valorant"; colorJeu = "rgba(255, 70, 85)"; break;
        default:
          fondJeu = "fond_events_vide"; logoJeu = "logo"; colorJeu = "rgb(187, 0, 255)";
      }

      function dateFormate(date) {
        const d = new Date(date);
        return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
      }

      function heureFormate(heure) {
        const [heures, minutes] = heure.split(":");
        return `${heures.padStart(2, "0")}h${minutes.padStart(2, "0")}`;
      }

      articleEvent.innerHTML = `
        <div class="fondArticles">
          <div class="imgJeuFond" style="background-image: url(../../../IMAGES/${fondJeu}.jpg);">
            <div class="fondNoir">
              <img class="logoJeu" src="../../../IMAGES/${logoJeu}.jpg" alt="logo ${demande.jeu}">
              <p class="paraJeu">${demande.jeu}</p>
            </div>
          </div>

          <div class="overflowArticle" style="--halo-color: ${colorJeu}">
            <p class="titreEvent">${demande.titre}</p>
            <p class="desc">${demande.description}</p>

            <div class="boiteHoraire">
              <img class="imgCalendrier" src="../../../IMAGES/Icons_site/Calendrier.png" alt="calendrier">
              <p class="info">Du ${dateFormate(demande.date_debut)} à ${heureFormate(demande.heure_debut)}</p>
            </div>

            <div class="boiteHoraire">
              <img class="imgCalendrier" src="../../../IMAGES/Icons_site/Calendrier.png" alt="calendrier">
              <p class="info">Au ${dateFormate(demande.date_fin)} à ${heureFormate(demande.heure_fin)}</p>
            </div>

            <div class="boiteRecompense">
              <img class="imgRecompense" src="../../../IMAGES/Icons_site/Récompense.png" alt="récompense">
              <p class="info">${demande.recompense}</p>
            </div>

            <div class="boiteParticipantMin">
                <img class="imgJoueur" src="../../../IMAGES/Icons_site/perso gameur.png" alt="joueurs">
                <p class="info">Participants minimum : ${demande.participants}</p>
            </div>

            <div class="footerArticle">
                <p class="organisateur"><em>Proposé par <strong>${user.pseudo}</strong></em></p>
                    <div class="participant">
                        <img class="imgParticipant" src="../../../IMAGES/Icons_site/perso gameur.png" alt="participants">
                        <p>${demande.NbrParticipants}</p>
                    </div>
            </div>
          </div>
        </div>

        <div class="boiteBtnInscription" style="--halo-color: ${colorJeu}">
          <button class="btnInscrire" style="--halo-color: ${colorJeu}">S'inscrire</button>
        </div>
      `;

      containerEventsEnCours.appendChild(articleEvent);

      // Event listener pour le bouton "S'inscrire"
      const btnInscrire = articleEvent.querySelector(".btnInscrire");
      btnInscrire.addEventListener("click", () => {
        console.log("Inscription détectée pour :", demande.id);
        // Ici tu peux ajouter la logique d'inscription côté serveur
      });

    });

    
    document.querySelectorAll(".overflowArticle").forEach(article => {
        article.addEventListener("mousemove", e => {
            const rect = article.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            article.style.setProperty("--x", `${x}px`);
            article.style.setProperty("--y", `${y}px`);
        });
    });


  } catch (err) {
    console.error("Erreur chargement événements :", err);
    containerEventsEnCours.innerHTML = `<p>Erreur serveur ${err.message}</p>`;
  }

});

