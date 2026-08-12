// Nombre de fiches ajoutées à chaque clic sur « Afficher plus de races »
const CARTES_PAR_LOT = 8;

// Toutes les fiches reçues de l'API, gardées en mémoire une seule fois
let toutesLesFiches = [];

// Combien de fiches sont actuellement visibles dans la galerie
let nombreAffiche = 0;


function displayPensionnaireCards(pensionnaires, containerSelector, ajouter) {

  // containerSelector : le sélecteur CSS du conteneur où placer les cartes
  // ajouter : si true, on ajoute à la suite au lieu de remplacer
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Conteneur introuvable : ${containerSelector}`);
    return;
  }

  if (!Array.isArray(pensionnaires)) {
    console.error("Les données reçues ne sont pas un tableau :", pensionnaires);
    return;
  }

  if (pensionnaires.length === 0 && !ajouter) {
    container.innerHTML = "<p>Aucune fiche disponible pour le moment.</p>";
    return;
  }

  // On vide le conteneur seulement si on ne fait pas un ajout
  if (!ajouter) {
    container.innerHTML = "";
  }

  // On boucle au travers de chacun des objets reçus de l'API
  pensionnaires.forEach(function (animal) {

    // La numérotation continue d'un lot à l'autre : la 9e carte reste la 9e
    const numero = container.querySelectorAll(".carte-animal").length + 1;

    const carte = document.createElement("article");
    carte.classList.add("carte-animal");
    carte.classList.add(`carte-animal-${numero}`);

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


// Affiche le lot suivant de fiches et met à jour le compteur et le bouton
function afficherLotSuivant(ajouter) {
  const lot = toutesLesFiches.slice(nombreAffiche, nombreAffiche + CARTES_PAR_LOT);

  displayPensionnaireCards(lot, ".grille-galerie", ajouter);
  nombreAffiche = nombreAffiche + lot.length;

  const compteur = document.querySelector("#compteurPensionnaires");
  if (compteur) {
    compteur.textContent =
      `${nombreAffiche} races affichées sur ${toutesLesFiches.length}`;
  }

  // Le bouton disparaît quand tout est affiché
  const bouton = document.querySelector("#boutonPlus");
  if (bouton) {
    bouton.hidden = nombreAffiche >= toutesLesFiches.length;
  }
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

    // On garde toutes les fiches en mémoire, puis on affiche le premier lot
    toutesLesFiches = donnees;
    nombreAffiche = 0;
    afficherLotSuivant(false);

    // Chaque clic ajoute le lot suivant à la suite des cartes déjà là
    const bouton = document.querySelector("#boutonPlus");
    if (bouton) {
      bouton.addEventListener("click", function () {
        afficherLotSuivant(true);
      });
    }

  } catch (error) {
    console.error("Erreur lors du chargement des pensionnaires :", error);
    container.innerHTML =
      "<p>Les fiches n'ont pas pu être chargées. Le serveur est peut-être hors ligne.</p>";
  }
}

loadPensionnaires();
