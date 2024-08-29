import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, '../public')));



const users = [
    {username: 'user1', password: bcrypt.hashSync('pass1', 8)},
    {username: 'user2', password: bcrypt.hashSync('pass2', 8)}
];

app.post('/login', (req: Request, res: Response) => {
    const { username, password, rememberMe} = req.body; 

    const user = users.find(u => u.username === username); 
    console.log(user)

    if (user && bcrypt.compareSync(password, user.password)) {
        // generate token 

        const token = jwt.sign(
            {username: user.username},
            JWT_SECRET, 
            {expiresIn: rememberMe? '1h': '5h'}, 
        );
        res.json({success: true, token}); 
    } else {
        res.status(401).json({success: false, message: "Invalid username or password"});
    }
})

interface UserPayload {
    username: string, 
    iat: number,  // issue at time 
    exp: number // exp time
}

app.get('/user-data', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // If no token, return 401 (Unauthorized)
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If token is invalid, return 403 (Forbidden)
        }

        const userInfo = user as UserPayload; 
        const username = userInfo.username;
        
        const userData = fetchUserDataFromDatabase(username);
        if (!userData) {
            return res.sendStatus(404); // User not found
        }

        res.json({data: userData}); // Send user data as JSON response
    });
});

const fetchUserDataFromDatabase = (username: string) => {
    return username + "data"; 
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 