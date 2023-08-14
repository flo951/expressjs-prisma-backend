import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
// this will automatically parse all to json 
app.use(express.json());
app.use('/user', userRoutes)

// add first endpoint, / is the root of the server
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})