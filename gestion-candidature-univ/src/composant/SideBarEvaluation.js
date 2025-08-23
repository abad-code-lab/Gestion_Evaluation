import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { href, Link, useLocation } from 'react-router-dom';
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
  PlusCircle,
  Edit2,
  Trash2,
  ListChecks,
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  FolderX,
  FileText,
  FilePlus,
  FileCheck,
  Users, // Utilisé pour Gestion des étudiants
  Calendar,
  Clock,
  Grid,
  Book,
  Layers3, // Utilisé pour Maquette
  ClipboardList,
  File,
  ClipboardCheck, // Utilisé pour Évaluations
  FileSearch,
  Radio,
  ListAlt,
  Circle,
  Table,
  Split,
  FolderCog,
  Search,
  ChevronRight,
  User, // Utilisé pour Profil utilisateur
  UsersRound,
  TrendingUp,
  RotateCcw,
  Calendar1Icon,
  User2Icon
} from 'lucide-react';
import { useUser } from './context/UserContext';
import { useSidebar } from './context/SidebarContext';

// Constants
const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 75;
const TRANSITION_DURATION = 200;

// Styled Components (pas de changement ici, les conserver tels quels)
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

// Menu data - MODIFIÉ
const MENU_DATA = {
  mainItems: [
    {
      id: 'evaluations',
      title: 'GESTION EVALUATION',
      icon: ClipboardCheck,
      color: '#10b981, #14b8a6',
      submenu: [
        {
          id: 'gest_eval',
          title: 'DashboardAdmin',
          href: '/admin/dashboard',
          icon: Users,
          color: '#ec4899, #f43f5e',
        },
        // {
        //   id: 'eval-modification',
        //   title: 'Modifier une évaluation',
        //   href: '/evaluations/modifier', // Changer le href si besoin pour une page de modification dédiée
        //   icon: Edit2
        // },
        // {
        //   id: 'eval-suppression',
        //   title: 'Supprimer une évaluation',
        //   href: '/evaluations/supprimer', // Changer le href si besoin pour une page de suppression dédiée
        //   icon: Trash2
        // },
        // {                                               
        //   id: 'eval-liste',
        //   title: 'Lister les évaluations',
        //   href: '/evaluations/liste',
        //   icon: ListChecks
        // }
      ]
    },
    // {
    //   id: 'etudiants', // Nouvelle section
    //   title: 'GESTION DES ÉTUDIANTS',
    //   icon: Users, // Icône pour les utilisateurs
    //   color: '#ec4899, #f43f5e', // Couleurs pour les étudiants
    //   submenu: [
    //     {
    //       id: 'etudiants-liste',
    //       title: 'Lister les étudiants',
    //       href: '/etudiants/liste',
    //       icon: User2Icon // Icône spécifique pour la liste des étudiants
    //     },
    //     {
    //       id: 'etudiants-import-csv',
    //       title: 'Importer (CSV)',
    //       href: '/etudiants/import-csv',
    //       icon: File // Icône pour l'import CSV
    //     },
    //     {
    //       id: 'etudiant-inscrit',
    //       title: 'Liste des inscrits',
    //       href: '/etudiants/etudiant-inscrit',
    //       icon: Users
    //     }
    //   ]
    // },
    // {
    //   id: 'maquette',
    //   title: 'MAQUETTE UE & EC',
    //   icon: Layers3, // Icône pour la maquette
    //   color: '#8b5cf6, #6366f1', // Couleurs pour la maquette
    //   submenu: [
    //     {
    //       id: 'ue',
    //       title: 'UE/EC',
    //       href: '/maquette/ue', // Exemple de chemin
    //       icon: BookOpen
    //     }
    //     // {
    //     //   id: 'ec',
    //     //   title: 'Éléments Constitutifs (EC)',
    //     //   href: '/maquette/ec', // Exemple de chemin
    //     //   icon: Book
    //     // }
    //   ]
    // },

    // {
    //   id: 'profil', // Nouvelle section
    //   title: 'MON PROFIL',
    //   icon: User, // Icône pour le profil utilisateur
    //   color: '#0891b2, #06b6d4', // Couleurs pour le profil
    //   submenu: [
    //     {
    //       id: 'profil-details',
    //       title: 'Login',
    //       href: '/profil/details',
    //       icon: User2Icon // Icône pour les détails du profil
    //     },
    //     {
    //       id: 'profil-settings',
    //       title: 'Paramètres',
    //       href: '/profil/parametres',
    //       icon: Settings // Icône pour les paramètres
    //     }
    //   ]
    // }
  ],
  singleItems: [],
  bottomItems: []
};

// Custom hooks (pas de changement ici, les conserver tels quels)
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

  useEffect(() => {
    if (typeof onStateChange === 'function') {
      const { isCollapsed, isHovered, isLocked } = state;
      onStateChange({ isCollapsed, isHovered, isLocked });
    }
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

const SideBarEvaluation = ({ onStateChange, isMobileOpen, toggleMobileDrawer }) => {
  const { user, logout } = useUser(); // Décommenté pour utiliser le contexte utilisateur

  const [state, updateState] = useSidebarState(onStateChange);
  const { isCollapsed, isLocked, isHovered, openSubmenu, activeItem } = state;
  const { isMobile } = useSidebar();
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
          item.href?.toLowerCase().includes(searchText) // Ajouter le contrôle 'href?' car tous les items n'ont pas forcément un href
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

  // Components (handlers et renderSidebarContent inchangés)
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
        <List sx={{ px: 1 }}>
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

      {/* Bottom section (peut inclure le bouton de déconnexion si tu en as un) */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
        {/* Exemple d'affichage du profil utilisateur connecté et bouton déconnexion */}
        {isExpanded && user && ( // Affiche le nom et prénom si l'utilisateur est connecté et la sidebar est étendue
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
              {user.prenom ? user.prenom.charAt(0) : ''}{user.nom ? user.nom.charAt(0) : ''}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user.prenom} {user.nom}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
        {isExpanded && user && ( // Bouton de déconnexion si l'utilisateur est connecté et la sidebar est étendue
          <List sx={{ px: 1, py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={logout} sx={{
                mx: 1.5,
                borderRadius: '12px',
                py: 1.5,
                px: 1.5,
                justifyContent: 'flex-start',
                bgcolor: 'rgba(239, 68, 68, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.3)',
                }
              }}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                  <User2Icon size={18} style={{ color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Déconnexion"
                  primaryTypographyProps={{
                    sx: {
                      color: '#ef4444',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Box>

    </>
  );

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
export default SideBarEvaluation;
