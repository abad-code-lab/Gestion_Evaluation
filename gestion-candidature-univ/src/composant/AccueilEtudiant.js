import React from "react";
import { Box, Typography } from "@mui/material";

const AccueilEtudiant = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
        color: "#fff",
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 600, textAlign: "center", mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Bienvenue sur la plateforme de gestion des évaluations UASZ
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cette application vous permet de :
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          • Gérer les inscriptions et les évaluations des étudiants <br />
          • Consulter vos résultats et suivre votre progression <br />
          • Accéder à des outils modernes pour simplifier la gestion universitaire
        </Typography>
      </Box>
    </Box>
  );
};

export default AccueilEtudiant;
