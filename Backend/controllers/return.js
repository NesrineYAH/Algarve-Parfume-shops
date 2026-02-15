//controllers/return.js 
const Return = require("../Model/Return.js");
const Order = require("../Model/Order.js");
const { sendEmail } = require("../utils/mailer.js");
const { generateReturnLabel } = require("../utils/generateReturnLabel");


exports.createReturnRequest = async (req, res) => {
  try {
    const dbUser = req.user;
    const { orderId, products, reason, description } = req.body;

    // 🔁 Validation que chaque produit a productId ET variantId
    if (!orderId || !products || products.length === 0 || !reason) {
      return res.status(400).json({ message: "Données invalides" });
    }

    // ✅ Vérification que chaque produit a bien productId et variantId
    for (const product of products) {
      if (!product.productId || !product.variantId) {
        return res.status(400).json({
          message: "Chaque produit doit avoir productId et variantId"
        });
      }
    }

    // 🟢 1. Récupérer la commande
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (order.userId.toString() !== dbUser._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // 🟢 2. Création du retour - EXACTEMENT comme votre modèle
    const newReturn = new Return({
      userId: dbUser._id,
      orderId,
      products: products.map(p => ({
        productId: p.productId,
        variantId: p.variantId,
        quantity: p.quantity || 1, // quantity est optionnel, default 1
      })),
      reason,
      description: description || "",
      status: "pending", // default du modèle
      returnLabels: [], // sera rempli après génération
    });

    await newReturn.save();

    // 🟢 3. Mettre à jour les items de la commande avec returnStatus
    for (const returnProduct of products) {
      const orderItem = order.items.find(
        item =>
          item.productId.toString() === returnProduct.productId.toString() &&
          item.variantId.toString() === returnProduct.variantId.toString()
      );

      if (orderItem) {
        orderItem.returnStatus = "requested";
      }
    }

    await order.save();

    // 🟢 4. Génération des étiquettes de retour
    const labelLinks = [];

    for (const product of products) {
      const labelPath = await generateReturnLabel({
        returnId: newReturn._id,
        orderId,
        productId: product.productId,
        variantId: product.variantId,
        quantity: product.quantity || 1,
        user: dbUser,
      });

      labelLinks.push(labelPath);
    }

    // ✅ Mettre à jour le retour avec les liens des étiquettes
    newReturn.returnLabels = labelLinks;
    await newReturn.save();

    // 🟢 5. Email de confirmation
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
        background: #ff4f9a;
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
      .product-list {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Demande de retour confirmée</h2>

      <p>Bonjour ${dbUser.prenom || dbUser.name || ""},</p>

      <p>
        Votre demande de retour pour la commande
        <strong>${orderId}</strong> a bien été enregistrée.
      </p>

      <div class="product-list">
        <h3>Produits retournés :</h3>
        <ul>
          ${products.map(p => {
      const orderItem = order.items.find(
        item =>
          item.productId.toString() === p.productId.toString() &&
          item.variantId.toString() === p.variantId.toString()
      );
      return `<li>${orderItem?.nom || "Produit"} (${orderItem?.options?.size || ""}${orderItem?.options?.unit || ""}) - Quantité: ${p.quantity || 1}</li>`;
    }).join("")}
        </ul>
      </div>

      <p><strong>Raison :</strong> ${reason}</p>
      ${description ? `<p><strong>Détails :</strong> ${description}</p>` : ""}

      <h3>📦 Étiquette(s) de retour</h3>

      <div class="labels">
        ${labelLinks
        .map(
          (link, index) => `
              <a class="btn" href="${link}" target="_blank">
                📄 Télécharger l’étiquette ${labelLinks.length > 1 ? `#${index + 1}` : ""}
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
      to: dbUser.email,
      subject: "Confirmation de votre retour",
      html,
      text: "Votre demande de retour a bien été enregistrée.",
    });

    // 🟢 Réponse finale
    res.status(201).json({
      success: true,
      message: "Demande de retour créée avec succès",
      returnId: newReturn._id,
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

// 🟡 Admin : marquer le colis comme reçu
exports.markAsReturned = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const returnRequest = await Return.findOne({
      orderId,
      productId,
      status: "approved"
    });

    if (!returnRequest) {
      return res.status(404).json({ message: "Retour non trouvé ou non approuvé" });
    }

    returnRequest.status = "returned";
    await returnRequest.save();

    const order = await Order.findById(orderId);
    const item = order.items.find(
      p => p.productId.toString() === productId
    );

    item.returnStatus = "returned";
    await order.save();

    res.json({ success: true, message: "Colis marqué comme retourné" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
















/*
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
    // 🟢 Mettre à jour la commande pour afficher le retour côté admin
    const order = await Order.findById(orderId);

    for (const item of products) {
      const product = order.items.find(
        p => p.productId.toString() === String(item.productId)
      );
      //    p => p.productId.toString() === item.productId

      if (product) {
        product.returnStatus = "requested"; // ⭐ très important
      }
    }

    await order.save();


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
        background: #ff4f9a;
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


*/