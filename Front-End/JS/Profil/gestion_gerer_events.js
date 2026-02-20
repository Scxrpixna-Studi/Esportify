document.addEventListener("DOMContentLoaded", async () => {

  const container = document.querySelector(".containerDemandes");
  const containerEventsEnCours = document.querySelector(".containerEventsEnCours");
  const containerValide = document.querySelector(".containerValidé");

  const aucuneDemande = document.getElementById("aucuneDemande");
  const aucunEvents = document.getElementById("aucunEvents");
  const aucunValide = document.getElementById("aucunValidé");

  try {

    const res = await fetch("/users/mes_demandes", {
      credentials: "include"
    });

    const resUser = await fetch("/users/me", {
      credentials: "include"
    });

    const user = await resUser.json();

    console.log("Status HTTP :", res.status);

    const text = await res.text(); // ← on récupère d'abord en texte
    console.log("Réponse brute serveur :", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      container.innerHTML = "<p>Le serveur a renvoyé du HTML au lieu du JSON.</p>";
      console.error("Erreur parsing JSON :", parseError);
      return;
    }

    if (!data.success) {
      container.innerHTML = "<p>Erreur chargement demandes</p>";
      return;
    }

    data.demandes.forEach(demande => {

      const article = document.createElement("article");
      let fondJeu, logoJeu, colorJeu;

      if (demande.jeu === "Call of Duty : Warzone") {
        fondJeu = "fond_cod"; logoJeu = "logo_cod_warzone"; colorJeu = "rgb(160, 221, 28)";
      } else if (demande.jeu === "Counter Strike 2") {
        fondJeu = "fond_cs"; logoJeu = "logo_counter"; colorJeu = "rgb(255, 153, 0)";
      } else if (demande.jeu === "League Of Legends") {
        fondJeu = "fond_lol"; logoJeu = "logo_lol"; colorJeu = "rgba(0, 255, 200)";
      } else if (demande.jeu === "Rocket League") {
        fondJeu = "fond_rl"; logoJeu = "rl"; colorJeu = "rgba(51, 139, 212)";
      } else if (demande.jeu === "Valorant") {
        fondJeu = "fond_valo"; logoJeu = "logo valorant"; colorJeu = "rgba(255, 70, 85)";
      } else {
        fondJeu = "fond_events_vide"; logoJeu = "logo"; colorJeu = "rgb(187, 0, 255)";
      }

      function dateFormate(date) {
        const d = new Date(date);
        return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
      function heureFormate(heure) {
        const [heures, minutes] = heure.split(":");
        return `${heures.padStart(2,"0")}h${minutes.padStart(2,"0")}`;
      }

      article.innerHTML = `
        <div class="fondArticles">
          <div class="imgJeuFond" style="background-image: url(../../../IMAGES/${fondJeu}.jpg);">
            <div class="fondNoir">
              <img class="logoJeu" src="/IMAGES/${logoJeu}.jpg" alt="logo rl">
              <p class="paraJeu">${demande.jeu}</p>
            </div>
          </div>
          <div class="overflowArticle" style="--halo-color: ${colorJeu}">
            <p class="titreEvent">${demande.titre}</p>
            <p class="desc">${demande.description}</p>
            <div class="boiteHoraire">
              <img class="imgCalendrier" src="/IMAGES/Icons_site/Calendrier.png" alt="calendrier">
              <p class="info">Du ${dateFormate(demande.date_debut)} à ${heureFormate(demande.heure_debut)}</p>
            </div>
            <div class="boiteHoraire">
              <img class="imgCalendrier" src="/IMAGES/Icons_site/Calendrier.png" alt="calendrier">
              <p class="info">Au ${dateFormate(demande.date_fin)} à ${heureFormate(demande.heure_fin)}</p>
            </div>
            <div class="boiteRecompense">
              <img class="imgRecompense" src="/IMAGES/Icons_site/Récompense.png" alt="récompense">
              <p class="info">${demande.recompense}</p>
            </div>
        
            <div class="boiteParticipantMin">
                <img class="imgJoueur" src="/IMAGES/Icons_site/perso gameur.png" alt="joueurs">
                <p class="info">Participants minimum : ${demande.participants}</p>
            </div>

            <div class="footerArticle">
              <div class= "boitePropos">
                <p class="organisateur"><em>Proposé par <strong>${user.pseudo}</strong></em></p>
                <p class="organisateur"><em>Validé par <strong>${user.pseudo}</strong></em></p>
              </div>
                    <div class="participant">
                        <img class="imgParticipant" src="/IMAGES/Icons_site/perso gameur.png" alt="participants">
                        <p>${demande.NbrParticipants}</p>
                    </div>
            </div>
          </div>
        </div>
      `;

      // Si la demande est déjà validée
      // Dans le forEach(data.demandes)…
if (demande.statut === "Validé") {

  // --- Article pour Events en cours ---
  const articleEvent = article.cloneNode(true);
  articleEvent.querySelectorAll(".boiteBtn").forEach(b => b.remove());
  const nouvelleBoite = document.createElement("div");
  nouvelleBoite.classList.add("boiteBtnInscription");
  nouvelleBoite.style.setProperty("--halo-color", colorJeu);
  nouvelleBoite.innerHTML = `<button class="btnInscrire" style="--halo-color: ${colorJeu}">S'inscrire</button>`;
  articleEvent.appendChild(nouvelleBoite);
  containerEventsEnCours.appendChild(articleEvent);

  // --- Article pour Validé ---
  const articleValide = article.cloneNode(true);
  articleValide.querySelectorAll(".boiteBtn").forEach(b => b.remove());
  const boiteStatut = document.createElement("div");
  boiteStatut.classList.add("boiteBtnValide");
  boiteStatut.style.setProperty("--halo-color", colorJeu);
  boiteStatut.innerHTML = `<button disabled class="btnStatut" style="--halo-color: ${colorJeu}">Validé</button>`;
  articleValide.appendChild(boiteStatut);
  containerValide.appendChild(articleValide);

} else {
  // Sinon, bouton Valider / Refuser (comme avant)
  container.appendChild(article);
}

    });

    // Affichage messages "aucun"
    aucuneDemande.style.display = container.querySelectorAll("article").length === 0 ? "flex" : "none";
    aucunValide.style.display = containerValide.querySelectorAll("article").length === 0 ? "flex" : "none";
    aucunEvents.style.display = containerEventsEnCours.querySelectorAll("article").length === 0 ? "flex" : "none";

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
    console.error("Erreur serveur :", err);
    container.innerHTML = `<p>Erreur serveur ${err}</p>`;
  }

});

async function gererValidation(article, demande) {
  let colorJeu;
  if (demande.jeu === "Call of Duty : Warzone") colorJeu = "rgb(160, 221, 28)";
  else if (demande.jeu === "Counter Strike 2") colorJeu = "rgb(255, 153, 0)";
  else if (demande.jeu === "League Of Legends") colorJeu = "rgba(0, 255, 200)";
  else if (demande.jeu === "Rocket League") colorJeu = "rgba(51, 139, 212)";
  else if (demande.jeu === "Valorant") colorJeu = "rgba(255, 70, 85)";
  else colorJeu = "rgb(187, 0, 255)";

  try {
    const res = await fetch("/users/valider_demande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: demande.id })
    });
    const result = await res.json();
    if (!result.success) return;
  } catch (err) {
    console.error("Erreur validation :", err);
    return;
  }

  const containerDemandes = document.querySelector(".containerDemandes");
  const containerEventsEnCours = document.querySelector(".containerEventsEnCours");
  const containerValide = document.querySelector(".containerValidé");

  const aucuneDemande = document.getElementById("aucuneDemande");
  const aucunEvents = document.getElementById("aucunEvents");
  const aucunValide = document.getElementById("aucunValidé");

  // Préparer les clones avant suppression
  const articleEvent = article.cloneNode(true);
  const articleValide = article.cloneNode(true);

  // Retirer article original
  article.remove();

  // Mise à jour messages "aucun"
  aucuneDemande.style.display = containerDemandes.querySelectorAll("article").length === 0 ? "flex" : "none";
  aucunValide.style.display = "none";
  aucunEvents.style.display = "none";

  // Article Events en cours
  articleEvent.querySelectorAll(".boiteBtn").forEach(b => b.remove());
  const nouvelleBoite = document.createElement("div");
  nouvelleBoite.classList.add("boiteBtnInscription");
  nouvelleBoite.style.setProperty("--halo-color", colorJeu);
  nouvelleBoite.innerHTML = `<button class="btnInscrire" style="--halo-color: ${colorJeu}">S'inscrire</button>`;
  articleEvent.appendChild(nouvelleBoite);
  containerEventsEnCours.appendChild(articleEvent);

  // Article Validé
  articleValide.querySelectorAll(".boiteBtn").forEach(b => b.remove());
  const boiteStatut = document.createElement("div");
  boiteStatut.classList.add("boiteBtnValide");
  boiteStatut.style.setProperty("--halo-color", colorJeu);
  boiteStatut.innerHTML = `<button disabled class="btnStatut" style="--halo-color: ${colorJeu}">Validé</button>`;
  articleValide.appendChild(boiteStatut);
  containerValide.appendChild(articleValide);
}
