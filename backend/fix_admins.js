const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixAdminUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Fix specific admins reported by user
        const emails = ['kr48392425@gmail.com', 'rajkumar@example.com'];
        const result1 = await User.updateMany(
            { email: { $in: emails } },
            { $set: { role: 'Admin', status: 'Approved', isApproved: true } }
        );
        console.log(`Admins updated: ${result1.modifiedCount}`);

        // 2. Consistency fix: isApproved: true should imply status: 'Approved'
        const result2 = await User.updateMany(
            { isApproved: true, status: 'Pending' },
            { $set: { status: 'Approved' } }
        );
        console.log(`Inconsistent users fixed: ${result2.modifiedCount}`);

        await mongoose.connection.close();
        console.log('Fix complete.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixAdminUsers();
