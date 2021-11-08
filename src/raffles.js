module.exports = {
  "Clássico": {
    "name": "Clássico",
    "description": "A loteria que paga milhões para o acertador dos 6 números sorteados.",
    "interval": "0 */5 * * * *", // intervalo entre sorteios de 5 minutos
    "prize": [0, 100000000], // premios para cada quantidade de acerto (1 acerto = prize[1])
    "draws": 1, // quantidade de numeros que irao ser sorteados
    "choices": 1, // quantidade de numeros que o jogador vai escolher
    "range": [1, 25], // range de numeros que podem ser escohidos
    "cost": 10 // custo da aposta
  },
  "Do Bar": {
    "name": "Do Bar",
    "description": "Mais chances de ganhar.",
    "interval": "0 */2 * * * *", // intevalo entre sorteios de 2 minutos
    "prize": [0, 100, 500, 1000, 10000, 100000],
    "draws": 5,
    "choices": 5,
    "range": [1, 25],
    "cost": 2.5
  },
  "Rápido & Furioso": {
    "name": "Rápido & Furioso",
    "description": "Sorteios a cada minuto.",
    "interval": "0 */1 * * * *", // intervalo entre sorteios de 1 minuto
    "prize": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    "draws": 5,
    "choices": 15,
    "range": [1, 25],
    "cost": 5
  }
}
