import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_PORT,

    DEBUG_MODE,

    DB_URL,

    SECRET_KEY,
    
    REFRESH_KEY,

    APP_URL
    
} = process.env