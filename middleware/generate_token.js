import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (payload) => {
    return jwt.sign(
        payload, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '24h' } // Token expiration time
    );
};

export default generateToken;
