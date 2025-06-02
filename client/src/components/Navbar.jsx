import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  School,
  Dashboard,
  Edit,
  Logout,
  Login,
  PersonAdd,
  Menu as MenuIcon,
  Person,
  Close
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/OPQ-TECH-black-logo.jpg.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');
  const studentName = localStorage.getItem('studentName') || 'Student';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    handleMenuClose();
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.includes(path);
  };

  const NavButton = ({ to, children, icon: Icon, onClick, color = 'inherit' }) => (
    <Button
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      startIcon={Icon && <Icon />}
      sx={{
        color: color,
        px: 2,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        position: 'relative',
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.1),
          transform: 'translateY(-1px)',
        },
        '&::after': to && isActiveRoute(to) ? {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 2,
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 1,
        } : {}
      }}
    >
      {children}
    </Button>
  );

  const ProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1.5,
          minWidth: 200,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          '& .MuiMenuItem-root': {
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box px={2} py={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {studentName}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
        <Dashboard sx={{ mr: 2 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to={`/edit-profile/${studentId}`}>
        <Edit sx={{ mr: 2 }} />
        Edit Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <Logout sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const MobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="OPQ Tech Logo" 
            onClick={() => {
              navigate(token ? "/dashboard" : "/");
              setMobileMenuOpen(false);
            }}
            style={{ 
              height: '40px', 
              width: 'auto', 
              marginRight: '8px',
              filter: 'brightness(0) invert(1)', // Makes logo white for dark background
              cursor: 'pointer'
            }} 
          />
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }} />
      
      <List sx={{ px: 2 }}>
        {token ? (
          <>
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  fontSize: '1.5rem'
                }}
              >
                {studentName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" fontWeight="bold">
                {studentName}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2), my: 1 }} />
            
            <ListItemButton
              component={Link}
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute('/dashboard') ? alpha(theme.palette.common.white, 0.2) : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            
            <ListItemButton
              component={Link}
              to={`/edit-profile/${studentId}`}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute('/edit-profile') ? alpha(theme.palette.common.white, 0.2) : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Edit />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
            
            <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2), my: 2 }} />
            
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: theme.palette.error.light,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.2)
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.light }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute('/login') ? alpha(theme.palette.common.white, 0.2) : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
            
            <ListItemButton
              component={Link}
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                borderRadius: 2,
                backgroundColor: isActiveRoute('/register') ? alpha(theme.palette.common.white, 0.2) : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Logo/Brand */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img 
              src={logo} 
              alt="OPQ Tech Logo" 
              onClick={() => navigate(token ? "/dashboard" : "/")}
              style={{ 
                height: isMobile ? '40px' : '48px', 
                width: 'auto', 
                marginRight: '12px',
                filter: 'brightness(0) invert(1)', // Makes logo white for dark background
                cursor: 'pointer'
              }} 
            />
            <Box>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    opacity: 0.8,
                    lineHeight: 1
                  }}
                >
                  Student Portal
                </Typography>
              )}
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box>
              {token ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <NavButton to="/dashboard" icon={Dashboard}>
                    Dashboard
                  </NavButton>
                  <NavButton to={`/edit-profile/${studentId}`} icon={Edit}>
                    Edit Profile
                  </NavButton>
                  
                  {/* Profile Avatar */}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      ml: 2,
                      p: 0.5,
                      border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                      '&:hover': {
                        borderColor: alpha(theme.palette.common.white, 0.6),
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {studentName.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1}>
                  <NavButton to="/login" icon={Login}>
                    Login
                  </NavButton>
                  <NavButton to="/register" icon={PersonAdd}>
                    Register
                  </NavButton>
                </Stack>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu for Desktop */}
      {!isMobile && ProfileMenu}
      
      {/* Mobile Drawer */}
      {isMobile && MobileDrawer}
    </>
  );
};

export default Navbar;