import QrCode from 'qrcode-reader';
import Jimp from 'jimp';

const readQRCode = (imagePath) => {
    return new Promise((resolve, reject) => {
        Jimp.read(imagePath)
            .then(image => {
                const qr = new QrCode();
                
                qr.callback = (err, value) => {
                    if (err) {
                        reject(new Error('Gagal membaca QR Code: ' + err.message));
                        return;
                    }
                    
                    if (!value || !value.result) {
                        reject(new Error('QR Code tidak terdeteksi'));
                        return;
                    }
                    
                    if (!value.result.includes('00020101')) {
                        reject(new Error('Bukan format QRIS yang valid'));
                        return;
                    }
                    
                    resolve(value.result);
                };
                
                qr.decode(image.bitmap);
            })
            .catch(err => {
                reject(new Error('Gagal memproses gambar: ' + err.message));
            });
    });
};

export { readQRCode };
