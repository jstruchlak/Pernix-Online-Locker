const express = require('express')

const router = express.Router()

// GET all details route
router.get('/', (req, res) => {
    res.json({mssg: 'GET all details'})
})

// GET a single detail based off id
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single detail'})
})

// POST
router.post('/', (req, res) => {
    res.json({mssg: 'POST new detail'})
})

// DELETE
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE new detail'})
})

// UPDATE
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE new detail'})
})


module.exports = router