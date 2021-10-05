const app = require('express')()
const port = process.env.PORT || 3000
const https = require('https')

const fs = require('fs')
const key = fs.readFileSync('./key.pem')
const cert = fs.readFileSync('./cert.pem')
const server = https.createServer({ key: key, cert: cert }, app)

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

server.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`)
})


app.use(require('./api/logger'))
app.use('/api/', require('./api/test'))
app.use('/api/reddit', require('./api/reddit'))