const sendEmail = require("../utils/mailer");

(async () => {
  await sendEmail({
    to: "contact@nesrinebekkar.com",
    subject: "Test Hostinger SMTP",
    text: "Test envoi depuis Hostinger",
    html: "<h2>Test réussi ✔️</h2>",
  });
})();






//////////////////////////////////////////
// 1️⃣ Paiement réussi
if (event.type === "checkout.session.completed") {
  try {
    console.log("🔥 checkout.session.completed reçu");
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    // ✅ Vérifier que le paiement est bien réussi
    if (paymentIntent.status !== "succeeded") {
      console.log("⏳ Paiement non confirmé :", paymentIntent.status);
      return res.json({ received: true });
    }

    // ✅ Vérifier si ce webhook a déjà été traité
    const existingPayment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (existingPayment) {
      console.log("⚠️ Webhook déjà traité :", paymentIntent.id);
      return res.json({ received: true });
    }

    const stripeCustomer = session.customer
      ? await stripe.customers.retrieve(session.customer)
      : null;

    const charge = paymentIntent.charges.data[0];

    const email =
      session.customer_details?.email ||
      stripeCustomer?.email ||
      paymentIntent.receipt_email ||
      session.metadata?.email;

    const amount = paymentIntent.amount / 100;

    console.log("📩 Email dans paymentIntent :", paymentIntent.receipt_email);
    console.log("📩 Email dans session :", session.customer_details?.email);
    console.log("📧 Email envoyé à :", email);

    // 📧 Envoi de l'email de confirmation
    await sendEmail({
      to: email,
      subject: "Votre paiement est confirmé",
      html: `
        <h2>Merci pour votre commande !</h2>
        <p>Votre paiement de <strong>${amount} €</strong> a été confirmé.</p>
        <p>Nous préparons votre commande.</p>
      `,
    });

    // 💳 Sauvegarde du paiement
    await Payment.create({
      user: userId,
      email,
      stripeCustomerId: session.customer,
      stripePaymentIntentId: paymentIntent.id,
      stripeCheckoutSessionId: session.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: {
        brand: charge.payment_method_details.card.brand,
        last4: charge.payment_method_details.card.last4,
      },
      metadata: session.metadata,
    });

    // 📦 Mise à jour de la commande
    await Order.findByIdAndUpdate(
      orderId,
      {
        status: "confirmed",
        paymentStatus: "paid",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntent.id,
        stripeCheckoutSessionId: session.id,
      },
      { new: true }
    );

    console.log("🟩 Commande mise à jour comme PAYÉE :", orderId);
  } catch (err) {
    console.error("❌ Erreur complète :", err);
  }
}




















