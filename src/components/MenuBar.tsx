import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuBarProps {
    title: String
}

export const MenuBar: React.FC<MenuBarProps> = (props) => {
    const navigate = useNavigate();

      const handleDashboard = () => {
        navigate('/dashboard')
      }

      const handleLogout = () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');  
        navigate('/login');
      }
    return (
      <AppBar position="static">
        <Toolbar
        sx={{
            backgroundColor: '#313131'
          }}> 
            <Typography variant="h6" component="div" color="#C3BBBB" sx={{ flexGrow: 1 }}>
                {props.title}
            </Typography>
            <Button 
            onClick={handleDashboard} 
            sx={{ 
                mr: 2, 
                color: 'white', // Text color
                backgroundColor: 'purple', // Background color
                '&:hover': { // Change color on hover
                backgroundColor: 'gray',
                }
            }}
            >
            Dashboard
            </Button>
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