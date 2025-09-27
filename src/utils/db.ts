import mysql from 'mysql2/promise';


export const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password:  process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        // solo CA se Aiven richiede SSL
        rejectUnauthorized: false,
        ca: process.env.SSL_CERT
    }
});
