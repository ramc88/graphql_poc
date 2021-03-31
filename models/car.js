const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Car = new Schema({
    brand: String,
    model: String,
    year: Number,
    owner: mongoose.Types.ObjectId
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model("cars", Car)
