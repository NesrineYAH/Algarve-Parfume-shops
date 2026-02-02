const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");

exports.generateReturnLabel = async (requestId, user, order) => {
    const filePath = path.join(__dirname, "..", "public", "etiquettes", `${requestId}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- LOGO ---
    const logoPath = path.join(__dirname, "..", "public", "logo.png");
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 100 });
    }

    // --- TITRE ---
    doc.fontSize(24).text("Étiquette de retour", 0, 50, { align: "center" });

    // --- INFOS CLIENT ---
    let y = 150;
    doc.fontSize(14).text(`Client : ${user.prenom} ${user.nom}`, 40, y);
    doc.text(`Email : ${user.email}`, 40, y + 20);
    doc.text(`Commande : ${order._id}`, 40, y + 40);
    doc.text(`Retour : ${requestId}`, 40, y + 60);




    // --- ADRESSE DE RETOUR ---
    y = 350;
    doc.fontSize(16).text("Adresse de retour :", 40, y, { underline: true });
    doc.fontSize(14).text("Algarve Parfume", 40, y + 30);
    doc.text(" Av. Francisco Sá Carneiro", 40, y + 50);
    doc.text("8125-507 Quarteira", 40, y + 70);
    doc.text("Portugal", 40, y + 70 + 20);
    doc.moveDown(2);

    // --- QR CODE ---
    const qrData = `https://algarve-parfume.com/retour/${requestId}`;
    const qrImage = await QRCode.toDataURL(qrData);
    const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");

    doc.image(qrBuffer, 350, 350, { width: 180 });
    doc.fontSize(12).text("Scanner pour suivre le retour", 350, 540);

    // --- CODE BARRES ---
    const barcodePng = await bwipjs.toBuffer({
        bcid: "code128",
        text: requestId.toString(),
        scale: 3,
        height: 12,
        includetext: true,
        textxalign: "center",
    });

    doc.image(barcodePng, 40, 600, { width: 350 });

    doc.end();
    return filePath;
};




