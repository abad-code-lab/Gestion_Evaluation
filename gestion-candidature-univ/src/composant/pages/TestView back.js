import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'react-quill/dist/quill.snow.css'; // Importer le CSS de ReactQuill
import { convertirDateEnFrancais } from '../DossierEtudiant';
import { createAppelCandidature } from '../../ServiceAPi/Microservice-AppelCandidature';
import { useNavigate } from 'react-router-dom';

const AjoutAppelCandidature = () => {
    const navigate = useNavigate();
    const [titre, setTitre] = useState('Candidature au Master en Intelligence Artificielle');
    const [description, setDescription] = useState(`Le Master en Intelligence Artificielle est un programme d’élite conçu pour former des ingénieurs 
        hautement qualifiés dans le domaine de l'IA. Ce programme innovant offre aux étudiants l'opportunité d'acquérir des
         compétences pointues en apprentissage automatique, en traitement du langage naturel, et en vision par ordinateur. Les diplômés de ce master seront des leaders technologiques capables de concevoir et de mettre en œuvre des solutions d'IA qui répondent aux besoins des entreprises modernes et favorisent l'innovation.`);
    const [conditions, setConditions] = useState('');
    const [idAppelCandidature, setIdAppelCandidature] = useState(0);
    const [domainName, setDomainName] = useState('');
    const [anneeAcademique, setAnneeAcademique] = useState("2024-2025");
    const [dateLimiteFormulaire, setDateLimiteFormulaire] = useState("2025-01-04");
    const [dateLimiteDossier, setDateLimiteDossier] = useState("2025-01-04");
    const [showPreview, setShowPreview] = useState(true); // Set initial state to true to show preview by default
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');

    const isFormValid = () => {
        // Vérifier si tous les champs sont remplis
        if (
            titre.trim() === '' ||
            description.trim() === '' ||
            conditions.trim() === '' ||
            anneeAcademique.trim() === '' ||
            dateLimiteFormulaire.trim() === '' ||
            dateLimiteDossier.trim() === '' ||

            domainName.trim() === '' // Vérifier le domaine
        ) {
            return false; // Si l'un des champs est vide, retourner false
        }
        return true; // Tous les champs sont remplis, retourner true
    };
    const createAppelCandidatureHandle = async () => {
        // Préparer les données
        const data = {
            ...(idAppelCandidature ? { id: idAppelCandidature } : {}),
            titre,
            description,
            conditions,
            anneeAcademique,
            dateLimiteDossier,
            dateLimiteFormulaire
        };
        console.log("Les informations");
        console.log(data);
    
        try {
            // Appel à l'API pour créer ou mettre à jour l'appel à candidature
            const response = await createAppelCandidature(data);
    
            // Mettre à jour l'ID
            setIdAppelCandidature(response.data.id);
            console.log(response.data);
    
            // Retourner l'ID créé ou mis à jour
            return response.data.id;
        } catch (error) {
            // Gérer les erreurs
            console.error("Erreur lors de la création de l'appel à candidature :", error);
            throw error; // Propager l'erreur si nécessaire
        }
    };
    

    // const createAppelCandidatureHandle = () => {
    //     // if(isFormValid){
    //     const data = {
    //         ...(idAppelCandidature ? { id: idAppelCandidature } : {}),
    //         titre,
    //         description,
    //         conditions,
    //         anneeAcademique,
    //         dateLimiteDossier,
    //         dateLimiteFormulaire
    //     };
    //     console.log("Les informations");
    //     console.log(data);

    //     createAppelCandidature(data)
    //         .then((response) => {

    //             setIdAppelCandidature(response.data.id)
    //             console.log(response.data);
    //             // generatePDF()
    //             // downloadPdf()
    //             return response.data.id;
    //         })
    //         .catch((error) => {
    //             // deleteToken();
    //             // setAuthHeader(null);
    //             console.log(error);
    //             console.error(error);

    //             // alert(error;
    //         });
    //     // }

    //     return idAppelCandidature;

    // };
    const ensureIdAppelCandidature = async() => {
        if (idAppelCandidature === 0) {
            const newId = await createAppelCandidatureHandle();

            setIdAppelCandidature(newId);

            return newId;
        }
        return idAppelCandidature;
    };
    const handleFinish = async () => {
        const idTemporaire = ensureIdAppelCandidature()
        idTemporaire.then((id) => {
            // setIdAppelCandidature(id)
            downloadPdf(id);        
        });
        console.log("idTemporaire", idTemporaire);
        // setTimeout(() => {
        

        // navigate("/appel-candidature");

        //     alert("Appel à candidature ajouté avec succès"); 
        // }, 5000);


    }
    const downloadPdf = async (identifiant) => {


        // Utilisation de la fonction
        const idAppelCandidatureValue = ensureIdAppelCandidature();

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([800, 1000]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        try {
            let yPosition = height - 100;
            const margin = 50;
            const lineHeight = 20;
            const maxWidth = width - (margin * 2);

            // Image d'en-tête
            const imageResponse = await fetch(`${process.env.PUBLIC_URL}/Header.png`);
            const imageBytes = await imageResponse.arrayBuffer();
            const image = await pdfDoc.embedPng(imageBytes);
            const imgDims = image.scale(0.5);

            page.drawImage(image, {
                x: (width - imgDims.width) / 2,
                y: yPosition - 100,
                width: imgDims.width,
                height: imgDims.height,
            });

            yPosition -= (imgDims.height + 40);

            // Titre
            const titleText = cleanText(`${titre} - ${anneeAcademique}`);
            const titleWidth = fontBold.widthOfTextAtSize(titleText, 16);
            page.drawText(titleText, {
                x: (width - titleWidth) / 2,
                y: yPosition + 60,
                size: 16,
                font: fontBold,
            });

            yPosition -= lineHeight * 3;

            // Description avec formatage
            yPosition = wrapText(
                parseQuillContent(description),
                maxWidth,
                font,
                fontBold,
                12,
                page,
                margin,
                yPosition,
                lineHeight
            );

            yPosition -= lineHeight * 2;

            // Conditions avec formatage
            yPosition = wrapText(
                parseQuillContent(`<b>Conditions</b> <br>${conditions}`),
                maxWidth,
                font,
                fontBold,
                12,
                page,
                margin,
                yPosition,
                lineHeight
            );

            yPosition -= lineHeight * 2;

            // URL et dates
            // = createAppelCandidatureHandle();
            const url = `http://${domainName}:3000/formulaire-candidature/${identifiant}`;
            page.drawText("Lien du formulaire:", {
                x: margin,
                y: yPosition,
                size: 12,
                font: fontBold,
            });

            yPosition -= lineHeight;
            page.drawText(url, {
                x: margin,
                y: yPosition,
                size: 12,
                font: font,
                color: rgb(0, 0, 1),
            });

            yPosition -= lineHeight * 2;

            const dateTexts = [
                `La date limite pour remplir le formulaire de pré-candidature est fixée au ${convertirDateEnFrancais(dateLimiteFormulaire)}`,
                `La date limite de dépôt des dossiers de candidature
                 au secrétariat du département informatique (UFR ST de l'UASZ) est fixée au ${convertirDateEnFrancais(dateLimiteDossier)}`
            ];

            dateTexts.forEach(text => {
                page.drawText(text, {
                    x: margin,
                    y: yPosition,
                    size: 12,
                    font: fontBold,
                    color: rgb(1, 0, 0), // Rouge (R:1, G:0, B:0)
                });
                yPosition -= lineHeight;
            });

            // Après les dates, ajouter la signature
            yPosition -= lineHeight * 4; // Espace avant la signature

            // Charger l'image de la signature
            const signatureResponse = await fetch(`${process.env.PUBLIC_URL}/signature.png`);
            const signatureBytes = await signatureResponse.arrayBuffer();
            const signature = await pdfDoc.embedPng(signatureBytes);

            // Calculer les dimensions de la signature (plus petite que l'en-tête)
            const sigDims = signature.scale(0.3); // Ajuster cette valeur selon vos besoins

            // Dessiner la signature alignée à droite
            page.drawImage(signature, {
                x: width - margin - sigDims.width, // Aligné à droite avec marge
                y: yPosition,
                width: sigDims.width,
                height: sigDims.height,
            });

            // Ajouter le texte "Le Directeur" au-dessus de la signature
            const directorText = "Le Chef de Département Informatique";
            const directorWidth = fontBold.widthOfTextAtSize(directorText, 12);
            page.drawText(directorText, {
                x: width - margin - sigDims.width + (sigDims.width - directorWidth) / 2, // Centré au-dessus de la signature
                y: yPosition + sigDims.height + 10,
                size: 12,
                font: fontBold,
            });

            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);

            // Créer un lien de téléchargement et simuler le clic
            const link = document.createElement('a');
            link.href = pdfUrl;

            // Utiliser un nom de fichier personnalisé pour le téléchargement
            const cleanFileName = `${titre}_${anneeAcademique}`
                .toLowerCase()
                .replace(/[éèêë]/g, 'e')
                .replace(/[àâä]/g, 'a')
                .replace(/[ùûü]/g, 'u')
                .replace(/[îï]/g, 'i')
                .replace(/[ôö]/g, 'o')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_');

            link.download = `${cleanFileName}.pdf`;

            // Déclencher le clic pour démarrer le téléchargement
            link.click();

            // Libérer l'URL de l'objet Blob après le téléchargement
            URL.revokeObjectURL(pdfUrl);
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            throw error;
        }
    };

    // const downloadPdf = async () => {
    //     try {
    //         // Fonction pour garantir un idAppelCandidature
    //         const ensureIdAppelCandidature = async () => {
    //             if (idAppelCandidature === 0) {
    //                 console.log("Création d'un nouvel idAppelCandidature...");
    //                 const newId = await createAppelCandidatureHandle();

    //                 if (!newId) {
    //                     throw new Error("La création de idAppelCandidature a échoué.");
    //                 }

    //                 setIdAppelCandidature(newId);

    //                 // Attendre que l'état soit mis à jour
    //                 return newId;
    //             }

    //             return idAppelCandidature;
    //         };

    //         // Bloquer tant que l'ID n'est pas défini
    //         const idAppelCandidatureValue = await ensureIdAppelCandidature();

    //         if (!idAppelCandidatureValue) {
    //             throw new Error("Impossible d'obtenir idAppelCandidature. Veuillez réessayer.");
    //         }

    //         console.log(`idAppelCandidature obtenu : ${idAppelCandidatureValue}`);

    //         const pdfDoc = await PDFDocument.create();
    //         const page = pdfDoc.addPage([800, 1000]);
    //         const { width, height } = page.getSize();
    //         const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    //         const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    //         try {
    //             let yPosition = height - 100;
    //             const margin = 50;
    //             const lineHeight = 20;
    //             const maxWidth = width - (margin * 2);

    //             // Image d'en-tête
    //             const imageResponse = await fetch(`${process.env.PUBLIC_URL}/Header.png`);
    //             const imageBytes = await imageResponse.arrayBuffer();
    //             const image = await pdfDoc.embedPng(imageBytes);
    //             const imgDims = image.scale(0.5);

    //             page.drawImage(image, {
    //                 x: (width - imgDims.width) / 2,
    //                 y: yPosition - 100,
    //                 width: imgDims.width,
    //                 height: imgDims.height,
    //             });

    //             yPosition -= (imgDims.height + 40);

    //             // Titre
    //             const titleText = cleanText(`${titre} - ${anneeAcademique}`);
    //             const titleWidth = fontBold.widthOfTextAtSize(titleText, 16);
    //             page.drawText(titleText, {
    //                 x: (width - titleWidth) / 2,
    //                 y: yPosition + 60,
    //                 size: 16,
    //                 font: fontBold,
    //             });

    //             yPosition -= lineHeight * 3;

    //             // Description avec formatage
    //             yPosition = wrapText(
    //                 parseQuillContent(description),
    //                 maxWidth,
    //                 font,
    //                 fontBold,
    //                 12,
    //                 page,
    //                 margin,
    //                 yPosition,
    //                 lineHeight
    //             );

    //             yPosition -= lineHeight * 2;

    //             // Conditions avec formatage
    //             yPosition = wrapText(
    //                 parseQuillContent(`<b>Conditions</b> <br>${conditions}`),
    //                 maxWidth,
    //                 font,
    //                 fontBold,
    //                 12,
    //                 page,
    //                 margin,
    //                 yPosition,
    //                 lineHeight
    //             );

    //             yPosition -= lineHeight * 2;
    //             // URL et dates
    //             // = createAppelCandidatureHandle();
    //             const url = `http://${domainName}:3000/formulaire-candidature/${idAppelCandidatureValue}`;
    //             page.drawText("Lien du formulaire:", {
    //                 x: margin,
    //                 y: yPosition,
    //                 size: 12,
    //                 font: fontBold,
    //             });

    //             yPosition -= lineHeight;
    //             page.drawText(url, {
    //                 x: margin,
    //                 y: yPosition,
    //                 size: 12,
    //                 font: font,
    //                 color: rgb(0, 0, 1),
    //             });

    //             yPosition -= lineHeight * 2;

    //             const dateTexts = [
    //                 `La date limite pour remplir le formulaire de pré-candidature est fixée au ${convertirDateEnFrancais(dateLimiteFormulaire)}`,
    //                 `La date limite de dépôt des dossiers de candidature
    //              au secrétariat du département informatique (UFR ST de l'UASZ) est fixée au ${convertirDateEnFrancais(dateLimiteDossier)}`
    //             ];

    //             dateTexts.forEach(text => {
    //                 page.drawText(text, {
    //                     x: margin,
    //                     y: yPosition,
    //                     size: 12,
    //                     font: fontBold,
    //                     color: rgb(1, 0, 0), // Rouge (R:1, G:0, B:0)
    //                 });
    //                 yPosition -= lineHeight;
    //             });

    //             // Après les dates, ajouter la signature
    //             yPosition -= lineHeight * 4; // Espace avant la signature

    //             // Charger l'image de la signature
    //             const signatureResponse = await fetch(`${process.env.PUBLIC_URL}/signature.png`);
    //             const signatureBytes = await signatureResponse.arrayBuffer();
    //             const signature = await pdfDoc.embedPng(signatureBytes);

    //             // Calculer les dimensions de la signature (plus petite que l'en-tête)
    //             const sigDims = signature.scale(0.3); // Ajuster cette valeur selon vos besoins

    //             // Dessiner la signature alignée à droite
    //             page.drawImage(signature, {
    //                 x: width - margin - sigDims.width, // Aligné à droite avec marge
    //                 y: yPosition,
    //                 width: sigDims.width,
    //                 height: sigDims.height,
    //             });

    //             // Ajouter le texte "Le Directeur" au-dessus de la signature
    //             const directorText = "Le Chef de Département Informatique";
    //             const directorWidth = fontBold.widthOfTextAtSize(directorText, 12);
    //             page.drawText(directorText, {
    //                 x: width - margin - sigDims.width + (sigDims.width - directorWidth) / 2, // Centré au-dessus de la signature
    //                 y: yPosition + sigDims.height + 10,
    //                 size: 12,
    //                 font: fontBold,
    //             });

    //             const pdfBytes = await pdfDoc.save();

    //             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    //             const pdfUrl = URL.createObjectURL(blob);

    //             // Créer un lien de téléchargement et simuler le clic
    //             const link = document.createElement('a');
    //             link.href = pdfUrl;

    //             // Utiliser un nom de fichier personnalisé pour le téléchargement
    //             const cleanFileName = `${titre}_${anneeAcademique}`
    //                 .toLowerCase()
    //                 .replace(/[éèêë]/g, 'e')
    //                 .replace(/[àâä]/g, 'a')
    //                 .replace(/[ùûü]/g, 'u')
    //                 .replace(/[îï]/g, 'i')
    //                 .replace(/[ôö]/g, 'o')
    //                 .replace(/[ç]/g, 'c')
    //                 .replace(/[^a-z0-9]/g, '_')
    //                 .replace(/_+/g, '_');

    //             link.download = `${cleanFileName}.pdf`;

    //             // Déclencher le clic pour démarrer le téléchargement
    //             link.click();

    //             // Libérer l'URL de l'objet Blob après le téléchargement
    //             URL.revokeObjectURL(pdfUrl);
    //             navigate("/appel-candidature");
    //         } catch (error) {
    //             console.error('Erreur lors du téléchargement du PDF:', error);
    //             // throw error;
    //             setTimeout(() => {
    //                 // downloadPdf();
    //                 alert("Erreur lors du téléchargement du PDF");

    //             }, 5000);
    //         }
    //     } catch (error) {
    //         console.error('Erreur lors du téléchargement du PDF:', error);
    //         // throw error;
    //         setTimeout(() => {
    //             // downloadPdf();
    //             alert("Erreur lors du téléchargement du PDF");

    //         }, 5000);
    //     }
    // }

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ header: [1, 2, 3] }],
            // [{ align: [] }],
            ['clean']
        ]
    };

    const formats = [
        'bold',
        'italic',
        'underline',
        'list',
        'bullet',
        'header',
        'align'
    ];

    const parseQuillContent = (html) => {
        if (!html) return '';

        const doc = new DOMParser().parseFromString(html, 'text/html');
        let text = '';

        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Gestion du formatage
                const style = window.getComputedStyle(node);
                const isBold = node.tagName === 'STRONG' || node.tagName === 'B' || style.fontWeight === 'bold';
                const isItalic = node.tagName === 'EM' || node.tagName === 'I' || style.fontStyle === 'italic';

                // Ajouter des marqueurs pour le formatage
                if (isBold) text += '*|B|*';
                if (isItalic) text += '*|I|*';

                // Gestion des listes
                if (node.tagName === 'LI') {
                    text += '• ';
                }

                // Gestion des paragraphes
                if (node.tagName === 'P') {
                    text += '\n';
                }

                node.childNodes.forEach(processNode);

                // Fermer les balises de formatage
                if (isItalic) text += '*|/I|*';
                if (isBold) text += '*|/B|*';

                // Ajouter des sauts de ligne après les éléments
                if (node.tagName === 'P' || node.tagName === 'LI') {
                    text += '\n';
                }
            }
        };

        doc.body.childNodes.forEach(processNode);
        return text.trim();
    };



    // Fonction pour générer le PDF avec texte sélectionnable
    const handleFinal = () => {
        createAppelCandidatureHandle()

        // setTimeout(() => {
        //     handleGeneratePDF()
        // }, 5000);
        // navigate("/appel-candidature");
    }
    // const handleGeneratePDF = () => {

    // };

    const stripHtmlTags = (str) => {
        if ((str === null) || (str === '')) return ''; // Retourner une chaîne vide au lieu de false
        return str.toString().replace(/<[^>]*>/g, '');
    };

    const cleanText = (text) => {
        return text
            .replace(/\n/g, ' ')  // Remplacer les retours à la ligne par des espaces
            .replace(/\s+/g, ' ')  // Normaliser les espaces multiples
            .trim();              // <i className="material-icons">delete</i> les espaces aux extrémités
    };

    const wrapText = (text, maxWidth, font, fontBold, fontSize, page, startX, startY, lineHeight) => {
        let y = startY;
        const lines = text.split('\n');

        lines.forEach(line => {
            if (!line.trim()) {
                y -= lineHeight;
                return;
            }

            // Gérer le formatage avec les marqueurs
            const segments = line.split(/(\*\|[BI]\|\*.*?\*\|\/[BI]\|\*)/g);
            let x = startX;

            segments.forEach(segment => {
                if (!segment) return;

                const isBold = segment.startsWith('*|B|*');
                const isItalic = segment.startsWith('*|I|*');

                if (isBold || isItalic) {
                    const cleanText = segment.replace(/\*\|[BI]\|\*|\*\|\/[BI]\|\*/g, '');
                    page.drawText(cleanText, {
                        x,
                        y,
                        size: fontSize,
                        font: isBold ? fontBold : font,
                    });
                    x += (isBold ? fontBold : font).widthOfTextAtSize(cleanText, fontSize);
                } else {
                    page.drawText(segment, {
                        x,
                        y,
                        size: fontSize,
                        font,
                    });
                    x += font.widthOfTextAtSize(segment, fontSize);
                }
            });

            y -= lineHeight;
        });

        return y;
    };

    const generatePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([800, 1000]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        try {
            let yPosition = height - 100;
            const margin = 50;
            const lineHeight = 20;
            const maxWidth = width - (margin * 2);

            // Image d'en-tête
            const imageResponse = await fetch(`${process.env.PUBLIC_URL}/Header.png`);
            const imageBytes = await imageResponse.arrayBuffer();
            const image = await pdfDoc.embedPng(imageBytes);
            const imgDims = image.scale(0.5);

            page.drawImage(image, {
                x: (width - imgDims.width) / 2,
                y: yPosition - 100,
                width: imgDims.width,
                height: imgDims.height,
            });

            yPosition -= (imgDims.height + 40);

            // Titre
            const titleText = cleanText(`${titre} - ${anneeAcademique}`);
            const titleWidth = fontBold.widthOfTextAtSize(titleText, 16);
            page.drawText(titleText, {
                x: (width - titleWidth) / 2,
                y: yPosition + 60,
                size: 16,
                font: fontBold,
            });

            yPosition -= lineHeight * 3;

            // Description avec formatage
            yPosition = wrapText(
                parseQuillContent(description),
                maxWidth,
                font,
                fontBold,
                12,
                page,
                margin,
                yPosition,
                lineHeight
            );

            yPosition -= lineHeight * 2;

            // Conditions avec formatage
            yPosition = wrapText(
                parseQuillContent(`<b>Conditions</b> <br>${conditions}`),
                maxWidth,
                font,
                fontBold,
                12,
                page,
                margin,
                yPosition,
                lineHeight
            );

            yPosition -= lineHeight * 2;

            // URL et dates
            const url = `http://${domainName}:3000/formulaire-candidature/Identifiant`;
            page.drawText("Lien du formulaire:", {
                x: margin,
                y: yPosition,
                size: 12,
                font: fontBold,
            });

            yPosition -= lineHeight;
            page.drawText(url, {
                x: margin,
                y: yPosition,
                size: 12,
                font: font,
                color: rgb(0, 0, 1),
            });

            yPosition -= lineHeight * 2;

            const dateTexts = [
                `La date limite pour remplir le formulaire de pré-candidature est fixée au ${convertirDateEnFrancais(dateLimiteFormulaire)}`,
                `La date limite de dépôt des dossiers de candidature
                 au secrétariat du département informatique (UFR ST de l'UASZ) est fixée au ${convertirDateEnFrancais(dateLimiteDossier)}`
            ];

            dateTexts.forEach(text => {
                page.drawText(text, {
                    x: margin,
                    y: yPosition,
                    size: 12,
                    font: fontBold,
                    color: rgb(1, 0, 0), // Rouge (R:1, G:0, B:0)
                });
                yPosition -= lineHeight;
            });

            // Après les dates, ajouter la signature
            yPosition -= lineHeight * 4; // Espace avant la signature

            // Charger l'image de la signature
            const signatureResponse = await fetch(`${process.env.PUBLIC_URL}/signature.png`);
            const signatureBytes = await signatureResponse.arrayBuffer();
            const signature = await pdfDoc.embedPng(signatureBytes);

            // Calculer les dimensions de la signature (plus petite que l'en-tête)
            const sigDims = signature.scale(0.3); // Ajuster cette valeur selon vos besoins

            // Dessiner la signature alignée à droite
            page.drawImage(signature, {
                x: width - margin - sigDims.width, // Aligné à droite avec marge
                y: yPosition,
                width: sigDims.width,
                height: sigDims.height,
            });

            // Ajouter le texte "Le Directeur" au-dessus de la signature
            const directorText = "Le Chef de Département Informatique";
            const directorWidth = fontBold.widthOfTextAtSize(directorText, 12);
            page.drawText(directorText, {
                x: width - margin - sigDims.width + (sigDims.width - directorWidth) / 2, // Centré au-dessus de la signature
                y: yPosition + sigDims.height + 10,
                size: 12,
                font: fontBold,
            });

            const pdfBytes = await pdfDoc.save();

            // Créer un nom de fichier propre en remplaçant les caractères spéciaux
            const cleanFileName = `${titre}_${anneeAcademique}`
                .toLowerCase()
                .replace(/[éèêë]/g, 'e')
                .replace(/[àâä]/g, 'a')
                .replace(/[ùûü]/g, 'u')
                .replace(/[îï]/g, 'i')
                .replace(/[ôö]/g, 'o')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_');

            // Créer le Blob et l'URL
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);

            // Télécharger automatiquement le PDF avec le nom personnalisé
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${cleanFileName}.pdf`;

            // Pour le preview, retourner l'URL
            return pdfUrl;
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    };


    const handlePreview = async () => {
        const pdfDataUri = await generatePDF();
        setPdfPreviewUrl(pdfDataUri);
        setShowPreview(true); // Afficher l'aperçu
    };

    const handleClosePreview = () => {
        setShowPreview(false); // Fermer l'aperçu
    };

    const handleCancel = () => {
        setTitre('');
        setDescription('');
        setConditions('');
        setDateLimiteFormulaire('');
        setDateLimiteDossier('');
        setShowPreview(false); // Masquer l'aperçu après annulation
    };

    useEffect(() => {
        handlePreview();
        // Récupérer le nom de domaine ou l'URL actuelle
        setDomainName(window.location.hostname); // Utiliser `window.location.href` si tu veux l'URL complète
        // setDomainName(window.location.href);
    }, [titre, description, conditions, anneeAcademique, dateLimiteFormulaire, dateLimiteDossier]);

    return (
        <div className="row">
            <div className="col s12 m6">
                <div id="validations" className="card card-tabs">
                    <div className="card-content">
                        <div className="card-title">
                            <h3 className="card-title">Formulaire d'ajout d'appel à candidature</h3>
                        </div>
                        <div id="view-validations">
                            <form className="formValidate" id="formValidate" method="post">
                                <div className="row">
                                    <div className="col s12">
                                        <b>Titre</b>
                                        <input
                                            type="text"
                                            value={titre} onChange={(e) => setTitre(e.target.value)}
                                        />
                                    </div>
                                    <strong>Annee académique</strong>
                                    <div className="browser-default">
                                        <select
                                            className="browser-default"
                                            onChange={(e) => setAnneeAcademique(e.target.value)} value={anneeAcademique} required
                                        >
                                            {Array.from({ length: 2 }, (_, i) => {
                                                const currentYear = new Date().getFullYear();
                                                const year = currentYear + i;
                                                return (
                                                    <option key={i} value={`${year - 1}-${year}`}>
                                                        {year - 1}-{year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="col s12">
                                        <b>Description</b>
                                        <ReactQuill value={description} onChange={setDescription} modules={modules} formats={formats} />
                                    </div>
                                    <div className="col s12">
                                        <b>Conditions</b>
                                        <ReactQuill value={conditions} onChange={setConditions} modules={modules} formats={formats} />
                                    </div>
                                    <div className="col s12">
                                        <b>Date limite (formulaire de pré-candidature)</b>
                                        <input
                                            type="date"
                                            value={dateLimiteFormulaire}
                                            onChange={(e) => setDateLimiteFormulaire(e.target.value)}
                                        />
                                    </div>
                                    <div className="col s12">
                                        <b>Date limite (dossier)</b>
                                        <input
                                            type="date"
                                            value={dateLimiteDossier}
                                            onChange={(e) => setDateLimiteDossier(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-field col s12">
                                    <button className="btn waves-effect waves-light right submit" type="button" onClick={() => handleFinish()}>
                                        Générer PDF
                                    </button>
                                    <button className="btn red" type="button" onClick={() => handleCancel()}>
                                        <i className="material-icons left">error</i>
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col s12 m6" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, overflowY: 'auto' }}>
                {showPreview && (
                    <div id="previewSection" style={{ height: '100%', padding: '20px' }}>
                        <h5>Aperçu de l'appel à candidature</h5>
                        <iframe
                            title="Aperçu de l'appel à candidature"
                            src={pdfPreviewUrl}
                            style={{
                                width: '100%',
                                height: 'calc(100vh - 100px)',
                                border: 'none'
                            }}
                        />
                        <button className="btn red" type="button" onClick={() => handleClosePreview()}>
                            Fermer l'aperçu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AjoutAppelCandidature;
