import { qrisDinamis, qrisDinamisBuffer } from '../utils/qris.js';
import { readQRCode } from './qrReaderService.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store for temporary QRIS data
const qrisStore = new Map();
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

const generateRandomDigits = () => {
    return Math.floor(Math.random() * 900) + 100;
};

const cleanupExpiredQRIS = async (qrisId) => {
    try {
        const qrisData = qrisStore.get(qrisId);
        if (qrisData && qrisData.filePath) {
            await fs.unlink(qrisData.filePath).catch(() => {});
        }
        qrisStore.delete(qrisId);
    } catch (error) {
        console.error('Error cleaning up QRIS:', error);
    }
};

const processStaticQRIS = async (imagePath) => {
    try {
        const qrisString = await readQRCode(imagePath);
        
        // Generate unique ID for this QRIS session
        const qrisId = uuidv4();
        
        // Store the QRIS string temporarily
        qrisStore.set(qrisId, {
            qrisString: qrisString,
            uploadedAt: Date.now()
        });
        
        // Clean up uploaded file
        await fs.unlink(imagePath).catch(() => {});
        
        return {
            qrisId: qrisId,
            message: 'QRIS berhasil dibaca dan siap untuk generate dinamis'
        };
    } catch (error) {
        // Clean up uploaded file on error
        await fs.unlink(imagePath).catch(() => {});
        throw error;
    }
};

const generateDynamicQRIS = async (qrisId, baseNominal) => {
    const qrisData = qrisStore.get(qrisId);
    
    if (!qrisData) {
        throw new Error('QRIS ID tidak ditemukan atau sudah expired');
    }
    
    if (!qrisData.qrisString) {
        throw new Error('Data QRIS tidak valid');
    }
    
    // Validate nominal
    if (isNaN(baseNominal) || baseNominal <= 0) {
        throw new Error('Nominal harus berupa angka positif');
    }
    
    // Generate random digits and final nominal
    const randomDigits = generateRandomDigits();
    const finalNominal = parseInt(`${baseNominal}${randomDigits}`);
    
    // Generate output path
    const outputPath = path.join(__dirname, '../../uploads', `qris_dynamic_${qrisId}.jpg`);
    
    try {
        // Generate dynamic QRIS
        await qrisDinamis(qrisData.qrisString, finalNominal, outputPath);
        
        // Calculate expiration time
        const expirationTime = Date.now() + EXPIRATION_TIME;
        
        // Update store with generated file info
        qrisStore.set(qrisId, {
            ...qrisData,
            filePath: outputPath,
            finalNominal: finalNominal,
            expirationTime: expirationTime,
            generatedAt: Date.now()
        });
        
        // Set cleanup timeout
        setTimeout(() => cleanupExpiredQRIS(qrisId), EXPIRATION_TIME);
        
        return {
            qrisId: qrisId,
            nominal: finalNominal,
            filePath: outputPath,
            expirationTime: expirationTime,
            message: `QRIS Dinamis berhasil dibuat dengan nominal Rp ${finalNominal.toLocaleString('id-ID')}`
        };
    } catch (error) {
        // Clean up on error
        await fs.unlink(outputPath).catch(() => {});
        throw new Error('Gagal membuat QRIS dinamis: ' + error.message);
    }
};

const getQRISFile = async (qrisId) => {
    const qrisData = qrisStore.get(qrisId);
    
    if (!qrisData) {
        throw new Error('QRIS tidak ditemukan');
    }
    
    if (!qrisData.filePath) {
        throw new Error('File QRIS belum di-generate');
    }
    
    // Check if file exists
    try {
        await fs.access(qrisData.filePath);
        return qrisData;
    } catch (error) {
        qrisStore.delete(qrisId);
        throw new Error('File QRIS tidak ditemukan atau sudah expired');
    }
};

const generateDynamicQRISBuffer = async (qrisId, baseNominal) => {
    const qrisData = qrisStore.get(qrisId);
    
    if (!qrisData) {
        throw new Error('QRIS ID tidak ditemukan atau sudah expired');
    }
    
    if (!qrisData.qrisString) {
        throw new Error('Data QRIS tidak valid');
    }
    
    // Validate nominal
    if (isNaN(baseNominal) || baseNominal <= 0) {
        throw new Error('Nominal harus berupa angka positif');
    }
    
    // Generate random digits and final nominal
    const randomDigits = generateRandomDigits();
    const finalNominal = parseInt(`${baseNominal}${randomDigits}`);
    
    try {
        // Generate dynamic QRIS as buffer
        const qrBuffer = await qrisDinamisBuffer(qrisData.qrisString, finalNominal);
        
        return {
            qrisId: qrisId,
            nominal: finalNominal,
            buffer: qrBuffer,
            message: `QRIS Dinamis berhasil dibuat dengan nominal Rp ${finalNominal.toLocaleString('id-ID')}`
        };
    } catch (error) {
        throw new Error('Gagal membuat QRIS dinamis: ' + error.message);
    }
};

export {
    processStaticQRIS,
    generateDynamicQRIS,
    generateDynamicQRISBuffer,
    getQRISFile,
    cleanupExpiredQRIS
};
