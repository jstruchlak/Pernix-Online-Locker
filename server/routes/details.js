const express = require('express')
const Detail = require('../models/detailModel')

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
router.post('/', async (req, res) => {
    const { fullName, dob, aboutMe } = req.body

    // try and create a new documemt with the properties from schema
    try{
        const detail = await Detail.create({fullName, dob, aboutMe})
        res.status(200).json(detail)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
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