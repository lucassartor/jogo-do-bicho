const http = require('http')
const webSocket = require('websocket').server
const fs = require('fs')
const { v4: uuid } = require('uuid')
const CronJob = require('cron').CronJob;
const raffles = require('./raffles');

// Apostas feitas nos sorteios
const bets = {}

// Clients conectados ao websocket
const connections = new Map()

// Carregando arquivos estaticos para serem servidos para o client
let page, client, timers

fs.readFile('src/index.html', (err, data) => {
  page = data
})

fs.readFile('src/client.js', (err, data) => {
  client = data
})

fs.readFile('src/timers.js', (err, data) => {
  timers = data
})

// Funções auaxiliares
const now = () => new Date().toISOString()

const hasDuplicates = (numbers) => {
  return (new Set(numbers)).size !== numbers.length;
}

const getContentOfMessage = (message) => {
  return JSON.parse(message.utf8Data)
}

// Envio de evento via websocket para o client
const sendMessageToClient = (userId, type, content) => {
  console.log(content)
  const client = connections.get(userId)
    if (client) {
      client.send(JSON.stringify({
        ...content,
        type,
      }))
    }
}

const sendBetAnnouncementToAllClients = (raffle, ignoredUser) => {
  connections.forEach((client, userId) => {
    if (userId === ignoredUser) return

    sendMessageToClient(userId, 'bet-made', { raffle, userId: ignoredUser })
  })
}

const sendNewPlayerAnnouncementToAllClients = (newUser) => {
  const playersCount = connections.size

  connections.forEach((client, userId) => {
    sendMessageToClient(userId, 'new-user', { newUser, playersCount })
  })
}

const isBetInvalid = (bet) => {
  if (!bet.userId) {
    return true
  }
  if (!bet.raffle || !raffles[bet.raffle]) {
    sendMessageToClient(bet.userId, 'bet-error', {
      message: 'Sorteio inexistente',
    })
    return true
  }
  if (!bet.numbers || bet.numbers.length !== raffles[bet.raffle].choices) {
    sendMessageToClient(bet.userId, 'bet-error', {
      message: 'Quantidade de números inválida',
    })
    return true
  }
  if (hasDuplicates(bet.numbers)) {
    sendMessageToClient(bet.userId, 'bet-error', {
      message: 'Números duplicados',
    })
    return true
  }
  return false
}

// Servidor http e rotas
const server = http.createServer(async (req, res) => {
  console.log(`${now()} - ${req.method} request received at ${req.url}`)

  // Rota de aposta
  if (req.method === 'POST' && req.url === '/bet') {
    await req.on('data', (chunk) => {
      const bet = JSON.parse(chunk)

      if (isBetInvalid(bet)) {
        console.log(`${now()} - Invalid bet`)
        res.statusCode = 400
        return res.end('Invalid bet')
      }

      bets[bet.raffle].push(bet)
      sendBetAnnouncementToAllClients(bet.raffle, bet.userId)

      console.log(`${now()} - New bet made in lottery "${bet.raffle}". Numbers: ${bet.numbers}`)

      res.statusCode = 200
      return res.end('Success')
    })

  }

  // Rotas para servir arquivos estáticos
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': page.length,
    })
    res.write(page)
    return res.end()
  }

  if (req.url === '/client.js') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': client.length,
    })
    res.write(client)
    res.end()
  }

  if (req.url === '/timers.js') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': timers.length,
    })
    res.write(timers)
    res.end()
  }

  res.statusCode = 404
  return res.end()
})

// Inicializando servidor http
server.listen(3000, () => {
  console.log(`🚀 Server ready at :3000`)
})

// Servidor WebSocket
webSocketServer = new webSocket({
  httpServer: server,
})

webSocketServer.on('request', (req) => {
  // recebendo uma conexão nova no websocket
  const connection = req.accept(null, req.origin)
  const connectionId = uuid()
  connections.set(connectionId, connection)
  sendMessageToClient(connectionId, 'user-id', { userId: connectionId, playerCount: connections.size })
  sendNewPlayerAnnouncementToAllClients(connectionId)

  console.log(`${now()} - ${connection.remoteAddress} connected`)

  // Recebendo evento de message do client (apenas usado para testes)
  connection.on('message', (message) => {
    console.log(getContentOfMessage(message))
  })

  // Recebendo evento de close do client
  connection.on('close', () => {
    console.log(`${now()} - ${connection.remoteAddress} disconnected`)
  })
})

// Funções referentes aos sorteios
const drawNumbers = ({ range, draws }) => {
  const numbers = []
  while(numbers.length < draws){
    var r = Math.floor(Math.random() * range[1]) + range[0]
    if(!numbers.includes(r)) numbers.push(r)
  }
  return numbers
}

const countBetHits = (draw, bet) => {
  let hits = 0
  for (const n of bet) {
    if (draw.includes(Number(n))) [
      hits++
    ]
  }
  return hits
}

const givePrizes = (raffle, draw, raffleBets) => {
  // Percorre todas as apostas e verifica quais acertaram o suficiente para ter ganhar algo
  for (const bet of raffleBets) {
    const hits = countBetHits(draw, bet.numbers)
    if (raffle.prize[hits] > 0) {
      console.log(`${now()} - ${bet.userId} - won ${raffle.prize[hits]} (${hits}/${raffle.draws})- ${raffle.name}`)
      sendMessageToClient(bet.userId, 'bet-win', {
        raffle,
        draw,
        bet,
        prize: raffle.prize[hits],
      })
    } else {
      sendMessageToClient(bet.userId, 'bet-loss', {
        raffle,
        draw,
        bet,
        prize: raffle.prize[hits],
      })
    }
  }
}

const createRaffle = (raffle) => new CronJob(raffle.interval, function() {
  // Codigo do sorteio que será rodado após o tempo definido para apostas acabar
  if (!bets[raffle.name] || bets[raffle.name].length < 1) {
    console.log(`${now()} - No bets made in lottery "${raffle.name}"`)
    return
  }

  const draw = drawNumbers(raffle)

  console.log(`${now()} - ${raffle.name}: (${bets[raffle.name].length} bets) - ${draw}`)
  givePrizes(raffle, draw, bets[raffle.name])
  bets[raffle.name] = []
}, null, true, 'America/Sao_Paulo')

// Inicializando Sorteios baseado nos dados de sorteios em src/raffles.js
const startRaffles = () => {
  const onGoingRaffles = {}
  for (const [name, raffle] of Object.entries(raffles)) {
    bets[name] = []
    onGoingRaffles[name] = createRaffle(raffle)
    onGoingRaffles[name].start()
  }
}

startRaffles()
