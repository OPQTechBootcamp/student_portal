import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
  Skeleton,
  Fade,
  Divider,
  Stack,
} from "@mui/material";
import {
  Person,
  Edit,
  School,
  Email,
  Phone,
  AccountTree,
  Class,
  CardMembership,
  AccessTime,
  Login,
  Logout,
  CheckCircle,
  Schedule,
  Today,
  Code,
  Timeline,
} from "@mui/icons-material";
import instance from "../api/axios";
import { useNavigate } from "react-router-dom";
import AttendanceHistory from "../components/AttendanceHistory";

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await instance.get(`/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await instance.get(`/attendance/today/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await instance.get(`/attendance/history/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAttendance = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = type === "in" ? "mark-in" : "mark-out";
      await instance.post(
        `/attendance/${endpoint}`,
        { studentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchTodayAttendance(); // refresh state after marking
    } catch (err) {
      alert(err.response?.data?.message || "Error marking attendance");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchProfile(),
        fetchTodayAttendance(),
        fetchHistory(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("T") || timeString.includes(" ")) {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      const [hours, minutes, seconds] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAttendanceStatus = () => {
    if (attendance.in_time && attendance.out_time) {
      return { status: "Complete", color: "success", icon: CheckCircle };
    } else if (attendance.in_time) {
      return { status: "Checked In", color: "primary", icon: Schedule };
    } else {
      return { status: "Not Started", color: "warning", icon: Today };
    }
  };

  const attendanceStatusInfo = getAttendanceStatus();
  const AttendanceIcon = attendanceStatusInfo.icon;

  // Calculate stats from history data (you can enhance this based on your actual data structure)
  const stats = {
    presentDays: history.filter((record) => record.in_time).length,
    totalDays: history.length || 100, // fallback to 100 if no history
    averageHours: 7.5, // calculate this based on your actual data
    streak: 12, // calculate consecutive attendance days
  };
  const attendancePercentage =
    stats.totalDays > 0 ? (stats.presentDays / stats.totalDays) * 100 : 0;

  if (isLoading || !student) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main}08 0%, 
            ${theme.palette.secondary.main}08 50%,
            ${theme.palette.success.main}08 100%)`,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.grey[50]} 0%, 
          ${theme.palette.grey[100]} 35%,
          rgba(255, 255, 255, 0.8) 70%,
          ${theme.palette.grey[50]} 100%)`,
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {showHistory ? (
          <Fade in timeout={500}>
            <Box>
              <Box display="flex" alignItems="center" mb={4}>
                <Button
                  variant="outlined"
                  startIcon={<Timeline />}
                  onClick={() => setShowHistory(false)}
                  sx={{
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
              <AttendanceHistory history={history} />
            </Box>
          </Fade>
        ) : (
          <>
            {/* Enhanced Header Section */}
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`,
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        fontSize: "2rem",
                        mr: 3,
                        boxShadow: `0 8px 32px ${alpha(
                          theme.palette.primary.main,
                          0.3
                        )}`,
                        border: `3px solid rgba(255, 255, 255, 0.8)`,
                        fontWeight: "bold",
                      }}
                    >
                      {student.name?.charAt(0)?.toUpperCase() || "S"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 1,
                        }}
                      >
                        Welcome back, {student.name?.split(" ")[0] || "Student"}
                        ! 👋
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          icon={<School />}
                          label={student.college}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<Class />}
                          label={`Semester ${student.semester}`}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Fade>

            <Grid container spacing={3}>
              {/* Enhanced Profile Card */}
              <Grid item xs={12} lg={6}>
                <Fade in timeout={1200}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 20px 60px ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Person
                          sx={{
                            color: theme.palette.primary.main,
                            mr: 2,
                            fontSize: 28,
                          }}
                        />
                        <Typography variant="h5" fontWeight="bold">
                          Profile Information
                        </Typography>
                      </Box>

                      <Stack spacing={3}>
                        <Box>
                          <Box display="flex" alignItems="center" mb={1.5}>
                            <Email
                              sx={{
                                color: "text.secondary",
                                mr: 1.5,
                                fontSize: 20,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              Email Address
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{ ml: 4 }}
                          >
                            {student.email}
                          </Typography>
                        </Box>

                        <Divider />

                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" mb={1.5}>
                              <School
                                sx={{
                                  color: "text.secondary",
                                  mr: 1.5,
                                  fontSize: 20,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="500"
                              >
                                College
                              </Typography>
                            </Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ ml: 4 }}
                            >
                              {student.college || "Not specified"}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" mb={1.5}>
                              <AccountTree
                                sx={{
                                  color: "text.secondary",
                                  mr: 1.5,
                                  fontSize: 20,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="500"
                              >
                                Branch
                              </Typography>
                            </Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ ml: 4 }}
                            >
                              {student.branch || "Not specified"}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" mb={1.5}>
                              <Class
                                sx={{
                                  color: "text.secondary",
                                  mr: 1.5,
                                  fontSize: 20,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="500"
                              >
                                Semester
                              </Typography>
                            </Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ ml: 4 }}
                            >
                              {student.semester || "Not specified"}
                            </Typography>
                          </Grid>

                          {student.phone && (
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" mb={1.5}>
                                <Phone
                                  sx={{
                                    color: "text.secondary",
                                    mr: 1.5,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight="500"
                                >
                                  Phone
                                </Typography>
                              </Box>
                              <Typography
                                variant="body1"
                                fontWeight="600"
                                sx={{ ml: 4 }}
                              >
                                {student.phone}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>

                        {student.skills && (
                          <>
                            <Divider />
                            <Box>
                              <Box display="flex" alignItems="center" mb={2}>
                                <Code
                                  sx={{
                                    color: "text.secondary",
                                    mr: 1.5,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight="500"
                                >
                                  Technical Skills
                                </Typography>
                              </Box>
                              <Box
                                display="flex"
                                flexWrap="wrap"
                                gap={1}
                                sx={{ ml: 4 }}
                              >
                                {student.skills
                                  .split(",")
                                  .slice(0, 6)
                                  .map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill.trim()}
                                      size="small"
                                      sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                                        border: `1px solid ${alpha(
                                          theme.palette.primary.main,
                                          0.3
                                        )}`,
                                        fontWeight: 500,
                                        "&:hover": {
                                          transform: "scale(1.05)",
                                          boxShadow: `0 4px 12px ${alpha(
                                            theme.palette.primary.main,
                                            0.3
                                          )}`,
                                        },
                                      }}
                                    />
                                  ))}
                                {student.skills.split(",").length > 6 && (
                                  <Chip
                                    label={`+${
                                      student.skills.split(",").length - 6
                                    } more`}
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </CardContent>

                    <CardActions sx={{ px: 4, pb: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/edit-profile/${student.id}`)}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: `0 8px 25px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                          fontWeight: "bold",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 12px 35px ${alpha(
                              theme.palette.primary.main,
                              0.4
                            )}`,
                          },
                        }}
                      >
                        Edit Profile
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>

              {/* Enhanced Entry Pass Card */}
              <Grid item xs={12} lg={6}>
                <Fade in timeout={1400}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(
                        theme.palette.secondary.main,
                        0.1
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 20px 60px ${alpha(
                          theme.palette.secondary.main,
                          0.15
                        )}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <CardMembership
                          sx={{
                            color: theme.palette.secondary.main,
                            mr: 2,
                            fontSize: 28,
                          }}
                        />
                        <Typography variant="h5" fontWeight="bold">
                          Entry Pass
                        </Typography>
                      </Box>

                      {student.entry_pass_start && student.entry_pass_end ? (
                        <Box>
                          <Paper
                            sx={{
                              p: 3,
                              background: `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.main}15)`,
                              border: `2px solid ${alpha(
                                theme.palette.success.main,
                                0.2
                              )}`,
                              borderRadius: 3,
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "3px",
                                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                              },
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                              fontWeight="500"
                            >
                              📅 Valid Period
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="success.main"
                              sx={{ mb: 2 }}
                            >
                              {formatDate(student.entry_pass_start)} -{" "}
                              {formatDate(student.entry_pass_end)}
                            </Typography>

                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Box display="flex" alignItems="center">
                                <CheckCircle
                                  sx={{
                                    color: "success.main",
                                    mr: 1,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                  fontWeight="600"
                                >
                                  Entry pass is active ✨
                                </Typography>
                              </Box>
                              <Chip
                                label="ACTIVE"
                                color="success"
                                size="small"
                                sx={{ fontWeight: "bold" }}
                              />
                            </Box>
                          </Paper>
                        </Box>
                      ) : (
                        <Box
                          textAlign="center"
                          py={6}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.warning.dark}15)`,
                            borderRadius: 3,
                            border: `2px dashed ${alpha(
                              theme.palette.warning.main,
                              0.3
                            )}`,
                          }}
                        >
                          <CardMembership
                            sx={{
                              fontSize: 64,
                              color: "warning.main",
                              mb: 2,
                              opacity: 0.7,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="warning.main"
                            fontWeight="600"
                            gutterBottom
                          >
                            Entry pass not yet generated
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                          >
                            Contact administration for pass generation
                          </Typography>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            Request Pass
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Enhanced Attendance Card */}
              <Grid item xs={12}>
                <Fade in timeout={1600}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(
                        theme.palette.info.main,
                        0.1
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 20px 60px ${alpha(
                          theme.palette.info.main,
                          0.15
                        )}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={4}
                        flexWrap="wrap"
                        gap={2}
                      >
                        <Box display="flex" alignItems="center">
                          <AccessTime
                            sx={{
                              color: theme.palette.info.main,
                              mr: 2,
                              fontSize: 28,
                            }}
                          />
                          <Typography variant="h5" fontWeight="bold">
                            Today's Attendance
                          </Typography>
                        </Box>
                        <Chip
                          icon={<AttendanceIcon />}
                          label={attendanceStatusInfo.status}
                          color={attendanceStatusInfo.color}
                          size="large"
                          sx={{
                            fontWeight: "bold",
                            px: 2,
                            py: 1,
                            "& .MuiChip-icon": { fontSize: 20 },
                          }}
                        />
                      </Box>

                      <Grid container spacing={4}>
                        {/* Attendance Actions */}
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              gutterBottom
                              fontWeight="600"
                            >
                              🎯 Mark Attendance
                            </Typography>
                            <Stack spacing={2} mt={3}>
                              <Button
                                variant="contained"
                                size="large"
                                startIcon={<Login />}
                                onClick={() => markAttendance("in")}
                                disabled={!!attendance.in_time}
                                sx={{
                                  py: 2,
                                  borderRadius: 3,
                                  background: attendance.in_time
                                    ? "rgba(0,0,0,0.12)"
                                    : `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                  fontSize: "1.1rem",
                                  fontWeight: "bold",
                                  boxShadow: attendance.in_time
                                    ? "none"
                                    : `0 8px 25px ${alpha(
                                        theme.palette.success.main,
                                        0.4
                                      )}`,
                                  "&:hover": !attendance.in_time
                                    ? {
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 12px 35px ${alpha(
                                          theme.palette.success.main,
                                          0.5
                                        )}`,
                                      }
                                    : {},
                                  "&:disabled": {
                                    color: "rgba(0,0,0,0.26)",
                                  },
                                }}
                              >
                                {attendance.in_time
                                  ? "✅ Checked In"
                                  : "🚪 Mark Entry"}
                              </Button>

                              <Button
                                variant="outlined"
                                size="large"
                                startIcon={<Logout />}
                                onClick={() => markAttendance("out")}
                                disabled={
                                  !attendance.in_time || !!attendance.out_time
                                }
                                sx={{
                                  py: 2,
                                  borderRadius: 3,
                                  borderWidth: 2,
                                  borderColor: attendance.out_time
                                    ? "rgba(0,0,0,0.12)"
                                    : theme.palette.error.main,
                                  color: attendance.out_time
                                    ? "rgba(0,0,0,0.26)"
                                    : theme.palette.error.main,
                                  fontSize: "1.1rem",
                                  fontWeight: "bold",
                                  "&:hover":
                                    !attendance.out_time && attendance.in_time
                                      ? {
                                          transform: "translateY(-2px)",
                                          borderColor: theme.palette.error.dark,
                                          backgroundColor: alpha(
                                            theme.palette.error.main,
                                            0.1
                                          ),
                                          borderWidth: 2,
                                        }
                                      : {},
                                  "&:disabled": {
                                    borderColor: "rgba(0,0,0,0.12)",
                                    color: "rgba(0,0,0,0.26)",
                                  },
                                }}
                              >
                                {attendance.out_time
                                  ? "✅ Checked Out"
                                  : "🚪 Mark Exit"}
                              </Button>
                            </Stack>

                            {!attendance.in_time && (
                              <Box
                                mt={3}
                                p={2}
                                sx={{
                                  background: alpha(
                                    theme.palette.warning.main,
                                    0.08
                                  ),
                                  borderRadius: 2,
                                  border: `1px dashed ${alpha(
                                    theme.palette.warning.main,
                                    0.3
                                  )}`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="warning.main"
                                  fontWeight="500"
                                >
                                  ⚠️ Don't forget to mark your entry when you
                                  arrive!
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Grid>

                        {/* Attendance Times */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                            fontWeight="600"
                          >
                            ⏰ Time Log
                          </Typography>
                          <Stack spacing={2} mt={3}>
                            {attendance.in_time ? (
                              <Paper
                                sx={{
                                  p: 3,
                                  background: `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.main}15)`,
                                  border: `2px solid ${alpha(
                                    theme.palette.success.main,
                                    0.2
                                  )}`,
                                  borderRadius: 3,
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "4px",
                                    height: "100%",
                                    background: theme.palette.success.main,
                                  },
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      fontWeight="500"
                                    >
                                      🟢 Entry Time
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      color="success.main"
                                    >
                                      {formatTime(attendance.in_time)}
                                    </Typography>
                                  </Box>
                                  <Login
                                    sx={{
                                      color: "success.main",
                                      fontSize: 28,
                                      opacity: 0.7,
                                    }}
                                  />
                                </Box>
                              </Paper>
                            ) : null}

                            {attendance.out_time ? (
                              <Paper
                                sx={{
                                  p: 3,
                                  background: `linear-gradient(135deg, ${theme.palette.error.main}08, ${theme.palette.error.main}15)`,
                                  border: `2px solid ${alpha(
                                    theme.palette.error.main,
                                    0.2
                                  )}`,
                                  borderRadius: 3,
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "4px",
                                    height: "100%",
                                    background: theme.palette.error.main,
                                  },
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      fontWeight="500"
                                    >
                                      🔴 Exit Time
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      color="error.main"
                                    >
                                      {formatTime(attendance.out_time)}
                                    </Typography>
                                  </Box>
                                  <Logout
                                    sx={{
                                      color: "error.main",
                                      fontSize: 28,
                                      opacity: 0.7,
                                    }}
                                  />
                                </Box>
                              </Paper>
                            ) : null}

                            {attendance.in_time && attendance.out_time && (
                              <Paper
                                sx={{
                                  p: 3,
                                  background: `linear-gradient(135deg, ${theme.palette.info.main}08, ${theme.palette.info.main}15)`,
                                  border: `2px solid ${alpha(
                                    theme.palette.info.main,
                                    0.2
                                  )}`,
                                  borderRadius: 3,
                                  textAlign: "center",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight="500"
                                  gutterBottom
                                >
                                  ⏱️ Total Duration
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="info.main"
                                >
                                  {(() => {
                                    const inTime = new Date(
                                      `1970-01-01T${attendance.in_time}`
                                    );
                                    const outTime = new Date(
                                      `1970-01-01T${attendance.out_time}`
                                    );
                                    const diff = outTime - inTime;
                                    const hours = Math.floor(
                                      diff / (1000 * 60 * 60)
                                    );
                                    const minutes = Math.floor(
                                      (diff % (1000 * 60 * 60)) / (1000 * 60)
                                    );
                                    return `${hours}h ${minutes}m`;
                                  })()}
                                </Typography>
                              </Paper>
                            )}

                            {!attendance.in_time && (
                              <Paper
                                sx={{
                                  p: 4,
                                  textAlign: "center",
                                  background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
                                  border: `2px dashed ${alpha(
                                    theme.palette.grey[400],
                                    0.5
                                  )}`,
                                  borderRadius: 3,
                                }}
                              >
                                <AccessTime
                                  sx={{
                                    fontSize: 48,
                                    color: "text.secondary",
                                    mb: 2,
                                    opacity: 0.5,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  color="text.secondary"
                                  fontWeight="500"
                                  gutterBottom
                                >
                                  No attendance marked yet
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Start your day by marking your entry time! 🌟
                                </Typography>
                              </Paper>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>

                      {/* Additional Quick Actions */}
                      <Box
                        mt={4}
                        pt={3}
                        sx={{
                          borderTop: `1px solid ${alpha(
                            theme.palette.divider,
                            0.5
                          )}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                          fontWeight="600"
                          sx={{ mb: 3 }}
                        >
                          📊 Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<Timeline />}
                              onClick={() => setShowHistory(true)}
                              sx={{
                                py: 1.5,
                                borderRadius: 2,
                                borderColor: alpha(
                                  theme.palette.primary.main,
                                  0.3
                                ),
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.05
                                  ),
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              View History
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
