const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        // Check if admin 'rajkumar' exists
        const adminEmail = 'rajkumar@example.com'; // User requested "emailid" as "rajkumar"
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Seeding default admin...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('rajkumar2425', salt);

            await User.create({
                name: 'Rajkumar',
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin',
                isApproved: true,
                expertise: ['Administration']
            });

            console.log('Default Admin "rajkumar" created successfully.');
        } else {
            console.log('Default Admin "rajkumar" already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
