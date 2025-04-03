import express from "express";
import { createReserva, checkDisponibilidade, cancelreserva, createReservaRecorrente, consultaReservas } from "../controllers/reservaController.js";

const ReservaRoutes = express.Router();

ReservaRoutes.get("/disponibilidade", checkDisponibilidade);
ReservaRoutes.post("/", createReserva);
ReservaRoutes.delete("/:id", cancelreserva);
ReservaRoutes.post("/recorrentes", createReservaRecorrente);
ReservaRoutes.get("/", consultaReservas);



export default ReservaRoutes;
