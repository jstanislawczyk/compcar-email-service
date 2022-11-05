module.exports = {
    server: {
        port: Number(process.env.SERVER_PORT) || 3002,
    },
    common: {
        isDev: process.env.IS_DEV === 'true',
        environment: process.env.ENVIRONMENT || 'local',
    },
    email: {
        host: process.env.EMAIL_HOST || 'localhost',
        port: {
            smtp: Number(process.env.EMAIL_PORT_SMTP) || 1025,
            http: Number(process.env.EMAIL_PORT_HTTP) || 8025,
        },
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.EMAIL_USER || 'test_email_user@sometestmail.com',
            password: process.env.EMAIL_PASS || 'pass',
        },
    },
};
