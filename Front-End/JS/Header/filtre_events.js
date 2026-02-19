    
 // Simuler un filtre   
    const filtres = document.querySelectorAll('.filtre');

    filtres.forEach(filtre => {
        const options = filtre.nextElementSibling; // récupère le .optionsFiltre
        filtre.addEventListener('mouseenter', () => {
            options.style.display = 'flex';
            options.style.flexDirection = 'column';
        });

        options.addEventListener('mouseenter', () => {
            options.style.display = 'flex';
            options.style.flexDirection = 'column';
        });

        filtre.addEventListener('mouseleave', () => {
            options.style.display = 'none';
        });

        options.addEventListener('mouseleave', () => {
            options.style.display = 'none';
        });
    });

// Bouton de redirection -> formulaire de creation d'evenement

document.getElementById("btnCreer").addEventListener("click", () => {
    window.location.href = "../Header/Events/formulaire_creation_events.html";
});

 document.querySelectorAll(".filtre").forEach(filtre => {
    const optionsBox = filtre.nextElementSibling;
    const options = optionsBox.querySelectorAll(".optionFiltre");

    options.forEach(option => {
        option.addEventListener("click", function(e) {
            e.preventDefault();

            const value = this.dataset.value;

            // Met à jour le texte du filtre concerné
            filtre.querySelector("p").textContent = value;

            // Ferme uniquement le bon menu
            optionsBox.style.display = "none";
        });
    });
});


