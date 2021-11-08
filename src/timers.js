// Atualização dos temporizadores (X tempo até o próximo sorteio)

const startTime = new Date()
let zooCasinoProgress = startTime.getSeconds()

const updateProgress = () => {
  const now = new Date()
  const secondsUntilNextMinute = (60 - now.getSeconds())
  zooCasinoProgress++
  if (zooCasinoProgress % 60 === 0) zooCasinoProgress = 0

  const zooCasinoPercentage = zooCasinoProgress / 60 * 100
  $('#zooCasino-progress').css('width', `${zooCasinoPercentage}%`).attr('aria-valuenow', zooCasinoPercentage);
  $('#zooCasino-timer').text(`Próximo sorteio em ${secondsUntilNextMinute} segundos`)
}

setInterval(updateProgress, 1000)
