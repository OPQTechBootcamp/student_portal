import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Card,
  CardContent,
  Pagination,
  Stack
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Today,
  History,
  CalendarToday,
  AccessTime,
  ExitToApp
} from '@mui/icons-material';

const AttendanceHistory = ({ history = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Number of records per page

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    
    // Handle different time formats
    if (timeString.includes('T') || timeString.includes(' ')) {
      // Full datetime string
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // Time only format (HH:MM:SS)
      const [hours, minutes, seconds] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getAttendanceStatus = (inTime, outTime) => {
    if (inTime && outTime) {
      return { 
        status: 'Complete', 
        color: 'success', 
        icon: CheckCircle
      };
    } else if (inTime) {
      return { 
        status: 'Incomplete', 
        color: 'warning', 
        icon: Schedule
      };
    } else {
      return { 
        status: 'Absent', 
        color: 'error', 
        icon: Today
      };
    }
  };

  const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return '-';
    
    try {
      let inDate, outDate;
      
      // Parse entry time
      if (inTime.includes('T') || inTime.includes(' ')) {
        inDate = new Date(inTime);
      } else {
        const today = new Date().toISOString().split('T')[0];
        inDate = new Date(`${today}T${inTime}`);
      }
      
      // Parse exit time
      if (outTime.includes('T') || outTime.includes(' ')) {
        outDate = new Date(outTime);
      } else {
        const today = new Date().toISOString().split('T')[0];
        outDate = new Date(`${today}T${outTime}`);
      }
      
      const diffMs = outDate - inDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${diffHours}h ${diffMinutes}m`;
    } catch (error) {
      return '-';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(history.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = history.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        mt: 3
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box 
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <History sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              Attendance History
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Track your daily attendance records
            </Typography>
          </Box>
        </Box>

        {history.length === 0 ? (
          <Box
            textAlign="center"
            py={6}
            px={3}
            sx={{
              backgroundColor: '#f5f5f5',
            }}
          >
            <History sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="600" sx={{ mb: 1 }}>
              No attendance records found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your attendance history will appear here once you start marking attendance
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f5f5f5',
                    '& th': {
                      borderBottom: '2px solid #e0e0e0',
                      py: 2
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '0.95rem' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday sx={{ fontSize: 18 }} />
                        Date
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '0.95rem' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime sx={{ fontSize: 18 }} />
                        Entry
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '0.95rem' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ExitToApp sx={{ fontSize: 18 }} />
                        Exit
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#0288d1', fontSize: '0.95rem' }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#7b1fa2', fontSize: '0.95rem' }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentData.map((row, index) => {
                    const statusInfo = getAttendanceStatus(row.in_time, row.out_time);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <TableRow 
                        key={startIndex + index}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f5f5f5'
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: '#fafafa'
                          }
                        }}
                      >
                        <TableCell sx={{ py: 2.5 }}>
                          <Typography variant="body1" fontWeight="500">
                            {formatDate(row.date)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: row.in_time ? '#2e7d32' : '#bdbdbd'
                              }} 
                            />
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: row.in_time ? '#2e7d32' : '#757575',
                                fontWeight: '500'
                              }}
                            >
                              {formatTime(row.in_time)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: row.out_time ? '#d32f2f' : '#bdbdbd'
                              }} 
                            />
                            <Typography 
                              variant="body1" 
                              sx={{
                                color: row.out_time ? '#d32f2f' : '#757575',
                                fontWeight: '500'
                              }}
                            >
                              {formatTime(row.out_time)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Typography variant="body1" fontWeight="500" sx={{ color: '#0288d1' }}>
                            {calculateDuration(row.in_time, row.out_time)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Chip
                            icon={<StatusIcon sx={{ fontSize: '18px !important' }} />}
                            label={statusInfo.status}
                            color={statusInfo.color}
                            size="small"
                            sx={{
                              fontWeight: '500',
                              '& .MuiChip-icon': {
                                fontSize: '16px'
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box mt={3} display="flex" justifyContent="center">
                <Stack spacing={2}>
                  <Pagination 
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Showing {startIndex + 1}-{Math.min(endIndex, history.length)} of {history.length} records
                  </Typography>
                </Stack>
              </Box>
            )}

            {/* Footer Stats */}
            <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Total {history.length} records
              </Typography>
              <Box display="flex" gap={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#2e7d32'
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Complete
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#ed6c02'
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Incomplete
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#d32f2f'
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Absent
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;