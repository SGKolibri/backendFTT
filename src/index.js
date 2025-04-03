import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";

import BlocoRoutes from "./routes/blocoRoutes.js";
import SalaRoutes from "./routes/salaRoutes.js";
import RelatorioRoutes from "./routes/relatorioRoutes.js";
import ReservaRoutes from "./routes/reservaRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors());

app.use("/api/blocos", BlocoRoutes);
app.use("/api/reservas", ReservaRoutes);
app.use("/api/salas", SalaRoutes);
app.use("/api/relatorio", RelatorioRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Servidor aberto na porta ${PORT}. Ambiente: ${
          process.env.NODE_ENV || "desenvolvimento"
        }`
      );
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

app.use((erro, request, response, next) => {
  console.error(erro.stack);
  response.status(500).json({ erro: "Erro interno no servidor." });
});
