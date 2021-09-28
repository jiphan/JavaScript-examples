const express = require('express')
const router = express.Router()
const axios = require('axios')
const keys = require('../keys.json')

router.get('/', (req, res) => {
    res
        .status(200)
        .json({ msg: 'success' })
})

let reddit_token = ''
axios.post('https://www.reddit.com/api/v1/access_token',
    // {
    //     grant_type: 'password',
    //     username: keys.reddit_user,
    //     password: keys.reddit_pass
    // },
    `grant_type=password&username=${keys.reddit_user}&password=${keys.reddit_pass}`,
    {
        headers: {
            'User-Agent': `node:test:1.0 by /u/${keys.reddit_user}`
        },
        auth: {
            username: keys.reddit_id,
            password: keys.reddit_secret
        }
    })
    .then(res => {
        reddit_token = res.data.access_token
    })
    .catch(err => console.log(err))

router.get('/reddit/:id', async (req, res) => {
    let d = await axios.get(`https://www.reddit.com/r/${req.params.id}.json`,
        {
            //
        },
        {
            headers: {
                'User-Agent': `node:test:1.0 by /u/${keys.reddit_user}`,
                Authorization: `bearer ${reddit_token}`
            }
        })
        .catch(err => console.log(err.response.data))

    // if (d) {
    //     for (let i of d.data.data.children) {
    //         console.log(i.data.title)
    //     }
    // }
    res
        .status(200)
        .json(d.data.data.children.map(i => i.data.title))
})

module.exports = router