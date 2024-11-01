const Detail = require('../models/detailModel')
const mongoose = require('mongoose')
const upload = require('../middleware/multerConfig')

// GET all functon
const getDetails = async (req, res) => {
    // add user_id from request body
    const user_id = req.user._id
    const details = await Detail.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(details)

}


// GET a single function
const getDetail = async (req, res) => {
    const { id } = req.params;

    console.log('Received request to get detail for ID:', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ID format:', id);
        return res.status(404).json({ error: 'Does not exist' });
    }

    try {
        const detail = await Detail.findById(id);
        console.log('Detail retrieved:', detail);

        if (!detail) {
            console.log('Detail not found for ID:', id);
            return res.status(404).json({ error: 'Does not exist' });
        }

        return res.status(200).json(detail);
    } catch (error) {
        console.error('Error retrieving detail:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



// CREATE function
const createDetail = async (req, res) => {
    const { fullName, dob, aboutMe } = req.body

    // error handling check
    let emptyFields = []

    if (!fullName) {
        emptyFields.push('Full Name')
    }
    if (!dob) {
        emptyFields.push('Date of Birth')
    }
    if (!aboutMe) {
        emptyFields.push('Role')
    }
    if (!req.file) {
        emptyFields.push('Profile Picture');
    }


    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'All fields are required', emptyFields })
    }


    // try and create a new documemt with the properties from schema
    try {
        const profilePic = req.file.path;
        const user_id = req.user._id
        const detail = await Detail.create({ fullName, dob, aboutMe, profilePic, user_id });
        res.status(200).json(detail)
    } catch (error) {
        res.status(400).json({ error: error.message })

    }
}


// DELETE functon
const deleteDetail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Does not exist' });
    }

    try {
        const detail = await Detail.findOneAndDelete({ _id: id });

        if (!detail) {
            return res.status(404).json({ error: 'Does not exist' });
        }

        res.status(200).json(detail);
    } catch (error) {
        console.error('Error deleting detail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// UPDATE function
const updateDetail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        let updateFields = { ...req.body };

        if (req.file) {
            updateFields.profilePic = req.file.path;
        }

        const updatedDetail = await Detail.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedDetail) {
            return res.status(400).json({ error: 'Detail not found' });
        }

        res.status(200).json(updatedDetail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



module.exports = {
    createDetail,
    getDetails,
    getDetail,
    deleteDetail,
    updateDetail
}