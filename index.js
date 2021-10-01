const app = require('express')()
const port = process.env.PORT || 8080

app.set('json spaces', 2)
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


app.use(require('./api/logger'))
app.use('/api/', require('./api/test'))