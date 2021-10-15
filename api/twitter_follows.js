const axios = require('axios')
const moment = require('moment')
const writeRows = require('./google')

async function twitFollows(twitter_token) {
    const user_list = [
        'EnnaAlouette',
        'NinaKosaka',
        'MillieParfait',
        'ReimuEndou'
    ]
    writeRows((await getFollows(twitter_token, user_list)).data.data.map(i => {
        return [
            // i.url,
            i.username,
            i.public_metrics.followers_count,
            moment().unix()
        ]
    }))
}

function getFollows(twitter_token, user_list) {
    return axios({
        method: 'get',
        url: 'https://api.twitter.com/2/users/by',
        params: {
            'usernames': user_list.join(),
            'user.fields': 'public_metrics,url'
        },
        headers: {
            'Authorization': `bearer ${twitter_token.access_token}`
        }
    }).catch(err => console.log(err.response.data))
}

module.exports = twitFollows