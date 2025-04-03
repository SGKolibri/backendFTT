import { Router } from "express";

import { CreateSala, GetSalas, DeleteSala, getSalasDisponiveis } from '../controllers/salaController.js'

const SalaRoutes = Router();

SalaRoutes.post("/", CreateSala);
SalaRoutes.get("/", GetSalas);
SalaRoutes.delete("/:id", DeleteSala);
SalaRoutes.get("/disponiveis", getSalasDisponiveis);


export default SalaRoutes;