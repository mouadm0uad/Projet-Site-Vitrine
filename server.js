const express = require("express");

const app = express();
const PORT = 3000;

// Nombre de fiches à afficher dans la galerie
const NOMBRE_FICHES = 8;

// Sert tous les fichiers du dossier "public" (html, css, js, images)
app.use(express.static("public"));

// -------------------------------------------------------------
// Route API : /api/pensionnaires
// -------------------------------------------------------------
app.get("/api/pensionnaires", async (req, res) => {
  const url = `https://api.thecatapi.com/v1/breeds?limit=${NOMBRE_FICHES}`;

  try {
    const reponse = await fetch(url);

    if (!reponse.ok) {
      throw new Error(`TheCatAPI a répondu avec le statut ${reponse.status}`);
    }

    const donnees = await reponse.json();

    // Transform the data to include image URLs correctly
    const pensionnaires = donnees
      .slice(0, NOMBRE_FICHES)
      .map(function (race) {
        let imageUrl = null;
        if (race.image && race.image.url) {
          imageUrl = race.image.url;
        } else if (race.reference_image_id) {
          imageUrl = `https://cdn2.thecatapi.com/images/${race.reference_image_id}.jpg`;
        }

        return {
          id: race.id,
          nom: race.name,
          origine: race.origin || "Origine inconnue",
          temperament: race.temperament || "Tempérament non documenté",
          description: race.description || "",
          esperanceVie: race.life_span ? race.life_span + " ans" : "Non précisé",
          image: imageUrl,
          fiche: race.wikipedia_url || null
        };
      });

    res.json(pensionnaires);

  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({
      erreur: "Impossible de récupérer les fiches pour le moment."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré : http://localhost:${PORT}`);
});