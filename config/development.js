module.exports = {
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME_DEV,
        options: {
            useNewUrlParser: true,
            auth: {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            }
        }
    },
    app: {
        port: process.env.PORT || 4001,
        passwordPattern: /\w{6,}/,
        appURL: process.env.APP_URL,
    },
    auth: {
        facebook: {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
        }
    },
    SendInBlue: {
        apiKey: process.env.SENDINBLUE_API_KEY_TEST || '',
        sender: {
            name: 'The Wally Shop',
            email: 'support@thewallyshop.co',
        }
    },
    stripe: {
        secret: process.env.STRIPE_SECRET,
    }
};
