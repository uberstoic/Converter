import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port: number = 5000;

const uploadsDir: string = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface ConvertRequestBody {
    convertTo: 'png' | 'jpg';
}

app.post('/convert', upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { convertTo } = req.body as ConvertRequestBody;
    if (!convertTo || !['png', 'jpg'].includes(convertTo)) {
        return res.status(400).send('Invalid conversion format specified.');
    }

    const outputFileName = `converted-${Date.now()}.${convertTo}`;
    const outputPath = path.join(uploadsDir, outputFileName);

    try {
        await sharp(req.file.buffer)
            .toFormat(convertTo)
            .toFile(outputPath);

        res.download(outputPath, outputFileName, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).send('Error during image conversion.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
