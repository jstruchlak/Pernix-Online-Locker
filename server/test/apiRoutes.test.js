const request = require('supertest');
const { connectToDatabase, disconnectFromDatabase } = require('./mockdb');
const app = require('../server');
const User = require('../models/userModel');
const Detail = require('../models/detailModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  KEY SECTIONS
// 1.  Setup and Teardown: beforeAll, afterEach, and afterAll prepare the database for testing and clean up any data created during the tests
// 2.  Mocking: jest.mock simulates behavior of database models and middleware
// 3.  API Tests: Each C.R.U.D test block below tests for specific API endpoints (GET, POST, PUT, DELETE) including successful operations and error handling
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('mockdb test', () => {
    expect(true).toBe(true);
});
// Mocking Detail model 
jest.mock('../models/detailModel', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteMany: jest.fn(),
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
}));
// Mocking middleware 
jest.mock('../middleware/requireAuth', () => (req, res, next) => {
    req.user = { _id: 'mockUserId' };
    next();
});
const testUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'P@55W0rdBl@ckb1rd',
};
const testDetailData = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Detail',
    description: 'Test description',
};


///////////////////////////////////////////////////////////////////////////
// TEST GROUP 1. API Tests
///////////////////////////////////////////////////////////////////////////
// Before and After tests - clears data then seeds with mock data
describe('API Tests', () => {
    beforeAll(async () => {
        await connectToDatabase();
        await User.deleteMany({});
        await Detail.deleteMany({});
        await User.create(testUserData);
        await Detail.create(testDetailData);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await User.deleteMany({});
        await Detail.deleteMany({});
        await disconnectFromDatabase();
    });


    ///////////////////////////////////////////////////////////////////////////
    // C.R.U.D Test 1. - Create a User - POST
    ///////////////////////////////////////////////////////////////////////////
    describe('POST /api/user/signup', () => {
        it('should create a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    username: 'anotheruser',
                    email: 'another@example.com',
                    password: 'P@55W0rdJPS291129',
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('email', 'another@example.com');
            expect(response.body).toHaveProperty('token');
        });
    
        it('should return 400 if fields are missing', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'All fields are required');
        });
    
        it('should return 400 if email already exists', async () => {
            // First, create a user with the email to simulate existing email
            await request(app)
                .post('/api/user/signup')
                .send({
                    username: 'existinguser',
                    email: 'existing@example.com',
                    password: 'P@55W0rdJPS291129',
                });
    
            // Now attempt to sign up with the same email
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    username: 'anotheruser',
                    email: 'existing@example.com',
                    password: 'AnotherPassword123!',
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'A user with this email already exists');
        });
    
        it('should return 400 if password is not strong enough', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    username: 'weakpassuser',
                    email: 'weakpass@example.com',
                    password: 'weak', // Example of a weak password
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'Password is too weak');
        });
    });
    

    ///////////////////////////////////////////////////////////////////////////
    // C.R.U.D Test 2. - Read a users details - GET
    ////////////////////////////////////////////////////////////////////////////
    describe('GET /api/details/:id', () => {
        it('should return a detail if a valid id is provided', async () => {
            Detail.findById.mockResolvedValue(testDetailData);
            const res = await request(app).get(`/api/details/${testDetailData._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', testDetailData._id.toString());
            expect(res.body).toHaveProperty('name', testDetailData.name);
        });
        it('should return 404 if id is invalid', async () => {
            const invalidId = '123';
            const res = await request(app).get(`/api/details/${invalidId}`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', 'Does not exist');
        });
        it('should return 404 if detail does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            Detail.findById.mockResolvedValue(null);
            const res = await request(app).get(`/api/details/${nonExistentId}`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', 'Does not exist');
        });


        ///////////////////////////////////////////////////////////////////////////
        // C.R.U.D Test 3. - Update a users details - PUT / PATCH
        ////////////////////////////////////////////////////////////////////////////
        describe('PUT /api/details/:id', () => {
            it('should update a detail with valid data', async () => {
                const updatedDetail = { name: 'Updated Detail', description: 'Updated description' };
                Detail.findByIdAndUpdate.mockResolvedValue({ ...testDetailData, ...updatedDetail });
                const res = await request(app)
                    .patch(`/api/details/${testDetailData._id}`)
                    .send(updatedDetail);
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('name', 'Updated Detail');
                expect(res.body).toHaveProperty('description', 'Updated description');
            });
            it('should return 400 if ID is invalid', async () => {
                const invalidId = '123';
                const res = await request(app)
                    .patch(`/api/details/${invalidId}`)
                    .send({ name: 'Invalid Detail' });
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('error', 'Invalid ID');
            });
            it('should return 404 if detail not found', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();
                Detail.findByIdAndUpdate.mockResolvedValue(null);
                const res = await request(app)
                    .patch(`/api/details/${nonExistentId}`)
                    .send({ name: 'Non-existent Detail' });
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('error', 'Detail not found');
            });
        });



        ///////////////////////////////////////////////////////////////////////////
        // C.R.U.D Test 4. - Delete a users details - DELETE
        ////////////////////////////////////////////////////////////////////////////
        describe('DELETE /api/details/:id', () => {
            it('should delete a detail with a valid ID', async () => {
                Detail.findOneAndDelete.mockResolvedValue(testDetailData);
                const res = await request(app).delete(`/api/details/${testDetailData._id}`);
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('_id', testDetailData._id.toString());
            });
            it('should return 404 if ID is invalid', async () => {
                const invalidId = '123';
                const res = await request(app).delete(`/api/details/${invalidId}`);
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty('error', 'Does not exist');
            });
            it('should return 404 if detail does not exist', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();
                Detail.findOneAndDelete.mockResolvedValue(null);
                const res = await request(app).delete(`/api/details/${nonExistentId}`);
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty('error', 'Does not exist');
            });
        });
    })


    ///////////////////////////////////////////////////////////////////////////
    // TEST GROUP 2.  User Login Tests
    ///////////////////////////////////////////////////////////////////////////
    describe('POST /api/user/login', () => {
        it('should return 400 if username is missing', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    username: testUserData.username,
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'All fields are required');
        });
        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    password: testUserData.password,
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'All fields are required');
        });
        it('should return 400 if password is missing', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    email: testUserData.email,
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'All fields are required');
        });

    });


    describe('POST /api/user/forgot-password', () => {
        beforeAll(async () => {
        
            await User.create({
                username: 'testuser',
                email: 'joeys@pernix.com.au',
                password: 'P@55W0rdJPS291129'
            });
        });
    
        afterAll(async () => {
            
            await User.deleteMany({ email: 'joeys@pernix.com.au' });
        });
    
        it('should send a reset password email for a valid user', async () => {
            const response = await request(app)
                .post('/api/user/forgot-password')
                .send({ email: 'joeys@pernix.com.au' });
    
             expect(response.statusCode).toBe(200);
        }, 15000);
    
        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/api/user/forgot-password')
                .send({}); 
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'Email is required');
        });
    
        it('should return 404 if user does not exist', async () => {
            const response = await request(app)
                .post('/api/user/forgot-password')
                .send({ email: 'nonexistent@example.com' });
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'User with this email does not exist');
        });
    });


    
    
});