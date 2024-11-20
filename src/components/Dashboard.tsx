import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Container, Grid} from '@mui/material';
import { getCardData } from '../APIQuery';

export const Dashboard: React.FC = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const navigate = useNavigate();
    const [numCards, setNumCards] = useState(0)
    const [value, setValue] = useState(0.0)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch("http://localhost:8000/inventory", {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({token})
                }); 
                
                const data = await response.json(); 
                if (data.success) {
                    let objJson = JSON.parse(data.data)
                    let obj = Object.keys(objJson)
                    let count = 0 
                    let total = 0.0
                    for (let i = 0; i < obj.length; i++) {
                        let cardInfo: any = getCardData(obj[i])
                        let json = JSON.parse(await cardInfo)
                        count += objJson[json.id].foil
                        count += objJson[json.id].normal
                        total += objJson[json.id].foil * (json.prices.usd_foil ? json.prices.usd_foil : 0)
                        total += objJson[json.id].normal * (json.prices.usd ? json.prices.usd : 0)
                    }
                    setNumCards(count)
                    setValue(total)
                } else {
                    throw new Error("failed to fetch inventory")
                }
            }
            fetchData()
        } catch(err) {
            alert('An error has occurred: ' + err);
        }
    }, [])

    useEffect(() => {
        if (token) {
            const decodedToken: { username: string } = jwtDecode(token);
            setUser(decodedToken);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');  
        navigate('/login');
    }

    const viewInventory = () => {
        navigate('/inventory')
    };

    const addCards = () => {
        navigate('/cards')
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
                            <Typography variant='h6' align='center' color='#C3BBBB'>
                                {user.username}
                            </Typography>
                        </Container> 
                        <div>
                            <Box
                                marginTop={2}
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
                            <Grid container spacing={2} justifyContent="center" marginTop={3}>
                                <Grid item>
                                    <Button variant="contained" 
                                    onClick={viewInventory}
                                    sx={{ 
                                        color: 'white', // Text color
                                        backgroundColor: 'purple', // Background color
                                        '&:hover': { // Change color on hover
                                        backgroundColor: 'gray',
                                        }
                                    }}>
                                        View Inventory
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" 
                                    onClick={addCards}
                                    sx={{ 
                                        color: 'white', // Text color
                                        backgroundColor: 'purple', // Background color
                                        '&:hover': { // Change color on hover
                                        backgroundColor: 'gray',
                                        }
                                    }}>
                                        Add Cards 
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Grid container spacing={2} justifyItems='center'>
                                <Grid item xs={12} sx={{margin: "3% 5% 0% 5%"}}>
                                    <Card sx={{backgroundColor:'#C3BBBB'}} > 
                                        <CardContent>
                                            <Typography variant='h5' gutterBottom> 
                                                You have {numCards} cards in your inventory.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sx={{margin: "0 5% 0% 5%"}}>
                                    <Card sx={{backgroundColor:'#C3BBBB'}}> 
                                        <CardContent>
                                            <Typography variant='h5' gutterBottom> 
                                                Your cards total value at ${value}.
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


