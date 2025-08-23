import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardEtudiant() {
  const [evaluations, setEvaluations] = useState([]);
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook navigation

  const handleCharger = async () => {
    setLoading(true);
    setError(null);
    setEvaluations([]);
    setEtudiant(null);

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/evaluations/moi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
      const data = await res.json();

      setEvaluations(data);
      if (data.length > 0) {
        setEtudiant(data[0].inscription.etudiant);
      } else {
        setEtudiant(null);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fonction pour colorer la note selon la valeur
  const getNoteStyle = (note) => {
    if (note == null) return {};
    if (note < 10)
      return {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        fontWeight: "700",
        borderRadius: 4,
        padding: "2px 6px",
        display: "inline-block",
        minWidth: 32,
        textAlign: "center",
      }; // rouge clair
    if (note < 14)
      return {
        backgroundColor: "#fef3c7",
        color: "#78350f",
        fontWeight: "700",
        borderRadius: 4,
        padding: "2px 6px",
        display: "inline-block",
        minWidth: 32,
        textAlign: "center",
      }; // orange clair
    return {
      backgroundColor: "#dcfce7",
      color: "#15803d",
      fontWeight: "700",
      borderRadius: 4,
      padding: "2px 6px",
      display: "inline-block",
      minWidth: 32,
      textAlign: "center",
    }; // vert clair
  };

  return (
    <div
      style={{
        maxWidth: "100vh",
        margin: "40px auto",
        background: "white",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        // minHeight: "70vh",
        maxHeight: "100vh",
        position: "relative", // pour positionner le bouton
      }}
    >
      {/* Bouton Retour Connexion en haut à gauche */}
      <button
        onClick={() => navigate("/accueil-candidat")}
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
        aria-label="Retour à la page de connexion"
      >
        ← Retour Connexion
      </button>

      <h2 style={{ textAlign: "center", marginBottom: 36, color: "#1e3a8a" }}>
        Tableau de bord Étudiant
      </h2>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <button
          onClick={handleCharger}
          disabled={loading}
          style={{
            padding: "12px 28px",
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            fontWeight: "700",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.5)",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#1e40af";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(30, 64, 175, 0.7)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.5)";
            }
          }}
          aria-label="Charger les données de l'étudiant"
        >
          {loading ? "Chargement..." : "Charger vos données"}
        </button>
      </div>

      {error && (
        <p role="alert" style={{ textAlign: "center", color: "#b91c1c", fontWeight: "700", marginBottom: 28 }}>
          {error}
        </p>
      )}

      {!!etudiant && (
        <section
          aria-label="Informations de l'étudiant"
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 12,
            margin: "0 auto 32px auto",
            padding: 20,
            backgroundColor: "#f1f5f9",
            maxWidth: 480,
            boxShadow: "0 0 10px rgba(100,100,100,0.05)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: 20, fontWeight: "700", color: "#334155" }}>
            Profil Étudiant
          </h3>
          <p style={{ marginBottom: 8 }}>
            <strong>Nom :</strong> {etudiant.nom}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Prénom :</strong> {etudiant.prenom}
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Matricule :</strong> {etudiant.matricule}
          </p>
        </section>
      )}

      {evaluations.length > 0 ? (
        <table
          role="table"
          aria-label="Liste des évaluations"
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            fontSize: 14,
            color: "#444",
          }}
        >
          <thead>
            <tr>
              {["Code UE", "Code EC", "Année", "Note contrôle", "Note examen", "Moyenne"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: "2px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#334155",
                    fontWeight: "700",
                    borderRadius: "8px 8px 0 0",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev, i) => (
              <tr
                key={ev.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#f9fafb" : "white",
                  boxShadow: "inset 0 -1px 0 #e2e8f0",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#f9fafb" : "white")}
              >
                <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
                <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.codeEC || "—"}</td>
                <td style={{ padding: "10px 12px" }}>{ev.inscription?.anneeInscription || "—"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={getNoteStyle(ev.noteControle)}>
                    {ev.noteControle != null ? ev.noteControle.toFixed(2) : "—"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={getNoteStyle(ev.noteExamen)}>
                    {ev.noteExamen != null ? ev.noteExamen.toFixed(2) : "—"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", fontWeight: "600", color: "#0f766e" }}>
                  {ev.inscription?.moyenne != null ? ev.inscription.moyenne.toFixed(2) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading &&
        !error && (
          <p style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontStyle: "italic" }}>
            Aucune évaluation trouvée.
          </p>
        )
      )}
    </div>
  );
}

















// import React, { useState } from "react";

// export default function DashboardEtudiant() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [etudiant, setEtudiant] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCharger = async () => {
//     setLoading(true);
//     setError(null);
//     setEvaluations([]);
//     setEtudiant(null);

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8080/api/evaluations/moi", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       const data = await res.json();

//       setEvaluations(data);
//       if (data.length > 0) {
//         setEtudiant(data[0].inscription.etudiant);
//       } else {
//         setEtudiant(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   // Fonction pour colorer la note selon la valeur
//   const getNoteStyle = (note) => {
//     if (note == null) return {};
//     if (note < 10) return { backgroundColor: "#fee2e2", color: "#b91c1c", fontWeight: "700", borderRadius: 4, padding: "2px 6px", display: "inline-block", minWidth: 32, textAlign: "center" }; // rouge clair
//     if (note < 14) return { backgroundColor: "#fef3c7", color: "#78350f", fontWeight: "700", borderRadius: 4, padding: "2px 6px", display: "inline-block", minWidth: 32, textAlign: "center" }; // orange clair
//     return { backgroundColor: "#dcfce7", color: "#15803d", fontWeight: "700", borderRadius: 4, padding: "2px 6px", display: "inline-block", minWidth: 32, textAlign: "center" }; // vert clair
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 640,
//         margin: "40px auto",
//         background: "white",
//         padding: 32,
//         borderRadius: 12,
//         boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         minHeight: "70vh",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 36, color: "#1e3a8a" }}>
//         Tableau de bord Étudiant
//       </h2>

//       <div style={{ textAlign: "center", marginBottom: 32 }}>
//         <button
//           onClick={handleCharger}
//           disabled={loading}
//           style={{
//             padding: "12px 28px",
//             backgroundColor: loading ? "#93c5fd" : "#2563eb",
//             color: "white",
//             fontWeight: "700",
//             border: "none",
//             borderRadius: 8,
//             fontSize: 16,
//             cursor: loading ? "not-allowed" : "pointer",
//             boxShadow: "0 4px 12px rgba(37, 99, 235, 0.5)",
//             transition: "background-color 0.3s, box-shadow 0.3s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading) {
//               e.currentTarget.style.backgroundColor = "#1e40af";
//               e.currentTarget.style.boxShadow = "0 6px 14px rgba(30, 64, 175, 0.7)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!loading) {
//               e.currentTarget.style.backgroundColor = "#2563eb";
//               e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.5)";
//             }
//           }}
//           aria-label="Charger les données de l'étudiant"
//         >
//           {loading ? "Chargement..." : "Charger vos données"}
//         </button>
//       </div>

//       {error && (
//         <p
//           role="alert"
//           style={{ textAlign: "center", color: "#b91c1c", fontWeight: "700", marginBottom: 28 }}
//         >
//           {error}
//         </p>
//       )}

//       {!!etudiant && (
//         <section
//           aria-label="Informations de l'étudiant"
//           style={{
//             border: "1px solid #cbd5e1",
//             borderRadius: 12,
//             margin: "0 auto 32px auto",
//             padding: 20,
//             backgroundColor: "#f1f5f9",
//             maxWidth: 480,
//             boxShadow: "0 0 10px rgba(100,100,100,0.05)",
//           }}
//         >
//           <h3
//             style={{
//               textAlign: "center",
//               marginBottom: 20,
//               fontWeight: "700",
//               color: "#334155",
//             }}
//           >
//             Profil Étudiant
//           </h3>
//           <p style={{ marginBottom: 8 }}>
//             <strong>Nom :</strong> {etudiant.nom}
//           </p>
//           <p style={{ marginBottom: 8 }}>
//             <strong>Prénom :</strong> {etudiant.prenom}
//           </p>
//           <p style={{ marginBottom: 0 }}>
//             <strong>Matricule :</strong> {etudiant.matricule}
//           </p>
//         </section>
//       )}

//       {evaluations.length > 0 ? (
//         <table
//           role="table"
//           aria-label="Liste des évaluations"
//           style={{
//             width: "100%",
//             borderCollapse: "separate",
//             borderSpacing: "0 8px",
//             fontSize: 14,
//             color: "#444",
//           }}
//         >

//           <thead>
//             <tr>
//               {["Code UE", "Code EC", "Année", "Note contrôle", "Note examen", "Moyenne"].map((header) => (
//                 <th
//                   key={header}
//                   scope="col"
//                   style={{
//                     textAlign: "left",
//                     padding: "10px 12px",
//                     borderBottom: "2px solid #e2e8f0",
//                     backgroundColor: "#f8fafc",
//                     color: "#334155",
//                     fontWeight: "700",
//                     borderRadius: "8px 8px 0 0",
//                   }}
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* <thead>
//             <tr>
//               {["Code UE", "Code EC", "Année", "Note contrôle", "Note examen"].map((header) => (
//                 <th
//                   key={header}
//                   scope="col"
//                   style={{
//                     textAlign: "left",
//                     padding: "10px 12px",
//                     borderBottom: "2px solid #e2e8f0",
//                     backgroundColor: "#f8fafc",
//                     color: "#334155",
//                     fontWeight: "700",
//                     borderRadius: "8px 8px 0 0",
//                   }}
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead> */}
//           {/* <tbody>
//             {evaluations.map((ev, i) => (
//               <tr
//                 key={ev.id}
//                 style={{
//                   backgroundColor: i % 2 === 0 ? "#f9fafb" : "white",
//                   boxShadow: "inset 0 -1px 0 #e2e8f0",
//                   transition: "background-color 0.3s",
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dbeafe"}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#f9fafb" : "white"}
//               >
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.codeEC || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.anneeInscription || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>
//                   <span style={getNoteStyle(ev.noteControle)}>
//                     {ev.noteControle != null ? ev.noteControle.toFixed(2) : "—"}
//                   </span>
//                 </td>
//                 <td style={{ padding: "10px 12px" }}>
//                   <span style={getNoteStyle(ev.noteExamen)}>
//                     {ev.noteExamen != null ? ev.noteExamen.toFixed(2) : "—"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody> */}

//           <tbody>
//             {evaluations.map((ev, i) => (
//               <tr
//                 key={ev.id}
//                 style={{
//                   backgroundColor: i % 2 === 0 ? "#f9fafb" : "white",
//                   boxShadow: "inset 0 -1px 0 #e2e8f0",
//                   transition: "background-color 0.3s",
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dbeafe"}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#f9fafb" : "white"}
//               >
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.ec?.codeEC || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>{ev.inscription?.anneeInscription || "—"}</td>
//                 <td style={{ padding: "10px 12px" }}>
//                   <span style={getNoteStyle(ev.noteControle)}>
//                     {ev.noteControle != null ? ev.noteControle.toFixed(2) : "—"}
//                   </span>
//                 </td>
//                 <td style={{ padding: "10px 12px" }}>
//                   <span style={getNoteStyle(ev.noteExamen)}>
//                     {ev.noteExamen != null ? ev.noteExamen.toFixed(2) : "—"}
//                   </span>
//                 </td>
//                 <td style={{ padding: "10px 12px", fontWeight: "600", color: "#0f766e" }}>
//                   {ev.inscription?.moyenne != null ? ev.inscription.moyenne.toFixed(2) : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       ) : (
//         !loading &&
//         !error && (
//           <p
//             style={{
//               textAlign: "center",
//               marginTop: 20,
//               color: "#64748b",
//               fontStyle: "italic",
//             }}
//           >
//             Aucune évaluation trouvée.
//           </p>
//         )
//       )}
//     </div>
//   );
// }

















// import React, { useState } from "react";

// export default function DashboardEtudiant() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [etudiant, setEtudiant] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCharger = async () => {
//     setLoading(true);
//     setError(null);
//     setEvaluations([]);
//     setEtudiant(null);

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8080/api/evaluations/moi", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Status:", res.status, "OK:", res.ok);
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       const data = await res.json();

//       setEvaluations(data);
//       if (data.length > 0) {
//         setEtudiant(data[0].inscription.etudiant);
//       } else {
//         setEtudiant(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Étudiant
//       </h2>

//       <div style={{ textAlign: "center", marginBottom: 28 }}>
//         <button
//           onClick={handleCharger}
//           disabled={loading}
//           style={{
//             padding: "10px 24px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             fontSize: 16,
//             fontWeight: 600,
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "background-color 0.3s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading) e.currentTarget.style.backgroundColor = "#1e40af";
//           }}
//           onMouseLeave={(e) => {
//             if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
//           }}
//         >
//           {loading ? "Chargement..." : "Charger vos données"}
//         </button>
//       </div>

//       {error && (
//         <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
//           {error}
//         </p>
//       )}

//       {!!etudiant && (
//         <div
//           style={{
//             border: "1px solid #e5e7eb",
//             borderRadius: 8,
//             margin: "0 auto 32px auto",
//             padding: 16,
//             backgroundColor: "#f9fafb",
//             maxWidth: 400,
//           }}
//         >
//           <p style={{ marginBottom: 6 }}>
//             <strong>Nom :</strong> {etudiant.nom}
//           </p>
//           <p style={{ marginBottom: 6 }}>
//             <strong>Prénom :</strong> {etudiant.prenom}
//           </p>
//           <p style={{ marginBottom: 0 }}>
//             <strong>Matricule :</strong> {etudiant.matricule}
//           </p>
//         </div>
//       )}

//       {evaluations.length > 0 ? (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Code UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Code EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {evaluations.map((ev) => (
//               <tr key={ev.id}>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.ue?.codeUE || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.codeEC || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.anneeInscription || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteControle != null ? ev.noteControle : "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteExamen != null ? ev.noteExamen : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         !loading &&
//         !error && (
//           <p style={{ textAlign: "center", color: "#555" }}>
//             Aucune évaluation trouvée.
//           </p>
//         )
//       )}
//     </div>
//   );
// }












// import React, { useState } from "react";

// export default function DashboardEtudiant() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [etudiant, setEtudiant] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCharger = async () => {
//     setLoading(true);
//     setError(null);
//     setEvaluations([]);
//     setEtudiant(null);

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8080/api/evaluations/moi", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Status:", res.status, "OK:", res.ok); // Ajoutes ce log
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       const data = await res.json();

//       setEvaluations(data);
//       if (data.length > 0) {
//         setEtudiant(data[0].inscription.etudiant);
//       } else {
//         setEtudiant(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Étudiant
//       </h2>

//       <div style={{ textAlign: "center", marginBottom: 28 }}>
//         <button
//           onClick={handleCharger}
//           disabled={loading}
//           style={{
//             padding: "10px 24px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             fontSize: 16,
//             fontWeight: 600,
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "background-color 0.3s",
//           }}
//           onMouseEnter={(e) => {
//             if (!loading) e.currentTarget.style.backgroundColor = "#1e40af";
//           }}
//           onMouseLeave={(e) => {
//             if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
//           }}
//         >
//           {loading ? "Chargement..." : "Charger vos données"}
//         </button>
//       </div>

//       {error && (
//         <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
//           {error}
//         </p>
//       )}

//       {!!etudiant && (
//         <div
//           style={{
//             border: "1px solid #e5e7eb",
//             borderRadius: 8,
//             margin: "0 auto 32px auto",
//             padding: 16,
//             backgroundColor: "#f9fafb",
//             maxWidth: 400,
//           }}
//         >
//           <p style={{ marginBottom: 6 }}>
//             <strong>Nom :</strong> {etudiant.nom}
//           </p>
//           <p style={{ marginBottom: 6 }}>
//             <strong>Prénom :</strong> {etudiant.prenom}
//           </p>
//           <p style={{ marginBottom: 0 }}>
//             <strong>Matricule :</strong> {etudiant.matricule}
//           </p>
//         </div>
//       )}

//       {evaluations.length > 0 ? (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {evaluations.map((ev) => (
//               <tr key={ev.id}>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.ue?.intitule || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.intitule || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.anneeInscription || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteControle != null ? ev.noteControle : "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteExamen != null ? ev.noteExamen : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         !loading && !error && (
//           <p style={{ textAlign: "center", color: "#555" }}>
//             Aucune évaluation trouvée.
//           </p>
//         )
//       )}
//     </div>
//   );
// }


























// import React, { useState } from "react";

// export default function DashboardEtudiant() {
//   const [matricule, setMatricule] = useState("");
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [etudiant, setEtudiant] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Appel au backend lorsqu'on clique sur le bouton
//   const handleCharger = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setFilteredEvaluations([]);
//     setEtudiant(null);

//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8080/api/evaluations", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       const data = await res.json();

//       // On filtre les évaluations selon le matricule
//       const evals = data.filter(
//         (ev) => ev.inscription?.etudiant?.matricule?.toLowerCase() === matricule.trim().toLowerCase()
//       );


//       setFilteredEvaluations(evals);

//       if (evals.length > 0) {
//         setEtudiant(evals[0].inscription.etudiant);
//       } else {
//         setEtudiant(null);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Étudiant
//       </h2>

//       {/* Formulaire de saisie et bouton */}
//       <form
//         onSubmit={handleCharger}
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: 12,
//           marginBottom: 28,
//         }}
//       >
//         <input
//           type="text"
//           value={matricule}
//           onChange={(e) => setMatricule(e.target.value)}
//           placeholder="Entrez votre matricule"
//           required
//           style={{
//             padding: 8,
//             width: 220,
//             borderRadius: 6,
//             border: "1px solid #ccc",
//             fontSize: 16,
//             textTransform: "uppercase",
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: "8px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             fontSize: 16,
//             fontWeight: 600,
//             cursor: "pointer",
//             transition: "background-color 0.3s",
//           }}
//         >
//           {loading ? "Chargement..." : "Charger vos données"}
//         </button>
//       </form>

//       {error && (
//         <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
//           {error}
//         </p>
//       )}

//       {/* Affichage infos étudiant */}
//       {!!etudiant && (
//         <div
//           style={{
//             border: "1px solid #e5e7eb",
//             borderRadius: 8,
//             margin: "0 auto 32px auto",
//             padding: 16,
//             backgroundColor: "#f9fafb",
//             maxWidth: 400,
//           }}
//         >
//           <p style={{ marginBottom: 6 }}>
//             <strong>Nom :</strong> {etudiant.nom}
//           </p>
//           <p style={{ marginBottom: 6 }}>
//             <strong>Prénom :</strong> {etudiant.prenom}
//           </p>
//           <p style={{ marginBottom: 0 }}>
//             <strong>Matricule :</strong> {etudiant.matricule}
//           </p>
//         </div>
//       )}

//       {/* Liste des évaluations */}
//       {filteredEvaluations.length > 0 && (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev) => (
//               <tr key={ev.id}>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.ue?.intitule || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.ec?.intitule || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.inscription?.anneeInscription || "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteControle !== undefined && ev.noteControle !== null
//                     ? ev.noteControle
//                     : "—"}
//                 </td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
//                   {ev.noteExamen !== undefined && ev.noteExamen !== null
//                     ? ev.noteExamen
//                     : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Message pour aucun résultat */}
//       {filteredEvaluations.length === 0 && !loading && !error && (
//         <p style={{ textAlign: "center", color: "#555" }}>
//           {matricule
//             ? "Aucune donnée trouvée pour ce matricule."
//             : "Veuillez renseigner votre matricule et cliquer sur 'Charger vos données'."}
//         </p>
//       )}
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";

// export default function DashboardEtudiant({ userEmail }) {
//   const [evaluations, setEvaluations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     fetch("http://localhost:8080/api/evaluations", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//         return res.json();
//       })
//       .then((data) => {
//         setEvaluations(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div
//       style={{
//         maxWidth: 900,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Tableau de bord Étudiant</h2>

//       {loading && (
//         <p style={{ textAlign: "center", fontSize: 16, color: "#555" }}>
//           Chargement de vos évaluations...
//         </p>
//       )}

//       {error && (
//         <p style={{ textAlign: "center", color: "red", fontWeight: "bold", fontSize: 16 }}>
//           {error}
//         </p>
//       )}

//       {!loading && !error && (
//         <>
//           {evaluations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "#555", fontSize: 16 }}>
//               Aucune évaluation trouvée.
//             </p>
//           ) : (
//             <ul
//               style={{
//                 maxWidth: 700,
//                 margin: "0 auto",
//                 paddingLeft: 0,
//                 listStyle: "none",
//               }}
//             >
//               {evaluations.map((e) => (
//                 <li
//                   key={e.id}
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     marginBottom: 12,
//                     padding: 15,
//                     borderRadius: 6,
//                     boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
//                     fontSize: 16,
//                     fontWeight: "500",
//                     color: "#333",
//                   }}
//                 >
//                   <strong>Cours :</strong> {e.inscription?.ec?.intitule || "—"} <br />
//                   <strong>Note Contrôle :</strong> {e.noteControle !== undefined && e.noteControle !== null ? e.noteControle : "—"} <br />
//                   <strong>Note Examen :</strong> {e.noteExamen !== undefined && e.noteExamen !== null ? e.noteExamen : "—"}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

























// import React, { useEffect, useState } from "react";

// export default function DashboardEtudiant({ userEmail }) {
//   const [evaluations, setEvaluations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//   // const token = localStorage.getItem('token');
//   const token = sessionStorage.getItem('token');
//   if (!token) {
//     setError("Utilisateur non authentifié.");
//     setLoading(false);
//     return;
//   }

//   fetch("http://localhost:8080/api/evaluations", {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     }
//   })
//     .then(res => {
//       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//       return res.json();
//     })
//     .then(data => {
//       setEvaluations(data);
//       setLoading(false);
//     })
//     .catch(err => {
//       setError(err.message);
//       setLoading(false);
//     });
// }, []);


//   // useEffect(() => {
//   //   // Récupérer toutes les évaluations et filtrer celles liées à l’étudiant connecté (email)
//   //   fetch("http://localhost:8080/api/evaluations")
//   //     .then(res => {
//   //       if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//   //       return res.json();
//   //     })
//   //     .then(data => {
//   //       const myEvals = data.filter(evalItem => evalItem.inscription.etudiant.email === userEmail);
//   //       setEvaluations(myEvals);
//   //       setLoading(false);
//   //     })
//   //     .catch(err => {
//   //       setError(err.message);
//   //       setLoading(false);
//   //     });
//   // }, [userEmail]);

//   return (
//     <div>
//       <h2>Tableau de bord Étudiant</h2>
//       {loading && <p>Chargement de vos évaluations...</p>}
//       {error && <p style={{color: "red"}}>{error}</p>}
//       {!loading && !error && (
//         <ul>
//           {evaluations.length === 0 && <li>Aucune évaluation trouvée.</li>}
//           {evaluations.map(e => (
//             <li key={e.id}>
//               Cours: {e.inscription.ec.intitule} - Note Contrôle: {e.note_controle} - Note Examen: {e.note_examen}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
