import { MongoClient } from 'mongodb';

let client;
let db;

export function connectToDatabase(config, callback) {
    if (db) return;

    let uri;
    if (config.user) {
        uri = `mongodb://${config.user}:${config.pass}@${config.host}/${config.options || ''}`;
    } else {
        uri = `mongodb://${config.host}/${config.options || ''}`;
    }
    client = new MongoClient(uri);
    db = client.db(config.db);
    callback && callback();
}

export function closeDatabaseConnection(callback) {
    if (client) {
        client.close();
        db = null;
    }
    callback && callback();
}

export function getDatabaseConnection() {
    return db;
}
