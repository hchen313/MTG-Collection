import { CardMedia, CardContent, Typography, Box, Button, Card } from "@mui/material"
import React from "react"
import AddInventory from "./AddInventory"

interface CardProps {
    set: String, 
    normal: String, 
    foil: String,
    imageURL: String, 
    cardID: String,  // scryfall ID 
}

export const CardInfo: React.FC<CardProps> = ({set, normal, foil, imageURL, cardID}) => {
    return (
    <div>
        <Card sx={{ height: '100%', padding: 3}}>
              <CardMedia
                component="img"
                height="auto"
                image={imageURL.toString()}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  SET: {set.toUpperCase()}
                </Typography>
                <Typography variant="h6" color="primary">
                  Normal: {normal?normal:"NA"}
                </Typography>
                <Typography variant="h6" color="primary">
                  Foil: {foil?foil:"NA"}
                </Typography>
              </CardContent>
              <Box sx={{ padding: 1 }}>
                <AddInventory cardID={cardID}/>
              </Box>
            </Card>
    </div>
    )
}