import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Lightbulb,
  Wifi,
  BatteryCharging,
  Users,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Globe,
  CheckCircle,
  Target,
  Zap,
  BookOpen,
  Coffee
} from 'lucide-react';

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const slogans = [
    "No Distractions. Just Determination.",
    "Build Your Future One Page at a Time.",
    "Strong Wi-Fi. Stronger Focus.",
    "Target 90+, Not 9 AM Crowds."
  ];

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterClick = () => {
    // Navigate to /register
    window.location.href = '/register';
  };

  const features = [
    { icon: <Lightbulb />, title: "Quiet Environment", desc: "Clean, distraction-free study space" },
    { icon: <Wifi />, title: "Free Wi-Fi", desc: "High-speed internet connectivity" },
    { icon: <BatteryCharging />, title: "Charging Points", desc: "Power up your devices anytime" },
    { icon: <Users />, title: "Individual & Group", desc: "Solo study or bring your gang" },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      color: '#1e293b',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: '#3b82f6',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              opacity: 0.6
            }}
          />
        ))}
      </div>


      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 12 }}>
        <Fade in={visible} timeout={1000}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: '70vh' }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label="✨ ABSOLUTELY FREE" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    mb: 2,
                    animation: 'pulse 2s ease-in-out infinite alternate',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                  }} 
                />
              </Box>
              
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                background: 'linear-gradient(45deg, #1e293b, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                lineHeight: 1.2
              }}>
                Attention Engineers!
              </Typography>
              
              <Typography variant="h4" sx={{ 
                mb: 3,
                color: '#ef4444',
                fontWeight: 600,
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}>
                OPEN STUDY DAYS @ TUMAKURU
              </Typography>

              <Typography variant="h6" sx={{ 
                mb: 4, 
                color: '#475569',
                lineHeight: 1.6,
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontWeight: 500
              }}>
                {slogans[currentSlogan]}
              </Typography>

              <Typography variant="body1" sx={{ 
                mb: 4, 
                color: '#64748b',
                lineHeight: 1.8,
                fontSize: '1.1rem'
              }}>
                Study in peace at our learning hub during exam season. 
                Perfect for internals, externals, and focused preparation sessions.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<CheckCircle />}
                  onClick={handleRegisterClick}
                  sx={{ 
                    background: 'linear-gradient(45deg, #10b981, #06d6a0)',
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                      background: 'linear-gradient(45deg, #059669, #05c29b)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Book Free Spot
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<Phone />}
                  sx={{ 
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderWidth: '2px',
                    '&:hover': {
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      transform: 'translateY(-2px)',
                      borderWidth: '2px',
                      background: 'rgba(59, 130, 246, 0.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  080-468-10558
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={visible} timeout={1200}>
                <Box sx={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Box sx={{
                    width: 300,
                    height: 300,
                    background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid rgba(59, 130, 246, 0.2)',
                    animation: 'float 3s ease-in-out infinite alternate',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                  }}>
                    <BookOpen size={120} color="#3b82f6" />
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>
                    <Lightbulb size={40} color="#f59e0b" />
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    animation: 'bounce 2s ease-in-out infinite 0.5s'
                  }}>
                    <Coffee size={35} color="#ef4444" />
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Fade>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h3" align="center" sx={{ 
            mb: 6,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3b82f6, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Why Choose Our Learning Hub?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={visible} timeout={1000 + index * 200}>
                  <Card sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ 
                        mb: 2,
                        color: '#3b82f6',
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {React.cloneElement(feature.icon, { size: 40 })}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        mb: 1,
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Location & Contact Section */}
        <Box sx={{ 
          py: 6,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08))',
          borderRadius: 4,
          mb: 6,
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)'
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ 
                mb: 3,
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                Visit Us Today!
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MapPin color="#ef4444" style={{ marginRight: 12 }} />
                <Typography variant="body1" sx={{ color: '#475569' }}>
                  OPQ TECH BOOTCAMP<br />
                  Landmark: Sri Venkateshwara Temple,<br />
                  Batawadi, Tumakuru
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Clock color="#ef4444" style={{ marginRight: 12 }} />
                <Typography variant="body1" sx={{ color: '#475569' }}>
                  6:00 AM – 8:00 PM daily
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone color="#ef4444" style={{ marginRight: 12 }} />
                <Typography variant="body1" sx={{ color: '#475569' }}>
                  080-468-10558
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ 
                  mb: 3,
                  color: '#ef4444',
                  fontWeight: 'bold'
                }}>
                  Limited Slots Available!
                </Typography>
                
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<Target />}
                  onClick={handleRegisterClick}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ef4444, #f97316)',
                    borderRadius: '30px',
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                    mb: 2,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
                      background: 'linear-gradient(45deg, #dc2626, #ea580c)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Register Now - It's FREE!
                </Button>
                
                <Typography variant="body2" sx={{ 
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  Valid until August 2025
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-20px); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;