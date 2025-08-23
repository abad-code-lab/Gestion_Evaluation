import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // importer useNavigate

function ImportECStudents() {
  const [file, setFile] = useState(null);
  const [infos, setInfos] = useState(null); // Pour stocker annee, codeEC, codeUE
  const [evaluations, setEvaluations] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);

  const navigate = useNavigate(); // hook pour navigation

  // Fonction détectant les valeurs "indéfinies"
  function isUndefinedLabel(value) {
    if (!value) return true;
    const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return /definir/i.test(normalized);
  }

  // Nettoie le code EC/UE pour enlever "À définir", underscore et espaces
  function cleanCode(value) {
    if (!value) return "";
    let cleaned = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleaned = cleaned.replace(/à définir|àdefinir|a definir|a_definir/gi, "");
    cleaned = cleaned.replace(/[_\s]/g, "");
    return cleaned.trim();
  }

  // Extrait annee, codeEC et codeUE du nom de fichier
  const extractInfos = (filename) => {
    const parts = filename.split("_");
    if (parts.length < 2) return null;
    const annee = parseInt(parts[0], 10);
    const codeEC = parts[1]?.replace(".csv", "").toUpperCase() || "";
    const codeUE = codeEC.substring(0, 6);
    return { annee, codeEC, codeUE };
  };

  // Quand on choisit un fichier, on extrait les infos
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const extracted = extractInfos(selectedFile.name);
      if (!extracted || !extracted.annee || !extracted.codeEC) {
        setInfos(null);
      } else {
        setInfos(extracted);
      }
    } else {
      setInfos(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      window.alert("Veuillez choisir un fichier CSV.");
      return;
    }
    if (!infos || !infos.annee || !infos.codeEC || !infos.codeUE) {
      window.alert(
        "Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)"
      );
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
      return;
    }

    const formData = new FormData();
    formData.append("fichier", file);
    formData.append("annee", infos.annee);
    formData.append("codeEC", infos.codeEC);
    formData.append("codeUE", infos.codeUE);

    try {
      const response = await fetch("http://localhost:8080/api/import/etudiants", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || "Erreur inconnue");
      }

      const stats = await response.json();
      window.alert(
        `✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`
      );
      setFile(null);
      setInfos(null);
      document.getElementById("fileInput").value = null;
    } catch (err) {
      window.alert("❌ Erreur lors de l'import : " + err.message);
      console.error("Erreur import:", err);
    }
  };

  // Fonction pour exporter la liste des évaluations en CSV
  const exportEvaluationsCSV = async () => {
    setLoadingExport(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
      setLoadingExport(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/evaluations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        window.alert("Aucune évaluation disponible pour export.");
        setLoadingExport(false);
        return;
      }

      // Préparer les données CSV
      // Colonnes: Matricule, Nom, Prénom, Code EC, Code UE, Note contrôle, Note examen, Moyenne EC
      const headers = [
        "Matricule",
        "Nom",
        "Prénom",
        "Code EC",
        "Code UE",
        "Note contrôle",
        "Note examen",
        "Moyenne EC",
      ];

      const csvRows = [
        headers.join(","), // ligne d'entête
      ];

      for (const ev of data) {
        const matricule = ev.inscription?.etudiant?.matricule ?? "";
        const nom = ev.inscription?.etudiant?.nom ?? "";
        const prenom = ev.inscription?.etudiant?.prenom ?? "";
        const codeEC = ev.inscription?.ec?.codeEC ?? "";
        const codeUE = ev.inscription?.ec?.ue?.codeUE ?? "";
        const noteControle = ev.noteControle != null ? ev.noteControle : "";
        const noteExamen = ev.noteExamen != null ? ev.noteExamen : "";
        const moyenneEC = ev.inscription?.moyenne != null ? ev.inscription.moyenne : "";

        const escaped = (str) => {
          if (typeof str === "string" && (str.includes(",") || str.includes('"') || str.includes("\n"))) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        const row = [
          escaped(matricule),
          escaped(nom),
          escaped(prenom),
          escaped(codeEC),
          escaped(codeUE),
          noteControle,
          noteExamen,
          moyenneEC,
        ];

        csvRows.push(row.join(","));
      }

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "evaluations_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert("Erreur lors de l'export CSV : " + error.message);
      console.error("Erreur export CSV :", error);
    } finally {
      setLoadingExport(false);
    }
  };

  useEffect(() => {
    const loadEvaluations = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8080/api/evaluations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setEvaluations(data);
      } catch {
        // Ignore erreur pour cette précharge
      }
    };
    loadEvaluations();
  }, []);

  return (
    <div
      className="container"
      style={{
        maxWidth: 500,
        margin: "40px auto",
        background: "white",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 16px #e0e0e0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        maxHeight: 900,
      }}
    >
      {/* Bouton de navigation vers DashboardAdmin en haut à gauche */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 14,
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.6)",
          transition: "background-color 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        aria-label="Aller au tableau de bord administrateur"
      >
        ← Dashboard Admin
      </button>

      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        Importer des étudiants pour un EC
      </h2>

      {/* Bouton Export CSV */}
      {evaluations.length > 0 && (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <button
            onClick={exportEvaluationsCSV}
            disabled={loadingExport}
            style={{
              padding: "10px 24px",
              backgroundColor: loadingExport ? "#94a3b8" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: loadingExport ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: 16,
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!loadingExport) e.currentTarget.style.backgroundColor = "#1e40af";
            }}
            onMouseLeave={(e) => {
              if (!loadingExport) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            {loadingExport ? "Export en cours..." : "Exporter les évaluations en CSV"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="fileInput"
            style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
          >
            Fichier CSV :
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          />
        </div>

        {infos && (
          <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
                  Année
                </th>
                <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
                  Code EC
                </th>
                <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
                  Code UE
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 8 }}>{infos.annee || "—"}</td>
                <td style={{ padding: 8 }}>
                  {isUndefinedLabel(infos.codeEC) ? "—" : cleanCode(infos.codeEC)}
                </td>
                <td style={{ padding: 8 }}>
                  {isUndefinedLabel(infos.codeUE) ? "—" : cleanCode(infos.codeUE)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 0",
            backgroundColor: "#2563eb",
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Importer
        </button>
      </form>
    </div>
  );
}

export default ImportECStudents;


















// import React, { useState, useEffect } from "react";

// function ImportECStudents() {
//   const [file, setFile] = useState(null);
//   const [infos, setInfos] = useState(null); // Pour stocker annee, codeEC, codeUE
//   const [evaluations, setEvaluations] = useState([]);
//   const [loadingExport, setLoadingExport] = useState(false);

//   // Fonction détectant les valeurs "indéfinies"
//   function isUndefinedLabel(value) {
//     if (!value) return true;
//     const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//     return /definir/i.test(normalized);
//   }

//   // Nettoie le code EC/UE pour enlever "À définir", underscore et espaces
//   function cleanCode(value) {
//     if (!value) return "";
//     let cleaned = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//     cleaned = cleaned.replace(/à définir|àdefinir|a definir|a_definir/gi, "");
//     cleaned = cleaned.replace(/[_\s]/g, "");
//     return cleaned.trim();
//   }

//   // Extrait annee, codeEC et codeUE du nom de fichier
//   const extractInfos = (filename) => {
//     const parts = filename.split("_");
//     if (parts.length < 2) return null;
//     const annee = parseInt(parts[0], 10);
//     const codeEC = parts[1]?.replace(".csv", "").toUpperCase() || "";
//     const codeUE = codeEC.substring(0, 6);
//     return { annee, codeEC, codeUE };
//   };

//   // Quand on choisit un fichier, on extrait les infos
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     if (selectedFile) {
//       const extracted = extractInfos(selectedFile.name);
//       if (!extracted || !extracted.annee || !extracted.codeEC) {
//         setInfos(null);
//       } else {
//         setInfos(extracted);
//       }
//     } else {
//       setInfos(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }
//     if (!infos || !infos.annee || !infos.codeEC || !infos.codeUE) {
//       window.alert(
//         "Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)"
//       );
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("fichier", file);
//     formData.append("annee", infos.annee);
//     formData.append("codeEC", infos.codeEC);
//     formData.append("codeUE", infos.codeUE);

//     try {
//       const response = await fetch("http://localhost:8080/api/import/etudiants", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(
//         `✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`
//       );
//       setFile(null);
//       setInfos(null);
//       document.getElementById("fileInput").value = null;
//     } catch (err) {
//       window.alert("❌ Erreur lors de l'import : " + err.message);
//       console.error("Erreur import:", err);
//     }
//   };

//   // Fonction pour exporter la liste des évaluations en CSV
//   const exportEvaluationsCSV = async () => {
//     setLoadingExport(true);
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       setLoadingExport(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8080/api/evaluations", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       const data = await res.json();

//       if (!Array.isArray(data) || data.length === 0) {
//         window.alert("Aucune évaluation disponible pour export.");
//         setLoadingExport(false);
//         return;
//       }

//       // Préparer les données CSV
//       // Colonnes: Matricule, Nom, Prénom, Code EC, Code UE, Note contrôle, Note examen, Moyenne EC
//       const headers = [
//         "Matricule",
//         "Nom",
//         "Prénom",
//         "Code EC",
//         "Code UE",
//         "Note contrôle",
//         "Note examen",
//         "Moyenne EC",
//       ];

//       const csvRows = [
//         headers.join(","), // ligne d'entête
//       ];

//       // Préparer les lignes
//       for (const ev of data) {
//         const matricule = ev.inscription?.etudiant?.matricule ?? "";
//         const nom = ev.inscription?.etudiant?.nom ?? "";
//         const prenom = ev.inscription?.etudiant?.prenom ?? "";
//         const codeEC = ev.inscription?.ec?.codeEC ?? "";
//         const codeUE = ev.inscription?.ec?.ue?.codeUE ?? "";
//         const noteControle = ev.noteControle != null ? ev.noteControle : "";
//         const noteExamen = ev.noteExamen != null ? ev.noteExamen : "";
//         const moyenneEC = ev.inscription?.moyenne != null ? ev.inscription.moyenne : "";

//         // Protection des champs contenant des virgules ou guillemets
//         const escaped = (str) => {
//           if (typeof str === "string" && (str.includes(",") || str.includes('"') || str.includes("\n"))) {
//             return `"${str.replace(/"/g, '""')}"`;
//           }
//           return str;
//         };

//         const row = [
//           escaped(matricule),
//           escaped(nom),
//           escaped(prenom),
//           escaped(codeEC),
//           escaped(codeUE),
//           noteControle,
//           noteExamen,
//           moyenneEC,
//         ];

//         csvRows.push(row.join(","));
//       }

//       const csvContent = csvRows.join("\n");
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);

//       // Créer un lien de téléchargement temporaire
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "evaluations_export.csv");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       window.alert("Erreur lors de l'export CSV : " + error.message);
//       console.error("Erreur export CSV :", error);
//     } finally {
//       setLoadingExport(false);
//     }
//   };

//   // Charger les évaluations en amont afin d'afficher le bouton export seulement si possible
//   // (optionnel, mais permet d'activer/désactiver le bouton proprement)
//   useEffect(() => {
//     const loadEvaluations = async () => {
//       const token = sessionStorage.getItem("token");
//       if (!token) return;
//       try {
//         const res = await fetch("http://localhost:8080/api/evaluations", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) return;
//         const data = await res.json();
//         setEvaluations(data);
//       } catch {
//         // Ignore erreur pour cette précharge
//       }
//     };
//     loadEvaluations();
//   }, []);

//   return (
//     <div
//       className="container"
//       style={{
//         maxWidth: 500,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Importer des étudiants pour un EC
//       </h2>

//       {/* Bouton Export CSV - visible si évaluations disponibles */}
//       {evaluations.length > 0 && (
//         <div style={{ marginBottom: 20, textAlign: "center" }}>
//           <button
//             onClick={exportEvaluationsCSV}
//             disabled={loadingExport}
//             style={{
//               padding: "10px 24px",
//               backgroundColor: loadingExport ? "#94a3b8" : "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: loadingExport ? "not-allowed" : "pointer",
//               fontWeight: "600",
//               fontSize: 16,
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (!loadingExport) e.currentTarget.style.backgroundColor = "#1e40af";
//             }}
//             onMouseLeave={(e) => {
//               if (!loadingExport) e.currentTarget.style.backgroundColor = "#2563eb";
//             }}
//           >
//             {loadingExport ? "Export en cours..." : "Exporter les évaluations en CSV"}
//           </button>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 20 }}>
//           <label
//             htmlFor="fileInput"
//             style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
//           >
//             Fichier CSV :
//           </label>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px 10px",
//               borderRadius: 6,
//               border: "1px solid #ccc",
//               fontSize: 16,
//               cursor: "pointer",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>

//         {infos && (
//           <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f1f5f9" }}>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Année
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code EC
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code UE
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td style={{ padding: 8 }}>
//                   {infos.annee || "—"}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {isUndefinedLabel(infos.codeEC) ? "—" : cleanCode(infos.codeEC)}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {isUndefinedLabel(infos.codeUE) ? "—" : cleanCode(infos.codeUE)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         )}

//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "12px 0",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontSize: 16,
//             fontWeight: "600",
//             borderRadius: 6,
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//             transition: "background-color 0.3s ease",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//         >
//           Importer
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;
















// import React, { useState } from "react";

// function ImportECStudents() {
//   const [file, setFile] = useState(null);
//   const [infos, setInfos] = useState(null); // Pour stocker annee, codeEC, codeUE

//   // Fonction détectant les valeurs "indéfinies"
//   function isUndefinedLabel(value) {
//     if (!value) return true;
//     const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//     return /definir/i.test(normalized);
//   }

//   // Nettoie le code EC/UE pour enlever "À définir", underscore et espaces
//   function cleanCode(value) {
//     if (!value) return "";
//     let cleaned = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//     cleaned = cleaned.replace(/à définir|àdefinir|a definir|a_definir/gi, "");
//     cleaned = cleaned.replace(/[_\s]/g, "");
//     return cleaned.trim();
//   }

//   // Extrait annee, codeEC et codeUE du nom de fichier
//   const extractInfos = (filename) => {
//     const parts = filename.split("_");
//     if (parts.length < 2) return null;
//     const annee = parseInt(parts[0], 10);
//     const codeEC = parts[1]?.replace(".csv", "").toUpperCase() || "";
//     const codeUE = codeEC.substring(0, 6);
//     return { annee, codeEC, codeUE };
//   };

//   // Quand on choisit un fichier, on extrait les infos
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     if (selectedFile) {
//       const extracted = extractInfos(selectedFile.name);
//       if (!extracted || !extracted.annee || !extracted.codeEC) {
//         setInfos(null);
//       } else {
//         setInfos(extracted);
//       }
//     } else {
//       setInfos(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }
//     if (!infos || !infos.annee || !infos.codeEC || !infos.codeUE) {
//       window.alert(
//         "Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)"
//       );
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("fichier", file);
//     formData.append("annee", infos.annee);
//     formData.append("codeEC", infos.codeEC);
//     formData.append("codeUE", infos.codeUE);

//     try {
//       const response = await fetch("http://localhost:8080/api/import/etudiants", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(
//         `✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`
//       );
//       setFile(null);
//       setInfos(null);
//       document.getElementById("fileInput").value = null;
//     } catch (err) {
//       window.alert("❌ Erreur lors de l'import : " + err.message);
//       console.error("Erreur import:", err);
//     }
//   };

//   return (
//     <div
//       className="container"
//       style={{
//         maxWidth: 500,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Importer des étudiants pour un EC
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 20 }}>
//           <label
//             htmlFor="fileInput"
//             style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
//           >
//             Fichier CSV :
//           </label>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px 10px",
//               borderRadius: 6,
//               border: "1px solid #ccc",
//               fontSize: 16,
//               cursor: "pointer",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>

//         {infos && (
//           <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f1f5f9" }}>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Année
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code EC
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code UE
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td style={{ padding: 8 }}>
//                   {infos.annee || "—"}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {isUndefinedLabel(infos.codeEC) ? "—" : cleanCode(infos.codeEC)}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {isUndefinedLabel(infos.codeUE) ? "—" : cleanCode(infos.codeUE)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         )}

//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "12px 0",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontSize: 16,
//             fontWeight: "600",
//             borderRadius: 6,
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//             transition: "background-color 0.3s ease",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//         >
//           Importer
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;





















// import React, { useState } from "react";

// function ImportECStudents() {
//   const [file, setFile] = useState(null);
//   const [infos, setInfos] = useState(null); // Pour stocker annee, codeEC, codeUE

//   // Extrait annee, codeEC et codeUE du nom de fichier
//   const extractInfos = (filename) => {
//     const parts = filename.split("_");
//     if (parts.length < 2) return null;
//     const annee = parseInt(parts[0], 10);
//     const codeEC = parts[1]?.replace(".csv", "").toUpperCase() || "";
//     const codeUE = codeEC.substring(0, 6); // les 6 premiers caractères de codeEC
//     return { annee, codeEC, codeUE };
//   };

//   // Quand on choisit un fichier, on extrait les infos
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     if (selectedFile) {
//       const extracted = extractInfos(selectedFile.name);
//       if (!extracted || !extracted.annee || !extracted.codeEC) {
//         setInfos(null);
//       } else {
//         setInfos(extracted);
//       }
//     } else {
//       setInfos(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }
//     if (!infos || !infos.annee || !infos.codeEC || !infos.codeUE) {
//       window.alert(
//         "Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)"
//       );
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("fichier", file);
//     formData.append("annee", infos.annee);
//     formData.append("codeEC", infos.codeEC);
//     formData.append("codeUE", infos.codeUE); // On ajoute le codeUE au formData

//     try {
//       const response = await fetch("http://localhost:8080/api/import/etudiants", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Pas de Content-Type explicite
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(
//         `✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`
//       );
//       // Réinitialiser fichier et infos si besoin
//       setFile(null);
//       setInfos(null);
//       // Reset input value (optionnel)
//       document.getElementById("fileInput").value = null;
//     } catch (err) {
//       window.alert("❌ Erreur lors de l'import : " + err.message);
//       console.error("Erreur import:", err);
//     }
//   };

//   return (
//     <div
//       className="container"
//       style={{
//         maxWidth: 500,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Importer des étudiants pour un EC
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 20 }}>
//           <label
//             htmlFor="fileInput"
//             style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
//           >
//             Fichier CSV :
//           </label>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px 10px",
//               borderRadius: 6,
//               border: "1px solid #ccc",
//               fontSize: 16,
//               cursor: "pointer",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>

//         {/* Affichage info extraite du fichier en tableau, sans "À définir" */}
//         {infos && (
//           <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f1f5f9" }}>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Année
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code EC
//                 </th>
//                 <th style={{ borderBottom: "2px solid #ccc", padding: 8, textAlign: "left" }}>
//                   Code UE
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td style={{ padding: 8 }}>
//                   {infos.annee || "—"}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {infos.codeEC && infos.codeEC !== "À DÉFINIR" ? infos.codeEC : "—"}
//                 </td>
//                 <td style={{ padding: 8 }}>
//                   {infos.codeUE && infos.codeUE !== "À DÉFINIR" ? infos.codeUE : "—"}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         )}

//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "12px 0",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontSize: 16,
//             fontWeight: "600",
//             borderRadius: 6,
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//             transition: "background-color 0.3s ease",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//         >
//           Importer
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;





















// import React, { useState } from "react";

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   // Fonction pour extraire année et codeEC à partir du nom du fichier
//   const extractInfos = (filename) => {
//     const parts = filename.split("_");
//     return {
//       annee: parseInt(parts[0], 10),
//       codeEC: parts[1]?.replace(".csv", "").toUpperCase(),
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);
//     if (!annee || !codeEC) {
//       window.alert(
//         "Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)"
//       );
//       return;
//     }

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("fichier", file);
//     formData.append("annee", annee);
//     formData.append("codeEC", codeEC);

//     try {
//       const response = await fetch("http://localhost:8080/api/import/etudiants", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Ne pas mettre 'Content-Type', le navigateur le gère avec FormData
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(
//         `✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`
//       );
//     } catch (err) {
//       window.alert("❌ Erreur lors de l'import : " + err.message);
//       console.error("Erreur import:", err);
//     }
//   };

//   return (
//     <div
//       className="container"
//       style={{
//         maxWidth: 500,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Importer des étudiants pour un EC</h2>

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 20 }}>
//           <label
//             htmlFor="fileInput"
//             style={{ display: "block", marginBottom: 8, fontWeight: "600" }}
//           >
//             Fichier CSV :
//           </label>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])}
//             required
//             style={{
//               width: "100%",
//               padding: "8px 10px",
//               borderRadius: 6,
//               border: "1px solid #ccc",
//               fontSize: 16,
//               cursor: "pointer",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "12px 0",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontSize: 16,
//             fontWeight: "600",
//             borderRadius: 6,
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//             transition: "background-color 0.3s ease",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//         >
//           Importer
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;



















// import React, { useState } from 'react';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   // Fonction pour extraire année et codeEC à partir du nom du fichier
//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0], 10),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase(),
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);
//     if (!annee || !codeEC) {
//       window.alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     // const token = localStorage.getItem('token');
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await fetch('http://localhost:8080/api/import/etudiants', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//           // Ne pas mettre 'Content-Type', le navigateur s'en occupe avec FormData
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(`✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`);
//     } catch (err) {
//       window.alert("❌ Erreur lors de l'import : " + err.message);
//       console.error("Erreur import:", err);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;

















// import React, { useState } from 'react';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0], 10),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase()
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     console.log("Fichier sélectionné :", file.name);

//     const { annee, codeEC } = extractInfos(file.name);

//     console.log("Infos extraites :", { annee, codeEC });

//     if (!annee || !codeEC) {
//       window.alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     const token = localStorage.getItem('token'); 
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     console.log("Token récupéré :", token);

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await fetch('http://localhost:8080/api/import/etudiants', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//           // NE PAS ajouter 'Content-Type' ici
//         },
//         body: formData
//       });

//       console.log("Statut de la réponse :", response.status);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Détails de l'erreur :", errorData);
//         throw new Error(errorData.erreur || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       console.log("Résultat reçu :", stats);
//       window.alert(`✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`);
//     } catch (error) {
//       console.error("Erreur attrapée :", error);
//       window.alert("❌ Erreur lors de l'import: " + error.message);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;



















// import React, { useState } from 'react';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0], 10),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase()
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);

//     if (!annee || !codeEC) {
//       window.alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     const token = localStorage.getItem('token'); 
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await fetch('/api/import/etudiants', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           // Note : Ne pas fixer 'Content-Type' ici, le navigateur s'en charge avec FormData
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.erreur || response.statusText || "Erreur inconnue");
//       }

//       const stats = await response.json();
//       window.alert(`✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`);
//     } catch (error) {
//       window.alert("❌ Erreur lors de l'import: " + error.message);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;












// import React, { useState } from 'react';
// import axios from 'axios';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0], 10),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase()
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);

//     if (!annee || !codeEC) {
//       window.alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     const token = localStorage.getItem('token'); 
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await axios.post('/api/import/etudiants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       const stats = response.data;
//       window.alert(`✅ Succès:\n- Étudiants créés: ${stats.etudiantsCrees}\n- Inscriptions créées: ${stats.inscriptionsCreees}`);
//     } catch (error) {
//       const message = error.response?.data?.erreur || error.message || "Erreur inconnue";
//       window.alert("❌ Erreur lors de l'import: " + message);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;
















// import React, { useState } from 'react';
// import axios from 'axios';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0]),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase()
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       window.alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);

//     if (!annee || !codeEC) {
//       window.alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     const token = localStorage.getItem('token'); // Assure-toi que le token est bien stocké sous ce nom
//     if (!token) {
//       window.alert("⚠️ Utilisateur non authentifié. Veuillez vous reconnecter.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await axios.post('/import/etudiants', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       window.alert(`✅ Succès:\n- Étudiants importés: ${response.data.etudiants_importes}\n- Inscriptions créées: ${response.data.inscriptions_creees}`);
//     } catch (error) {
//       const message = error.response?.data?.erreur || error.message;
//       window.alert("❌ Erreur lors de l'import: " + message);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;











// import React, { useState } from 'react';
// import axios from 'axios';

// function ImportECStudents() {
//   const [file, setFile] = useState(null);

//   const extractInfos = (filename) => {
//     const parts = filename.split('_');
//     return {
//       annee: parseInt(parts[0]),
//       codeEC: parts[1]?.replace('.csv', '').toUpperCase()
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       alert("Veuillez choisir un fichier CSV.");
//       return;
//     }

//     const { annee, codeEC } = extractInfos(file.name);

//     if (!annee || !codeEC) {
//       alert("Le nom du fichier doit suivre le format: ANNEE_CODEEC.csv (ex: 2023_INF4111.csv)");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fichier', file);
//     formData.append('annee', annee);
//     formData.append('codeEC', codeEC);

//     try {
//       const response = await axios.post('/api/import/ec-etudiants', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       alert(`✅ Succès:\n- Étudiants importés: ${response.data.etudiants_importes}\n- Inscriptions créées: ${response.data.inscriptions_creees}`);
//     } catch (error) {
//       alert("❌ Erreur lors de l'import: " + (error.response?.data?.erreur || error.message));
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Importer des étudiants pour un EC</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Fichier CSV :</label>
//           <input 
//             type="file" 
//             accept=".csv"
//             onChange={(e) => setFile(e.target.files[0])} 
//             required 
//           />
//         </div>
//         <button type="submit">Importer</button>
//       </form>
//     </div>
//   );
// }

// export default ImportECStudents;
