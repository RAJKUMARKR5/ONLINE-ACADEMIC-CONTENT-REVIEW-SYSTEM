const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testDelete = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find a test user to delete (one that is declined or unapproved)
        const userToDelete = await User.findOne({ 
            email: { $nin: ['kr48392425@gmail.com', 'rajkumar@example.com'] },
            status: { $in: ['Declined', 'Pending'] }
        });

        if (!userToDelete) {
            console.log('No eligible test user found to delete.');
            await mongoose.connection.close();
            return;
        }

        console.log(`Attempting to delete user: ${userToDelete.email} (${userToDelete._id})`);
        
        // Simulate the logic in the route
        const adminEmail = 'kr48392425@gmail.com';
        if (adminEmail !== 'kr48392425@gmail.com') {
            console.log('Permission check failed (simulation).');
        } else {
            const result = await User.deleteOne({ _id: userToDelete._id });
            console.log('Delete result:', result);
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testDelete();
