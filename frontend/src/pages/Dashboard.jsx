import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
  Button,
} from '@mui/material';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setUserData(res.data))
      .catch(err => {
        console.error('Unauthorized or error loading user:', err);
        navigate('/login');
      });
  }, [navigate, token]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Expense Tracker Dashboard
          </Typography>

          {userData && (
            <Box>
              <Tooltip title="User Menu">
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <Avatar
                    src={userData.profileImageUrl}
                    alt={userData.username}
                  >
                    {getInitials(userData.username)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem disabled>
                  Signed in as <strong style={{ marginLeft: '4px' }}>{userData.username}</strong>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ backgroundColor: '#fff', p: 4, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h5" gutterBottom>
            Welcome back, {userData?.username || ''}!
          </Typography>

          <Typography variant="body1" mb={2}>
            Ready to track your expenses? Click below to get started.
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/expenses"
            color="secondary"
          >
            Go to Expense Tracker
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;