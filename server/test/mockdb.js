const mongoose = require('mongoose');

// connect to the database
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.TEST_DB_URI);
        console.log('Connected to db'); 
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};

// disconnect from the database
const disconnectFromDatabase = async () => {
   
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

// Export the connection functions for use in 'apiRoutes.test.js'
module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
};


describe('Database Connection', () => {
    it('should connect and disconnect from the database', async () => {
        await connectToDatabase();
        expect([1, 2]).toContain(mongoose.connection.readyState);
        await disconnectFromDatabase();
        expect(mongoose.connection.readyState).toBe(0); 
    });
});
