// Atualização dos temporizadores (X tempo até o próximo sorteio)

const startTime = new Date()
let classicoProgress = ((startTime.getMinutes() % 5) * 60) + startTime.getSeconds()
let doBarProgress = ((startTime.getMinutes() % 2) * 60) + startTime.getSeconds()
let rapidoEFuriosoProgress = startTime.getSeconds()

const updateProgress = () => {
  const now = new Date()
  const secondsUntilNextMinute = (60 - now.getSeconds())
  const minutesUntilNextClassico = now.getMinutes() % 5 === 0 ? (5 - (now.getMinutes() % 5)) - 1 : (5 - (now.getMinutes() % 5))
  const minutesUntilNextDoBar = now.getMinutes() % 2 === 0 ? (2 - (now.getMinutes() % 2)) - 1 : (2 - (now.getMinutes() % 2))
  classicoProgress++
  doBarProgress++
  rapidoEFuriosoProgress++
  if (classicoProgress % (60 * 5) === 0) classicoProgress = 0
  if (doBarProgress % (60 * 2) === 0) doBarProgress = 0
  if (rapidoEFuriosoProgress % 60 === 0) rapidoEFuriosoProgress = 0

  const classicoPercentage = classicoProgress / (60 * 5) * 100
  $('#classico-progress').css('width', `${classicoPercentage}%`).attr('aria-valuenow', classicoPercentage);
  $('#classico-timer').text(`Próximo sorteio em ${minutesUntilNextClassico} minutos e ${secondsUntilNextMinute} segundos`)

  const doBarPercentage = doBarProgress / (60 * 2) * 100
  $('#doBar-progress').css('width', `${doBarPercentage}%`).attr('aria-valuenow', doBarPercentage);
  $('#doBar-timer').text(`Próximo sorteio em ${minutesUntilNextDoBar} minutos e ${secondsUntilNextMinute} segundos`)

  const rapidoEFuriosoPercentage = rapidoEFuriosoProgress / 60 * 100
  $('#rapidoEFurioso-progress').css('width', `${rapidoEFuriosoPercentage}%`).attr('aria-valuenow', rapidoEFuriosoPercentage);
  $('#rapidoEFurioso-timer').text(`Próximo sorteio em ${secondsUntilNextMinute} segundos`)
}

setInterval(updateProgress, 1000)
