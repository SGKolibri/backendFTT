import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

async function connectDatabase() {
    await mongoose.connect(mongoUrl)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((erro) => console.error("Não foi possível conectar ao MongoDB", erro));
}

export default connectDatabase;