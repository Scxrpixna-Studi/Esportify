const para = document.getElementById("paraPrincipalCo");

    // Récupérer le paramètre "status" dans l'URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    // Définir le message selon le status
    let message = "";
    switch(status) {
        case "email-verified":
            message = "Votre E-Mail a bien été vérifié ! Vous pouvez maintenant vous connecter à Esportify.";
            break;
        case "token-invalide":
            message = "Le token est invalide ou déjà utilisé. Veuillez réessayer.";
            break;
        case "erreur":
            message = "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
            break;
        default:
            message = "Une erreur c'est produite...";
    }

    para.textContent = message;
