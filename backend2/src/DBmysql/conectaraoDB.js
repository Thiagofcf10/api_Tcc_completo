const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '112233';
const DB_NAME = process.env.DB_NAME || process.env.DB_DATABASE;

if (!process.env.DB_USER && process.env.USER) {
    console.warn('Warning: using process.env.USER for DB user. Consider renaming your .env entries to DB_USER/DB_PASSWORD/DB_NAME to avoid clobbering by OS env vars.');
}

const connection = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    charset: 'utf8mb4'
});

async function connectWithRetry(maxRetries = 5, delayMs = 2000) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const conn = await connection.getConnection();
            console.log('Conectado ao MySQL!');
            conn.release(); // libera a conexão para o pool
            return;
        } catch (err) {
            attempt++;
            console.error(`Tentativa ${attempt} falhou: ${err.message}`);
            if (attempt < maxRetries) {
                console.log(`Tentando novamente em ${delayMs / 1000} segundos...`);
                await new Promise(res => setTimeout(res, delayMs));
            } else {
                console.error('Não foi possível conectar ao MySQL após várias tentativas.');
                throw err;
            }
        }
    }
}

connectWithRetry();

module.exports = connection;
