// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: String,
    message: String,
    discount: Number,      // nouveau champ
    newPrice: Number,      // nouveau champ
    imageUrl: String,      // nouveau champ pour l'image
    type: {
        type: String,
        enum: ["promo", "sale", "offer", "new", "order", "system"],
        default: "system",
    },
    isRead: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
