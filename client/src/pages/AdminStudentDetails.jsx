import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Link,
  TableContainer,
  useTheme,
  alpha,
  Stack,
  TablePagination
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AccountTree as BranchIcon,
  CalendarToday as CalendarIcon,
  LinkedIn as LinkedInIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../api/axios';

const AdminStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const [profileRes, attendanceRes] = await Promise.all([
          instance.get(`/admin/student/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          instance.get(`/admin/student/${id}/attendance`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStudent(profileRes.data);
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error('Failed to load student details:', err);
        setError('Failed to load student details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, token]);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getSemesterColor = (semester) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    return colors[(semester - 1) % colors.length] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateAttendanceStats = () => {
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.in_time).length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays * 100).toFixed(1) : 0;
    
    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage
    };
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const getPaginatedAttendance = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return attendance.slice(startIndex, endIndex);
  };

  const stats = student ? calculateAttendanceStats() : { totalDays: 0, presentDays: 0, absentDays: 0, attendancePercentage: 0 };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading student details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/dashboard')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ mt: 4 }}>
            Student not found.
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/dashboard')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Tooltip title="Back to Dashboard">
              <IconButton 
                onClick={() => navigate('/admin/dashboard')}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box flex={1}>
              <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
                Student Profile
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Detailed information and attendance records
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Student Profile Card */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 120,
                    height: 120,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    bgcolor: theme.palette.primary.main,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  {getInitials(student.name)}
                </Avatar>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {student.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  ID: {student.id}
                </Typography>
                <Chip
                  label={`Semester ${student.semester}`}
                  color={getSemesterColor(student.semester)}
                  size="large"
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <Card elevation={3} sx={{ mt: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom color="primary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon />
                    Attendance Overview
                  </Box>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" py={2}>
                      <Typography variant="h3" fontWeight="bold" color="success.main">
                        {stats.attendancePercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attendance Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" py={2}>
                      <Typography variant="h3" fontWeight="bold" color="primary">
                        {stats.presentDays}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Present
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" py={1}>
                      <Typography variant="h5" fontWeight="600" color="info.main">
                        {stats.totalDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Days
                      </Typography>
                    </Box>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Box textAlign="center" py={1}>
                      <Typography variant="h5" fontWeight="600" color="error.main">
                        {stats.absentDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Days Absent
                      </Typography>
                    </Box>
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Information */}
          <Grid item xs={12} md={8}>
            {/* Personal Information */}
            <Paper elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Typography variant="h5" fontWeight="600" color="primary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon />
                    Personal Information
                  </Box>
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {[
                    { icon: <EmailIcon />, label: 'Email', value: student.email, color: 'primary' },
                    { icon: <PhoneIcon />, label: 'Phone', value: student.phone, color: 'success' },
                    { icon: <BusinessIcon />, label: 'College', value: student.college, color: 'info' },
                    { icon: <BranchIcon />, label: 'Branch', value: student.branch, color: 'secondary' },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box display="flex" alignItems="center" gap={2} p={2} 
                           sx={{ 
                             bgcolor: alpha(theme.palette[item.color].main, 0.05),
                             borderRadius: 2,
                             border: `1px solid ${alpha(theme.palette[item.color].main, 0.2)}`
                           }}>
                        <Box sx={{ color: `${item.color}.main` }}>
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {item.value || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Paper>

            {/* Professional Information */}
            <Paper elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                <Typography variant="h5" fontWeight="600" color="secondary">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CodeIcon />
                    Professional Information
                  </Box>
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinkedInIcon fontSize="small" />
                          LinkedIn Profile
                        </Box>
                      </Typography>
                      {student.linkedin ? (
                        <Link href={student.linkedin} target="_blank" rel="noopener" 
                              sx={{ textDecoration: 'none', fontWeight: 500 }}>
                          {student.linkedin}
                        </Link>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not provided
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CodeIcon fontSize="small" />
                          Skills
                        </Box>
                      </Typography>
                      <Typography variant="body1">
                        {student.skills || 'No skills listed'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Bio
                      </Typography>
                      <Typography variant="body1">
                        {student.bio || 'No bio provided'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>

            {/* Pass Information */}
            <Paper elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                <Typography variant="h5" fontWeight="600" color="info.main">
                  <Box display="flex" alignItems="center" gap={1}>
                    <BadgeIcon />
                    Entry Pass Information
                  </Box>
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} p={2} 
                         sx={{ 
                           bgcolor: alpha(theme.palette.success.main, 0.05),
                           borderRadius: 2,
                           border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                         }}>
                      <LoginIcon sx={{ color: 'success.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pass Start Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(student.entry_pass_start)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} p={2} 
                         sx={{ 
                           bgcolor: alpha(theme.palette.warning.main, 0.05),
                           borderRadius: 2,
                           border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                         }}>
                      <LogoutIcon sx={{ color: 'warning.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pass End Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(student.entry_pass_end)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>

        {/* Attendance History */}
        <Paper elevation={3} sx={{ borderRadius: 3, mt: 3 }}>
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="h5" fontWeight="600" color="primary">
              <Box display="flex" alignItems="center" gap={1}>
                <EventIcon />
                Attendance History ({attendance.length} records)
              </Box>
            </Typography>
          </Box>
          
          {attendance.length === 0 ? (
            <Box textAlign="center" py={6}>
              <ScheduleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No attendance records found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance records will appear here once the student starts checking in
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.grey[100], 0.8) }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DateRangeIcon fontSize="small" />
                          Date
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.grey[100], 0.8) }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LoginIcon fontSize="small" />
                          Check In
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.grey[100], 0.8) }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LogoutIcon fontSize="small" />
                          Check Out
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.grey[100], 0.8) }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTimeIcon fontSize="small" />
                          Duration
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.grey[100], 0.8) }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPaginatedAttendance().map((record, idx) => {
                      const hasCheckedIn = record.in_time;
                      const hasCheckedOut = record.out_time;
                      
                      return (
                        <TableRow 
                          key={idx}
                          hover
                          sx={{ 
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.04) 
                            }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(record.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={hasCheckedIn ? 'text.primary' : 'text.secondary'}>
                              {formatTime(record.in_time)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={hasCheckedOut ? 'text.primary' : 'text.secondary'}>
                              {formatTime(record.out_time)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {hasCheckedIn && hasCheckedOut ? 
                                (() => {
                                  const inTime = new Date(`2000-01-01T${record.in_time}`);
                                  const outTime = new Date(`2000-01-01T${record.out_time}`);
                                  const duration = Math.abs(outTime - inTime) / (1000 * 60 * 60);
                                  return `${duration.toFixed(1)}h`;
                                })() : '-'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={hasCheckedIn ? 'Present' : 'Absent'}
                              color={hasCheckedIn ? 'success' : 'error'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <TablePagination
                component="div"
                count={attendance.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
                  bgcolor: alpha(theme.palette.grey[50], 0.5)
                }}
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminStudentDetails;