import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Ensure payload is an object
    if (typeof payload !== 'object') {
        payload = { data: payload };
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export default generateToken;
