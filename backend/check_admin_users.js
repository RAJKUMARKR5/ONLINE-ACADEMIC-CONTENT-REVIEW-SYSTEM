const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const emails = ['kr48392425@gmail.com', 'rajkumar@example.com'];
        const users = await User.find({ email: { $in: emails } });
        console.log('--- USER DATA ---');
        console.log(JSON.stringify(users, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
