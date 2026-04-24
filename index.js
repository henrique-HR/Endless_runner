const telaInicio = document.getElementById('tela-inicio')
const btnJogar   = document.getElementById('btn-jogar')
const game       = document.querySelector('.game_board')
const mario      = document.querySelector('#mario')
const pedra      = document.querySelector('.pedra')
const scoreEl    = document.querySelector('#ponto')
const botao      = document.querySelector('#botao')

// --- Audio ---
const audioEfeito = document.createElement('audio')
const audiofundo  = document.createElement('audio')
game.appendChild(audioEfeito)
game.appendChild(audiofundo)
audiofundo.setAttribute('src', './audio/fundo.mp3')
audiofundo.loop = true

// --- Estado do jogo ---
let pontos    = 0
let gameAtivo = false
let scoreLoop = null
let loop      = null

// --- Botao Jogar ---
btnJogar.addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
    }
    if (screen.orientation?.lock) {
        screen.orientation.lock('landscape').catch(() => {})
    }
    telaInicio.style.display = 'none'
    iniciar()
})

// --- Iniciar jogo ---
function iniciar() {
    // Resetar estado
    pontos    = 0
    gameAtivo = true
    scoreEl.textContent = 0

    // Resetar personagem e pedra
    mario.className = 'personagem troca'
    game.classList.remove('sefudeu')
    pedra.style.animation = ''
    pedra.style.left = ''

    // Iniciar audio
    audiofundo.currentTime = 0
    audiofundo.play()

    // Score
    scoreLoop = setInterval(() => {
        if (gameAtivo) {
            pontos++
            scoreEl.textContent = pontos
        }
    }, 100)

    // Colisao
    loop = setInterval(() => {
        const marioRect = mario.getBoundingClientRect()
        const pedraRect = pedra.getBoundingClientRect()

        const colidiu = (
            marioRect.right  > pedraRect.left  + 10 &&
            marioRect.left   < pedraRect.right - 10 &&
            marioRect.bottom > pedraRect.top   + 10
        )

        if (colidiu) fim()
    }, 10)
}

// --- Game Over ---
function fim() {
    gameAtivo = false
    clearInterval(loop)
    clearInterval(scoreLoop)

    audioEfeito.setAttribute('src', './audio/audio_wndzp.mp3')
    audioEfeito.play()
    audiofundo.pause()

    pedra.style.animation = 'none'
    pedra.style.left = pedra.getBoundingClientRect().left + 'px'
    mario.classList.add('morte')
    game.classList.add('sefudeu')

    // Volta para tela inicial apos 6 segundos
    setTimeout(() => {
        telaInicio.style.display = 'flex'
    }, 6000)
}

// --- Pulo ---
const pulo = () => {
    if (!gameAtivo) return
    if (mario.classList.contains('jump')) return
    mario.classList.add('jump')
    audioEfeito.setAttribute('src', './audio/eu-gostumm.mp3')
    audioEfeito.play()
    setTimeout(() => {
        mario.classList.remove('jump')
    }, 500)
}

// --- Controles ---
botao.addEventListener('click', pulo)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') pulo()
})
