import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";

const getUserEmail = () => {
  return localStorage.getItem("userEmail") || "";
};

export default function Dashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const email = getUserEmail();
    if (!email) {
      setErrorMsg("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    fetch("https://api.uasz.sn/v1/evaluations")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des évaluations");
        }
        return res.json();
      })
      .then((data) => {
        const userEvals = data.content.filter(
          (e) => e.inscription.etudiant.email === email
        );
        setEvaluations(userEvals);
      })
      .catch((e) => {
        setErrorMsg(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{errorMsg}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord - Mes évaluations
      </Typography>

      {evaluations.length === 0 ? (
        <Typography>Aucune évaluation trouvée.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UE</TableCell>
                <TableCell>EC</TableCell>
                <TableCell>Note Contrôle</TableCell>
                <TableCell>Note Examen</TableCell>
                <TableCell>Note Finale</TableCell>
                <TableCell>Mention</TableCell>
                <TableCell>Commentaire</TableCell>
                <TableCell>Date de création</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>{ev.inscription.ec.ue.intitule}</TableCell>
                  <TableCell>{ev.inscription.ec.intitule}</TableCell>
                  <TableCell>{ev.note_controle}</TableCell>
                  <TableCell>{ev.note_examen}</TableCell>
                  <TableCell>{ev.note_finale}</TableCell>
                  <TableCell>{ev.mention}</TableCell>
                  <TableCell>{ev.commentaire || "-"}</TableCell>
                  <TableCell>{new Date(ev.date_creation).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
