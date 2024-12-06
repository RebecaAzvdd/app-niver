document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameArea = document.getElementById('game-area');
    const modal = document.getElementById('message-modal');
    const modalText = document.getElementById('modal-text');
    const closeModal = document.getElementById('close-modal');

    startButton.addEventListener('click', () => {
        showScreen(1);
        setupGame();
    });

    restartButton.addEventListener('click', () => showScreen(0));

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    function showScreen(index) {
        gsap.to('.screen.visible', { opacity: 0, duration: 0.5, onComplete: () => {
            screens.forEach((screen, i) => {
                screen.classList.toggle('visible', i === index);
            });
            gsap.fromTo('.screen.visible', { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }});
    }

    function setupGame() {
        gameArea.innerHTML = ''; 
        const messages = [
            'oi meu bem',
            'feliz aniversario',
            'obrigado por ser minha',
            'eu amo ser sua sabia?',
            'me pedi em namoro quando?'
        ];

        for (let i = 0; i < messages.length; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.addEventListener('click', () => {
                modalText.textContent = messages[i];
                modal.classList.remove('hidden');
                heart.remove();
                if (document.querySelectorAll('.heart').length === 0) {
                    setTimeout(() => showScreen(2), 1000);
                }
            });
            gameArea.appendChild(heart);
        }
    }

    new Swiper('.swiper-container', {
        direction: 'horizontal', // Garantir layout horizontal
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
                    setTimeout(() => showScreen(3), 500);
                }
            },
        },
    });
});
