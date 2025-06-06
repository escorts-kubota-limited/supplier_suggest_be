import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoute.js';
import suggestionRoute from './routes/suggestionRoute.js'
import fileRoute from './routes/fileRoute.js'
import deviceRoute from './routes/deviceRoute.js';
import notificationRoute from './routes/notiifcationRoutes.js'
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
app.use((req, res, next) => {
    const originalSetHeader = res.setHeader;
    res.setHeader = function(name, value) {
        // Prevent setting 'Location' or 'Host'
        if (name.toLowerCase() === 'location' || name.toLowerCase() === 'host' || name.toLowerCase() === 'x-powered-by') {
            return;
        }
        originalSetHeader.call(this, name, value);
    };
    next();
});

app.use(cors()) ;

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/suggestion',suggestionRoute );
app.use('/file', fileRoute ) ;
app.use('/device', deviceRoute ) ;
app.use('/notification',notificationRoute)


const PORT = process.env.PORT || 30002;

app.listen(PORT, () => {
    import('./escalationCron.js');
    console.log(`Server is running on port ${PORT}`);
});
