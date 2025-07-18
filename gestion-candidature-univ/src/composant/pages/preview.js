import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

function Preview({ title, paragraphes, alignment, styles }) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  // Fonction pour charger les polices
  const loadFont = async (fontUrl) => {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de la police depuis ${fontUrl}`);
    }
    return response.arrayBuffer();
  };

  // Fonction pour charger l'image de l'en-tête
  const loadImage = async (imageUrl) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de l'image depuis ${imageUrl}`);
    }
    return response.arrayBuffer();
  };

  // Fonction pour diviser le texte en lignes, en prenant en compte les retours à la ligne
  const splitTextIntoLines = (text, font, fontSize, maxWidth) => {
    const lines = [];
    let currentLine = "";
    const paragraphs = text.split("\n"); // Diviser le texte en paragraphes selon le retour à la ligne

    paragraphs.forEach((paragraph) => {
      const words = paragraph.split(" ");
      words.forEach((word) => {
        const testLine = currentLine ? currentLine + " " + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth < maxWidth) {
          currentLine = testLine; // Ajouter le mot à la ligne courante
        } else {
          lines.push(currentLine); // Ajouter la ligne courante
          currentLine = word; // Démarrer une nouvelle ligne avec le mot actuel
        }
      });

      if (currentLine) {
        lines.push(currentLine); // Ajouter la dernière ligne après chaque paragraphe
      }

      lines.push("\n"); // Ajouter un saut de ligne entre les paragraphes
      currentLine = ""; // Réinitialiser la ligne pour le prochain paragraphe
    });

    return lines.filter(line => line !== "\n"); // <i className="material-icons">delete</i> les sauts de ligne inutiles
  };

  useEffect(() => {
    const generatePDF = async () => {
      try {
        const doc = await PDFDocument.create();
        doc.registerFontkit(fontkit);

        // Charger les polices personnalisées
        const robotoRegular = await loadFont("/fonts/Roboto-Regular.ttf");
        const robotoBold = await loadFont("/fonts/Roboto-Italic.ttf");
        const robotoItalic = await loadFont("/fonts/Roboto-Italic.ttf");
        const robotoBoldItalic = await loadFont("/fonts/Roboto-BoldItalic.ttf");

        const fontRegular = await doc.embedFont(robotoRegular);
        const fontBold = await doc.embedFont(robotoBold);
        const fontItalic = await doc.embedFont(robotoItalic);
        const fontBoldItalic = await doc.embedFont(robotoBoldItalic);

        // Charger l'image d'en-tête
        const headerImageBytes = await loadImage("/Header.png");
        const headerImage = await doc.embedPng(headerImageBytes);

        const page = doc.addPage();
        const { width, height } = page.getSize();

        // Dessiner l'image d'en-tête
        const headerImageWidth = 500;
        const headerImageHeight = (headerImage.height / headerImage.width) * headerImageWidth;
        page.drawImage(headerImage, {
          x: (width - headerImageWidth) / 2,
          y: height - headerImageHeight - 50,
          width: headerImageWidth,
          height: headerImageHeight,
        });

        let yPosition = height - headerImageHeight - 80;

        // Sélectionner la police pour le titre en fonction des styles
        const getTitleFont = () => {
          if (styles.bold && styles.italic) return fontBoldItalic;
          if (styles.bold) return fontBold;
          if (styles.italic) return fontItalic;
          return fontRegular;
        };

        const titleFont = getTitleFont();
        const titleFontSize = parseInt(styles.fontSize) || 16;

        // Calculer la largeur du texte du titre pour le positionnement
        const titleWidth = titleFont.widthOfTextAtSize(title, titleFontSize);
        let titleXPosition;
        if (alignment === "center") {
          titleXPosition = (width - titleWidth) / 2;
        } else if (alignment === "right") {
          titleXPosition = width - titleWidth - 50;
        } else {
          titleXPosition = 50;
        }

        // Dessiner le titre
        page.drawText(title, {
          x: titleXPosition,
          y: yPosition,
          size: titleFontSize,
          font: titleFont,
        });

        yPosition -= 40; // Décaler après le titre

        // Traitement des paragraphes
        const maxWidth = width - 100; // Largeur maximale pour le texte (en tenant compte des marges)
        paragraphes.forEach((paragraphe) => {
          const lines = splitTextIntoLines(paragraphe, fontRegular, 12, maxWidth);

          lines.forEach((line) => {
            let xPosition;
            xPosition = 50; // Position horizontale (marge à gauche)

            page.drawText(line, {
              x: xPosition,
              y: yPosition,
              size: 12,
              font: fontRegular,
            });

            yPosition -= 20; // Espacement entre les lignes
          });

          yPosition -= 10; // Espacement supplémentaire après chaque paragraphe
        });

        // Sauvegarder le PDF
        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        setPdfBlobUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
      }
    };

    generatePDF();
  }, [title, paragraphes, alignment, styles]);

  return (
    <div>
      <h4>Aperçu PDF</h4>
      {pdfBlobUrl ? (
        <iframe src={pdfBlobUrl} width="100%" height="600px" title="Aperçu PDF"></iframe>
      ) : (
        <p>Génération du PDF en cours...</p>
      )}
    </div>
  );
}

export default Preview;
