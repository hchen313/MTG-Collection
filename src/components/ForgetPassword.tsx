import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, TextField } from '@mui/material';

const ForgetPassword = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setPopupOpen(true); // Open the popup
    };

    const handleClosePopup = () => {
        setPopupOpen(false); // Close the popup
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username === "" || password === "" || email == "" || password2 == "") {
            alert("Please enter username/password/email"); 
            return;
        } else if (password != password2) {
            alert("Password not match")
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/forget", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({email, username, password, password2})
            }); 

            const data = await response.json(); 
            if (data.success) {
                alert("Success!")
                handleClosePopup()
            } else {
                alert('Reset password failed: ' + data.message);
            }
        } catch (error) {
            alert('An error has occurred: ' + error);
        }
    }

    return (
         <>
            <Link href='#' onClick={handleSignUp}>
                Forget Password?
            </Link>
            <Dialog open={isPopupOpen} onClose={handleClosePopup}>
                <DialogTitle>Forget Password</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Username"
                                type="username"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="New Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            <Button onClick={handleClosePopup} color="secondary" style={{ marginTop: '1rem' }}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '1rem', marginLeft: '1rem' }}
                                onClick={handleSubmit}
                            >
                            Submit
                            </Button>
                        </form>
                    </DialogContent>
            </Dialog>
        </>
    );
};

export default ForgetPassword;
