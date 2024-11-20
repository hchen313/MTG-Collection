import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Box } from '@mui/material';

interface inventoryProps {
    cardID: String // scryfall ID
}

const AddInventory: React.FC<inventoryProps> = ({cardID}) => {
    const [foiling, setFoiling] = useState("")
    const [isPopupOpen, setPopupOpen] = useState(false);

    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => {
        if (quantity > 1) {
        setQuantity((prev) => prev - 1);
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(event.target.value)); // Ensure quantity is at least 1
        setQuantity(value);
    };

    const handleOpenPopup = (e: React.FormEvent) => {
        e.preventDefault();
        setPopupOpen(true); // Open the popup
    };

    const handleClosePopup = () => {
        setPopupOpen(false); // Close the popup
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (foiling == "") {
            alert("Please select a foiling"); 
            return;
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch("http://localhost:8000/add", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({token, cardID, foiling, quantity})
            }); 

            const data = await response.json(); 
            if (data.success) {
                alert("Success!")
                handleClosePopup()
            } else {
                alert('Add to Inventory failed: ' + data.message);
            }
        } catch (error) {
            alert('An error has occurred: ' + error);
        }
    }

    return (
         <>
            <Button variant="contained" color="primary" fullWidth onClick={handleOpenPopup}>
                  Add
            </Button>
            <Dialog open={isPopupOpen}
                    onClose={handleClosePopup}
                    maxWidth="xs" // Adjust width (e.g., 'xs', 'sm', 'md', etc.)
                    fullWidth
                    PaperProps={{
                        sx: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        },
                    }}>
                <DialogTitle>Add to Inventory </DialogTitle>
                    <DialogContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Choose a foiling</FormLabel>
                            <RadioGroup value={foiling} onChange={(e) => setFoiling(e.target.value)}>
                                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                                <FormControlLabel value="foil" control={<Radio />} label="Foil" />
                            </RadioGroup>
                            <div>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* Decrement Button */}
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleDecrement} 
                                        disabled={quantity <= 1}
                                        sx={{ minWidth: 40 }}
                                    >
                                        -
                                    </Button>
                                    
                                    {/* Quantity Display/Editor */}
                                    <TextField
                                        value={quantity}
                                        onChange={handleInputChange}
                                        type="number"
                                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                        sx={{ width: 60 }}
                                    />
                                    
                                    {/* Increment Button */}
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleIncrement} 
                                        sx={{ minWidth: 40 }}
                                    >
                                        +
                                    </Button>
                                </Box>
                            </div>
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
                            Add
                            </Button>
                        </FormControl>
                    </DialogContent>
            </Dialog>
        </>
    );
};

export default AddInventory;
