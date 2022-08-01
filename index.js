const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const textract = require('./textract.js');

const getCodeFromImage = async (buffer) => {
    const res = await textract.detectText(buffer);

    return res.Blocks.find(block => block.BlockType === 'WORD' && block.Text.startsWith('PC')).Text;
}

const mvPromise = (file) => {
    file.mvPromise = (filePath) => new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
    return file
}

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
}));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        let targetFile = req.files.t_file;
        targetFile = mvPromise(targetFile);
        const filePath = path.join(__dirname, 'uploads', targetFile.name)
        await targetFile.mvPromise(filePath)
        const code = await getCodeFromImage(textract.fileToBuffer(filePath))
        res.send(code);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Your app listening on port 3000'));