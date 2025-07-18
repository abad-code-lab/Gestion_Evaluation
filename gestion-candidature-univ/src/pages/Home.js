import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { getEvaluationsCount, getStudentsCount } from '../ServiceAPi/EvaluationService'; // Exemple d’appels API

const Home = () => {
  const [evaluationsCount, setEvaluationsCount] = useState(null);
  const [studentsCount, setStudentsCount] = useState(null);

  useEffect(() => {
    // Exemple : récupérer le nombre d’évaluations et d’étudiants via API
    getEvaluationsCount().then(count => setEvaluationsCount(count)).catch(() => setEvaluationsCount('N/A'));
    getStudentsCount().then(count => setStudentsCount(count)).catch(() => setStudentsCount('N/A'));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur l’application de gestion des évaluations - UASZ
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Utilisez le menu pour accéder aux différentes fonctionnalités : gestion des évaluations, des étudiants, des unités d’enseignement, etc.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Évaluations</Typography>
            <Typography variant="h3">{evaluationsCount !== null ? evaluationsCount : '...'}</Typography>
            <Button component={Link} to="/evaluations/liste" variant="contained" sx={{ mt: 2 }}>
              Voir les évaluations
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Étudiants</Typography>
            <Typography variant="h3">{studentsCount !== null ? studentsCount : '...'}</Typography>
            <Button component={Link} to="/etudiants/liste" variant="contained" sx={{ mt: 2 }}>
              Gérer les étudiants
            </Button>
          </Paper>
        </Grid>

        {/* Ajoute d’autres cartes si besoin */}
      </Grid>

      {/* Section actualités ou autres contenus */}
    </Box>
  );
};

export default Home;
