import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Modal,
} from "@mui/material";
import {
  Lock as LockIcon,
  Mail as MailIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  width: 380,
};

export default function AccueilEtudiant() {
  // États connexion
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // États modal inscription
  const [openModal, setOpenModal] = useState(false);
  // Ajout du champ role avec valeur par défaut "ETUDIANT"
  const [signupData, setSignupData] = useState({ email: "", password: "", role: "ETUDIANT" });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupMessage, setSignupMessage] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email requis";
    else if (!validateEmail(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginChange = (e) => {
    setFormData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateLoginForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/utilisateurs/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, motDePasse: formData.password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        sessionStorage.setItem("role", decoded.role);
        sessionStorage.setItem("email", decoded.sub);
        setMessage("Connexion réussie !");
        redirectByRole(decoded.role);
      } else if (response.status === 401 || response.status === 404) {
        setMessage("Email ou mot de passe incorrect");
      } else {
        setMessage("Erreur lors de la connexion");
      }
    } catch (error) {
      setMessage("Erreur serveur, veuillez réessayer plus tard");
    }
  };

  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin/dashboard");
    else if (role === "PROFESSEUR") navigate("/enseignant/dashboard");
    else if (role === "ETUDIANT") navigate("/etudiant/dashboard");
    else navigate("/");
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!signupData.email) newErrors.email = "Email requis";
    else if (!validateEmail(signupData.email)) newErrors.email = "Email invalide";
    if (!signupData.password) newErrors.password = "Mot de passe requis";
    else if (signupData.password.length < 8)
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    if (!signupData.role) newErrors.role = "Le rôle est obligatoire";
    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage("");
    if (!validateSignupForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/utilisateurs/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          motDePasse: signupData.password,
          role: signupData.role,
        }),
      });

      if (response.status === 201) {
        window.alert("Inscription réussie !");
        setSignupData({ email: "", password: "", role: "ETUDIANT" }); // reset y compris role
        setOpenModal(false);
      } else if (response.status === 409) {
        setSignupMessage("Cet email est déjà utilisé");
      } else {
        setSignupMessage("Erreur lors de l'inscription");
      }
    } catch (error) {
      setSignupMessage("Erreur serveur, veuillez réessayer plus tard");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f3f6fd",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* Formulaire Connexion */}
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            bgcolor: "#ecebfc",
            borderRadius: "50%",
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <LockIcon sx={{ color: "#6c55f9", fontSize: 32 }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Connexion
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Accédez à votre compte
        </Typography>

        {message && (
          <Typography
            sx={{
              mb: 2,
              color: message.includes("réussie") ? "green" : "red",
              fontWeight: "medium",
            }}
          >
            {message}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: "100%" }} noValidate>
          <TextField
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleLoginChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleLoginChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "#6c55f9",
              ":hover": { bgcolor: "#573adf" },
              py: 1.8,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Se connecter
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" mt={4} textAlign="center">
          Vous n&apos;avez pas de compte ? <br />
          <Link
            component="button"
            underline="hover"
            sx={{ fontWeight: "bold", color: "#6c55f9" }}
            onClick={() => {
              setSignupMessage("");
              setSignupErrors({});
              setSignupData({ email: "", password: "", role: "ETUDIANT" });
              setOpenModal(true);
            }}
          >
            S&apos;inscrire
          </Link>
        </Typography>
      </Paper>

      {/* Modal Inscription */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={styleModal}>
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Inscription
          </Typography>

          {signupMessage && (
            <Typography
              sx={{
                mb: 2,
                color: signupMessage.includes("réussie") ? "green" : "red",
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {signupMessage}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSignupSubmit} noValidate>
            <TextField
              label="E-mail"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="email"
              required
              autoComplete="email"
              error={Boolean(signupErrors.email)}
              helperText={signupErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mot de passe"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              type={showSignupPassword ? "text" : "password"}
              autoComplete="new-password"
              error={Boolean(signupErrors.password)}
              helperText={signupErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="disabled" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowSignupPassword((v) => !v)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Champ sélection rôle */}
            <TextField
              select
              label="Rôle"
              name="role"
              value={signupData.role}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
              error={Boolean(signupErrors.role)}
              helperText={signupErrors.role}
            >
              <option value="ETUDIANT">Étudiant</option>
              <option value="PROFESSEUR">PROFESSEUR</option>
              <option value="ADMIN">Admin</option>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "#6c55f9",
                ":hover": { bgcolor: "#573adf" },
                py: 1.8,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              S&apos;inscrire
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}









// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";import {
//   Box,
//   Button,
//   Paper,
//   TextField,
//   Typography,
//   InputAdornment,
//   IconButton,
//   Link,
//   Modal,
// } from "@mui/material";
// import {
//   Lock as LockIcon,
//   Mail as MailIcon,
//   Visibility,
//   VisibilityOff,
// } from "@mui/icons-material";

// const styleModal = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 3,
//   width: 380,
// };

// export default function AccueilEtudiant() {
//   // États connexion
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // États modal inscription
//   const [openModal, setOpenModal] = useState(false);
//   const [signupData, setSignupData] = useState({ email: "", password: "" });
//   const [signupErrors, setSignupErrors] = useState({});
//   const [signupMessage, setSignupMessage] = useState("");
//   const [showSignupPassword, setShowSignupPassword] = useState(false);

//   const navigate = useNavigate();

//   // Validation email simple
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   // Validation form connexion
//   const validateLoginForm = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email requis";
//     else if (!validateEmail(formData.email)) newErrors.email = "Email invalide";
//     if (!formData.password) newErrors.password = "Mot de passe requis";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Gestion saisie login
//   const handleLoginChange = (e) => {
//     setFormData((f) => ({
//       ...f,
//       [e.target.name]: e.target.value,
//     }));
//   };


// // Soumission connexion via API
// const handleLoginSubmit = async (e) => {
//   e.preventDefault();
//   setMessage("");
//   if (!validateLoginForm()) return;

//   try {
//     const response = await fetch("http://localhost:8080/api/utilisateurs/connexion", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: formData.email, motDePasse: formData.password }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Données reçues du backend :", data);

//       // Stocker le token
//       sessionStorage.setItem("token", data.token);

//       // Déclarer token à partir de data.token pour le décodage
//       const token = data.token;

//       // Décoder le token
//       const decoded = jwtDecode(token);
//       console.log("Contenu du token décodé :", decoded);

//       // Stocker infos utiles
//       sessionStorage.setItem("role", decoded.role);
//       sessionStorage.setItem("email", decoded.sub);

//       setMessage("Connexion réussie !");

//       // Redirection selon rôle
//       redirectByRole(decoded.role);
//     } else if (response.status === 401 || response.status === 404) {
//       setMessage("Email ou mot de passe incorrect");
//     } else {
//       setMessage("Erreur lors de la connexion");
//     }
//   } catch (error) {
//     setMessage("Erreur serveur, veuillez réessayer plus tard");
//   }
// };

// const redirectByRole = (role) => {
//   if (role === "ADMIN") {
//     navigate("/admin/dashboard");
//   } else if (role === "ENSEIGNANT") {
//     navigate("/enseignant/dashboard");
//   } else if (role === "ETUDIANT") {
//     navigate("/etudiant/dashboard");
//   } else {
//     navigate("/"); // page d'accueil ou une autre page par défaut
//   }
// };


//   // Validation form inscription
//   const validateSignupForm = () => {
//     const newErrors = {};
//     if (!signupData.email) newErrors.email = "Email requis";
//     else if (!validateEmail(signupData.email)) newErrors.email = "Email invalide";
//     if (!signupData.password) newErrors.password = "Mot de passe requis";
//     else if (signupData.password.length < 8)
//       newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
//     setSignupErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Gestion saisie inscription
//   const handleSignupChange = (e) => {
//     setSignupData((f) => ({
//       ...f,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Soumission inscription via API
//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     setSignupMessage("");
//     if (!validateSignupForm()) return;

//     try {
//       const response = await fetch("http://localhost:8080/api/utilisateurs/inscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: signupData.email, motDePasse: signupData.password, role: "ETUDIANT" }),
//       });

//       if (response.status === 201) {
//         setSignupMessage("Inscription réussie !");
//         setSignupData({ email: "", password: "" });
//         setOpenModal(false);
//       } else if (response.status === 409) {
//         setSignupMessage("Cet email est déjà utilisé");
//       } else {
//         setSignupMessage("Erreur lors de l'inscription");
//       }
//     } catch (error) {
//       setSignupMessage("Erreur serveur, veuillez réessayer plus tard");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         bgcolor: "#f3f6fd",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 2,
//       }}
//     >
//       {/* Formulaire Connexion */}
//       <Paper
//         elevation={10}
//         sx={{
//           p: 4,
//           width: 380,
//           borderRadius: 4,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           bgcolor: "white",
//         }}
//       >
//         <Box
//           sx={{
//             bgcolor: "#ecebfc",
//             borderRadius: "50%",
//             width: 64,
//             height: 64,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             mb: 3,
//           }}
//         >
//           <LockIcon sx={{ color: "#6c55f9", fontSize: 32 }} />
//         </Box>

//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Connexion
//         </Typography>
//         <Typography variant="body1" color="text.secondary" mb={4}>
//           Accédez à votre compte
//         </Typography>

//         {message && (
//           <Typography
//             sx={{
//               mb: 2,
//               color: message.includes("réussie") ? "green" : "red",
//               fontWeight: "medium",
//             }}
//           >
//             {message}
//           </Typography>
//         )}

//         <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: "100%" }} noValidate>
//           <TextField
//             label="E-mail"
//             name="email"
//             value={formData.email}
//             onChange={handleLoginChange}
//             fullWidth
//             margin="normal"
//             variant="outlined"
//             type="email"
//             autoComplete="email"
//             error={Boolean(errors.email)}
//             helperText={errors.email}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <MailIcon color="disabled" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             label="Mot de passe"
//             name="password"
//             value={formData.password}
//             onChange={handleLoginChange}
//             fullWidth
//             margin="normal"
//             variant="outlined"
//             type={showPassword ? "text" : "password"}
//             autoComplete="current-password"
//             error={Boolean(errors.password)}
//             helperText={errors.password}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <LockIcon color="disabled" />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="toggle password visibility">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{
//               mt: 3,
//               bgcolor: "#6c55f9",
//               ":hover": { bgcolor: "#573adf" },
//               py: 1.8,
//               fontWeight: "bold",
//               fontSize: "1rem",
//             }}
//           >
//             Se connecter
//           </Button>
//         </Box>

//         <Typography variant="body2" color="text.secondary" mt={4} textAlign="center">
//           Vous n&apos;avez pas de compte ? <br />
//           <Link
//             component="button"
//             underline="hover"
//             sx={{ fontWeight: "bold", color: "#6c55f9" }}
//             onClick={() => {
//               setSignupMessage("");
//               setSignupErrors({});
//               setSignupData({ email: "", password: "" });
//               setOpenModal(true);
//             }}
//           >
//             S&apos;inscrire
//           </Link>
//         </Typography>
//       </Paper>

//       {/* Modal Inscription */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={styleModal}>
//           <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
//             Inscription
//           </Typography>

//           {signupMessage && (
//             <Typography
//               sx={{
//                 mb: 2,
//                 color: signupMessage.includes("réussie") ? "green" : "red",
//                 fontWeight: "medium",
//                 textAlign: "center",
//               }}
//             >
//               {signupMessage}
//             </Typography>
//           )}

//           <Box component="form" onSubmit={handleSignupSubmit} noValidate>
//             <TextField
//               label="E-mail"
//               name="email"
//               value={signupData.email}
//               onChange={handleSignupChange}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               type="email"
//               required
//               autoComplete="email"
//               error={Boolean(signupErrors.email)}
//               helperText={signupErrors.email}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <MailIcon color="disabled" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               label="Mot de passe"
//               name="password"
//               value={signupData.password}
//               onChange={handleSignupChange}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               required
//               type={showSignupPassword ? "text" : "password"}
//               autoComplete="new-password"
//               error={Boolean(signupErrors.password)}
//               helperText={signupErrors.password}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon color="disabled" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowSignupPassword((v) => !v)}
//                       edge="end"
//                       aria-label="toggle password visibility"
//                     >
//                       {showSignupPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               sx={{
//                 mt: 3,
//                 bgcolor: "#6c55f9",
//                 ":hover": { bgcolor: "#573adf" },
//                 py: 1.8,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//               }}
//             >
//               S&apos;inscrire
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }