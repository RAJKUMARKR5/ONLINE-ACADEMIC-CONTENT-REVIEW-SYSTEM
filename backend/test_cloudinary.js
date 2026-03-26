require('dotenv').config();
const { cloudinary, uploadCloud } = require('./config/cloudinaryConfig');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.post('/test-upload', (req, res, next) => {
    uploadCloud.single('file')(req, res, function (err) {
        if (err) {
            console.error('MULTER ERROR:', err);
            return res.status(500).json({ error: err.message || err.toString() });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ file: req.file });
    });
});

// Create a dummy PDF to test
const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
fs.writeFileSync(dummyPdfPath, 'Dummy PDF content');

const FormData = require('form-data');
const axios = require('axios');

app.listen(5001, async () => {
    console.log('Test server running on 5001');
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyPdfPath));
        
        console.log('Sending request...');
        const res = await axios.post('http://localhost:5001/test-upload', form, {
            headers: form.getHeaders(),
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Upload Error:', err.response ? err.response.data : err.message);
    }
    process.exit(0);
});
