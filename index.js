import { connectToDatabase } from './db/conn.js';
import { runServer } from './server.js'

const dbConfig = {
    host: 'localhost',
    user: '',
    pass: '',
    db: 'myDatabase',
    options: ''
};

connectToDatabase(dbConfig, () => {
    console.log('Database is ready to be used in the app');
    runServer()
});