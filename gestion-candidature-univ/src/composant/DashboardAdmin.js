import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // import useNavigate ici
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function DashboardAdmin() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // hook de navigation

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/evaluations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
        return res.json();
      })
      .then((data) => {
        setEvaluations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalEvaluations = evaluations.length;

  const moyennesNonNulles = evaluations
    .map((ev) => ev.inscription?.moyenne)
    .filter((m) => typeof m === "number" && !isNaN(m));

  const moyenneGlobale =
    moyennesNonNulles.length > 0
      ? (moyennesNonNulles.reduce((acc, val) => acc + val, 0) / moyennesNonNulles.length).toFixed(2)
      : "N/A";

  const repartitionMoyennes = { echec: 0, passable: 0, bien: 0 };

  moyennesNonNulles.forEach((m) => {
    if (m < 10) repartitionMoyennes.echec += 1;
    else if (m < 14) repartitionMoyennes.passable += 1;
    else repartitionMoyennes.bien += 1;
  });

  const dataPie = [
    { name: "Échecs (<10)", value: repartitionMoyennes.echec },
    { name: "Passable (10-13.9)", value: repartitionMoyennes.passable },
    { name: "Bien et ++ (≥14)", value: repartitionMoyennes.bien },
  ];

  const histogramBuckets = {};
  moyennesNonNulles.forEach((m) => {
    const bucket = Math.floor(m);
    histogramBuckets[bucket] = (histogramBuckets[bucket] || 0) + 1;
  });

  const dataBar = [];
  for (let i = 0; i <= 20; i++) {
    dataBar.push({ moyenne: i.toString(), count: histogramBuckets[i] || 0 });
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent === 0) return null;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight="600"
        fontSize={12}
      >
        {`${dataPie[index].name} : ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      style={{
        maxWidth: 1600,
        maxHeight: 1000,
        margin: "40px auto",
        background: "white",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 16px #e0e0e0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative", // pour bouton positionné
      }}
    >
      {/* Bouton retour vers AccueilEtudiant en haut à gauche */}
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

      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Tableau de bord Administrateur</h2>

      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <Link to="/import-export" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "12px 28px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            Gérer Import / Export des évaluations
          </button>
        </Link>
      </div>

      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "12px 28px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
          >
            Gérer les évaluations
          </button>
        </Link>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

      {error && <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p style={{ textAlign: "center", color: "#555", marginBottom: 30 }}>
            {totalEvaluations} évaluation{totalEvaluations > 1 ? "s" : ""} disponible
            {totalEvaluations > 1 ? "s" : ""}.
          </p>

          <h3 style={{ textAlign: "center", marginBottom: 16 }}>Moyenne générale : {moyenneGlobale}</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              gap: 40,
            }}
          >
            {/* Camembert des moyennes */}
            <div style={{ width: 320, height: 320 }}>
              <h4 style={{ textAlign: "center", marginBottom: 12 }}>Répartition des moyennes</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} contentStyle={{ fontSize: 14 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Histogramme des moyennes */}
            <div style={{ width: 540, height: 320 }}>
              <h4 style={{ textAlign: "center", marginBottom: 12 }}>Histogramme des moyennes</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 25, bottom: 40 }}>
                  <XAxis
                    dataKey="moyenne"
                    label={{ value: "Moyenne", position: "insideBottom", offset: 15, fontWeight: "600" }}
                    tick={{ fontWeight: "600", fontSize: 12 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    label={{ value: "Nombre", angle: -90, position: "insideLeft", fontWeight: "600" }}
                    allowDecimals={false}
                    tick={{ fontWeight: "600", fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} contentStyle={{ fontSize: 14 }} />
                  <Legend wrapperStyle={{ fontWeight: "700", fontSize: 14 }} verticalAlign="top" height={36} />
                  <Bar dataKey="count" name="Nombre d'évaluations" fill="#8884d8" barSize={40} radius={[5, 5, 0, 0]}>
                    <LabelList dataKey="count" position="top" style={{ fontWeight: "600", fontSize: 14 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistiques additionnelles textuelles */}
          <div style={{ marginTop: 30, textAlign: "center", fontSize: 16, color: "#333", lineHeight: 1.6 }}>
            <p>
              <strong>Nombre d’échecs (moyenne &lt; 10) :</strong> {repartitionMoyennes.echec}
            </p>
            <p>
              <strong>Nombre de notes passables (10 ≤ moyenne &lt; 14) :</strong> {repartitionMoyennes.passable}
            </p>
            <p>
              <strong>Nombre de notes bien et plus (≥ 14) :</strong> {repartitionMoyennes.bien}
            </p>
          </div>
        </>
      )}
    </div>
  );
}






















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// export default function DashboardAdmin() {
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
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
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

//   // Calculs statistiques

//   const totalEvaluations = evaluations.length;

//   // Récupérer moyennes non nulles
//   const moyennesNonNulles = evaluations
//     .map((ev) => ev.inscription?.moyenne)
//     .filter((m) => typeof m === "number" && !isNaN(m));

//   // Moyenne générale arrondie à 2 décimales
//   const moyenneGlobale =
//     moyennesNonNulles.length > 0
//       ? (
//           moyennesNonNulles.reduce((acc, val) => acc + val, 0) / moyennesNonNulles.length
//         ).toFixed(2)
//       : "N/A";

//   // Répartition des moyennes par catégorie
//   const repartitionMoyennes = {
//     echec: 0,    // Moyenne < 10
//     passable: 0, // Moyenne entre 10 et <14
//     bien: 0,     // Moyenne ≥ 14
//   };

//   moyennesNonNulles.forEach((m) => {
//     if (m < 10) repartitionMoyennes.echec += 1;
//     else if (m < 14) repartitionMoyennes.passable += 1;
//     else repartitionMoyennes.bien += 1;
//   });

//   const dataPie = [
//     { name: "Échecs (<10)", value: repartitionMoyennes.echec },
//     { name: "Passable (10-13.9)", value: repartitionMoyennes.passable },
//     { name: "Bien et ++ (≥14)", value: repartitionMoyennes.bien },
//   ];

//   // Histogramme des moyennes par tranche entière (0 à 20)
//   const histogramBuckets = {};
//   moyennesNonNulles.forEach((m) => {
//     const bucket = Math.floor(m);
//     histogramBuckets[bucket] = (histogramBuckets[bucket] || 0) + 1;
//   });

//   const dataBar = [];
//   for (let i = 0; i <= 20; i++) {
//     dataBar.push({ moyenne: i.toString(), count: histogramBuckets[i] || 0 });
//   }

//   // Custom label pour le camembert (avec pourcentage arrondi)
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
//     if (percent === 0) return null; // ne pas afficher les labels avec 0%

//     return (
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontWeight="600" fontSize={12}>
//         {`${dataPie[index].name} : ${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 1600,
//         maxHeight: 1000,
//         margin: "40px auto",
//         background: "white",
//         padding: 24,
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Administrateur
//       </h2>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/import-export" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//           >
//             Gérer Import / Export des évaluations
//           </button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
//           >
//             Gérer les évaluations
//           </button>
//         </Link>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

//       {error && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>
//       )}

//       {!loading && !error && (
//         <>
//           <p style={{ textAlign: "center", color: "#555", marginBottom: 30 }}>
//             {totalEvaluations} évaluation{totalEvaluations > 1 ? "s" : ""} disponible
//             {totalEvaluations > 1 ? "s" : ""}.
//           </p>

//           <h3 style={{ textAlign: "center", marginBottom: 16 }}>
//             Moyenne générale : {moyenneGlobale}
//           </h3>

//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "space-around",
//               gap: 40,
//             }}
//           >
//             {/* Camembert des moyennes */}
//             <div style={{ width: 320, height: 320 }}>
//               <h4 style={{ textAlign: "center", marginBottom: 12 }}>Répartition des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={dataPie}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     label={renderCustomizedLabel}
//                     labelLine={false}
//                   >
//                     {dataPie.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value, name) => [`${value}`, name]}
//                     contentStyle={{ fontSize: 14 }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Histogramme des moyennes */}
//             <div style={{ width: 540, height: 320 }}>
//               <h4 style={{ textAlign: "center", marginBottom: 12 }}>Histogramme des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 25, bottom: 40 }}>
//                   <XAxis
//                     dataKey="moyenne"
//                     label={{ value: "Moyenne", position: "insideBottom", offset: 15, fontWeight: "600" }}
//                     tick={{ fontWeight: "600", fontSize: 12 }}
//                     interval={0}
//                     angle={-30}
//                     textAnchor="end"
//                     height={60}
//                   />
//                   <YAxis
//                     label={{ value: "Nombre", angle: -90, position: "insideLeft", fontWeight: "600" }}
//                     allowDecimals={false}
//                     tick={{ fontWeight: "600", fontSize: 12 }}
//                   />
//                   <Tooltip
//                     cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
//                     contentStyle={{ fontSize: 14 }}
//                   />
//                   <Legend wrapperStyle={{ fontWeight: "700", fontSize: 14 }} verticalAlign="top" height={36} />
//                   <Bar dataKey="count" name="Nombre d'évaluations" fill="#8884d8" barSize={40} radius={[5, 5, 0, 0]}>
//                     <LabelList dataKey="count" position="top" style={{ fontWeight: "600", fontSize: 14 }} />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Statistiques additionnelles textuelles */}
//           <div style={{ marginTop: 30, textAlign: "center", fontSize: 16, color: "#333", lineHeight: 1.6 }}>
//             <p><strong>Nombre d’échecs (moyenne &lt; 10) :</strong> {repartitionMoyennes.echec}</p>
//             <p><strong>Nombre de notes passables (10 ≤ moyenne &lt; 14) :</strong> {repartitionMoyennes.passable}</p>
//             <p><strong>Nombre de notes bien et plus (≥ 14) :</strong> {repartitionMoyennes.bien}</p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// export default function DashboardAdmin() {
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
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
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

//   // Calculs statistiques

//   const totalEvaluations = evaluations.length;

//   // Récupérer moyennes non nulles
//   const moyennesNonNulles = evaluations
//     .map((ev) => ev.inscription?.moyenne)
//     .filter((m) => typeof m === "number" && !isNaN(m));

//   // Moyenne générale arrondie à 2 décimales
//   const moyenneGlobale =
//     moyennesNonNulles.length > 0
//       ? (
//           moyennesNonNulles.reduce((acc, val) => acc + val, 0) / moyennesNonNulles.length
//         ).toFixed(2)
//       : "N/A";

//   // Répartition des moyennes par catégorie
//   const repartitionMoyennes = {
//     echec: 0,    // Moyenne < 10
//     passable: 0, // Moyenne entre 10 et <14
//     bien: 0,     // Moyenne ≥ 14
//   };

//   moyennesNonNulles.forEach((m) => {
//     if (m < 10) repartitionMoyennes.echec += 1;
//     else if (m < 14) repartitionMoyennes.passable += 1;
//     else repartitionMoyennes.bien += 1;
//   });

//   const dataPie = [
//     { name: "Échecs (<10)", value: repartitionMoyennes.echec },
//     { name: "Passable (10-13.9)", value: repartitionMoyennes.passable },
//     { name: "Bien et ++ (≥14)", value: repartitionMoyennes.bien },
//   ];

//   // Histogramme des moyennes par tranche entière (0 à 20)
//   const histogramBuckets = {};
//   moyennesNonNulles.forEach((m) => {
//     const bucket = Math.floor(m);
//     histogramBuckets[bucket] = (histogramBuckets[bucket] || 0) + 1;
//   });

//   const dataBar = [];
//   for (let i = 0; i <= 20; i++) {
//     dataBar.push({ moyenne: i.toString(), count: histogramBuckets[i] || 0 });
//   }

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
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Administrateur
//       </h2>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/import-export" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//           >
//             Gérer Import / Export des évaluations
//           </button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
//           >
//             Gérer les évaluations
//           </button>
//         </Link>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

//       {error && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>
//       )}

//       {!loading && !error && (
//         <>
//           <p style={{ textAlign: "center", color: "#555", marginBottom: 30 }}>
//             {totalEvaluations} évaluation{totalEvaluations > 1 ? "s" : ""} disponible
//             {totalEvaluations > 1 ? "s" : ""}.
//           </p>

//           <h3 style={{ textAlign: "center", marginBottom: 16 }}>
//             Moyenne générale : {moyenneGlobale}
//           </h3>

//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "space-around",
//               gap: 40,
//             }}
//           >
//             {/* Camembert des moyennes */}
//             <div style={{ width: 300, height: 300 }}>
//               <h4 style={{ textAlign: "center", marginBottom: 12 }}>Répartition des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={dataPie}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label
//                     labelLine={false}
//                   >
//                     {dataPie.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Histogramme des moyennes */}
//             <div style={{ width: 500, height: 300 }}>
//               <h4 style={{ textAlign: "center", marginBottom: 12 }}>Histogramme des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <XAxis dataKey="moyenne" label={{ value: "Moyenne", position: "insideBottom", offset: -5 }} />
//                   <YAxis label={{ value: "Nombre", angle: -90, position: "insideLeft" }} allowDecimals={false} />
//                   <Tooltip />
//                   <Legend verticalAlign="top" height={36} />
//                   <Bar dataKey="count" name="Nombre d'évaluations" fill="#8884d8">
//                     <LabelList dataKey="count" position="top" />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }




















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// export default function DashboardAdmin() {
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
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
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

//   // Calculs statistiques

//   const totalEvaluations = evaluations.length;

//   // Récupérer moyennes non nulles
//   const moyennesNonNulles = evaluations
//     .map((ev) => ev.inscription?.moyenne)
//     .filter((m) => typeof m === "number" && !isNaN(m));

//   // Moyenne générale
//   const moyenneGlobale =
//     moyennesNonNulles.length > 0
//       ? (
//           moyennesNonNulles.reduce((acc, val) => acc + val, 0) / moyennesNonNulles.length
//         ).toFixed(2)
//       : "N/A";

//   // Répartition des moyennes par catégorie
//   const repartitionMoyennes = {
//     echec: 0,    // < 10
//     passable: 0, // 10 ≤ x < 14
//     bien: 0,     // ≥ 14
//   };

//   moyennesNonNulles.forEach((m) => {
//     if (m < 10) repartitionMoyennes.echec += 1;
//     else if (m < 14) repartitionMoyennes.passable += 1;
//     else repartitionMoyennes.bien += 1;
//   });

//   const dataPie = [
//     { name: "Échecs (<10)", value: repartitionMoyennes.echec },
//     { name: "Passable (10-13.9)", value: repartitionMoyennes.passable },
//     { name: "Bien et ++ (≥14)", value: repartitionMoyennes.bien },
//   ];

//   // Histogramme des moyennes par tranche entières
//   const histogramBuckets = {};
//   moyennesNonNulles.forEach((m) => {
//     const bucket = Math.floor(m);
//     histogramBuckets[bucket] = (histogramBuckets[bucket] || 0) + 1;
//   });

//   const dataBar = [];
//   for (let i = 0; i <= 20; i++) {
//     dataBar.push({ moyenne: i.toString(), count: histogramBuckets[i] || 0 });
//   }

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
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Administrateur
//       </h2>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/import-export" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//           >
//             Gérer Import / Export des évaluations
//           </button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
//           >
//             Gérer les évaluations
//           </button>
//         </Link>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

//       {error && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>
//       )}

//       {!loading && !error && (
//         <>
//           <p style={{ textAlign: "center", color: "#555", marginBottom: 30 }}>
//             {totalEvaluations} évaluation{totalEvaluations > 1 ? "s" : ""} disponible
//             {totalEvaluations > 1 ? "s" : ""}.
//           </p>

//           <h3 style={{ textAlign: "center", marginBottom: 16 }}>
//             Moyenne générale : {moyenneGlobale}
//           </h3>

//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "space-around",
//               gap: 40,
//             }}
//           >
//             {/* Camembert des moyennes */}
//             <div style={{ width: 300, height: 300 }}>
//               <h4 style={{ textAlign: "center" }}>Répartition des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={dataPie}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label
//                     labelLine={false}
//                   >
//                     {dataPie.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Histogramme des moyennes */}
//             <div style={{ width: 500, height: 300 }}>
//               <h4 style={{ textAlign: "center" }}>Histogramme des moyennes</h4>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <XAxis dataKey="moyenne" label={{ value: "Moyenne", position: "insideBottom", offset: -5 }} />
//                   <YAxis label={{ value: "Nombre", angle: -90, position: "insideLeft" }} allowDecimals={false} />
//                   <Tooltip />
//                   <Legend verticalAlign="top" height={36} />
//                   <Bar dataKey="count" name="Nombre d'évaluations" fill="#8884d8">
//                     <LabelList dataKey="count" position="top" />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function DashboardAdmin() {
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
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
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
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Administrateur
//       </h2>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/import-export" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//           >
//             Gérer Import / Export des évaluations
//           </button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
//           >
//             Gérer les évaluations
//           </button>
//         </Link>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

//       {error && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
//           {error}
//         </p>
//       )}

//       {!loading && !error && (
//         <>
//           {evaluations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "#555" }}>
//               Aucune évaluation disponible.
//             </p>
//           ) : (
//             <p style={{ textAlign: "center", color: "#555" }}>
//               {evaluations.length} évaluation{evaluations.length > 1 ? "s" : ""} disponible
//               {evaluations.length > 1 ? "s" : ""}.
//             </p>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function DashboardAdmin() {
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
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
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
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>
//         Tableau de bord Administrateur
//       </h2>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/import-export" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
//           >
//             Gérer Import / Export des évaluations
//           </button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: 24, textAlign: "center" }}>
//         <Link to="/gest-evaluations" style={{ textDecoration: "none" }}>
//           <button
//             style={{
//               padding: "12px 28px",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontSize: 16,
//               fontWeight: "600",
//               boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
//           >
//             Gérer les évaluations
//           </button>
//         </Link>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Chargement des évaluations...</p>}

//       {error && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
//           {error}
//         </p>
//       )}

//       {!loading && !error && (
//         <>
//           {evaluations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "#555" }}>
//               Aucune évaluation disponible.
//             </p>
//           ) : (
//             <ul style={{ maxWidth: 600, margin: "0 auto", paddingLeft: 0, listStyle: "none" }}>
//               {evaluations.map((evalItem) => (
//                 <li
//                   key={evalItem.id}
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     marginBottom: 10,
//                     padding: 12,
//                     borderRadius: 6,
//                     boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//                     fontSize: 16,
//                     fontWeight: "500",
//                     color: "#333",
//                     textAlign: "center",
//                   }}
//                 >
//                   ID: {evalItem.id}
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
// import { Link } from "react-router-dom";

// export default function DashboardAdmin() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // const token = localStorage.getItem("token"); // récupère le token depuis le localStorage
//     const token = sessionStorage.getItem('token');

//     if (!token) {
//       setError("Utilisateur non authentifié.");
//       setLoading(false);
//       return;
//     }

//     fetch("http://localhost:8080/api/evaluations", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`, // on envoie le token ici
//         "Content-Type": "application/json",
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
//     <div>
//       <h2>Tableau de bord Administrateur</h2>

//       <div style={{ marginBottom: "1rem" }}>
//         <Link to="/import-export">
//           <button>Gérer Import / Export des évaluations</button>
//         </Link>
//       </div>

//       <div style={{ marginBottom: "1rem" }}>
//       <Link to="/gest-evaluations">
//         <button>Gérer les évaluations</button>
//         </Link>
//       </div>

//       {loading && <p>Chargement des évaluations...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {!loading && !error && (
//         <ul>
//           {evaluations.map((evalItem) => (
//             <li key={evalItem.id}>
//               ID: {evalItem.id} - Note Contrôle: {evalItem.note_controle} - Note Examen: {evalItem.note_examen}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }















// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; // Ajouté pour la navigation

// export default function DashboardAdmin() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8080/api/evaluations")
//       .then(res => {
//         if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//         return res.json();
//       })
//       .then(data => {
//         setEvaluations(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Tableau de bord Administrateur</h2>

//       <div style={{ marginBottom: "1rem" }}>
//         {/* Lien vers la page d'import/export */}
//         <Link to="/import-export">
//           <button>Gérer Import / Export des évaluations</button>
//         </Link>
//       </div>

//       {loading && <p>Chargement des évaluations...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {!loading && !error && (
//         <ul>
//           {evaluations.map(evalItem => (
//             <li key={evalItem.id}>
//               ID: {evalItem.id} - Note Contrôle: {evalItem.note_controle} - Note Examen: {evalItem.note_examen}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";

// export default function DashboardAdmin() {
//   const [evaluations, setEvaluations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8080/api/evaluations")
//       .then(res => {
//         if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
//         return res.json();
//       })
//       .then(data => {
//         setEvaluations(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Tableau de bord Administrateur</h2>
//       {loading && <p>Chargement des évaluations...</p>}
//       {error && <p style={{color: "red"}}>{error}</p>}
//       {!loading && !error && (
//         <ul>
//           {evaluations.map(evalItem => (
//             <li key={evalItem.id}>
//               ID: {evalItem.id} - Note Contrôle: {evalItem.note_controle} - Note Examen: {evalItem.note_examen}
//             </li>
//           ))}
//         </ul>
//       )}
//       {/* Ajouter ici import/export, gestion inscriptions/utilisateurs */}
//     </div>
//   );
// }
