// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
module.exports = {
    db: 'mongodb://localhost/bb',
    bloodBankModel: 'bloodbanks',
    sessionSecret: 'developmentSessionSecret',
    facebook: {
        clientID: '1683963698572532',
        clientSecret: 'e86de4528e2e963d76e757eed7b5d0d5',
        callbackURL: 'http://localhost:3000/oauth/facebook/callback'
    },
    twitter: {
        clientID: 'Twitter Application ID',
        clientSecret: 'Twitter Application Secret',
        callbackURL: 'http://localhost:3000/oauth/twitter/callback'
    },
    google: {
        clientID: '55955499503-q7v1p8tnrd9rb7kbj0218popm7dc1559.apps.googleusercontent.com',
        clientSecret: '1CIrPpWr53K_w5iHvWPPSNU8',
        callbackURL: 'http://localhost:3000/oauth/google/callback'
    }
};
