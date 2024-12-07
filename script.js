document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameArea = document.getElementById('game-area');
    const modal = document.getElementById('message-modal');
    const modalText = document.getElementById('modal-text');
    const closeModal = document.getElementById('close-modal');
    const menuButton = document.getElementById('menu-button');
    const menuLinks = document.getElementById('menu-links');
    const quizArea = document.getElementById('quiz-area');
    const wordBox = document.getElementById('word-box');
    const florWord = document.getElementById('flor-word');
    const nextScreenButton = document.getElementById('next-screen');
    const backgroundAudio = document.getElementById('background-audio');
    let quizAnswers = []; // Para armazenar as iniciais das respostas
    let currentQuestionIndex = 0; // Para acompanhar a pergunta atual
    let heartsClicked = 0; // Para contar quantos corações foram clicados

    // Exibir ou ocultar menu
    menuButton.addEventListener('click', () => {
        menuLinks.style.display = menuLinks.style.display === 'block' ? 'none' : 'block';
    });

    // Iniciar o jogo
    startButton.addEventListener('click', () => {
        backgroundAudio.play(); // Reproduz o áudio
        showScreen(1); // Transição para a tela do jogo
        setupGame();
    });

    // Reiniciar
    restartButton?.addEventListener('click', () => showScreen(0));

    // Fechar modal
    closeModal?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Funções auxiliares
    function showScreen(index) {
        gsap.to('.screen.visible', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                screens.forEach((screen, i) => {
                    screen.classList.toggle('visible', i === index);
                });
                gsap.fromTo('.screen.visible', { opacity: 0 }, { opacity: 1, duration: 0.5 });
            },
        });
    }

    // Tela do Jogo (corações)
    function setupGame() {
        gameArea.innerHTML = '';
        const messages = [
            'oi meu bem',
            'feliz aniversário',
            'obrigado por ser minha',
            'eu amo ser sua sabia?',
            'me pedi em namoro quando?',
        ];

        messages.forEach((message, index) => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.addEventListener('click', () => {
                modalText.textContent = message;
                modal.classList.remove('hidden');
                heart.remove();
                heartsClicked++;

                // Checar se todos os corações foram clicados
                if (heartsClicked === messages.length) {
                    setTimeout(() => {
                        // Agora vamos para a galeria (Tela 3)
                        showScreen(2); // Tela de galeria (índice 2)
                        setupQuiz(); // Chama a função para configurar o quiz
                    }, 1000); // Delay de 1 segundo
                }
            });
            gameArea.appendChild(heart);
        });
    }

    // Inicializar Swiper para a galeria
    const swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: false,
        on: {
            slideChange: function () {
                if (this.isEnd) {
                    // Quando chegar no final da galeria, vai para o quiz
                    setTimeout(() => {
                        showScreen(3); // Vai para a tela do quiz
                        setupQuiz(); // Chama a função para configurar o quiz
                    }, 500); // Vai para a tela do quiz
                }
            },
        },
    });

    function setupQuiz() {
        quizArea.innerHTML = '';
        const questions = [
            {
                question: 'O que me chamou mais atenção em ti?',
                correctAnswer: 'Sorriso',
                options: ['Sorriso', 'Cabelo', 'Olhões', 'Voz']
            },
            {
                question: 'O que eu mais quero fazer com você?',
                correctAnswer: 'Dormir',
                options: ['Cozinhar', 'Viajar', 'Dormir', 'Assistir Harry Potter']
            },
            {
                question: 'Qual vai ser a cor do nosso gatinho?',
                correctAnswer: 'Ruivo',
                options: ['Preto', 'Branco', 'Ruivo', 'Branco e Preto']
            },
            {
                question: 'Qual é a qualidade que mais admiro em ti?',
                correctAnswer: 'Humor',
                options: ['Sinceridade', 'Empatia', 'Humor']
            },
        ];
    
        // Gerar a primeira pergunta
        const question = questions[currentQuestionIndex];
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = ` 
            <p>${question.question}</p>
            ${question.options.map(option => `<button class="answer" data-answer="${question.correctAnswer}" data-option="${option}">${option}</button>`).join('')}
        `;
        quizArea.appendChild(questionDiv);
    
        // Selecionar os botões de resposta depois de criá-los
        const answerButtons = document.querySelectorAll('.answer');
    
        // Adicionar evento de resposta
        answerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const answer = e.target.getAttribute('data-answer');
                const option = e.target.getAttribute('data-option');
                
                if (answer === option) {  // Verifica se a resposta está certa
                    quizAnswers.push(answer.charAt(0));  // Adiciona a inicial da resposta
                    florWord.textContent = quizAnswers.join('');  // Atualiza a palavra formada
                    e.target.disabled = true;  // Desabilita o botão
                    e.target.style.backgroundColor = "#e0e0e0";  // Marca a resposta correta
                    
                    // Avança para a próxima pergunta
                    setTimeout(() => {
                        currentQuestionIndex++; // Aumenta o índice para a próxima pergunta
                        if (currentQuestionIndex < questions.length) {
                            setupQuiz(); // Exibe a próxima pergunta
                        } else {
                            setTimeout(() => showScreen(4), 500); // Fim do quiz, vai para a tela final
                        }
                    }, 500);
                } else {
                    e.target.disabled = true;  // Desabilita a resposta errada
                    e.target.style.backgroundColor = "#ffb3b3";  // Marca a resposta errada
                    setTimeout(() => e.target.style.display = 'none', 1000);  // Esconde a alternativa errada
                }
            });
        });
    }
});
