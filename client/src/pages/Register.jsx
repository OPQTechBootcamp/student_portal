import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from "../api/axios"
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Card,
  CardContent,
  Fade,
  Grow,
  Link
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  School,
  Code,
  LinkedIn,
  Lock,
  Visibility,
  VisibilityOff,
  CalendarToday,
  CheckCircle,
  Error as ErrorIcon,
  LoginOutlined
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
  color: 'white',
  padding: theme.spacing(6),
  textAlign: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0 0%, #8e24aa 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    semester: '',
    linkedin: '',
    skills: '',
    bio: '',
    password: '',
    confirmPassword: '',
    entry_pass_start: '',
    entry_pass_end: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skillTags, setSkillTags] = useState([]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : '';
      case 'phone':
        return !/^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Please enter a valid 10-digit phone number' : '';
      case 'college':
        return value.length < 3 ? 'College name must be at least 3 characters' : '';
      case 'branch':
        return value.length < 2 ? 'Branch must be at least 2 characters' : '';
      case 'semester':
        return !/^[1-8]$/.test(value) ? 'Semester must be between 1 and 8' : '';
      case 'linkedin':
        return value && !/^https:\/\/(www\.)?linkedin\.com\//.test(value) ? 'Please enter a valid LinkedIn URL' : '';
      case 'password':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'bio':
        return value.length > 500 ? 'Bio must be less than 500 characters' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Real-time validation
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle skills as tags
    if (name === 'skills') {
      const tags = value.split(',').map(skill => skill.trim()).filter(skill => skill);
      setSkillTags(tags);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Make ALL fields mandatory except confirmPassword (which is handled separately)
    const requiredFields = ['name', 'email', 'phone', 'college', 'branch', 'semester', 'linkedin', 'skills', 'bio', 'password', 'confirmPassword', 'entry_pass_start', 'entry_pass_end'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        let fieldName = field;
        if (field === 'confirmPassword') fieldName = 'Confirm Password';
        else if (field === 'entry_pass_start') fieldName = 'Entry Pass Start Date';
        else if (field === 'entry_pass_end') fieldName = 'Entry Pass End Date';
        else fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        
        newErrors[field] = `${fieldName} is required`;
      } else {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Prepare form data for API (exclude confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await instance.post('/students/register', registrationData);
      
      console.log('Registration successful:', response.data);
      
      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '', college: '', branch: '', 
        semester: '', linkedin: '', skills: '', bio: '', password: '', 
        confirmPassword: '', entry_pass_start: '', entry_pass_end: ''
      });
      setSkillTags([]);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors with better user experience
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        
        // Handle specific error cases
        if (errorMessage === 'Email already exists') {
          setErrors({ 
            email: 'This email is already registered. Please use a different email or try logging in.',
            submit: 'An account with this email already exists. Please use a different email address.'
          });
          return; // Don't set generic submit error
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Server is not responding. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ 
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { key: 'name', label: 'Full Name', icon: Person, required: true, width: 6, placeholder: 'Enter your full name' },
    { key: 'email', label: 'Email Address', icon: Email, required: true, width: 6, type: 'email', placeholder: 'your.email@example.com' },
    { key: 'phone', label: 'Phone Number', icon: Phone, required: true, width: 6, placeholder: '1234567890' },
    { key: 'college', label: 'College/University', icon: School, required: true, width: 6, placeholder: 'Your college name' },
    { key: 'branch', label: 'Branch/Department', icon: Code, required: true, width: 6, placeholder: 'e.g., Computer Science' },
    { key: 'semester', label: 'Current Semester', required: true, width: 6, placeholder: '1-8' },
    { key: 'entry_pass_start', label: 'Entry Pass Start Date', type: 'date', icon: CalendarToday, width: 6, required: true },
    { key: 'entry_pass_end', label: 'Entry Pass End Date', type: 'date', icon: CalendarToday, width: 6, required: true },
    { key: 'linkedin', label: 'LinkedIn Profile URL', icon: LinkedIn, width: 12, placeholder: 'https://linkedin.com/in/yourprofile', required: true },
    { key: 'skills', label: 'Skills', width: 12, placeholder: 'React, Node.js, Python, Machine Learning (comma separated)', required: true },
    { key: 'bio', label: 'Tell us about yourself', multiline: true, rows: 4, width: 12, placeholder: 'Share your interests, goals, and what makes you unique...', required: true },
  ];

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Grow in={success} timeout={1000}>
          <Card sx={{ maxWidth: 500, textAlign: 'center', borderRadius: 3, boxShadow: 6 }}>
            <CardContent sx={{ p: 6 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'success.main',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircle sx={{ fontSize: 48 }} />
              </Avatar>
              <Typography variant="h3" gutterBottom fontWeight="bold" color="success.main">
                Registration Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to our platform! You will receive a confirmation email shortly.
              </Typography>
              <StyledButton
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ mt: 3 }}
                startIcon={<LoginOutlined />}
              >
                Go to Login
              </StyledButton>
            </CardContent>
          </Card>
        </Grow>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <StyledPaper>
            <GradientBox>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'white',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Person sx={{ fontSize: 32, color: 'primary.main' }} />
              </Avatar>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Student Registration
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Join our platform and unlock amazing opportunities
              </Typography>
            </GradientBox>

            <Box p={4}>
              {/* Login Link */}
              <Box textAlign="center" mb={3}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={() => navigate('/login')}
                    sx={{ 
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
              {(errors.submit || errors.email) && (
                <Fade in>
                  <Alert 
                    severity="error" 
                    icon={<ErrorIcon />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    {errors.submit || errors.email}
                    {errors.email && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <Link 
                            component="button" 
                            variant="body2" 
                            onClick={() => navigate('/login')}
                            sx={{ 
                              fontWeight: 'bold',
                              textDecoration: 'underline',
                              color: 'inherit'
                            }}
                          >
                            Click here to login instead
                          </Link>
                        </Typography>
                      </Box>
                    )}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {formFields.map(({ key, label, icon: Icon, required, type = 'text', multiline, rows, width, placeholder }) => (
                    <Grid item xs={12} md={width} key={key}>
                      <StyledTextField
                        label={label}
                        name={key}
                        type={type}
                        value={formData[key]}
                        onChange={handleChange}
                        fullWidth
                        required={required}
                        multiline={multiline}
                        rows={rows}
                        placeholder={placeholder}
                        error={!!errors[key]}
                        helperText={
                          errors[key] || 
                          (key === 'bio' ? `${formData[key].length}/500 characters` : '')
                        }
                        InputLabelProps={type === 'date' ? { shrink: true } : {}}
                        InputProps={{
                          startAdornment: Icon && (
                            <InputAdornment position="start">
                              <Icon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      required
                      placeholder="Create a secure password"
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      required
                      placeholder="Confirm your password"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {skillTags.length > 0 && (
                    <Grid item xs={12}>
                      <Fade in>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Skills Preview:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {skillTags.map((skill, index) => (
                              <Grow in key={index} timeout={300 + index * 100}>
                                <Chip 
                                  label={skill} 
                                  variant="outlined" 
                                  color="primary"
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      transition: 'transform 0.2s',
                                    },
                                  }}
                                />
                              </Grow>
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box textAlign="center">
                      <StyledButton
                        type="submit"
                        size="large"
                        disabled={loading}
                        sx={{ minWidth: 250 }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                            Registering...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </StyledButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;