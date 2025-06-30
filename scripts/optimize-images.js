const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Configuration des tailles d'images
const IMAGE_SIZES = {
  mobile: { width: 600, quality: 75 },
  tablet: { width: 1024, quality: 80 },
  desktop: { width: 1920, quality: 85 },
};

// Images à optimiser (les plus lourdes identifiées)
const IMAGES_TO_OPTIMIZE = [
  {
    input: "src/assets/img/accueil/Slide1-min.webp",
    basename: "Slide1",
    directory: "src/assets/img/accueil/",
  },
  {
    input: "src/assets/img/newImage/2.webp",
    basename: "2",
    directory: "src/assets/img/newImage/",
  },
  {
    input: "src/assets/img/newImage/6.webp",
    basename: "6",
    directory: "src/assets/img/newImage/",
  },
  {
    input: "src/assets/img/accueil/man3.jpg",
    basename: "man3",
    directory: "src/assets/img/accueil/",
  },
  {
    input: "src/assets/img/webp/12.webp",
    basename: "12",
    directory: "src/assets/img/webp/",
  },
  {
    input: "src/assets/img/accueil/femme_slide2.webp",
    basename: "femme_slide2",
    directory: "src/assets/img/accueil/",
  },
  {
    input: "src/assets/img/accueil/logoMSL.png",
    basename: "logoMSL",
    directory: "src/assets/img/accueil/",
  },
];

async function checkImageMagick() {
  try {
    await execAsync("magick -version");
    console.log("✅ ImageMagick trouvé");
    return true;
  } catch (error) {
    console.log("❌ ImageMagick non trouvé. Installation requise:");
    console.log("macOS: brew install imagemagick");
    console.log("Ubuntu: sudo apt-get install imagemagick");
    console.log("Windows: https://imagemagick.org/script/download.php#windows");
    return false;
  }
}

async function optimizeImage(imageConfig, sizeKey, sizeConfig) {
  const extension = path.extname(imageConfig.input);
  const outputExtension =
    extension === ".jpg" || extension === ".jpeg" ? ".webp" : extension;
  const outputPath = path.join(
    imageConfig.directory,
    `${imageConfig.basename}-${sizeKey}${outputExtension}`
  );

  // Vérifier si le fichier de sortie existe déjà
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  ${outputPath} existe déjà, ignoré`);
    return;
  }

  // Vérifier si le fichier d'entrée existe
  if (!fs.existsSync(imageConfig.input)) {
    console.log(`❌ Fichier d'entrée non trouvé: ${imageConfig.input}`);
    return;
  }

  try {
    let command;

    if (outputExtension === ".webp") {
      // Conversion vers WebP avec redimensionnement
      command = `magick "${imageConfig.input}" -resize ${sizeConfig.width}x -quality ${sizeConfig.quality} -define webp:method=6 -define webp:lossless=false "${outputPath}"`;
    } else {
      // Redimensionnement sans conversion de format
      command = `magick "${imageConfig.input}" -resize ${sizeConfig.width}x -quality ${sizeConfig.quality} "${outputPath}"`;
    }

    console.log(
      `🔄 Optimisation: ${path.basename(imageConfig.input)} -> ${path.basename(
        outputPath
      )}`
    );
    await execAsync(command);

    // Vérifier la taille du fichier
    const originalStats = fs.statSync(imageConfig.input);
    const optimizedStats = fs.statSync(outputPath);
    const reduction = (
      ((originalStats.size - optimizedStats.size) / originalStats.size) *
      100
    ).toFixed(1);

    console.log(
      `✅ ${path.basename(outputPath)} créé (${formatBytes(
        optimizedStats.size
      )}, -${reduction}%)`
    );
  } catch (error) {
    console.error(
      `❌ Erreur lors de l'optimisation de ${imageConfig.input}:`,
      error.message
    );
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

async function generateOptimizedImages() {
  console.log("🖼️  Génération des images optimisées...\n");

  // Vérifier ImageMagick
  const hasImageMagick = await checkImageMagick();
  if (!hasImageMagick) {
    process.exit(1);
  }

  console.log("\n📁 Traitement des images...\n");

  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    console.log(`\n📸 Traitement: ${imageConfig.input}`);

    for (const [sizeKey, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      await optimizeImage(imageConfig, sizeKey, sizeConfig);
    }
  }

  console.log("\n✨ Optimisation terminée !");
  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifiez les images générées dans les dossiers assets");
  console.log("2. Testez le site sur différentes tailles d'écran");
  console.log("3. Mesurez les performances avec les DevTools");
}

// Script de nettoyage pour supprimer les images optimisées
async function cleanOptimizedImages() {
  console.log("🧹 Nettoyage des images optimisées...\n");

  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    for (const sizeKey of Object.keys(IMAGE_SIZES)) {
      const extension = path.extname(imageConfig.input);
      const outputExtension =
        extension === ".jpg" || extension === ".jpeg" ? ".webp" : extension;
      const outputPath = path.join(
        imageConfig.directory,
        `${imageConfig.basename}-${sizeKey}${outputExtension}`
      );

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`🗑️  Supprimé: ${outputPath}`);
      }
    }
  }

  console.log("\n✅ Nettoyage terminé !");
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes("--clean")) {
  cleanOptimizedImages();
} else if (args.includes("--help")) {
  console.log(`
📖 Optimiseur d'images pour MSL Itech

Usage:
  node scripts/optimize-images.js          Génère les images optimisées
  node scripts/optimize-images.js --clean  Supprime les images optimisées
  node scripts/optimize-images.js --help   Affiche cette aide

Description:
  Ce script génère automatiquement des versions optimisées des images
  les plus lourdes du site en différentes tailles (mobile, tablet, desktop)
  pour améliorer les performances et réduire l'usage de données.
  
Prérequis:
  - ImageMagick installé sur le système
  `);
} else {
  generateOptimizedImages();
}

module.exports = {
  generateOptimizedImages,
  cleanOptimizedImages,
  IMAGES_TO_OPTIMIZE,
  IMAGE_SIZES,
};
