import Reserva from "../models/reservaModel.js";
import Sala from "../models/salaModel.js";
import { notificarReservaFutura } from "../middlewares/notificacaoMiddleware.js";


export async function createReserva(request, response) {
  const { sala, data, tempoInicial, tempoFinal, coordenador, motivo, curso } = request.body;

  if (!sala || !data || !tempoInicial || !tempoFinal || !coordenador || !motivo) {
    return response.status(404).json({ message: "Preencha todos os campos" });
  }
  try {
    const salaInfo = await Sala.findById(sala);
    if (!salaInfo) {
      return response.status(404).json({ message: "Sala não encontrada." });
    }

    if (!salaInfo.compartilhavel && salaInfo.cursos.length > 0) {
      console.log(salaInfo)
      if (!salaInfo.cursos.includes(curso)) {
        return response.status(403).json({ message: "Sala restrita a determinados cursos." });
      }
    }

    const conflict = await Reserva.findOne({
      sala,
      data,
      $or: [
        { tempoInicial: { $lt: tempoFinal, $gte: tempoInicial } },
        { tempoFinal: { $gt: tempoInicial, $lte: tempoFinal } },
      ],
    });

    if (conflict) {
      return response.status(409).json({ message: "Conflito: Já existe uma reserva para esse horário." });
    }

    const reserva = await Reserva.create({
      sala,
      data,
      tempoInicial,
      tempoFinal,
      coordenador,
      curso,
      motivo,
    });

    response.status(201).json(reserva);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro ao criar a reserva" });
  }
}
export async function checkDisponibilidade(request, response) {
  const { sala, data, tempoInicial, tempoFinal } = request.query;

  try {
    const conflict = await Reserva.findOne({
      sala,
      data,
      $or: [
        { tempoInicial: { $lt: tempoFinal, $gte: tempoInicial } },
        { tempoFinal: { $gt: tempoInicial, $lte: tempoFinal } },
      ],
    });

    if (conflict) {
      return response.status(200).json({ available: false, message: "Sala já reservada neste horário." });
    }

    response.status(200).json({ available: true, message: "Sala disponível." });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro ao verificar disponibilidade" });
  }
}
export async function cancelreserva(request, response) {
  const {id} = request.params;
const reserva = await Reserva.findById({ _id: id });
if(!reserva){
  return response.status(400).json({ message: "ID não encontrado" })
  }

  try {
    const reserva = await Reserva.findById({ _id: id });

    if (!reserva) {
      return response.status(404).json({ message: "Reserva não encontrada." });
    }

    await Reserva.findByIdAndDelete({ _id: id });

    response.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro ao cancelar a reserva." });
  }
}
export async function createReservaRecorrente(request, response) {
  const { sala, data, tempoInicial, tempoFinal, curso, coordenador, motivo, recorrencia } = request.body;
  const salaInfo = await Sala.findById(sala);
  if (!salaInfo) {
    return response.status(404).json({ message: "Sala não encontrada." });
  }

  if (!salaInfo.compartilhavel && salaInfo.cursos.length > 0) {
    console.log(salaInfo)
    if (!salaInfo.cursos.includes(curso)) {
      return response.status(403).json({ message: "Sala restrita a determinados cursos." });
    }
  }
  try {
    let datasGeradas = [new Date(data)];
    if (recorrencia) {
      for (let i = 1; i < recorrencia.quantidade; i++) {
        const novaData = new Date(datasGeradas[i - 1]);
        if (recorrencia.frequencia === "diária") {
          novaData.setDate(novaData.getDate() + 1); 
        } else if (recorrencia.frequencia === "semanal") {
          novaData.setDate(novaData.getDate() + 7); 
        } else if (recorrencia.frequencia === "mensal") {
          novaData.setMonth(novaData.getMonth() + 1); 
        }
        datasGeradas.push(novaData);
      }
    }

    const reservasCriadas = [];
    for (const dataGerada of datasGeradas) {
      const conflict = await Reserva.findOne({
        sala,
        data: dataGerada.toISOString().split("T")[0], 
        $or: [
          { tempoInicial: { $lt: tempoFinal, $gte: tempoInicial } },
          { tempoFinal: { $gt: tempoInicial, $lte: tempoFinal } },
          { tempoInicial: { $lte: tempoInicial }, tempoFinal: { $gte: tempoFinal } }
        ],
      });

      if (conflict) {
        return response.status(409).json({ message: `Conflito em ${dataGerada.toISOString().split('T')[0]}. Reserva não criada.` });
      }

      const reserva = await Reserva.create({
        sala,
        data: dataGerada.toISOString().split("T")[0],
        tempoInicial,
        tempoFinal,
        curso,
        coordenador,
        motivo,
      });
      reservasCriadas.push(reserva);
    }

    response.status(201).json({ message: "Reservas criadas com sucesso.", reservas: reservasCriadas });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro ao criar reservas recorrentes." });
  }
}

export async function consultaReservas(request, response) {

  try {
    const reservas = await Reserva.find().populate("sala")
    return response.status(200).json(reservas)
  } catch (erro) {
    console.error(erro);
    response.status(500).json({ message: "Erro ao consultar reservas." });
  }
}