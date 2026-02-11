//controllers/return.js
const ReturnRequest = require("../Model/ReturnRequest.js");
const Order = require("../Model/Order.js");
const { sendEmail } = require("../utils/mailer.js"); // ⭐ tu l'as déjà
const { generateReturnLabel } = require("../utils/generateReturnLabel.js");


exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, productId, reason, description } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        const alreadyRequested = await ReturnRequest.findOne({
            userId: req.user.userId,
            orderId,
            productId,
        });

        if (alreadyRequested) {
            return res.status(400).json({ message: "Retour déjà demandé pour ce produit" });
        }
        // 1️⃣ Créer la demande de retour
        const request = await ReturnRequest.create({
            userId: req.user.userId,
            orderId,
            productId,
            reason,
            description,
        });

        // 2️⃣ Mettre la commande en refunded automatiquement
        order.status = "refunded";
        order.paymentStatus = "refunded";
        order.refundedAt = new Date();
        await order.save();

        // 3️⃣ Générer l’étiquette PDF
        const filePath = generateReturnLabel(request._id, req.user, order);

        // 4️⃣ Envoyer l’email
        const html = `
      <h2>Votre demande de retour est bien enregistrée</h2>
      <p>Bonjour ${req.user.prenom},</p>

      <p>Nous avons bien reçu votre demande de retour pour la commande 
      <strong>${orderId}</strong>.</p>

      <p><strong>Raison :</strong> ${reason}</p>
      ${description ? `<p><strong>Détails :</strong> ${description}</p>` : ""}

      <br/>

      <h3>📦 Étiquette de retour</h3>
      <p>Vous pouvez télécharger votre étiquette de retour ici :</p>

      <a href="http://localhost:5001/etiquettes/${request._id}.pdf"
         style="background:#4c6ef5;color:white;padding:10px 15px;text-decoration:none;border-radius:8px;">
<button> Télécharger l’étiquette de retour </button>
      </a>

      <br/><br/>
      <p>Notre équipe vous contactera dès que votre retour sera traité.</p>
      <p>Merci pour votre confiance.</p>
    `;

        await sendEmail({
            to: req.user.email,
            subject: "Confirmation de votre demande de retour",
            html,
            text: "Votre demande de retour est enregistrée.",
        });

        res.json({ success: true, request });

    } catch (err) {
        console.error("Erreur createReturnRequest :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


/*

exports.createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason, description } = req.body;

    if (!orderId || !productId || !reason) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    const productInOrder = order.products.find(p => p._id.toString() === productId);
    if (!productInOrder) return res.status(400).json({ message: "Produit non trouvé dans la commande" });

    const existingRequest = await ReturnRequest.findOne({
      userId: req.user.userId,
      orderId,
      productId
    });
    if (existingRequest) return res.status(400).json({ message: "Retour déjà demandé" });

    const request = await ReturnRequest.create({
      userId: req.user.userId,
      orderId,
      productId,
      reason,
      description
    });

    // Optionnel : ne pas passer automatiquement à refunded
    order.status = "return_requested";
    await order.save();

    const filePath = generateReturnLabel(request._id, req.user, order);


    const emailHtml = "";

    await sendEmail({
      to: req.user.email,
      subject: "Demande de retour reçue",
      html: emailHtml,
      text: "Votre demande de retour est enregistrée."
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("Erreur createReturnRequest :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
*/

/*





est ce que la route de retour d'un produit ou une commande est recommandé d'être parmis les routes d'orders ou bien comme j'ai fais moi dans un fichier séparé return.js 


*/