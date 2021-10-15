const app = require('express')()
const port = process.env.PORT || 3000

app.set('json spaces', 2)
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Hello World' })
})
app.get('/api', (req, res) => {
    res.send([
        '/',
        '/api',
        // '/reddit/{subreddit}'
    ])
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use(require('./api/logger'))
app.use('/api/', require('./api/test'))
app.use('/api/reddit', require('./api/reddit'))

require('./api/twitter_stream')