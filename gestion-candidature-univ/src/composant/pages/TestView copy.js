import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import html2pdf from 'html2pdf.js';
import 'react-quill/dist/quill.snow.css'; // Importer le CSS de ReactQuill

const TestView = () => {
    const [titre, setTitre] = useState('Candidature au Master en Intelligence Artificielle');
    const [description, setDescription] = useState("Le Master en Intelligence Artificielle est un programme d’élite conçu pour former des ingénieurs hautement qualifiés dans le domaine de l'IA. Ce programme innovant offre aux étudiants l'opportunité d'acquérir des compétences pointues en apprentissage automatique, en traitement du langage naturel, et en vision par ordinateur. Les diplômés de ce master seront des leaders technologiques capables de concevoir et de mettre en œuvre des solutions d'IA qui répondent aux besoins des entreprises modernes et favorisent l'innovation.");
    const [conditions, setConditions] = useState('');
    const [dateLimiteFormulaire, setDateLimiteFormulaire] = useState('');
    const [dateLimiteDossier, setDateLimiteDossier] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
        ],
    };

    const formats = ['bold', 'italic', 'underline', 'link', 'list', 'header', 'align'];

    // Fonction pour générer le PDF
    const handleGeneratePDF = () => {
        const element = document.getElementById('formContent');
    
        // Options pour html2pdf.js afin de configurer le PDF
        const options = {
          margin: 0, // Pas de marge
          filename: 'appel_a_candidature.pdf',
          image: { type: 'jpeg', quality: 0.98 }, // Format et qualité de l'image
          html2canvas: { scale: 2, width: 1000 }, // Avoir une meilleure résolution et contrôler la largeur
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Format A4, orientation portrait
        };
    
        // Utilisation de html2pdf.js pour générer le PDF avec les options
        html2pdf()
          .from(element)
          .set(options)
          .save();
      };

    const handlePreview = () => {
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

    return (
        <div className="row">
            <div className="col s12">
                <div id="validations" className="card card-tabs">
                    <div className="card-content">
                        <div className="card-title">
                            <h4 className="card-title">Formulaire d'ajout d'appel à candidature</h4>
                        </div>

                        <div id="view-validations">
                            <form className="formValidate" id="formValidate" method="post">
                                <div className="row">
                                    <div className="col s12">
                                        <strong>Titre</strong>
                                        <ReactQuill value={titre} onChange={setTitre} modules={modules} formats={formats} />
                                    </div>

                                    <div className="col s12">
                                        <strong>Description</strong>
                                        <ReactQuill value={description} onChange={setDescription} modules={modules} formats={formats} />
                                    </div>

                                    <div className="col s12">
                                        <strong>Conditions</strong>
                                        <ReactQuill value={conditions} onChange={setConditions} modules={modules} formats={formats} />
                                    </div>

                                    <div className="col s12">
                                        <strong>Date limite (formulaire de pré-candidature)</strong>
                                        <input
                                            type="date"
                                            value={dateLimiteFormulaire}
                                            onChange={(e) => setDateLimiteFormulaire(e.target.value)}
                                        />
                                    </div>

                                    <div className="col s12">
                                        <strong>Date limite (dossier)</strong>
                                        <input
                                            type="date"
                                            value={dateLimiteDossier}
                                            onChange={(e) => setDateLimiteDossier(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="input-field col s12">
                                    <button className="btn waves-effect waves-light right submit" type="button" onClick={handleGeneratePDF}>
                                        Générer PDF
                                    </button>

                                    <button className="btn green" type="button" onClick={handlePreview}>
                                        Aperçu
                                    </button>

                                    <button className="btn red" type="button" onClick={handleCancel}>
                                        <i className="material-icons left">error</i>
                                        Annuler
                                    </button>
                                </div>

                                {/* Zone de prévisualisation */}
                                {showPreview && (
                                    <div id="previewSection" style={{ marginTop: '20px' }}>
                                        <h5>Aperçu de l'appel à candidature</h5>
                                        <div>
                                            <strong>Titre:</strong>
                                            <div dangerouslySetInnerHTML={{ __html: titre }} />
                                        </div>
                                        <div>
                                            <strong>Description:</strong>
                                            <div dangerouslySetInnerHTML={{ __html: description }} />
                                        </div>
                                        <div>
                                            <strong>Conditions:</strong>
                                            <div dangerouslySetInnerHTML={{ __html: conditions }} />
                                        </div>
                                        <div>
                                            <strong>Date limite (formulaire de pré-candidature):</strong>
                                            {dateLimiteFormulaire}
                                        </div>
                                        <div>
                                            <strong>Date limite (dossier):</strong>
                                            {dateLimiteDossier}
                                        </div>
                                        <button className="btn red" type="button" onClick={handleClosePreview}>
                                            Fermer l'aperçu
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zone cachée contenant le formulaire à capturer pour PDF */}
            <div id="formContent" style={{width:'100%'}} >
                <div>
                    {/* <img src={`%PUBLIC_URL%/Header.png`} /> */}
                    {/* <img src={`${process.env.PUBLIC_URL}/Header.png`} alt="Header Logo UASZ" /> */}

                </div>
                <div style={{ textAlign: "center" }}>
                    {/* <strong>Titre:</strong> */}
                    <img src={`${process.env.PUBLIC_URL}/Header.png`} alt="Header Logo UASZ" />
                    <div dangerouslySetInnerHTML={{ __html: titre }} />
                </div>
                <div>
                    <strong>Description:</strong>
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <div>
                    <strong>Conditions:</strong>
                    <div dangerouslySetInnerHTML={{ __html: conditions }} />
                </div>
                <div>
                    <strong>Date limite (formulaire de pré-candidature):</strong>
                    {dateLimiteFormulaire}
                </div>
                <div>
                    <strong>Date limite (dossier):</strong>
                    {dateLimiteDossier}
                </div>
            </div>
        </div>
    );
};

export default TestView;
