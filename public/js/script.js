// On attend que la page soit chargée avant de toucher au HTML.
document.addEventListener("DOMContentLoaded", function () {


  /* -------------------------------------------------------
     1. MENU MOBILE
     Le bouton « Menu » ouvre et ferme la navigation.
     ------------------------------------------------------- */
  var boutonMenu = document.getElementById("boutonMenu");
  var menuPrincipal = document.getElementById("menuPrincipal");

  if (boutonMenu && menuPrincipal) {
    boutonMenu.addEventListener("click", function () {
      menuPrincipal.classList.toggle("navigation--ouverte");

      // On indique aux lecteurs d'écran si le menu est ouvert ou fermé.
      var estOuvert = menuPrincipal.classList.contains("navigation--ouverte");
      boutonMenu.setAttribute("aria-expanded", estOuvert);
    });
  }


  /* -------------------------------------------------------
     2. ANNÉE COURANTE
     Évite d'avoir à changer l'année à la main chaque janvier.
     ------------------------------------------------------- */
  var annee = document.getElementById("anneeCourante");

  if (annee) {
    annee.textContent = new Date().getFullYear();
  }


  /* -------------------------------------------------------
     3. FORMULAIRE DE CONTACT
     Vérification simple avant l'envoi. Le formulaire n'est
     relié à aucune boîte courriel : on affiche seulement un
     message de confirmation.
     ------------------------------------------------------- */
  var formulaire = document.getElementById("formulaireContact");

  if (formulaire) {
    var champNom = document.getElementById("nom");
    var champCourriel = document.getElementById("courriel");
    var champMessage = document.getElementById("message");
    var messageRetour = document.getElementById("messageRetour");

    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault(); // empêche le rechargement de la page

      var erreurs = [];

      // On enlève les erreurs de la tentative précédente.
      champNom.classList.remove("champ-erreur");
      champCourriel.classList.remove("champ-erreur");
      champMessage.classList.remove("champ-erreur");

      // Le nom doit contenir au moins 2 caractères.
      if (champNom.value.trim().length < 2) {
        champNom.classList.add("champ-erreur");
        erreurs.push("le nom");
      }

      // Le courriel doit contenir un @ et un point après celui-ci.
      var modeleCourriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!modeleCourriel.test(champCourriel.value.trim())) {
        champCourriel.classList.add("champ-erreur");
        erreurs.push("le courriel");
      }

      // Le message doit contenir au moins 10 caractères.
      if (champMessage.value.trim().length < 10) {
        champMessage.classList.add("champ-erreur");
        erreurs.push("le message (10 caractères minimum)");
      }

      if (erreurs.length > 0) {
        messageRetour.className = "message-retour message-retour--erreur";
        messageRetour.textContent = "Il reste à corriger : " + erreurs.join(", ") + ".";
        return;
      }

      // Tout est valide : message de confirmation et remise à zéro.
      messageRetour.className = "message-retour message-retour--succes";
      messageRetour.textContent =
        "Merci " + champNom.value.trim() + ", votre message est parti. Réponse sous 48 heures.";
      formulaire.reset();
    });
  }


});
