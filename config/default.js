module.exports = {
    server: {
        url: process.env.SERVER_URL || 'localhost',
        port: Number(process.env.SERVER_PORT) || 3002,
        protocol: process.env.SERVER_PROTOCOL || 'http',
    },
    common: {
        isDev: process.env.IS_DEV === 'true',
        environment: process.env.ENVIRONMENT || 'local',
    },
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.AWS_ENDPOINT || '',
        sqs: {
            emailQueue: {
                name: process.env.EMAIL_QUEUE_URL || 'emails',
                url: process.env.EMAIL_QUEUE_URL || 'http://localhost:4566/000000000000/emails',
            },
        },
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
