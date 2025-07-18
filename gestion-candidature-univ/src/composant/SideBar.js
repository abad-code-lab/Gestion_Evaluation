import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
  Avatar,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChevronLeft,
  Lock,
  LockOpen,
  Home,
  BookOpen,


  GraduationCap,
  Settings,
  Bell,
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  FolderX,
  FileText,
  FilePlus,
  FileCheck,
  Users,
  Calendar,
  Clock,
  Grid,

  Book,

  Layers3,
  ClipboardList,
  File,
  ClipboardCheck,
  FileSearch,
  Radio,
  Circle,
  Table,
  Split,
  Search,

  ChevronRight,
  User,
  UsersRound,
  TrendingUp,
  RotateCcw,
  Calendar1Icon,
  User2Icon
} from 'lucide-react';
import { useUser } from './context/UserContext';
import { useSidebar } from './context/SidebarContext';



// Constants
// const DRAWER_WIDTH = 280;
const DRAWER_WIDTH = 260;
// const DRAWER_WIDTH_COLLAPSED = 72;
const DRAWER_WIDTH_COLLAPSED = 75;
const TRANSITION_DURATION = 200;

// Styled Components
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'isExpanded'
})(({ theme, isExpanded }) => ({
  width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    border: 'none',
    borderRight: isExpanded
      ? '1px solid rgba(255,255,255,0.1)'
      : '2px solid rgba(59,130,246,0.3)',
    boxShadow: isExpanded
      ? '0 10px 25px rgba(0,0,0,0.3)'
      : '0 0 20px rgba(59,130,246,0.2)',
    transition: theme.transitions.create(['width', 'border', 'box-shadow'], {
      easing: theme.transitions.easing.easeOut,
      duration: TRANSITION_DURATION,
    }),
    overflow: 'hidden'
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => !['isActive', 'itemColor', 'isExpanded'].includes(prop)
})(({ theme, isActive, itemColor, isExpanded }) => ({
  margin: '8px 12px',
  borderRadius: isExpanded ? '12px' : '16px',
  padding: isExpanded ? '12px' : '16px 8px',
  justifyContent: isExpanded ? 'flex-start' : 'center',
  minHeight: 'auto',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  ...(isActive && {
    background: isExpanded
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(59,130,246,0.3)',
    boxShadow: isExpanded
      ? '0 4px 12px rgba(0,0,0,0.2)'
      : '0 4px 12px rgba(59,130,246,0.3)',
    transform: !isExpanded ? 'scale(1.05)' : 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(135deg, ${itemColor})`,
      opacity: 0.2,
      borderRadius: 'inherit'
    }
  }),
  '&:hover': {
    background: isExpanded
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(59,130,246,0.2)',
    transform: !isExpanded ? 'scale(1.1)' : 'none',
    boxShadow: !isExpanded ? '0 4px 12px rgba(59,130,246,0.2)' : 'none'
  }
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  display: 'block'
});

const StyledSubmenuButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})(({ isActive }) => ({
  borderRadius: '8px',
  py: 1,
  px: 2,
  mb: 0.5,
  background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
  boxShadow: isActive ? '0 2px 8px rgba(59,130,246,0.1)' : 'none',
  '&:hover': {
    background: isActive ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.1)'
  }
}));


const GradientAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => !['itemColor', 'avatarSize'].includes(prop)
})(({ itemColor, avatarSize = 'medium' }) => {
  const sizes = { large: 48, medium: 40, small: 32 };
  const size = sizes[avatarSize];

  return {
    background: `linear-gradient(135deg, ${itemColor})`,
    width: size,
    height: size,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  };
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(59,130,246,0.5)',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.6)',
      opacity: 1,
    },
  },
});

// Menu data
const MENU_DATA = {
  mainItems: [
    {
      id: 'dashboard',
      title: 'DASHBOARDS',
      icon: LayoutDashboard, // ✅
      badge: '3',
      color: '#3b82f6, #06b6d4',
      submenu: [
        {
          id: 'enseignements-dashboard',
          title: 'Enseignements',
          href: '/dashboard-modern-enseignements',
          icon: BookOpen
        },
        {
          id: 'evaluations-dashboard',
          title: 'Evaluations',
          href: '/dashboard-ecommerce-budget',
          icon: BarChart3,
          active: true
        },
        {
          id: 'candidatures-dashboard',
          title: 'Candidatures',
          href: '/dashboard-analytics-appelsOffres',
          icon: Users
        }
      ]
    },
    {
      id: 'evaluations',
      title: 'EVALUATIONS',
      icon: ClipboardCheck,
      color: '#10b981, #14b8a6',
      submenu: [
        {
          id: 'eval-etudiants',
          title: 'Evaluation des étudiants',
          href: '/evaluations/etudiants',
          icon: ClipboardList
        }
      ]
    },
    {
      id: 'enseignements',
      title: 'ENSEIGNEMENTS_',
      icon: Book,
      color: '#8b5cf6, #6366f1',
      submenu: [
        {
          id: 'evaluation-ens',
          title: 'Evaluation',
          href: '/enseignements/evaluation',
          icon: BarChart3
        },
        {
          id: 'maquette-ens',
          title: 'Maquette',
          href: '/maquette/maquette/Maquette',
          icon: Layers3
        },
        {
          id: 'declaration-heures',
          title: 'Déclaration des heures',
          href: '/enseignements/declaration-heures',
          icon: Clock
        },
        {
          id: 'deroulement',
          title: 'Déroulement',
          href: '/enseignements/deroulement',
          icon: Table
        },
        {
          id: 'emploi-temps',
          title: 'Emploi du temps',
          href: '/enseignements/emploi-temps',
          icon: Calendar
        },
        {
          id: 'repartition-ens',
          title: 'Répartition',
          href: '/enseignements/repartition',
          icon: Split
        }
      ]
    },
    {
      id: 'candidatures',
      title: 'CANDIDATURES',
      icon: FileText,
      color: '#f97316, #ef4444',
      submenu: [

        {
          id: 'resultats-prvisoires',
          title: 'Resultats provisoires',
          href: '/resultats-provisoires',
          icon: FileCheck
        },


        {
          id: 'listes-candidatures',
          title: 'Dossiers traités',
          href: '/liste-etudiant-retenu',
          icon: FileCheck
        },
        {
          id: 'traitement-candidatures',
          title: 'Traitement',
          href: '/traitement',
          icon: ClipboardCheck
        },



        {
          id: 'dossiers-en-attente',
          title: 'Dossiers en attente',
          href: '/dossier-etudiant-en-attente',
          icon: FolderOpen
        },

        {
          id: 'dossiers-etudiants',
          title: 'Dossiers incomplets',
          href: '/dossier-etudiant',
          icon: FolderOpen
        },
        {
          id: 'dossiers-refuses',
          title: 'Dossiers refusés',
          href: '/dossier-refuser',
          icon: FolderX
        },
        {
          id: 'appel-candidature',
          title: 'Appel à candidature',
          href: '/appel-candidature',
          icon: FilePlus
        }
      ]
    },
    {
      id: 'calendrier',
      title: 'CALENDRIER',
      icon: Calendar1Icon,
      color: '#0891b2, #06b6d4',
      // href: '/calendar',
      submenu: [
        { id: 'calendrier-perso',
          title: 'Mon Calendrier',
          icon: Calendar1Icon,
          color: '#0891b2, #06b6d4',
          href: '/calendar',}
        
      ]
    
    },
    {
      id: 'enseignements-main',
      title: 'ENSEIGNEMENTS',
      icon: BookOpen,
      color: '#059669, #0d9488',
      submenu: [
        {
          id: 'repartition',
          title: 'REPARTITION',
          href: '/maquette/maquette/Repartition',
          icon: Split
        },
        {
          id: 'maquette',
          title: 'MAQUETTE',
          href: '/maquette/maquette/Maquette',
          icon: Layers3
        },
        {
          id: 'ec',
          title: 'EC',
          href: '/maquette/ec/EC',
          icon: File
        },
        {
          id: 'ue',
          title: 'UE',
          href: '/maquette/ue/UE',
          icon: FileSearch
        }
      ]
    },

    {
      id: 'parametres',
      title: 'PARAMÈTRES',
      icon: Settings,
      color: '#4b5563, #9ca3af',
      submenu: [
        {
          id: 'groupes',
          title: 'GROUPES',
          href: '/maquette/groupe/Groupe',
          icon: UsersRound
        },
        {
          id: 'classes',
          title: 'CLASSES',
          href: '/maquette/classe/Classe',
          icon: GraduationCap
        },
        {
          id: 'formations',
          title: 'FORMATIONS',
          href: '/maquette/formation/Formation',
          icon: BookOpen
        },
        {
          id: 'semestres',
          title: 'SEMESTRES',
          href: '/maquette/semestre/Semestre',
          icon: Calendar
        },
        {
          id: 'niveaux',
          title: 'NIVEAUX',
          href: '/maquette/niveau/Niveau',
          icon: TrendingUp
        },
        {
          id: 'cycles',
          title: 'CYCLES',
          href: '/maquette/cycle/Cycle',
          icon: RotateCcw
        }
      ]
    },
    {
      id: 'utilisateurs',
      title: 'UTILISATEURS',
      icon: Users,
      color: '#0891b2,rgb(209, 196, 12)',
      submenu: [
        {
          id: 'enseignants',
          title: 'ENSEIGNANTS',
          href: '/enseignants',
          icon: User
        },
        {
          id: 'vacataires',
          title: 'VACATAIRES',
          href: '/vacataires',
          icon: User
        },
        {
          id: 'etudiants',
          title: 'ETUDIANTS',
          href: '/etudiants',
          icon: User
        }
      ]
    }



  ],
  singleItems: [
    // {
    //   id: 'etudiants',
    //   title: 'ETUDIANTS',
    //   icon: 'content_paste',
    //   color: '#ec4899, #f43f5e',
    //   href: 'page-etudiants.html'
    // },
    // {
    //   id: 'calendrier',
    //   title: 'CALENDRIER',
    //   icon: Calendar1Icon,
    //   color: '#0891b2, #06b6d4',
    //   href: '/calendar'
    // }
  ],
  bottomItems: [


    // {
    //   id: 'userC0nnected',
    //   // title: user ? `${user.prenom} ${user.nom}` : 'n0m',
    //   title: 'n0m',
    //   icon: User2Icon,
    //   color: '#0891b2, #06b6d4',
    //   href: '/calendar'
    // },
    // {
    //   id: 'calendrier',
    //   title: 'CALENDRIER',
    //   icon: Calendar1Icon,
    //   color: '#0891b2, #06b6d4',
    //   href: '/calendar'
    // }
    // {
    //   id: 'settings',
    //   title: 'Paramètres',
    //   icon: Settings, // ✅ C’est une fonction composant
    //   color: '#4b5563, #9ca3af',
    //   badge: 1
    // },
    // {
    //   id: 'radio',
    //   title: 'Radio',
    //   icon: Radio,
    //   href: '/etudiants',
    //   color: '#7c3aed, #6366f1',
    //   badge: 0
    // },
    // {
    //   id: 'autre',
    //   title: 'Autre',
    //   icon: Circle,
    //   color: '#10b981, #14b8a6',
    //   badge: 2
    // }
  ]


};





// Custom hooks
const useSidebarState = (onStateChange) => {
  const location = useLocation();
  const [state, setState] = useState({
    isCollapsed: false,
    isLocked: false,
    isMobileOpen: false,
    isHovered: false,
    openSubmenu: null,
    activeItem: 'DASHBOARDS'
  });

  // Fonction utilitaire pour retrouver l'item actif
  const getActiveMenuInfo = (path) => {
    for (const menu of MENU_DATA.mainItems) {
      const found = menu.submenu?.find(item => item.href === path);
      if (found) {
        return { activeItem: menu.id, openSubmenu: menu.id };
      }
    }

    const single = MENU_DATA.singleItems?.find(item => item.href === path);
    if (single) {
      return { activeItem: single.id, openSubmenu: null };
    }

    return { activeItem: null, openSubmenu: null };
  };

  // Détection automatique de l'élément actif
  useEffect(() => {
    const { activeItem, openSubmenu } = getActiveMenuInfo(location.pathname);
    setState(prev => ({ ...prev, activeItem, openSubmenu }));
  }, [location.pathname]);

  // Mise à jour externe via callback
  // useEffect(() => {
  //   if (onStateChange) {
  //     const { isCollapsed, isHovered, isLocked } = state;
  //     onStateChange({ isCollapsed, isHovered, isLocked });
  //   }
  // }, [state.isCollapsed, state.isHovered, state.isLocked, onStateChange]);





  useEffect(() => {
    if (typeof onStateChange === 'function') {
      const { isCollapsed, isHovered, isLocked } = state;
      onStateChange({ isCollapsed, isHovered, isLocked });
    }
    // ⛔ NE PAS inclure `onStateChange` dans les dépendances directement
    // ✅ inclure seulement les champs concrets
  }, [state.isCollapsed, state.isHovered, state.isLocked]);


  // Fonction pour mettre à jour le state manuellement
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState];
};


const MenuItem = React.memo(({ item, isActive, isExpanded, onClick }) => {
  const IconComponent = item.icon;

  const ButtonContent = (
    <StyledListItemButton
      isActive={isActive}
      itemColor={item.color}
      isExpanded={isExpanded}
      onClick={onClick}
    >
      <ListItemIcon sx={{ minWidth: 'auto', mr: isExpanded ? 2 : 0 }}>
        <GradientAvatar
          itemColor={item.color}
          avatarSize={isExpanded ? 'medium' : 'large'}
        >
          <IconComponent size={isExpanded ? 18 : 20} />
        </GradientAvatar>
      </ListItemIcon>
      {isExpanded && (
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            sx: {
              color: 'white',
              fontWeight: 500,
              fontSize: '0.95rem'
            }
          }}
        />
      )}
    </StyledListItemButton>
  );

  const content = item.href ? (
    <StyledLink to={item.href}>
      {ButtonContent}
    </StyledLink>
  ) : ButtonContent;

  return (
    <Tooltip
      title={!isExpanded ? item.title : ""}
      placement="right"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)'
          }
        }
      }}
    >
      <ListItem disablePadding>
        {content}
      </ListItem>
    </Tooltip>
  );
});

// const MenuItemWithSubmenu = React.memo(({ menu, isOpen, isActive, isExpanded, onToggle }) => {
//   const location = useLocation();
//   const IconComponent = menu.icon;

//   // Check if any submenu item is currently active
//   const hasActiveSubmenu = menu.submenu?.some(item => item.href === location.pathname);

//   return (
//     <>
//       <Tooltip
//         title={!isExpanded ? `${menu.title} (${menu.submenu.length} éléments)` : ""}
//         placement="right"
//         arrow
//         componentsProps={{
//           tooltip: {
//             sx: {
//               bgcolor: 'rgba(17, 24, 39, 0.95)',
//               color: 'white',
//               border: '1px solid rgba(59, 130, 246, 0.3)',
//               borderRadius: '8px',
//               backdropFilter: 'blur(4px)'
//             }
//           }
//         }}
//       >
//         <ListItem disablePadding>
//           <StyledListItemButton
//             isActive={isActive || isOpen || hasActiveSubmenu}
//             itemColor={menu.color}
//             isExpanded={isExpanded}
//             onClick={() => onToggle(menu.id)}
//           >
//             <ListItemIcon sx={{ minWidth: 'auto', mr: isExpanded ? 2 : 0 }}>
//               <Badge
//                 badgeContent={!isExpanded && menu.badge ? menu.badge : null}
//                 color="error"
//                 sx={{
//                   '& .MuiBadge-badge': {
//                     background: 'linear-gradient(135deg, #f97316, #ef4444)',
//                     boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
//                   }
//                 }}
//               >
//                 <GradientAvatar
//                   itemColor={menu.color}
//                   avatarSize={isExpanded ? 'medium' : 'large'}
//                 >
//                   <IconComponent size={isExpanded ? 18 : 20} />
//                 </GradientAvatar>
//               </Badge>
//             </ListItemIcon>

//             {isExpanded && (
//               <>
//                 <ListItemText
//                   primary={
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>
//                         {menu.title}
//                       </Typography>
//                       {menu.badge && (
//                         <Chip
//                           label={menu.badge}
//                           size="small"
//                           sx={{
//                             background: 'linear-gradient(135deg, #f97316, #ef4444)',
//                             color: 'white',
//                             height: '20px',
//                             fontSize: '0.75rem',
//                             fontWeight: 'bold'
//                           }}
//                         />
//                       )}
//                     </Box>
//                   }
//                 />
//                 <ChevronRight
//                   size={16}
//                   style={{
//                     color: 'rgba(255,255,255,0.6)',
//                     transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
//                     transition: 'transform 0.2s'
//                   }}
//                 />
//               </>
//             )}
//           </StyledListItemButton>
//         </ListItem>
//       </Tooltip>

//       <Collapse in={isOpen && isExpanded} timeout={TRANSITION_DURATION}>
//         <List sx={{ pl: 3, pr: 1 }}>
//           {menu.submenu?.map((item) => {
//             const isCurrentlyActive = item.href === location.pathname;

//             return (
//               <ListItem key={item.id} disablePadding>
//                 <StyledLink to={item.href}>
//                   <StyledSubmenuButton isActive={isCurrentlyActive}>
//                     <ListItemIcon sx={{ minWidth: '20px', mr: 1.5 }}>
//                       <Circle
//                         size={8}
//                         fill={isCurrentlyActive ? '#60a5fa' : '#6b7280'}
//                         color={isCurrentlyActive ? '#60a5fa' : '#6b7280'}
//                       />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={item.title}
//                       primaryTypographyProps={{
//                         sx: {
//                           color: isCurrentlyActive ? '#93c5fd' : '#d1d5db',
//                           fontSize: '0.875rem',
//                           fontWeight: isCurrentlyActive ? 500 : 400
//                         }
//                       }}
//                     />
//                   </StyledSubmenuButton>
//                 </StyledLink>
//               </ListItem>
//             );
//           })}
//         </List>
//       </Collapse>
//     </>
//   );
// });

const MenuItemWithSubmenu = React.memo(({ menu, isOpen, isActive, isExpanded, onToggle }) => {
  const location = useLocation();
  const IconComponent = menu.icon;

  // Check if any submenu item is currently active
  const hasActiveSubmenu = menu.submenu?.some(item => item.href === location.pathname);

  return (
    <>
      <Tooltip
        title={!isExpanded ? `${menu.title} (${menu.submenu.length} éléments)` : ""}
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(17, 24, 39, 0.95)',
              color: 'white',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              backdropFilter: 'blur(4px)'
            }
          }
        }}
      >
        <ListItem disablePadding>
          <StyledListItemButton
            isActive={isActive || isOpen || hasActiveSubmenu}
            itemColor={menu.color}
            isExpanded={isExpanded}
            onClick={() => onToggle(menu.id)}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: isExpanded ? 2 : 0 }}>
              <Badge
                badgeContent={!isExpanded && menu.badge ? menu.badge : null}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #f97316, #ef4444)',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                  }
                }}
              >
                <GradientAvatar
                  itemColor={menu.color}
                  avatarSize={isExpanded ? 'medium' : 'large'}
                >
                  <IconComponent size={isExpanded ? 18 : 20} />
                </GradientAvatar>
              </Badge>
            </ListItemIcon>

            {isExpanded && (
              <>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>
                        {menu.title}
                      </Typography>
                      {menu.badge && (
                        <Chip
                          label={menu.badge}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #f97316, #ef4444)',
                            color: 'white',
                            height: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <ChevronRight
                  size={16}
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </>
            )}
          </StyledListItemButton>
        </ListItem>
      </Tooltip>

      <Collapse in={isOpen && isExpanded} timeout={TRANSITION_DURATION}>
        <List sx={{ pl: 3, pr: 1 }}>
          {menu.submenu?.map((item) => {
            const isCurrentlyActive = item.href === location.pathname;
            // Récupérer le composant d'icône du sous-élément
            const SubmenuIconComponent = item.icon;

            return (
              <ListItem key={item.id} disablePadding>
                <StyledLink to={item.href}>
                  <StyledSubmenuButton isActive={isCurrentlyActive}>
                    <ListItemIcon sx={{ minWidth: '28px', mr: 1.5 }}>
                      {SubmenuIconComponent ? (
                        // Afficher l'icône du sous-élément si elle existe
                        <SubmenuIconComponent
                          size={16}
                          style={{
                            color: isCurrentlyActive ? '#60a5fa' : '#9ca3af'
                          }}
                        />
                      ) : (
                        // Fallback avec le cercle si pas d'icône
                        <Circle
                          size={8}
                          fill={isCurrentlyActive ? '#60a5fa' : '#6b7280'}
                          color={isCurrentlyActive ? '#60a5fa' : '#6b7280'}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        sx: {
                          color: isCurrentlyActive ? '#93c5fd' : '#d1d5db',
                          fontSize: '0.875rem',
                          fontWeight: isCurrentlyActive ? 500 : 400
                        }
                      }}
                    />
                  </StyledSubmenuButton>
                </StyledLink>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
});
const SideBar = ({ onStateChange, isMobileOpen, toggleMobileDrawer }) => {
  // const { user, logout } = useUser();

  const [state, updateState] = useSidebarState(onStateChange);
  const { isCollapsed, isLocked, isHovered, openSubmenu, activeItem } = state;
const {isMobile } = useSidebar();
  const isExpanded = !isCollapsed || isHovered;


  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };


  // Fonction de filtrage
  const filteredMenu = MENU_DATA.mainItems
    .map((menu) => {
      if (menu.submenu) {
        const filteredSubmenu = menu.submenu.filter((item) =>
          item.title.toLowerCase().includes(searchText) ||
          item.href.toLowerCase().includes(searchText)
        );
        if (
          filteredSubmenu.length > 0 ||
          menu.title.toLowerCase().includes(searchText)
        ) {
          return {
            ...menu,
            submenu: filteredSubmenu
          };
        }
        return null;
      } else if (
        menu.title.toLowerCase().includes(searchText)
      ) {
        return menu;
      }
      return null;
    })
    .filter(Boolean);

  // Components
  const handlers = useMemo(() => ({
    toggleCollapse: () => {
      if (!isLocked) {
        updateState({
          isCollapsed: !isCollapsed,
          openSubmenu: !isCollapsed ? null : openSubmenu
        });
      }
    },

    toggleLock: () => {
      updateState({ isLocked: !isLocked });
    },

    toggleSubmenu: (menuId) => {
      if (isCollapsed && !isHovered && !isLocked) {
        updateState({ isCollapsed: false });
        setTimeout(() => {
          updateState({ openSubmenu: openSubmenu === menuId ? null : menuId });
        }, 10);
      } else {
        updateState({ openSubmenu: openSubmenu === menuId ? null : menuId });
      }
    },

    setActiveItem: (itemId) => {
      updateState({ activeItem: itemId });
    },

    handleMouseEnter: () => {
      if (isCollapsed && !isLocked) {
        updateState({ isHovered: true });
      }
    },

    handleMouseLeave: () => {
      if (isCollapsed && !isLocked && isHovered) {
        updateState({ isHovered: false, openSubmenu: null });
      }
    }
  }), [isCollapsed, isLocked, isHovered, openSubmenu, updateState]);



  const renderSidebarContent = () => (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: isExpanded
            ? 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 80%)',
          transition: 'all 0.2s',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: isExpanded ? 2 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s' }}>
            {/* <GradientAvatar itemColor="#3b82f6, #8b5cf6" avatarSize="medium">
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>U</Typography>
            </GradientAvatar> */}
            <GradientAvatar itemColor="#3b82f6, #8b5cf6" avatarSize="large">
             <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo-uasz.jpeg`}
                alt="Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              </Link>
            </GradientAvatar>

            {isExpanded && (
              <Box sx={{ ml: 1.5 }}>
                <Link to="/">
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>
                  {/* Baobab */}
                  UASZ
                </Typography>

                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>

                  l'excellence ma référence

                </Typography>
                </Link>
              </Box>
            )}
          </Box>

          {!isExpanded && (
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <GradientAvatar itemColor="#3b82f6, #8b5cf6" avatarSize="large">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo-uasz.jpeg`}
                alt="Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              </GradientAvatar>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: !isExpanded ? 'column' : 'row', gap: 1 }}>
            <Tooltip title={isLocked ? "Déverrouiller" : "Verrouiller"} placement="top">
              <IconButton
                size="small"
                onClick={handlers.toggleLock}
                sx={{
                  color: isLocked ? '#10b981' : 'rgba(255,255,255,0.6)',
                  bgcolor: isLocked ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: isLocked ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.2)',
                    color: isLocked ? '#34d399' : 'white'
                  }
                }}
              >
                {isLocked ? <Lock size={16} /> : <LockOpen size={16} />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isCollapsed ? "Développer" : "Réduire"} placement="top">
              <IconButton
                size="small"
                onClick={handlers.toggleCollapse}
                disabled={isLocked}
                sx={{
                  color: isLocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: isCollapsed && !isHovered ? 'rotate(180deg)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isLocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    color: isLocked ? 'rgba(255,255,255,0.3)' : 'white'
                  },
                  '&:disabled': {
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                <ChevronLeft size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {isExpanded && (
          <StyledTextField
            size="small"
            fullWidth
            placeholder="Rechercher..."
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
            }}
          />
        )}

      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        {/* Menu items with submenus */}
        <List sx={{ px: 1 }}>
          {/* {MENU_DATA.mainItems?.map((menu) => ( */}
          {/* {filteredMenu.mainItems?.map((menu) => ( */}
          {filteredMenu?.map((menu) => (
            <MenuItemWithSubmenu
              key={menu.id}
              menu={menu}
              isOpen={openSubmenu === menu.id}
              isActive={activeItem === menu.id}
              isExpanded={isExpanded}
              onToggle={(menuId) => {
                handlers.toggleSubmenu(menuId);
                handlers.setActiveItem(menuId);
              }}
            />
          ))}
        </List>
        {/* Single items */}
        {MENU_DATA.singleItems && (
          <List sx={{ px: 1, mb: 4 }}>
            {MENU_DATA.singleItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                isExpanded={isExpanded}
                onClick={() => handlers.setActiveItem(item.id)}
              />
            ))}
          </List>
        )}

      </Box>

      {/* Bottom section */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
        <List sx={{ px: 1, py: 1 }}>
          {MENU_DATA.bottomItems?.map((item) => {
            {/* {filteredMenu.bottomItems?.map((item) => { */ }
            const IconComponent = item.icon;

            return (
              <Tooltip
                key={item.id}
                title={!isExpanded ? item.title : ""}
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(17, 24, 39, 0.95)',
                      color: 'white',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(4px)'
                    }
                  }
                }}
              >
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    sx={{
                      mx: 1.5,
                      borderRadius: isExpanded ? '12px' : '16px',
                      py: isExpanded ? 1.5 : 1.25,
                      px: isExpanded ? 1.5 : 1,
                      justifyContent: isExpanded ? 'flex-start' : 'center',
                      '&:hover': {
                        background: isExpanded
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(59,130,246,0.2)',
                        transform: !isExpanded ? 'scale(1.1)' : 'none'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto', mr: isExpanded ? 2 : 0 }}>
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                          }
                        }}
                      >
                        <GradientAvatar
                          itemColor={item.color}
                          avatarSize={isExpanded ? 'small' : 'medium'}
                        >
                          <IconComponent size={isExpanded ? 16 : 18} />
                        </GradientAvatar>
                      </Badge>
                    </ListItemIcon>

                    {isExpanded && (
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          sx: {
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

    </>
  );

  // (
  //   <Drawer
  //     variant="temporary"
  //     open={isMobileOpen}
  //     onClose={toggleMobileDrawer}
  //     ModalProps={{ keepMounted: true }}
  //     sx={{
  //       '& .MuiDrawer-paper': {
  //         width: isExpanded ? 250 : 65,
  //         background: '#111827',
  //         color: '#fff',
  //       }
  //     }}
  //   >
  //     {renderSidebarContent()}
  //   </Drawer>
  // ) : 

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={isMobileOpen}
      onClose={toggleMobileDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: isExpanded ? 250 : 65,
          background: '#111827',
          color: '#fff',
        },
      }}
    >
      {renderSidebarContent()}
    </Drawer>
  ) : (
    <StyledDrawer
      variant="permanent"
      isExpanded={isExpanded}
      onMouseEnter={handlers.handleMouseEnter}
      onMouseLeave={handlers.handleMouseLeave}
    >
      {renderSidebarContent()}
    </StyledDrawer>
  );
}  
export default SideBar;