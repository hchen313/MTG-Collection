import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Box, Card, CardContent, Container, Grid, IconButton, Menu, MenuItem } from '@mui/material';

export const Dashboard: React.FC = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [userData, setUserData] = useState<{ data: string } | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            const decodedToken: { username: string } = jwtDecode(token);
            setUser(decodedToken);
        }
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:8000/user-data', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');  
        navigate('./login');
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const MenuBar: React.FC = () => {
        return (
          <AppBar position="static">
            <Toolbar
            sx={{
                backgroundColor: '#313131'
              }}> 
            <Typography variant="h6" component="div" color="#C3BBBB" sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              {/* <div>
                <IconButton onClick={handleClick}> 
                    <Avatar sx={{width: 36, height:36, bgcolor: "lightblue", mr: 2}}> {user?.username.toUpperCase()[0]} </Avatar>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx = {{}}
                >
                    <MenuItem onClick={handleClose}>View My Inventory</MenuItem>
                </Menu>
            </div> */}
              <Button 
                onClick={handleLogout} 
                sx={{ 
                    mr: 2, 
                    color: 'white', // Text color
                    backgroundColor: 'red', // Background color
                    '&:hover': { // Change color on hover
                    backgroundColor: 'darkred',
                    }
                }}
                >
                Logout
                </Button>
            </Toolbar>
          </AppBar>
        );
      };

    return (
        <div style={{backgroundColor: '#222222', minHeight: '100vh'}}>
            <MenuBar /> 
                {user ? (
                    <main>
                        <Container >
                            <Typography variant='h2' align='center' color="#C3BBBB"> Overview </Typography>
                            {userData != null && 
                            <Typography variant='h6' align='center' color='#C3BBBB'>
                                {user.username}
                            </Typography>}
                        </Container> 
                        <div>
                            <Box
                                component="img"
                                src="http://localhost:8000/manacrypt.png" 
                                alt="Mana Crypt"
                                sx={{
                                    display: 'block',
                                    margin: '0 auto',
                                    width: '30%',
                                    height: 'auto',
                                }}
                                />
                        </div>
                        <div>
                            <Grid container spacing={2} justifyItems='center'>
                                <Grid item xs={12} sx={{margin: "3% 5% 0% 5%"}}>
                                    <Card sx={{backgroundColor:'#C3BBBB'}} > 
                                        <CardContent>
                                            <Typography variant='h5' gutterBottom> 
                                                You have 0 cards in your inventory.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sx={{margin: "0 5% 0% 5%"}}>
                                    <Card sx={{backgroundColor:'#C3BBBB'}}> 
                                        <CardContent>
                                            <Typography variant='h5' gutterBottom> 
                                                Your cards total value at $0.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </main>
                ) : (
                    <p>404 Error</p>
                )}
        </div>
    );
};





export default Dashboard;
