document.addEventListener("DOMContentLoaded", async () => {

  const container2 = document.querySelector(".containerDemandes2");
  const aucuneDemande = document.getElementById("aucuneDemande");

  try {

    const res = await fetch("http://127.0.0.1:3000/users/mes_demandes", {
      credentials: "include"
    });

    const resUser = await fetch("http://127.0.0.1:3000/users/me", {
          credentials: "include"
      });

    const user = await resUser.json();

    console.log("Status HTTP :", res.status);

    const text = await res.text(); // ← on récupère d'abord en texte
    console.log("Réponse brute serveur :", text);

    // On tente de parser seulement si c'est du JSON valide
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
      aucuneDemande.style.display = "none";


  // Verif quel jeu choisi
  
    let fondJeu, logoJeu, colorJeu;
    if (demande.jeu === "Call of Duty : Warzone") {
      fondJeu = "fond_cod";
      logoJeu = "logo_cod_warzone";
      colorJeu = "rgb(160, 221, 28)";
    } else if (demande.jeu === "Counter Strike 2") {
      fondJeu = "fond_cs";
      logoJeu = "logo_counter";
      colorJeu = "rgb(255, 153, 0)";
    } else if (demande.jeu === "League Of Legends") {
      fondJeu = "fond_lol";
      logoJeu = "logo_lol";
      colorJeu = "rgba(0, 255, 200)";
    } else if (demande.jeu === "Rocket League") {
      fondJeu = "fond_rl";
      logoJeu = "rl";
      colorJeu = "rgba(51, 139, 212)";
    } else if (demande.jeu === "Valorant") {
      fondJeu = "fond_valo";
      logoJeu = "logo valorant";
      colorJeu = "rgba(255, 70, 85)";
    } else {
      fondJeu = "fond_events_vide";
      logoJeu = "logo";
      colorJeu = "rgb(187, 0, 255)";
    }


    function dateFormate(date) {
      const d = new Date(date);

      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    function heureFormate(heure) {
      const [heures, minutes] = heure.split(":");

      return `${heures.padStart(2, "0")}h${minutes.padStart(2, "0")}`;
    }


      

      article.innerHTML = `
                    <div class="fondArticles">

                        <div class="imgJeuFond" style="background-image: url(../../../IMAGES/${fondJeu}.jpg);">
                            <div class="fondNoir">
                                <img class="logoJeu" src="../../../IMAGES/${logoJeu}.jpg" alt="logo rl">
                                <p class="paraJeu">${demande.jeu}</p>
                            </div>
                        </div>
                        
                        <div class="overflowArticle" style="--halo-color: ${colorJeu}">

                            <p class="titreEvent">${demande.titre}</p>
                            <p class="desc">${demande.description}</p>

                                <div class="boiteHoraire">
                                    <img class="imgCalendrier" src="../../IMAGES/Icons_site/Calendrier.png" alt="calendrier">
                                    <p class="info">Du ${dateFormate(demande.date_debut)} à ${heureFormate(demande.heure_debut)}</p>
                                </div>

                                <div class="boiteHoraire">
                                    <img class="imgCalendrier" src="../../IMAGES/Icons_site/Calendrier.png" alt="calendrier">
                                    <p class="info">Au ${dateFormate(demande.date_fin)} à ${heureFormate(demande.heure_fin)}</p>
                                </div>

                                <div class="boiteRecompense">
                                    <img class="imgRecompense" src="../../IMAGES/Icons_site/Récompense.png" alt="récompense">
                                    <p class="info">${demande.recompense}</p>
                                </div>

                                <div class="footerArticle">
                                    <p class="organisateur"><em>Proposé par <strong>${user.pseudo}</strong></em></p>
                                        <div class="participant">
                                            <img class="imgParticipant" src="../../IMAGES/Icons_site/perso gameur.png" alt="participants">
                                            <p>${demande.participants}</p>
                                        </div>
                                </div>
                        </div>
                    </div>

                    <div class="boiteBtn" id="boiteValidation" style="--halo-color: ${colorJeu}">
                        <button class="validation" id="valider">${demande.statut}</button>
                    </div>
                            
      `;

      container2.appendChild(article);
    });

  } catch (err) {
    console.error("Erreur serveur :", err);
    container2.innerHTML = `<p>Erreur serveur ${err}</p>`;
  }

});