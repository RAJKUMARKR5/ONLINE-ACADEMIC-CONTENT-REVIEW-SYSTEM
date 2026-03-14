const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Submission = require('./models/Submission');

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const sub = await Submission.findOne({ title: 'recursion' });
        if (sub) {
            console.log(`SUBMISSION_STATUS: ${sub.status}`);
            console.log(`PUBLISHED_AT: ${sub.publishedAt}`);
        } else {
            console.log('Submission not found');
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
