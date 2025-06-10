import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    databaseUrl: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '30d',
    mailerSendApiKey: process.env.MAILERSEND_API_KEY,
    mailerSendSenderEmail: process.env.MAILERSEND_SENDER_EMAIL,
};

export default config;