import mongoose from "mongoose"

const blocoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        enum: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    },
    descricao: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Bloco", blocoSchema);