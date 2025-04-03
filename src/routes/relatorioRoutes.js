import { Router } from "express"; 

import RelatorioSala from "../services/relatorio.js";

const RelatorioRoutes = Router();

RelatorioRoutes.get("/:id", RelatorioSala);

export default RelatorioRoutes