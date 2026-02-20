
// Gère la connexion sur le site 

  fetch("/users/me", {
    credentials: "include" // Obligatoire sinon les cookies de sessions ne seront pas envoyés, donc pas de session reconnue côté serveur
  })
    .then(res => res.json())
    .then(user => {
      if (!user.connected) {
        console.log("Utilisateur non connecté");
        return
      };

      console.log("Utilisateur connecté");

      const pseudo = user.pseudo;
      const pdpProfil = user.pdpProfil;

      let role = "";
      if (pseudo === "Scxrpixna") {
        role = "Organisateur";
      } else {
        role = user.role;
      }

    // Affiche les éléments du menu déroulant 
      let lienProfil = document.getElementById("lienProfil");
      let profilContainer = document.getElementById("profilContainer");

        lienProfil.addEventListener("click", (e) => {
            e.preventDefault(); // empêche la navigation
            profilContainer.style.display = profilContainer.style.display === "flex" ? "none" : "flex"; 
          });

      

  // Si connecté → menu déroulant

  if (role === 'Joueur') {
    
    profilContainer.innerHTML = `
    
   
   <div id="fondMenuD">
        <div id="boiteDeco">
          <button id="deconnection"></button>
        </div>
        <img id="pdpProfil" src=${pdpProfil} alt="">
        <a id="modifProfil" href="">Modifier le Profil</a>
        <hr id="ligneSepaMenuD">
        <p id="pseudo">${pseudo}</p>
        <p id="role">${role} Esportify</p>

        <div id="boiteLiensMenu">
          <div class="boiteLiensM">
            <ul class="mesEventsLiens" id="colorJoueur">
                <li><a class="liensGlobal" href="/Header/Profil/demande_events.html">Mes Évènements</a></li>
                <li><a class="liensGlobal" href="">Historique</a></li>
                <li><a class="liensGlobal" href="">Favoris</a></li>
            </ul>
          </div>
        </div>

    </div>
    
    
    `;
  } else if (role === 'Organisateur') {
    profilContainer.innerHTML = `
    <div id="fondMenuD">

        <div id="boiteDeco">
          <button id="deconnection"></button>
        </div>

        <img id="pdpProfil" src=${pdpProfil} alt="">
        <a id="modifProfil" href="">Modifier le Profil</a>
        <hr id="ligneSepaMenuD">
        <p id="pseudo">${pseudo}</p>
        <p id="role">${role} Esportify</p>

        <div id="boiteLiensMenu">
          <div class="boiteLiensM">
            <ul class="mesEventsLiens" id="colorJoueur">
                <li><a class="liensGlobal" href="/Header/Profil/demande_events.html">Demandes d'événements</a></li>
                <li><a class="liensGlobal" href="">Historique</a></li>
                <li><a class="liensGlobal" href="">Favoris</a></li>
            </ul>
          <br>
            <ul class="mesEventsLiens" id="colorOrganisateur"  style="--menu-color: 180, 159, 255">
                <li><a class="liensGlobal" href="/Header/Profil/gerer_events.html">Gérer un Event</a></li>
                <li><a class="liensGlobal" href="/Header/Events/gerer_users.html">Gérer un Utilisateur</a></li>
            </ul>

          </div>
        </div>
            <br>

    </div>`
    
    ;
  } else if (role === 'Administrateur') {
    profilContainer.innerHTML = `
  
    <div id="fondMenuD">

        <div id="boiteDeco">
          <button id="deconnection"></button>
        </div>

        <img id="pdpProfil" src=${pdpProfil} alt="">
        <a id="modifProfil" href="">Modifier le Profil</a>
        <hr id="ligneSepaMenuD">
        <p id="pseudo">${pseudo}</p>
        <p id="role">${role} Esportify</p>

        <div id="boiteLiensMenu">

          <div class="boiteLiensM"> 
              <ul class="mesEventsLiens" id="colorJoueur">
                  <li><a class="liensGlobal" href=/Header/Profil/demande_events.html">Demandes d'événements</a></li>
                  <li><a class="liensGlobal" href="">Historique</a></li>
                  <li><a class="liensGlobal" href="">Favoris</a></li> 
              </ul>
            <br>

            <ul class="mesEventsLiens" id="colorOrganisateur"  style="--menu-color: 180, 159, 255">
                <li><a class="liensGlobal" href="/Header/Profil/gerer_events.html">Gérer un Event</a></li>
                <li><a class="liensGlobal" href="">Gérer un Utilisateur</a></li>
            </ul>
            <br>

            <ul class="mesEventsLiens" id="colorAdministrateur"  style="--menu-color: 255, 159, 237">
                <li><a class="liensGlobal" href="">Administrer le Site</a></li>
            </ul>

          </div>

        </div>

    </div>
    `;
} else {
  
}
});


// Gère la déconnexion sur le site
 document.addEventListener("click", (e) => {
  if (e.target.id === "deconnection") {
    fetch("/users/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Déconnexion réussie");
          window.location.reload();
        }
      })
      .catch(err => console.error("Erreur déconnexion :", err));
  }
});



