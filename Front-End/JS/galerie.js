const images = [
    
    "/IMAGES/img1.png",
    "/IMAGES/img2.png",
    "/IMAGES/img3.png",
    "/IMAGES/img4.png",
    "/IMAGES/img5.png"
];

const listeGalerie = document.getElementById('listeGalerie');
const messageAucune = document.getElementById('aucuneImage');

if (images.length === 0) {
    // Pas d'image → message visible
    messageAucune.style.display = "block";
} else {
    // On masque le message
    messageAucune.style.display = "none";

    images.forEach((src, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <figure>
                <img class="imgGalerie" src="${src}" alt="img${index + 1}">
            </figure>
        `;
        listeGalerie.appendChild(li);
    });
}

const profil = document.getElementById("profil");
const menu = document.getElementById("profilContainer");

profil.addEventListener("mouseenter", () => {
  menu.style.display = "flex";
});

menu.addEventListener("mouseleave", () => {
  menu.style.display = "none";
});

