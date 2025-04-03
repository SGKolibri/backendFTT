import mongoose from "mongoose";

const ReservaSchema = new mongoose.Schema({
  sala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sala",
    required: true,
  },
  data: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: "A data da reserva deve ser no futuro.",
    },
  },
  tempoInicial: {
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
  tempoFinal: {
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
  coordenador: {
    type: String,
    required: true,
    maxlength: 100,
  },
  motivo: {
    type: String,
    required: true,
    maxlength: 255,
  },
  curso: {
    type: String,
    default: [],
  },
});

export default mongoose.model("Reserva", ReservaSchema);
