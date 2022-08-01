const { DetectDocumentTextCommand } = require("@aws-sdk/client-textract");
const { TextractClient } = require("@aws-sdk/client-textract");
const fs = require('fs');
const REGION = process.env.REGION || "us-east-1"

const textractClient = new TextractClient({ region: REGION });

const fileToBuffer = (filePath) => Buffer.from(fs.readFileSync(filePath))

const detectText = async (buffer) => {
    try {
        const params = {
            Document: {
                Bytes: buffer
            }
        }
        const analyzeImage = new DetectDocumentTextCommand(params);
        const response = await textractClient.send(analyzeImage);
        return response
    } catch (error) {
        console.log(error);
    }
}

module.exports = { detectText, fileToBuffer }