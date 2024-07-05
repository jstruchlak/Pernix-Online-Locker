const express = require('express')
const { 
    createDetail,
    getDetails,
    getDetail,
    updateDetail,
    deleteDetail
 } = require('../controller/detailsController')

const router = express.Router()

// GET all details route
router.get('/', getDetails)

// GET a single detail based off id
router.get('/:id', getDetail)

// POST
router.post('/', createDetail)

// DELETE
router.delete('/:id', deleteDetail)

// UPDATE
router.patch('/:id', updateDetail)


module.exports = router