module.exports = {
  "Zoo Casino": {
    "name": "Zoo Casino",
    "description": "A loteria que paga milhões para o acertador dos 6 números sorteados.",
    "interval": "0 */1 * * * *", // intervalo entre sorteios de 5 minutos
    "prize": [0, 10000], // premios para cada quantidade de acerto (1 acerto = prize[1])
    "draws": 1, // quantidade de numeros que irao ser sorteados
    "choices": 1, // quantidade de numeros que o jogador vai escolher
    "range": [1, 9], // range de numeros que podem ser escohidos
    "cost": 100 // custo da aposta
  },
}
