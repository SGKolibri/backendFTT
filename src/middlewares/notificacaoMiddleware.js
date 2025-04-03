export function notificarReservaFutura(reserva) {
    console.log(`[Notificação] Reserva confirmada! 📅 Data: ${reserva.data}, ⏰ Horário: ${reserva.tempoInicial} - ${reserva.tempoFinal}, 🏢 Sala: ${reserva.sala}`);
}
