const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res
        .status(200)
        .json({ msg: 'success' })
})


router.get('/reddit/:id', (req, res) => {
    //
})

module.exports = router