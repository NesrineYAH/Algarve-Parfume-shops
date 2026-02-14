//controllers/return.js 
const Return = require("../Model/Return.js");
const Order = require("../Model/Order.js");
const { sendEmail } = require("../utils/mailer.js");
const { generateReturnLabel } = require("../utils/generateReturnLabel");

exports.createReturnRequest = async (req, res) => {
  try {
    const dbUser = req.user; // <-- IMPORTANT, c'est lui qu'on utilise
    const { orderId, products, reason, description } = req.body;

    // 🔐 Validation
    if (!orderId || !products || products.length === 0 || !reason) {
      return res.status(400).json({ message: "Données invalides" });
    }

    // 🟢 1. Création du retour
    const newReturn = new Return({
      //  userId: req.user._id,
      //  userId: req.user.userId,
      userId: dbUser._id, // ✅ Mongo _id
      orderId,
      products,
      reason,
      description,
    });

    await newReturn.save();

    // 🟢 2. Génération des étiquettes de retour
    // 👉 une étiquette par produit
    const labelLinks = [];

    for (const item of products) {
      const labelPath = await generateReturnLabel({
        returnId: newReturn._id,
        orderId,
        productId: item.productId,
        //  user: req.user,
        user: dbUser, // ✅ USER COMPLET

      });

      labelLinks.push(labelPath);
    }

    // 🟢 3. Email de confirmation + liens des étiquettes
    const html = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f2f2f2;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }

      h2 {
        text-align: center;
        font-size: 26px;
        color: #333;
        margin-bottom: 20px;
      }

      .btn {
        display: inline-block;
        background: #ff4f9a; /* Rose */
        color: white;
        padding: 12px 18px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .btn:hover {
        background: #e04388;
      }

      p, li {
        font-size: 15px;
        color: #444;
      }

      .labels {
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>Demande de retour confirmée</h2>

      <p>Bonjour ${req.user.prenom},</p>

      <p>
        Votre demande de retour pour la commande
        <strong>${orderId}</strong> a bien été enregistrée.
      </p>

      <p><strong>Raison :</strong> ${reason}</p>
      ${description ? `<p><strong>Détails :</strong> ${description}</p>` : ""}

      <h3>📦 Étiquette(s) de retour</h3>

      <div class="labels">
        ${labelLinks
        .map(
          (link) => `
              <a class="btn" href="${link}" target="_blank">
                📄 Télécharger l’étiquette
              </a>
            `
        )
        .join("<br>")
      }
      </div>

      <p style="margin-top: 25px;">Merci pour votre confiance.</p>
    </div>
  </body>
</html>
`;

    await sendEmail({
      // to: req.user.email,
      to: dbUser.email,
      subject: "Confirmation de votre retour",
      html,
      text: "Votre demande de retour a bien été enregistrée.",
    });

    // 🟢 Réponse finale
    res.status(201).json({
      success: true,
      message: "Demande de retour créée avec succès",
    });
  } catch (error) {
    console.error("❌ Create return error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




// 🟠 Admin : approuver le retour d’un produit
exports.approveReturn = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const returnRequest = await Return.findOne({
      orderId,
      productId,
      status: "pending"
    });

    if (!returnRequest) {
      return res.status(404).json({ message: "Demande de retour introuvable" });
    }

    returnRequest.status = "approved";
    await returnRequest.save();

    const order = await Order.findById(orderId);
    const item = order.items.find(p =>
      p.productId.toString() === productId
    );

    item.returnStatus = "approved";
    await order.save();

    res.json({
      success: true,
      message: "Retour approuvé",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// 🟣 Admin : marquer le produit comme retourné + rembourser
exports.refundProduct = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const returnRequest = await Return.findOne({
      orderId,
      productId,
      status: "approved"
    });

    if (!returnRequest) {
      return res.status(400).json({ message: "Retour non approuvé" });
    }

    returnRequest.status = "refunded";
    await returnRequest.save();

    const order = await Order.findById(orderId);
    const item = order.items.find(
      p => p.productId.toString() === productId
    );

    item.returnStatus = "refunded";

    const allRefunded = order.items.every(i =>
      ["none", "refunded"].includes(i.returnStatus)
    );

    if (allRefunded) {
      order.status = "refunded";
      order.paymentStatus = "refunded";
      order.refundedAt = new Date();
    }

    await order.save();

    await sendEmail({
      to: req.user.email,
      subject: "Remboursement effectué",
      text: "Votre produit a été remboursé."
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
