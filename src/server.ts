import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import path from 'path';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
dotenv.config();
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: process.env.APIKEY, 
    authDomain: process.env.AUTHDOMAIN, 
    databaseURL: process.env.DATABASEURL, 
    projectId: process.env.PROJECTID, 
    storageBucket: process.env.STORAGEBUCKET, 
    messagingSenderId: process.env.MESSENGINGSENDERID, 
    appId: process.env.APPID, 
    measurementId: process.env.MEASUREMENTID
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp)



const app = express();
const PORT = process.env.PORT;
const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, '../public')));

app.post('/updateInventory', (req: Request, res: Response) => {
    const {token, quantity, cardID, foiling} = req.body
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { username: string };
        const databaseRef = ref(database, 'users/' + payload.username + "/cards/" + cardID)
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                if (quantity == 0) {
                    if (foiling == "normal") {
                        if (snapshot.val().foil == 0) {
                            remove(databaseRef)
                        } else {
                            update(databaseRef, {
                                normal: 0
                            })
                        }
                    } else {
                        if (snapshot.val().normal == 0) {
                            remove(databaseRef)
                        } else {
                            update(databaseRef, {
                                foil: 0
                            })
                        }
                    }
                } else {
                    if (foiling == "normal") {
                        update(databaseRef, {
                            normal: quantity
                        })
                    } else {
                        update(databaseRef, {
                            foil: quantity 
                        })
                    }
                }
            } else {
                res.status(401).json({success: false, message: "Card doesn't exist in inventory"});
                return; 
            }
        })
        res.json({success: true})
    } catch(err: any) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({success: false, message: "Your login token has expired; Please Login Again"});
        } else {
            res.status(401).json({success: false, message: "Error adding card to the database (server):" + err});
        }
        
    }
})

app.post('/add', (req: Request, res: Response) => {
    const {token, cardID, foiling, quantity} = req.body
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { username: string };
        const databaseRef = ref(database, 'users/' + payload.username + "/cards/" + cardID)
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                if (foiling == "normal") {
                    update(databaseRef, {
                        normal: quantity + snapshot.val().normal
                    })
                } else {
                    update(databaseRef, {
                        foil: quantity + snapshot.val().foil
                    })
                }
            } else {
                if (foiling == "normal") {
                    set(databaseRef, {
                        normal: quantity,
                        foil: 0
                    })
                } else {
                    set(databaseRef, {
                        normal: 0,
                        foil: quantity
                    })
                }
            }
        })
        res.json({success: true})
    } catch(err: any) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({success: false, message: "Your login token has expired; Please Login Again"});
        } else {
            res.status(401).json({success: false, message: "Error adding card to the database (server):" + err});
        }
        
    }
})

app.post('/inventory', (req: Request, res: Response) => {
    const {token} = req.body 
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { username: string };
        const databaseRef = ref(database, 'users/' + payload.username + "/cards/")
        get(databaseRef).then((snapshot) => {
            res.json({success: true, data: JSON.stringify(snapshot.val())})
        })
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({success: false, message: "Your login token has expired; Please Login Again"});
        } else {
            res.status(401).json({success: false, message: "Error adding card to the database (server):" + err});
        }
    }
})

app.post('/signup', (req: Request, res: Response) => {

    const {email, username, password} = req.body
    const databaseRef = ref(database, 'users/' + username)
    try {

        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                res.status(401).json({success: false, message: "User already exist, pick a new username"});
            } else {
                set(databaseRef, {
                    email: email,
                    username: username, 
                    password: password
                })
                res.json({success: true})
            }
        })
    } catch(err: any) {
        console.log(err)
        res.status(401).json({success: false, message: "Error when signing up"});
    }
})

app.post('/forget', (req: Request, res: Response) => {
    const {email, username, password, password2} = req.body
    const databaseRef = ref(database, 'users/' + username)
    try {
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                if (email == snapshot.val().email) {
                    // update 
                    update(databaseRef, {
                        password: password
                    })
                    res.json({success: true})
                } else {
                    res.status(401).json({success: false, message: "Username does not match email"});
                }
            } else {
                res.status(401).json({success: false, message: "username doesn't exist"});
            }
        })
    } catch(err: any) {
        console.log(err)
        res.status(401).json({success: false, message: "Error when logging in"});
    }
})

app.post('/login', (req: Request, res: Response) => {
    const { username, password, rememberMe} = req.body; 
    const databaseRef = ref(database, 'users/' + username)
    try {
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                if (password == snapshot.val().password) {
                    const token = jwt.sign(
                        {username: snapshot.val().username},
                        JWT_SECRET, 
                        {expiresIn: rememberMe? '1h': '5h'}, 
                    );
                    res.json({success: true, token}); 
                } else {
                    res.status(401).json({success: false, message: "Invalid username or password"});
                }
            } else {
                res.status(401).json({success: false, message: "Invalid username or password"});
            }
        })
    } catch(err: any) {
        console.log(err)
        res.status(401).json({success: false, message: "Error when logging in"});
    }

    
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 