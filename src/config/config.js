process.env.PORT = process.env.PORT || 3000;


if (!process.env.URLDB) {

    process.env.URLDB = 'mongodb://localhost:27017/tdea';

}

process.env.SENDGRID_API_KEY = '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';