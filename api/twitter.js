const axios = require('axios')
const keys = require('../keys.json')

async function twitAuth() {
    return axios.post(
        'https://api.twitter.com/oauth2/token',
        'grant_type=client_credentials',
        {
            auth: {
                username: keys.twitter.consumer_key,
                password: keys.twitter.consumer_secret
            }
        }).catch(err => console.log(err.response))
}

module.exports = twitAuth