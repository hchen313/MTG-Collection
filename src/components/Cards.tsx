import { AppBar, Toolbar, Typography, Button, TextField, Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from './MenuBar';
import { CardInfo } from './CardInfo';


export const Cards: React.FC = () => {
    const [options, setOptions] = useState([])
    const [cards, SetCards] = useState<any[]>([])
    const showCards = async(searchValue: String | null) => {
        if (searchValue == null || searchValue == "") {
            return;
        }
        try {
            const response = await fetch("https://api.scryfall.com/cards/search?q=" + searchValue + "&unique=prints", {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
        
            if (!response.ok) {
                alert("HTTP ERROR")
            }
        
            const data = await response.json();

            let current = []
            SetCards([])
            for (let i = 0; i < data.data.length; i++) {
                let card = data.data[i]
                let set = card.set
                let price_usd = card.prices.usd
                let price_usd_foil = card.prices.usd_foil
                let imageURL = ""
                if (card.card_faces != null && card.card_faces[0].image_uris != null) {
                    imageURL = card.card_faces[0].image_uris.small
                } else {
                    imageURL = card.image_uris.small
                }
                let cardID = card.id
                current.push({set, price_usd, price_usd_foil, imageURL, cardID})
            }
            SetCards(current)
            return; 
        } catch (error: any) {
            alert("Error when fetching card data: " + error.message)
        }
    }
    const search = async(searchValue: String | null) => {
        const autocomplete = document.getElementById('autocomplete');
        if (autocomplete && searchValue != null && searchValue != "") {
            try {
                const response = await fetch("https://api.scryfall.com/cards/autocomplete?q=" + searchValue, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
            
                if (!response.ok) {
                    alert("HTTP ERROR")
                }
            
                const data = await response.json();
                setOptions(data.data)
                return; 
            } catch (error: any) {
                alert("Error during search: " + error.message)
            }
        }
    }

    return (
    <div style={{backgroundColor: '#BABABA', minHeight: '100vh'}}>
        <div>
            <MenuBar title="Cards"/>
        </div>
        <div> 
            <Autocomplete
                loading
                id="autocomplete"
                options={options}
                sx={{ width: 250, paddingLeft: 2, paddingTop: 1, paddingBottom: 1}}
                renderInput={(params) => <TextField {...params} label="Card Name" />}
                onInputChange={(e, newValue) => search(newValue)}
                onChange={(e, newValue) => showCards(newValue)}
            />
        </div>
        <div>
            <Divider />
            <Box sx={{ flexGrow: 1, padding: 2}}>
                <Grid container spacing={2}>
            {
                cards.length > 0 ? (
                    cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
                        <CardInfo
                            key={index}
                            set={card.set} 
                            normal={card.price_usd} 
                            foil={card.price_usd_foil} 
                            imageURL={card.imageURL}
                            cardID={card.cardID}
                        />
                    </Grid>
                    ))
                ) : null
            }
            </Grid>
            </Box>
        </div>
    </div>
    )
}