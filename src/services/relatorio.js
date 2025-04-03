import Sala from "../models/salaModel.js";
import Reserva from "../models/reservaModel.js";

/*
    Relátorio de Salas:
    Recebe o id da sala e retorna informações sobre a sala, incluindo:
    - Número da sala
    - Bloco da sala
    - Capacidade da sala
    - Tipo da sala
    - Status da sala (disponível ou não)
    - Reservas futuras (se houver)
    - Reservas passadas (se houver)
    - Total de reservas realizadas 
*/

async function RelatorioSala(request, response) {
  const { id } = request.params;
  const data = new Date();
  if (!id) {
    return response.status(400).json({ erro: "Id da sala não fornecido." });
  }

  try {
    const sala = await Sala.findById(id).populate("bloco");
    if (!sala) {
      return response.status(404).json({ erro: "Sala não encontrada" });
    }

    const dataAtual = data.toISOString().split("T")[0];
    console.log("dataAtual:", dataAtual);

    const reservas = await Reserva.find({
      sala: id,
    });

    const reservasFuturas = reservas.filter((reserva) => {
      const dataReserva = reserva.data.toISOString().split("T")[0];
      return dataReserva >= dataAtual;
    });

    const reservasPassadas = reservas.filter((reserva) => {
      const dataReserva = reserva.data.toISOString().split("T")[0];
      return dataReserva < dataAtual;
    });

    const totalReservas = reservas.length;

    const relatorio = {
      numero: sala.numero,
      bloco: sala.bloco.nome,
      capacidade: sala.capacidade,
      tipo: sala.tipo,
      reservasFuturas:
        reservasFuturas.length > 0
          ? reservasFuturas
          : [
              `Não há reservas futuras para a sala ${sala.bloco.nome}${sala.numero} depois da data ${dataAtual}`,
            ],
      reservasPassadas:
        reservasPassadas.length > 0
          ? reservasPassadas
          : [
              `Não há reservas passadas para a sala ${sala.bloco.nome}${sala.numero} antes da data ${dataAtual}`,
            ],
      todasReservas: reservas,
      totalReservas,
    };

    console.log(`Gerando relatório da sala ${sala}.`);
    return response.status(200).json(relatorio);
  } catch (error) {
    console.log("Não foi possível gerar relatório.", error);
    return response
      .status(400)
      .json({ "Não foi possível gerar relatório": error });
  }
}

export default RelatorioSala;
