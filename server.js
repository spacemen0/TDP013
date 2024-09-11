import express from 'express';
import messages from "./routes/messages.js"
import notFound from './middlewares/notFound.js';
import logger from './middlewares/logger.js';
import cors from 'cors'
const app = express();
app.use(logger);
app.use(express.json());
app.use(cors())
app.use('/messages', messages);
app.use(notFound)

export function runServer() {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app
