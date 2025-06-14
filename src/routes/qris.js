import express from 'express';
import upload from '../middleware/upload.js';
import {
    processStaticQRIS,
    generateDynamicQRIS,
    generateDynamicQRISBuffer,
    getQRISFile
} from '../services/qrisService.js';

const router = express.Router();

// POST /api/qris/upload - Upload static QRIS image
router.post('/upload', upload.single('qris'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File QRIS harus diupload'
            });
        }

        const result = await processStaticQRIS(req.file.path);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/qris/generate - Generate dynamic QRIS with nominal
router.post('/generate', async (req, res, next) => {
    try {
        const { qrisId, nominal } = req.body;
        
        if (!qrisId) {
            return res.status(400).json({
                success: false,
                message: 'qrisId harus disediakan'
            });
        }
        
        if (!nominal) {
            return res.status(400).json({
                success: false,
                message: 'nominal harus disediakan'
            });
        }
        
        const baseNominal = parseInt(nominal);
        const result = await generateDynamicQRIS(qrisId, baseNominal);
        
        res.json({
            success: true,
            data: {
                qrisId: result.qrisId,
                nominal: result.nominal,
                expirationTime: result.expirationTime,
                message: result.message
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/qris/generate-buffer - Generate dynamic QRIS as buffer
router.post('/generate-buffer', async (req, res, next) => {
    try {
        const { qrisId, nominal } = req.body;
        
        if (!qrisId) {
            return res.status(400).json({
                success: false,
                message: 'qrisId harus disediakan'
            });
        }
        
        if (!nominal) {
            return res.status(400).json({
                success: false,
                message: 'nominal harus disediakan'
            });
        }
        
        const baseNominal = parseInt(nominal);
        const result = await generateDynamicQRISBuffer(qrisId, baseNominal);
        
        // Set headers for image response
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qris-dynamic-${result.nominal}.png"`
        });
        
        res.send(result.buffer);
    } catch (error) {
        next(error);
    }
});

// GET /api/qris/:id - Get generated QRIS file
router.get('/:id', async (req, res, next) => {
    try {
        const qrisId = req.params.id;
        const qrisData = await getQRISFile(qrisId);
        
        // Send file
        res.sendFile(qrisData.filePath, (err) => {
            if (err) {
                next(new Error('Gagal mengirim file QRIS'));
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/qris/:id/info - Get QRIS info without downloading file
router.get('/:id/info', async (req, res, next) => {
    try {
        const qrisId = req.params.id;
        const qrisData = await getQRISFile(qrisId);
        
        res.json({
            success: true,
            data: {
                qrisId: qrisId,
                nominal: qrisData.finalNominal,
                expirationTime: qrisData.expirationTime,
                generatedAt: qrisData.generatedAt,
                isExpired: Date.now() > qrisData.expirationTime
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
