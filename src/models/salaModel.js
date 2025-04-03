import mongoose from "mongoose";

const TIPO_SALA = {
  LABORATORIO: "laboratorio",
  SALA_NORMAL: "sala_normal",
};

const salaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    unique: true,
    match: [
      /^[1-9][0-9]{2}$/,
      "O número da sala deve seguir o formato: 101, 201, etc.",
    ],
  },
  bloco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bloco",
    required: true,
  },
  capacidade: {
    type: Number,
    required: true,
    min: [1, "A capacidade mínima deve ser 1."],
    max: [50, "A capacidade máxima deve ser 50."],
  },
  tipo: {
    type: String,
    enum: Object.values(TIPO_SALA),
    required: true,
  },
  compartilhavel: {
    type: Boolean,
    default: true,
  },
  cursos: {
    type: [String],
    default: [],
    validate: {
      validator: function (cursos) {
        return cursos.every((curso) => curso.length <= 50);
      },
      message: "Cada curso deve ter no máximo 50 caracteres.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  horarioInicial: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: (props) =>
        "${props.value} não é um horário válido! Use o formato HH:mm.",
    },
  },
  horarioFinal: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: (props) =>
        "${props.value} não é um horário válido! Use o formato HH:mm.",
    },
  },
});

export default mongoose.model("Sala", salaSchema);
