import React, { useState } from 'react'; 
import { Avatar, Grid, Paper, TextField, FormControlLabel, Checkbox, Button, Link, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import ForgetPassword from './ForgetPassword';

export const Login = () => {
    const paperStyle = {
        padding: 20, 
        height: "70vh",
        width: 280, 
        margin:"20px auto"
    }

    const [username, setUserName] = useState(""); 
    const [password, setPassword] = useState("");  
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username === "" || password === "") {
            alert("Please enter username/password"); 
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({username, password, rememberMe})
            }); 

            const data = await response.json(); 
            if (data.success) {
                if (rememberMe) {
                    sessionStorage.setItem('token', data.token);
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }
                navigate('/dashboard');
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            alert('An error has occurred: ' + error);
        }
    }


    return (
        <Grid> 
            <Paper elevation={20} style={paperStyle}> 
                <Grid container direction="column" alignItems="center">
                    <Avatar sx={{width: 56, height:56, bgcolor: "lightblue"}}> MTG </Avatar>
                    <h2> Sign In </h2>
                </Grid>
                <TextField label="Username" placeholder='Enter username' fullWidth required margin='normal' 
                onChange={(event) => {setUserName(event.target.value)}}> </TextField>
                <TextField label="Password" placeholder='Enter password' fullWidth required margin='none'
                onChange={(event) => {setPassword(event.target.value)}} type='password'> </TextField>
                <FormControlLabel 
                    control={
                        <Checkbox name="checkBox" color="primary" onChange={(event) => {setRememberMe(event.target.checked)}}/>
                    } 
                    label="Remember me"
                />
                <Button type='submit' color='primary' variant='contained' fullWidth style={{margin: "8px 0"}}
                onClick={(event) => {handleSubmit(event)}}> Sign in </Button>
                <Typography>
                    <ForgetPassword />
                </Typography>
                <Typography> Do you have an account?
                    <SignUp />
                </Typography>
            </Paper>
        </Grid>
    );
}