import { Router } from "express";

import { CreateBloco, GetBlocos, DeleteBloco } from '../controllers/blocoController.js'

const BlocoRoutes = Router();

BlocoRoutes.post("/", CreateBloco);
BlocoRoutes.get("/", GetBlocos);
BlocoRoutes.delete("/:id", DeleteBloco);

export default BlocoRoutes;