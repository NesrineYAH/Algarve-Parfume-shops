const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],

    reason: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        type: String,
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "refunded"],
        default: "pending",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Return", returnSchema);

