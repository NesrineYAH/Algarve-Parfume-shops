const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, user, address) => {
    const doc = new PDFDocument({ margin: 50 });

    const invoicePath = path.join(
        __dirname,
        `../invoices/invoice-${order._id}.pdf`
    );

    doc.pipe(fs.createWriteStream(invoicePath));

    // HEADER
    doc
        .fontSize(20)
        .text("FACTURE", { align: "center" })
        .moveDown();

    doc
        .fontSize(12)
        .text(`Numéro de commande : ${order._id}`)
        .text(`Date : ${order.createdAt.toLocaleDateString()}`)
        .moveDown();

    // CLIENT
    doc
        .fontSize(14)
        .text("Informations client", { underline: true })
        .moveDown(0.5);

    doc
        .fontSize(12)
        .text(`${user.prenom} ${user.nom}`)
        .text(address.street)
        .text(`${address.postalCode} ${address.city}`)
        .text(address.country)
        .moveDown();

    // ARTICLES
    doc
        .fontSize(14)
        .text("Détails de la commande", { underline: true })
        .moveDown(0.5);

    order.items.forEach((item) => {
        const price = parseFloat(item.options.prix);
        const total = price * item.quantite;

        doc
            .fontSize(12)
            .text(
                `${item.nom} — ${item.options.size}${item.options.unit} x${item.quantite} : ${total.toFixed(2)} €`
            );
    });

    doc.moveDown();

    // TOTAL
    doc
        .fontSize(16)
        .text(`Total : ${order.totalPrice} €`, { align: "right" });

    doc.end();

    return invoicePath;
};

module.exports = generateInvoice;
