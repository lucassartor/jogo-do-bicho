let userId

// Animais e suas imagens
const animals = [
    {name: 'Cavalo', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Coelho', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Elefante', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Hamster', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Leão', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Puma', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Raposa', image: 'https://cdn-icons-png.flaticon.com/512/1466/1466578.png'},
    {name: 'Urso', image: 'https://cdn-icons-png.flaticon.com/512/427/427522.png'},
    {name: 'Unicornio', image: 'https://cdn-icons-png.flaticon.com/512/616/616487.png'},
]

// Regras de negócio de cada sorteio
const raffles = {
    zooCasino: {
        name: 'Zoo Casino',
        description: 'A loteria que paga milhões.',
        bets: 1,
        numbers: 9,
        cost: 100,
        prize: 'R$ 10.000,00',
    },
}

// Apostas feitas pelo usuário
const bets = {
    zooCasino: [],
}

let playerCount = 0

// Carrinho
const cart = {
    total: 0,
    bets: [],
    balance: 1000,
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
        case 'new-user':
            $('#players').text(`${data.playersCount} players online`)
            showToast('Novo jogador!', `Jogador ${data.newUser} acabou de entrar!`)
            break

        case 'user-disconnected':
            $('#players').text(`${data.playersCount} players online`)
            showToast('Jogador saiu', `Jogador ${data.newUser} acabou de sair!`)
            break

        case 'user-id':
            userId = data.userId
            break

        case 'bet-made':
            showToast('Nova aposta', `Jogador ${data.userId} acabou de apostar em ${data.raffle}!`)
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
    bets.zooCasino = []

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
