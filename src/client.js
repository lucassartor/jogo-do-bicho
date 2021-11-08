let userId

// Animais e suas imagens
const animals = [
    {name: 'Avestruz', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Águia', image: 'https://cdn-icons.flaticon.com/png/512/2417/premium/2417563.png?token=exp=1636334677~hmac=5f9ad6ed7efe3d4cb68ecbdb255d3653'},
    {name: 'Burro', image: 'https://cdn-icons.flaticon.com/png/512/1018/premium/1018430.png?token=exp=1636334887~hmac=46e3264980ca1ac73c504e0550f55be7'},
    {name: 'Borboleta', image: 'https://cdn-icons.flaticon.com/png/512/1776/premium/1776959.png?token=exp=1636334927~hmac=aa193e8be0707455d4e533e1875cb546'},
    {name: 'Cachorro', image: 'https://cdn-icons.flaticon.com/png/512/4540/premium/4540795.png?token=exp=1636334943~hmac=a9d51cbb85c1c80e349d6157d72e7ad3'},
    {name: 'Cabra', image: 'https://cdn-icons.flaticon.com/png/512/1063/premium/1063454.png?token=exp=1636334964~hmac=2e769d37304bbee9021740077b799d6e'},
    {name: 'Carneiro', image: 'https://cdn-icons-png.flaticon.com/512/1466/1466578.png'},
    {name: 'Camelo', image: 'https://cdn-icons.flaticon.com/png/512/2918/premium/2918098.png?token=exp=1636335006~hmac=f7c8e2aa153f0008d1cc1524fe2d6d16'},
    {name: 'Cobra', image: 'https://cdn-icons-png.flaticon.com/512/616/616487.png'},
    {name: 'Coelho', image: 'https://cdn-icons.flaticon.com/png/512/2716/premium/2716961.png?token=exp=1636335019~hmac=3ad72afaee084a7c778c8e5d6b3d426f'},
    {name: 'Cavalo', image: 'https://cdn-icons.flaticon.com/png/512/5371/premium/5371387.png?token=exp=1636335062~hmac=f161d829364649387f7215a7a76a7ca7'},
    {name: 'Elefante', image: 'https://cdn-icons.flaticon.com/png/512/1063/premium/1063451.png?token=exp=1636335084~hmac=84d9e9668ce4ea9bbb984076015facb5'},
    {name: 'Galo', image: 'https://cdn-icons-png.flaticon.com/512/291/291986.png'},
    {name: 'Gato', image: 'https://cdn-icons.flaticon.com/png/512/1650/premium/1650555.png?token=exp=1636335163~hmac=80b86ff0a653f0a3f17aafdae66291ab'},
    {name: 'Jacaré', image: 'https://cdn-icons-png.flaticon.com/512/2219/2219706.png'},
    {name: 'Leão', image: 'https://cdn-icons.flaticon.com/png/512/2559/premium/2559432.png?token=exp=1636335184~hmac=795dc27da27822608df9f13526d898c9'},
    {name: 'Macaco', image: 'https://cdn-icons.flaticon.com/png/512/3195/premium/3195978.png?token=exp=1636335211~hmac=167d6a297407f3d483504d7d011909b7'},
    {name: 'Porco', image: 'https://cdn-icons.flaticon.com/png/512/2120/premium/2120219.png?token=exp=1636335268~hmac=8fd69641ccbe4082d16904d80471a2b8'},
    {name: 'Pavão', image: 'https://cdn-icons.flaticon.com/png/512/2465/premium/2465381.png?token=exp=1636335288~hmac=c9bf4fa511caefc95f3b20a82b12e84e'},
    {name: 'Peru', image: 'https://cdn-icons.flaticon.com/png/512/2403/premium/2403468.png?token=exp=1636335378~hmac=8467f38f241c22375053224ad10b3e40'},
    {name: 'Touro', image: 'https://cdn-icons.flaticon.com/png/512/3786/premium/3786945.png?token=exp=1636335393~hmac=863b93f1e318a4bbc790d38b1d8ab530'},
    {name: 'Tigre', image: 'https://cdn-icons-png.flaticon.com/512/616/616523.png'},
    {name: 'Urso', image: 'https://cdn-icons.flaticon.com/png/512/2097/premium/2097915.png?token=exp=1636335477~hmac=48665230ed6cf594f689eeaf620de7ae'},
    {name: 'Veado', image: 'https://cdn-icons-png.flaticon.com/512/427/427536.png'},
    {name: 'Vaca', image: 'https://cdn-icons.flaticon.com/png/512/3319/premium/3319367.png?token=exp=1636335503~hmac=45f580cfdff28c5fc1e6ffa889dfdbcf'},
]

// Regras de negócio de cada sorteio
const raffles = {
    classico: {
        name: 'Clássico',
        description: 'A loteria que paga milhões.',
        bets: 1,
        numbers: 25,
        cost: 10,
        prize: 'R$ 100.000.000,00',
    },
    doBar: {
        name: 'Do Bar',
        description: 'Mais chances de ganhar.',
        bets: 5,
        numbers: 25,
        cost: 2.5,
        prize: 'R$ 100.000,00',
    },
    rapidoEFurioso: {
        name: 'Rápido & Furioso',
        description: 'Fácil de ganhar e apostar.',
        bets: 15,
        numbers: 25,
        cost: 5,
        prize: 'R$ 150,00',
    },
}

// Apostas feitas pelo usuário
const bets = {
    classico: [],
    doBar: [],
    rapidoEFurioso: [],
}

// Carrinho
const cart = {
    total: 0,
    bets: [],
    balance: 100,
}

// Funções auxiliares
const sortAscending = (array) => array.sort((a, b) => a - b) // Ordena números de forma crescente
const formatCurrency = (amount) => amount.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) // Formata valores monetários
$('#balance').text(`${formatCurrency(cart.balance)}`) // Insere valor inicial do balanço

const showToast = (title, body, delay = 5000) => { // Exibe notificação na tela
    const toastId = Date.now()

    $('#toast-container').append(`
    <div id="${toastId}" class="toast" data-delay="${delay}">
      <div class="toast-header">
        <strong id="toast-header" class="mr-auto me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div id="toast-body" class="toast-body">${body}</div>
    </div>
  `)

    $(`#${toastId}`).toast('show')
}

// Websocket
const ws = new WebSocket(`ws://${location.host}`)

ws.onopen = () => {
    $('#status').removeClass('badge bg-warning text-dark')
    $('#status').addClass('badge bg-success')
    $('#status').text('Conectado')
}

ws.onclose = () => {
    $('#status').removeClass('badge bg-success')
    $('#status').addClass('badge bg-warning text-dark')
    $('#status').text('Desconectado')
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    switch (data.type) {
        case 'user-id':
            userId = data.userId
            break

        case 'bet-made':
            showToast('Nova aposta', `Alguém apostou na ${data.raffle}!`)
            break

        case 'bet-error':
            showToast('Erro', data.message)
            break

        case 'bet-win':
            const numbers = sortAscending(data.bet.numbers).join(', ')
            const draw = sortAscending(data.draw).join(', ')
            showToast('Você ganhou!', `Você acertou os números sorteados pela ${data.raffle.name}!<br>Seu prêmio: <b>${formatCurrency(data.prize)}</b><br>Sua aposta: ${numbers}<br>Números sorteados: ${draw}`, 30000)
            cart.balance += data.prize
            $('#balance').text(`${formatCurrency(cart.balance)}`)
            break

        case 'bet-loss':
            const numbersLoss = sortAscending(data.bet.numbers).join(', ')
            const drawLoss = sortAscending(data.draw).join(', ')
            showToast('Você perdeu :(', `Você não acertou os números sorteados na ${data.raffle.name}!<br>Sua aposta: ${numbersLoss}<br>Números sorteados: ${drawLoss}`, 30000)
    }
}

// Função que finaliza e confirma as apostas realizadas
const placeBets = async () => {
    if (cart.total > cart.balance)
        showToast('Erro', 'Balanço insuficiente para aposta!')
    else {
        for (const lottery in bets) {
            if (bets[lottery].length === raffles[lottery].bets) {
                const data = JSON.stringify({
                    userId,
                    raffle: raffles[lottery].name,
                    numbers: bets[lottery],
                })

                await fetch(`http://${location.host}/bet`, {
                    method: 'POST',
                    body: data,
                })
                cart.balance -= cart.total
                $('#balance').text(`${formatCurrency(cart.balance)}`)

                let animalBets = []
                bets[lottery].forEach(bet => animalBets.push(' ' + animals[bet - 1].name))
                showToast('Sucesso', `Você apostou na ${lottery}<br>Suas apostas: <b>${animalBets}</b><br>Boa sorte :)`)
            }
        }

        clearBets()
    }
}

// Função que limpa as apostas feitas anteriormente
const clearBets = () => {
    cart.bets = []
    bets.classico = []
    bets.doBar = []
    bets.rapidoEFurioso = []

    updateCart()
    cart.total = 0
    $('#total').text(`Total: ${formatCurrency(cart.total)}`)

    for (const lottery in bets) {
        $(`[id^=${lottery}-number-]`).each((_, e) => {
            e.checked = false
            e.disabled = false
        })
    }
}

// Função que atualiza os itens e valor total do carrinho
const updateCart = () => {

    for (const lottery in bets) {
        if (bets[lottery].length === raffles[lottery].bets) {
            if (!cart.bets.find(bet => bet === lottery)) {
                cart.bets.push(lottery)
                cart.total = cart.total + raffles[lottery].cost

                $('#cart').append(`<small id="${lottery}-cart"><p class="card-text">1x ${raffles[lottery].name} | ${formatCurrency(raffles[lottery].cost)}</p></small>`)
            }
        } else {
            cart.bets = cart.bets.filter(bet => bet !== lottery)

            if ($(`#${lottery}-cart`).length) {
                cart.total = cart.total - raffles[lottery].cost
                $(`#${lottery}-cart`).remove()
            }
        }
    }

    $('#total').text(`Total: ${formatCurrency(cart.total)}`)
    $('#finish').prop('disabled', !cart.bets.length)
}

// Função que desabilita ou reabilita os números da aposta
const updateCheckmarks = (lottery, disable) => {
    $(`[id^=${lottery}-number-]`).each((_, checkbox) => {
        checkbox.disabled = disable ? !checkbox.checked : false
    })
}

// Função que registra a escolha de um número
const checkNumber = (lottery, id) => {
    const checkbox = $(`#${id}`)[0]

    if (checkbox.checked) {
        bets[lottery] = [...bets[lottery], checkbox.value]

        if (bets[lottery].length === raffles[lottery].bets) {
            updateCheckmarks(lottery, checkbox.checked)
        }
    } else {
        if (bets[lottery].length === raffles[lottery].bets) {
            updateCheckmarks(lottery, checkbox.checked)
        }

        bets[lottery] = bets[lottery].filter(n => n !== checkbox.value)
    }

    updateCart()
}

// Função que adiciona os checkboxes de opções de números dinamicamente
const generateCheckboxes = (lottery, numbers) => {
    let html = ''

    for (let i = 1; i <= numbers; i++) {
        const id = `${lottery}-number-${i}`

        html = html + `
      <div class="col-md-2 form-check-inline justify-content-center align-center">
          <div class="animal-checkbox">
            <input id="${id}" class="css-checkbox" type="checkbox" value="${i}" onclick="checkNumber('${lottery}', '${id}')">
            <label for="${id}" class="css-label" style="background-image: url(${animals[i - 1].image});"></label>
          </div>
      </div>
    `
    }

    return html
}

// Função que adiciona as opções de loterias dinamicamente
const generateLottery = (lottery) => {
    $('#lotteries').append(`
    <div class="card">
      <div class="card-header">
        <div class="row">
            <div class="col-md-3">
              <h5 class="card-title">${raffles[lottery].name}</h5>
              <h6 class="card-subtitle text-muted">${raffles[lottery].description}</h6>
            </div>
            <div class="col-md-3 text-center">
              <h5 class="card-title">${raffles[lottery].bets}</h5>
              <h6 class="card-subtitle text-muted"><small>APOSTAS</small></h6>
            </div>
            <div class="col-md-3 text-center">
              <h5 class="card-title">${formatCurrency(raffles[lottery].cost)}</h5>
              <h6 class="card-subtitle text-muted"><small>CUSTO</small></h6>
            </div>
            <div class="col-md-3 text-end">
              <h5 class="card-title">${raffles[lottery].prize}</h5>
              <h6 class="card-subtitle text-muted"><small>PRÊMIO MÁXIMO</small></h6>
            </div>
        </div>
      </div>
      <div class="card-body">
        <div id="${lottery}-numbers"></div>
      </div>
      <div class="card-footer">
        <div class="progress">
          <div id="${lottery}-progress" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
        </div>
        <small><div id="${lottery}-timer" class="text-center"></div></small>
      </div>
    </div>
    <br>
  `)

    $(`#${lottery}-numbers`).html(generateCheckboxes(lottery, raffles[lottery].numbers))
}

for (const lottery in raffles) {
    generateLottery(lottery)
}
