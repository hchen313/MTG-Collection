import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

app.use(cors()); 
app.use(bodyParser.json()); 

const users = [
    {username: 'user1', password: bcrypt.hashSync('pass1', 8)}
];

app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body; 

    const user = users.find(u => u.username === username); 
    console.log(user)

    if (user && bcrypt.compareSync(password, user.password)) {
        // generate token 

        const token = jwt.sign(
            {username: user.username},
            JWT_SECRET, 
            {expiresIn: '1h'}, 
        );
        res.json({success: true, token}); 
    } else {
        res.status(401).json({success: false, message: "Invalid username or password"});
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 