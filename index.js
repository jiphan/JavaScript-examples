const express = require('express')
const logger = require('./middleware/logger')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


app.use(logger)
app.use('/api/members', require('./api/members'))