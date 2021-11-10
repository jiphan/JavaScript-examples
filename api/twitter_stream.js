const needle = require('needle');

(async () => {
    const twitter_token = (await require('./twitter')()).data

    twitStream(twitter_token, 20)
    handleInput(twitter_token)
})()

function handleInput(twitter_token) {
    return require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }).on('line', input => {
        let args = input.split(' ')
        switch (args[0]) {
            case 'add':
                addTwitRule(twitter_token, args[1])
                break
            case 'add2':
                args.shift()
                add2TwitRule(twitter_token, args.join(' '))
                break
            case 'delete':
                args.shift()
                delTwitRule(twitter_token, args)
                break
            case 'read':
                readTwitRule(twitter_token)
                break
            case 'retry':
                twitStream(twitter_token, 10)
                break
            case 'write':
                require('./google')([[args[1]]], 'twitarchiver!A1')
                break
            default:
                console.log('404')
                console.log(args)
        }
    })
}

async function readTwitRule(twitter_token) {
    needle('get',
        'https://api.twitter.com/2/tweets/search/stream/rules', {},
        {
            headers: {
                'Authorization': `bearer ${twitter_token.access_token}`
            }
        }
    ).then(res => console.log(res.body.data))
}

async function add2TwitRule(twitter_token, rule) {
    needle('post',
        'https://api.twitter.com/2/tweets/search/stream/rules',
        {
            'add': [{ 'value': `${rule}` }]
        },
        {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${twitter_token.access_token}`
            }
        }
    ).then(res => console.log(res.body))
}

async function addTwitRule(twitter_token, username) {
    needle('post',
        'https://api.twitter.com/2/tweets/search/stream/rules',
        {
            'add': [{ 'value': `from:${username} has:media -is:retweet` }]
        },
        {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${twitter_token.access_token}`
            }
        }
    ).then(res => console.log(res.body))
}

async function delTwitRule(twitter_token, ids) {
    needle('post',
        'https://api.twitter.com/2/tweets/search/stream/rules',
        {
            'delete': { 'ids': ids }
        },
        {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${twitter_token.access_token}`
            }
        }
    ).then(res => console.log(res.body))
}

async function twitStream(twitter_token, retryAttempt) {
    const stream = needle.get(getStreamUrl(), {
        headers: {
            'Authorization': `bearer ${twitter_token.access_token}`
        },
        timeout: 60000
    }).on('header', header => {
        console.log('Status:', header)
    })

    stream.on('data', data => {
        try {
            let res = parse(JSON.parse(data))
            console.log(JSON.parse(data).includes)
            require('./google')([[
                res.username,
                res.text,
                res.images,
                res.tweet_id,
                res.timestamp,
                'twitter.com/i/status/' + res.tweet_id
            ]], 'twitarchiver!A1')
            retryAttempt = 10
        } catch (e) {
            if (data.detail) console.log(data.detail)
        }
    })
    stream.on('done', err => {
        console.log(err)
        setTimeout(() => {
            console.log('Reconnecting...')
            twitStream(twitter_token, ++retryAttempt)
        }, 2 ** retryAttempt)
    })
    return stream
}

function parse(json) {
    let media = ''
    if (json.includes.media) {
        if (json.includes.media[0].url) media = json.includes.media.map(i => i.url)
    }
    return {
        username: json.includes.users.filter(i => i.id == json.data.author_id)[0].username,
        text: json.data.text,
        images: media,
        tweet_id: json.data.id,
        timestamp: json.data.created_at,
        rule: json.matching_rules.map(i => i.id)
    }
}

function getStreamUrl() {
    const url = new URL('https://api.twitter.com/2/tweets/search/stream')
    url.searchParams.append('expansions', 'author_id,attachments.media_keys,referenced_tweets.id')
    url.searchParams.append('media.fields', 'media_key,url')
    url.searchParams.append('tweet.fields', 'created_at')
    url.searchParams.append('user.fields', 'name,username')
    return url.href
}

module.exports = {
    twitStream,
    handleInput,
    addTwitRule
}