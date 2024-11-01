const express = require('express')
const { 
    createDetail,
    getDetails,
    getDetail,
    updateDetail,
    deleteDetail
 } = require('../controller/detailsController')

 
const requireAuth = require('../middleware/requireAuth')
const upload = require('../middleware/multerConfig');


const router = express.Router()

// first check if user is authenticated before accessing any other routes
router.use(requireAuth)

// GET all details route
router.get('/', getDetails)

// GET a single detail based off id
router.get('/:id', getDetail)

// POST
router.post('/', upload.single('profilePic'), createDetail);

// DELETE
router.delete('/:id', deleteDetail)

// UPDATE
router.patch('/:id', upload.single('profilePic'), updateDetail);


module.exports = router