const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const emails = ['kr48392425@gmail.com', 'rajkumar@example.com'];
        const users = await User.find({ email: { $in: emails } });
        console.log('--- DETAILED USER DATA ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}`);
            console.log(`Role: ${u.role}`);
            console.log(`Status: ${u.status}`);
            console.log(`isApproved: ${u.isApproved}`);
            console.log('---');
        });
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
