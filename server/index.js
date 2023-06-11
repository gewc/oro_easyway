import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import storeRouter from './routes/store.routes.js';
import productRouter from './routes/product.routes.js';
import registerRouter from './routes/register.routes.js';
import viewRouter from './routes/view.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb'}));

app.get('/', (req, res) => {
    res.send({ message: 'Hello World!'});
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/registers', registerRouter);
app.use('/api/v1/views', viewRouter);

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log("Server starte on port https://oro-easyway.onrender.com"))
    } catch (error) {
        console.log(error)
    }
}

startServer();