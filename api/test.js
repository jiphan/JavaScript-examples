const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({ msg: 'success' })
})

router.get('/:id', async (req, res) => {
    res.status(200).json({
        msg: req.params.id
    })
})

module.exports = router