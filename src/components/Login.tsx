import React, { useState } from 'react'; 
import { Avatar, Grid, Paper, TextField, FormControlLabel, Checkbox, Button, Link, Typography } from '@mui/material';

export const Login = () => {
    const paperStyle = {
        padding: 20, 
        height: "70vh",
        width: 280, 
        margin:"20px auto"
    }

    const [username, setUserName] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({username, password})
            }); 

            const data = await response.json(); 
            if (data.success) {
                console.log("success");
            } else {
                setError(data.message); 
            }
        } catch (error) {
            setError("An error has occurred, please try again");
            console.error('Login error', error);  
        }

        if (error != "") {
            console.error(error); 
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
                onChange={(event) => {setPassword(event.target.value)}}> </TextField>
                <FormControlLabel 
                    control={
                        <Checkbox name="checkBox" color="primary" />
                    } 
                    label="Remember me"
                />
                <Button type='submit' color='primary' variant='contained' fullWidth style={{margin: "8px 0"}}
                onClick={(event) => {handleSubmit(event)}}> Sign in </Button>
                <Typography>
                    <Link href="#" onClick={()=>{}}>
                        Forgot password?
                    </Link>
                </Typography>
                <Typography> Do you have an account?
                    <Link href="#" onClick={()=>{}}>
                        Sign up
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    );
}