const fs = require("fs");
const path = require("path");

// Script alternatif sans ImageMagick - utilise Sharp (package Node.js)

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
    input: "src/assets/img/accueil/logoMSL.webp",
    basename: "logoMSL",
    directory: "src/assets/img/accueil/",
  },
];

async function checkSharp() {
  try {
    const sharp = require("sharp");
    console.log("✅ Sharp trouvé");
    return sharp;
  } catch (error) {
    console.log("❌ Sharp non trouvé. Installation automatique...");
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    try {
      console.log("📦 Installation de Sharp...");
      await execAsync("npm install sharp");
      const sharp = require("sharp");
      console.log("✅ Sharp installé et prêt");
      return sharp;
    } catch (installError) {
      console.error("❌ Impossible d'installer Sharp:", installError.message);
      console.log("\n🔧 Solutions alternatives:");
      console.log("1. Installez Sharp manuellement: npm install sharp");
      console.log("2. Utilisez des outils en ligne comme TinyPNG.com");
      console.log("3. Utilisez l'optimisation manuelle (voir documentation)");
      return null;
    }
  }
}

async function optimizeImageWithSharp(sharp, imageConfig, sizeKey, sizeConfig) {
  const extension = path.extname(imageConfig.input);
  const outputExtension = ".webp"; // Toujours convertir en WebP avec Sharp
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
    console.log(
      `🔄 Optimisation: ${path.basename(imageConfig.input)} -> ${path.basename(
        outputPath
      )}`
    );

    await sharp(imageConfig.input)
      .resize(sizeConfig.width, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({
        quality: sizeConfig.quality,
        effort: 6, // Meilleure compression
      })
      .toFile(outputPath);

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
  console.log("🖼️  Génération des images optimisées avec Sharp...\n");

  // Vérifier Sharp
  const sharp = await checkSharp();
  if (!sharp) {
    process.exit(1);
  }

  console.log("\n📁 Traitement des images...\n");

  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    console.log(`\n📸 Traitement: ${imageConfig.input}`);

    for (const [sizeKey, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      await optimizeImageWithSharp(sharp, imageConfig, sizeKey, sizeConfig);
    }
  }

  console.log("\n✨ Optimisation terminée avec Sharp !");
  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifiez les images générées dans les dossiers assets");
  console.log("2. Testez le site sur différentes tailles d'écran");
  console.log("3. Mesurez les performances avec les DevTools");
}

async function generateManualInstructions() {
  console.log("📖 Instructions pour l'optimisation manuelle\n");

  console.log("🎯 Outils recommandés en ligne (gratuits):");
  console.log("- TinyPNG.com - Compression PNG/JPEG");
  console.log("- Squoosh.app - Outil Google pour WebP");
  console.log("- Compressor.io - Compression multi-format");

  console.log("\n📏 Tailles à créer pour chaque image:");

  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    console.log(`\n📸 ${imageConfig.input}:`);

    for (const [sizeKey, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      const outputName = `${imageConfig.basename}-${sizeKey}.webp`;
      console.log(
        `  ${sizeKey}: ${sizeConfig.width}px max, qualité ${sizeConfig.quality}% → ${outputName}`
      );
    }
  }

  console.log("\n💡 Processus recommandé:");
  console.log("1. Ouvrez squoosh.app dans votre navigateur");
  console.log("2. Glissez-déposez une image");
  console.log("3. Sélectionnez WebP comme format de sortie");
  console.log("4. Ajustez la qualité selon le tableau ci-dessus");
  console.log("5. Redimensionnez à la largeur maximale");
  console.log("6. Téléchargez et renommez selon le pattern");
  console.log("7. Placez dans le bon dossier assets");
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes("--manual")) {
  generateManualInstructions();
} else if (args.includes("--help")) {
  console.log(`
📖 Optimiseur d'images alternatif pour MSL Itech

Usage:
  node scripts/optimize-images-alternative.js          Génère avec Sharp
  node scripts/optimize-images-alternative.js --manual Instructions manuelles
  node scripts/optimize-images-alternative.js --help   Affiche cette aide

Description:
  Alternative à ImageMagick utilisant Sharp (package Node.js) ou
  instructions pour optimisation manuelle avec des outils en ligne.
  `);
} else {
  generateOptimizedImages();
}

module.exports = {
  generateOptimizedImages,
  generateManualInstructions,
  IMAGES_TO_OPTIMIZE,
  IMAGE_SIZES,
};
