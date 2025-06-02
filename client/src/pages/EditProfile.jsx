import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
  Avatar,
  Divider,
  InputAdornment,
  Skeleton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person,
  Phone,
  School,
  AccountTree,
  Class,
  LinkedIn,
  Code,
  Description,
  CalendarToday,
  Save,
  Cancel,
  Edit
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../api/axios';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log("Error: ", error);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await instance.get(`/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Result: ", res);
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user starts editing
    if (success) setSuccess('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsLoading(true);

    const token = localStorage.getItem('token');

    // Convert ISO string to just YYYY-MM-DD
    const payload = {
      ...formData,
      entry_pass_start: formData.entry_pass_start?.split('T')[0] || null,
      entry_pass_end: formData.entry_pass_end?.split('T')[0] || null,
    };

    try {
      await instance.put(`/students/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully!');
      
      // Auto-navigate after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  // Loading skeleton
  if (!formData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box display="flex" alignItems="center" mb={4}>
              <Skeleton variant="circular" width={80} height={80} />
              <Box ml={3}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={150} height={24} />
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    );
  }

  const formFields = [
    { key: 'name', label: 'Full Name', icon: Person, xs: 12, sm: 6 },
    { key: 'phone', label: 'Phone Number', icon: Phone, xs: 12, sm: 6 },
    { key: 'college', label: 'College/University', icon: School, xs: 12, sm: 6 },
    { key: 'branch', label: 'Branch/Department', icon: AccountTree, xs: 12, sm: 6 },
    { key: 'semester', label: 'Current Semester', icon: Class, xs: 12, sm: 6, type: 'number' },
    { key: 'linkedin', label: 'LinkedIn Profile URL', icon: LinkedIn, xs: 12, sm: 6 },
    { key: 'skills', label: 'Skills (comma separated)', icon: Code, xs: 12 },
    { key: 'bio', label: 'Bio/About Yourself', icon: Description, xs: 12, multiline: true, rows: 4 },
    { key: 'entry_pass_start', label: 'Entry Pass Start Date', icon: CalendarToday, xs: 12, sm: 6, type: 'date' },
    { key: 'entry_pass_end', label: 'Entry Pass End Date', icon: CalendarToday, xs: 12, sm: 6, type: 'date' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              p: 4
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '2rem',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {formData.name?.charAt(0)?.toUpperCase() || 'S'}
              </Avatar>
              <Box ml={3}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Edit Profile
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Update your personal information and academic details
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Edit sx={{ fontSize: 40, opacity: 0.7 }} />
            </Box>
          </Box>

          {/* Form Content */}
          <Box p={4}>
            {/* Alerts */}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { fontSize: '1.2rem' }
                }}
              >
                {success}
              </Alert>
            )}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { fontSize: '1.2rem' }
                }}
              >
                {error}
              </Alert>
            )}

            {/* Current Skills Preview */}
            {formData.skills && (
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Skills:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.skills.split(',').map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.trim()}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {formFields.map(({ key, label, icon: Icon, xs = 12, sm = 6, type = 'text', multiline = false, rows = 1 }) => (
                  <Grid item xs={xs} sm={sm} key={key}>
                    <TextField
                      label={label}
                      name={key}
                      type={type}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      fullWidth
                      multiline={multiline}
                      rows={multiline ? rows : undefined}
                      disabled={isLoading}
                      InputLabelProps={type === 'date' ? { shrink: true } : {}}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Action Buttons */}
              <Box 
                display="flex" 
                justifyContent="space-between" 
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
              >
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  size="large"
                  startIcon={<Cancel />}
                  disabled={isLoading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    order: { xs: 2, sm: 1 }
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  disabled={isLoading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    order: { xs: 1, sm: 2 },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfile;