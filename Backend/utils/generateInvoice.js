const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, user, address) => {
    // 📁 Dossier où stocker les factures
    const invoicesDir = path.join(__dirname, "../public/invoices");

    // 🔥 Créer le dossier s'il n'existe pas
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // 🔥 Chemin complet du fichier PDF (IMPORTANT)
    const invoicePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);

    // 📝 Création du PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(invoicePath));

    // --- CONTENU DE LA FACTURE ---
    doc.fontSize(20).text("FACTURE", { align: "center" }).moveDown();

    doc.fontSize(12)
        .text(`Commande : ${order._id}`)
        .text(`Date : ${order.createdAt.toLocaleDateString()}`)
        .moveDown();

    doc.fontSize(14).text("Client", { underline: true }).moveDown(0.5);
    doc.fontSize(12)
        .text(`${user.prenom} ${user.nom}`)
        .text(address.street)
        .text(`${address.postalCode} ${address.city}`)
        .text(address.country)
        .moveDown();

    doc.fontSize(14).text("Articles", { underline: true }).moveDown(0.5);

    order.items.forEach(item => {
        const total = parseFloat(item.options.prix) * item.quantite;
        doc.fontSize(12).text(
            `${item.nom} - ${item.options.size}${item.options.unit} x${item.quantite} : ${total.toFixed(2)} €`
        );
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total : ${order.totalPrice} €`, { align: "right" });
    doc.end();

    return invoicePath;
};

module.exports = generateInvoice;

