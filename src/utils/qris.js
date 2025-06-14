import qrcode from "qrcode";

function toCRC16(str) {
    function charCodeAt(str, i) {
        let get = str.substr(i, 1);
        return get.charCodeAt();
    }

    let crc = 0xffff;
    let strlen = str.length;
    for (let c = 0; c < strlen; c++) {
        crc ^= charCodeAt(str, c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    let hex = crc & 0xffff;
    hex = hex.toString(16).toUpperCase();
    return hex.padStart(4, "0");
}

async function qrisDinamis(qrstring, nominal, path) {
    let qris2 = qrstring.slice(0, -4);
    let replaceQris = qris2.replace("010211", "010212");
    let pecahQris = replaceQris.split("5802ID");
    let uang =
        "54" + ("0" + nominal.toString().length).slice(-2) + nominal + "5802ID";

    let output =
        pecahQris[0] +
        uang +
        pecahQris[1] +
        toCRC16(pecahQris[0] + uang + pecahQris[1]);

    await qrcode.toFile(path, output, { margin: 2, scale: 10 });
    return path;
}

async function qrisDinamisBuffer(qrstring, nominal) {
    let qris2 = qrstring.slice(0, -4);
    let replaceQris = qris2.replace("010211", "010212");
    let pecahQris = replaceQris.split("5802ID");
    let uang =
        "54" + ("0" + nominal.toString().length).slice(-2) + nominal + "5802ID";

    let output =
        pecahQris[0] +
        uang +
        pecahQris[1] +
        toCRC16(pecahQris[0] + uang + pecahQris[1]);

    // Menghasilkan buffer QR Code
    const qrBuffer = await qrcode.toBuffer(output, { margin: 2, scale: 10 });
    return qrBuffer;
}

export { qrisDinamis, qrisDinamisBuffer, toCRC16 };
