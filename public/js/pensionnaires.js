function displayPensionnaireCards(pensionnaires, containerSelector) {

  // containerSelector : le sélecteur CSS du conteneur où placer les cartes
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Conteneur introuvable : ${containerSelector}`);
    return;
  }

  if (!Array.isArray(pensionnaires)) {
    console.error("Les données reçues ne sont pas un tableau :", pensionnaires);
    return;
  }

  if (pensionnaires.length === 0) {
    container.innerHTML = "<p>Aucune fiche disponible pour le moment.</p>";
    return;
  }

  // On vide le conteneur avant d'ajouter les cartes
  container.innerHTML = "";

  // On boucle au travers de chacun des objets reçus de l'API
  pensionnaires.forEach(function (animal, index) {

    const carte = document.createElement("article");
    carte.classList.add("carte-animal");
    carte.classList.add(`carte-animal-${index + 1}`);

    // On raccourcit la description pour garder des cartes de taille égale
    let resume = animal.description;
    if (resume.length > 120) {
      resume = resume.slice(0, 120).trim() + "…";
    }

    // Si l'API ne fournit pas de photo, on affiche un bloc de remplacement
    const visuel = animal.image
      ? `<img src="${animal.image}" alt="Un chat de race ${animal.nom}" loading="lazy">`
      : `<div class="carte-animal__sans-photo">Photo à venir</div>`;

    carte.innerHTML = `
      ${visuel}
      <div class="carte-animal__contenu">
        <h3>${animal.nom}</h3>
        <p class="carte-animal__meta">${animal.origine} · ${animal.esperanceVie}</p>
        <p class="carte-animal__temperament">${animal.temperament}</p>
        <p>${resume}</p>
      </div>
    `;

    container.appendChild(carte);
  });

}

async function loadPensionnaires() {
  const container = document.querySelector(".grille-galerie");
  if (!container) {
    return; // cette page n'a pas de galerie, on ne fait rien
  }

  try {
    // On appelle notre propre API, qui elle-même interroge TheCatAPI
    const response = await fetch("/api/pensionnaires");

    if (!response.ok) {
      throw new Error(`Erreur du serveur : ${response.status}`);
    }

    // On transforme le JSON en objets JavaScript
    const donnees = await response.json();

    if (donnees.erreur) {
      container.innerHTML = `<p>${donnees.erreur}</p>`;
      return;
    }

    // On affiche les fiches dans le conteneur
    displayPensionnaireCards(donnees, ".grille-galerie");

  } catch (error) {
    console.error("Erreur lors du chargement des pensionnaires :", error);
    container.innerHTML =
      "<p>Les fiches n'ont pas pu être chargées. Le serveur est peut-être hors ligne.</p>";
  }
}

loadPensionnaires();
