import Sala from "../models/salaModel.js";
import Bloco from "../models/blocoModel.js";
import Reserva from "../models/reservaModel.js";

async function CreateSala(request, response) {
  const {
    numero,
    bloco,
    capacidade,
    tipo,
    compartilhavel = true,
    cursos = [],
    horarioInicial,
    horarioFinal,
  } = request.body;

  if (!numero || !bloco || !capacidade || !tipo || !cursos) {
    return response.status(400).json({ erro: "Preencha todos os campos" });
  }
  if (compartilhavel && cursos.length < 2) {
    return response
      .status(400)
      .json({ Erro: "A sala deve estar vinculada a mais de 1 curso." });
  }

  try {
    const blocoExists = await Bloco.findById(bloco);
    if (!blocoExists) {
      return response.status(404).json({ erro: "Bloco não encontrado" });
    }

    const salaExists = await Sala.findOne({ numero, bloco });
    if (salaExists) {
      return response.status(400).json({ erro: "Sala já existe" });
    }

    const sala = await Sala.create({
      numero,
      bloco,
      capacidade,
      tipo,
      compartilhavel,
      cursos,
      horarioInicial,
      horarioFinal,
    });
    return response.status(201).json(sala);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ erro: "Erro ao criar sala" });
  }
}

async function GetSalas(request, response) {
  try {
    const salas = await Sala.find().populate("bloco");
    return response.status(200).json(salas);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ erro: "Erro ao buscar salas" });
  }
}

async function DeleteSala(request, response) {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ erro: "ID inválido" });
  }

  try {
    const salaExists = await Sala.findById(id);
    if (!salaExists) {
      return response.status(404).json({ erro: "Sala não encontrada" });
    }

    await Sala.findByIdAndDelete(id);
    return response.status(200).json({ message: "Sala deletada com sucesso" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ erro: "Erro ao deletar sala" });
  }
}

export async function getSalasDisponiveis(req, res) {
  const { curso, data, horarioInicial, horarioFinal } = req.query;

  if (!curso || !data || !horarioInicial || !horarioFinal) {
    return res
      .status(400)
      .json({
        erro: "Preencha todos os campos necessários: curso, data, horárioInicial, horárioFinal.",
      });
  }

  try {
    const salas = await Sala.find({
      $or: [{ compartilhavel: true }, { cursos: { $in: [curso] } }],
    });

    const disponiveis = [];
    for (const sala of salas) {
      const conflict = await Reserva.findOne({
        bloco: sala.bloco,
        sala: sala.numero,
        data,
        $or: [
          { horarioInicial: { $lt: horarioFinal, $gte: horarioInicial } },
          { tempofinal: { $gt: horarioInicial, $lte: horarioFinal } },
        ],
      });

      if (!conflict) {
        disponiveis.push(sala);
      }
    }

    res.status(200).json(disponiveis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar salas disponíveis" });
  }
}

export { CreateSala, GetSalas, DeleteSala };
