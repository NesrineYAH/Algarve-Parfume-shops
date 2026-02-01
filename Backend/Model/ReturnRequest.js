const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    reason: { type: String, required: true },
    description: { type: String },
    image: { type: String },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "refunded"],
        default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
