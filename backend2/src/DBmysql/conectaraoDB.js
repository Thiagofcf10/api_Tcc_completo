const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env



// Prefer non-colliding env var names so we don't pick up the OS user (e.g. process.env.USER)
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '112233';
// Support either DB_NAME or DB_DATABASE (some .env files use DB_DATABASE)
const DB_NAME = process.env.DB_NAME || process.env.DB_DATABASE;

if (!process.env.DB_USER && process.env.USER) {
    console.warn('Warning: using process.env.USER for DB user. Consider renaming your .env entries to DB_USER/DB_PASSWORD/DB_NAME to avoid clobbering by OS env vars.');
}

const connection = mysql.createPool({
    host: DB_HOST,      // Host do MySQL
    user: DB_USER,      // Usuário MySQL
    password: DB_PASSWORD,  // Senha MySQL
    database: DB_NAME,   // Banco de dados
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    connectTimeout: 10000,
    supportBigNumbers: true,
    bigNumberStrings: true
});

async function ensureUtf8Compatibility() {
    try {
        const poolConnection = await connection.getConnection();
        try {
            await poolConnection.execute('SET NAMES utf8mb4');
            await poolConnection.query("ALTER TABLE arquivos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            await poolConnection.query("ALTER TABLE arquivos MODIFY nome_arquivo VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            await poolConnection.query("ALTER TABLE arquivos MODIFY caminho_arquivo VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            const legacyColumnAdjustments = [
                "ALTER TABLE arquivos MODIFY justificativa TEXT NULL DEFAULT ''",
                "ALTER TABLE arquivos MODIFY objetivo TEXT NULL DEFAULT ''",
                "ALTER TABLE arquivos MODIFY sumario TEXT NULL DEFAULT ''",
                "ALTER TABLE arquivos MODIFY introducao TEXT NULL DEFAULT ''",
                "ALTER TABLE arquivos MODIFY bibliografia TEXT NULL DEFAULT ''"
            ];

            for (const statement of legacyColumnAdjustments) {
                try {
                    await poolConnection.query(statement);
                } catch (alterErr) {
                    if (alterErr && ['ER_BAD_FIELD_ERROR', 'ER_PARSE_ERROR', 'ER_NO_SUCH_TABLE'].includes(alterErr.code)) {
                        continue;
                    }
                    throw alterErr;
                }
            }
        } finally {
            poolConnection.release();
        }
    } catch (err) {
        if (err && err.code !== 'ER_NO_SUCH_TABLE') {
            console.warn('Não foi possível ajustar o charset do MySQL para utf8mb4:', err.message);
        }
    }
}

connection.getConnection()
    .then(() => {
        console.log('Conectado ao MySQL!');
        return ensureUtf8Compatibility();
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MySQL:', err.message);
    });
// Exporte a conexão para usar em outros arquivos
module.exports = connection;