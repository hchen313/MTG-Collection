import { AppBar, Toolbar, Typography, Button, TextField, Box, Grid, Paper, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from './MenuBar';
import { getCardData } from '../APIQuery'

export const Inventory: React.FC = () => {
      const [inventory, setInventory] = useState<{cardname: String, set: String, quantity: number, foiling: String, price: String, id: String, link: String}[]>([])
      //const [quantity, setQuantity] = useState(0)

      const onChangeQuantity = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        setInventory((item) => {
          const element = item[index]
          element.quantity = parseInt(event.target.value, 10) ? parseInt(event.target.value, 10): 0
          
          const updatedItem = [...item]
          updatedItem[index] = element
          return updatedItem
        })
      }

      const onConfirmClick = async (index: number) => {
        let quantity = inventory[index].quantity
        let cardID = inventory[index].id
        let foiling = inventory[index].foiling
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await fetch("http://localhost:8000/updateInventory", {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({token, quantity, cardID, foiling})
            }); 

            const data = await response.json(); 
            if (data.success) {
                alert("Success!")
            } else {
                alert('Change inventory failed: ' + data.message);
            }
        } catch(err) {
          alert('An error has occurred: ' + err);
        }
      }

      useEffect(() => {
          try {
            const fetchData = async () => {
              const token = localStorage.getItem('token') || sessionStorage.getItem('token');
              const response = await fetch("http://localhost:8000/inventory", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({token})
              }); 
            
              const data = await response.json(); 
              let newItems = []
              if (data.success) {
                  let objJson = JSON.parse(data.data)
                  let obj = Object.keys(objJson)
                  for (let i = 0; i < obj.length; i++) {
                    let cardInfo = getCardData(obj[i])
                    let json = JSON.parse(await cardInfo)
                    let name = json.name
                    let set = json.set.toUpperCase()
                    let foil_quantity = objJson[json.id].foil
                    let normal_quantity = objJson[json.id].normal
                    let foil_price = json.prices.usd_foil 
                    let normal_price = json.prices.usd 
                    let id = json.id
                    let link = json.scryfall_uri
                    if (foil_quantity != 0 ){
                      newItems.push({cardname: name, set: set, quantity: foil_quantity, foiling: "foil", price: foil_price, id: id, link: link})
                    } 
                    if (normal_quantity != 0) {
                      newItems.push({cardname: name, set: set, quantity: normal_quantity, foiling: "normal", price: normal_price, id: id, link: link})
                    }
                  }
                  setInventory(newItems)
              } else {
                  throw new Error("failed to fetch inventory")
              }
            }

            fetchData()
        } catch (err) {
          alert('An error has occurred: ' + err);
        }
      }, [])

      return (
        <div style={{backgroundColor: '#BABABA', minHeight: '100vh'}}>
            <div>
                <MenuBar title="Inventory"/>
            </div>
            <div>
                <Divider />
                {
                  <Box sx={{ width: "100%", padding: 2 }}>
                  <Grid container spacing={2}>
                    {inventory.map((item, index) => (
                      <Grid item xs={12} key={index}>
                      <Paper elevation={3} sx={{ padding: 2, display: "flex", alignItems: "center", maxWidth: "95%"}}>
                        {/* Text Content */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6"> <Link target="_blank" href={item.link? item.link.toString() : "#"}> {item.cardname} </Link></Typography>
                          <Typography variant="body2">{item.set}</Typography>
                          <Typography variant="body2">{item.foiling}</Typography>
                          <Typography variant="body2">{item.id}</Typography>
                        </Box>
                        <Box  display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"> 
                          <TextField
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => onChangeQuantity(e, index)}
                              InputProps={{ inputProps: { min: 0 } }} // Prevent negative values
                              sx = {{width: 100, padding: 2}}
                            />
                            <Button variant="contained" onClick={() => onConfirmClick(index)}>Confirm</Button>
                            
                          </Box>
                          {/* Price */}
                          <Typography variant="body1" sx={{ fontWeight: "bold", padding: 3, width: "10%"}}>
                              {item.price? item.price : "NA"}
                            </Typography>
                      </Paper>
                    </Grid>
                    ))}
                  </Grid>
                </Box>
                }
            </div>
        </div>
      )
}