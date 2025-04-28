document.addEventListener('DOMContentLoaded', function() {
    // Данные карточек (математика)
    const cardsData = [
        {
            question: "Что такое теорема Пифагора?",
            answer: "В прямоугольном треугольнике квадрат гипотенузы равен сумме квадратов катетов: \\(c^2 = a^2 + b^2\\)",
            image: "pythagoras"
        },
        {
            question: "Как найти площадь круга?",
            answer: "Площадь круга вычисляется по формуле: \\(S = \\pi r^2\\), где \\(r\\) - радиус круга",
            image: "circle"
        },
        {
            question: "Что такое производная функции?",
            answer: "Производная функции показывает скорость изменения функции в данной точке. Геометрически - это угловой коэффициент касательной к графику функции.",
            image: "derivative"
        },
        {
            question: "Как решить квадратное уравнение?",
            answer: "Квадратное уравнение вида \\(ax^2 + bx + c = 0\\) решается по формуле:<br>\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)<br>Дискриминант \\(D = b^2 - 4ac\\) определяет количество корней.",
            image: "quadratic"
        },
        {
            question: "Что такое логарифм?",
            answer: "Логарифм числа \\(b\\) по основанию \\(a\\) (\\(\\log_a b\\)) - это показатель степени, в которую нужно возвести \\(a\\), чтобы получить \\(b\\): \\(a^{\\log_a b} = b\\)",
            image: "logarithm"
        },
        {
            question: "Как найти объем шара?",
            answer: "Объем шара вычисляется по формуле: \\(V = \\frac{4}{3}\\pi r^3\\), где \\(r\\) - радиус шара",
            image: "sphere"
        },
        {
            question: "Что такое интеграл?",
            answer: "Интеграл функции - это площадь под кривой графика функции. Неопределенный интеграл - множество первообразных. Определенный интеграл - число, равное площади на заданном интервале.",
            image: "integral"
        },
        {
            question: "Как работает бином Ньютона?",
            answer: "Бином Ньютона: \\((a + b)^n = \\sum_{k=0}^n C(n,k) \\cdot a^{n-k}b^k\\), где \\(C(n,k)\\) - биномиальные коэффициенты",
            image: "binomial"
        },
        {
            question: "Что такое мнимая единица?",
            answer: "Мнимая единица \\(i\\) - это число, квадрат которого равен \\(-1\\) (\\(i^2 = -1\\)). Основа комплексных чисел вида \\(z = a + bi\\)",
            image: "imaginary"
        },
        {
            question: "Как найти определитель матрицы 2×2?",
            answer: "Для матрицы:<br>\\(\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}\\)<br>Определитель вычисляется как: \\(\\det = ad - bc\\)",
            image: "matrix"
        }
    ];

    // Элементы DOM
    const flashcard = document.getElementById('flashcard');
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    const cardTitle = document.querySelector('.card-title');
    const cardCounter = document.getElementById('card-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const themeBtn = document.getElementById('theme-btn');
    const progressBar = document.getElementById('progress-bar');
    const themeIcon = themeBtn.querySelector('i');
    const cardImages = document.querySelectorAll('.card-image');
    
    // Состояние
    let currentCardIndex = 0;
    let shuffledCards = [...cardsData];
    let isDarkTheme = false;
    
    // Инициализация
    updateCard();
    updateProgress();
    setupEventListeners();
    
    function setupEventListeners() {
        // Переворот карточки
        flashcard.addEventListener('click', flipCard);
        document.querySelectorAll('.flip-btn').forEach(btn => {
            btn.addEventListener('click', flipCard);
        });
        
        // Навигация
        prevBtn.addEventListener('click', showPrevCard);
        nextBtn.addEventListener('click', showNextCard);
        shuffleBtn.addEventListener('click', shuffleCards);
        themeBtn.addEventListener('click', toggleTheme);
        
        // Клавиатурная навигация
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                showPrevCard();
            } else if (e.key === 'ArrowRight') {
                showNextCard();
            } else if (e.key === ' ') {
                flipCard();
                e.preventDefault();
            } else if (e.key === 't' || e.key === 'T') {
                toggleTheme();
            }
        });
    }
    
    function flipCard() {
        flashcard.classList.toggle('flipped');
        // Добавляем анимацию "пружинки"
        flashcard.style.transform = flashcard.classList.contains('flipped') 
            ? 'rotateY(180deg) scale(1.02)' 
            : 'rotateY(0deg) scale(1.02)';
        
        setTimeout(() => {
            flashcard.style.transform = flashcard.classList.contains('flipped') 
                ? 'rotateY(180deg) scale(1)' 
                : 'rotateY(0deg) scale(1)';
        }, 300);
    }
    
    function showPrevCard() {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            animateCardChange('left');
        } else {
            // Анимация "тряски" если карточки закончились
            animateShake(prevBtn);
        }
    }
    
    function showNextCard() {
        if (currentCardIndex < shuffledCards.length - 1) {
            currentCardIndex++;
            animateCardChange('right');
        } else {
            animateShake(nextBtn);
        }
    }
    
    function animateCardChange(direction) {
        // Анимация исчезновения
        flashcard.style.opacity = '0';
        flashcard.style.transform = direction === 'left' 
            ? 'translateX(-50px) rotateY(0deg)' 
            : 'translateX(50px) rotateY(0deg)';
        
        setTimeout(() => {
            // Обновляем контент
            updateCard();
            
            // Анимация появления
            flashcard.style.opacity = '1';
            flashcard.style.transform = 'translateX(0) rotateY(0deg)';
            
            // Сбрасываем переворот
            if (flashcard.classList.contains('flipped')) {
                flashcard.classList.remove('flipped');
            }
        }, 300);
    }
    
    function animateShake(element) {
        element.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
    }
    
    function updateCard() {
        const card = shuffledCards[currentCardIndex];
        cardTitle.textContent = card.question;
        cardBack.innerHTML = `<p>${card.answer}</p><button class="flip-btn"><i class="fas fa-sync-alt"></i> Показать вопрос</button>`;
        
        // Обновляем изображение
        updateCardImage(card.image);
        
        // Обновляем счетчик
        cardCounter.textContent = `${currentCardIndex + 1}/${shuffledCards.length}`;
        
        // Обновляем прогресс
        updateProgress();
        
        // Обновляем обработчики для новой кнопки
        document.querySelector('.card-back .flip-btn').addEventListener('click', flipCard);
        
        // Перерендериваем MathJax для новых формул
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }
    
    function updateCardImage(imageType) {
        // В реальном проекте здесь можно загружать разные SVG в зависимости от темы карточки
        const color = isDarkTheme ? '%23e8eaed' : '%234285f4';
        const svgMap = {
            pythagoras: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M21 3H3v18h18V3zm-2 16H5V5h14v14z"/><path d="M15 8v8h-2v-6h-2v6H9V8h2v6h2V8h2z"/></svg>`,
            circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="10"/></svg>`,
            derivative: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M5 19h14v2H5zM19 3H5v2h14v2h-6v2h6v2h-6v2h6v2h-6v2h6v2H5v2h14v2H5v-2H3v-2h2v-2H3v-2h2v-2H3v-2h2v-2H3V9h2V7H3V5h2V3H3V1h2v2h14v2z"/></svg>`,
            quadratic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M7 10h10v2H7zm0 4h7v2H7z"/></svg>`,
            logarithm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M8 17h2v-5h1v-1h3v1h1v5h2v-6h-3v-1h-3v1H8z"/></svg>`,
            sphere: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="none" stroke="${color}" stroke-width="2"/></svg>`,
            integral: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M11 3h2v18h-2z"/><path d="M5 3h2v6h2v2H7v6h10v-2h2v6h-2v-2H7v2H5z"/></svg>`,
            binomial: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M12 7h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2V9h-2V7z"/></svg>`,
            imaginary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
            matrix: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/><path d="M7 7h4v4H7zm0 6h4v4H7zm6-6h4v4h-4zm0 6h4v4h-4z"/></svg>`
        };
        
        const svg = svgMap[imageType] || svgMap.pythagoras;
        cardImages.forEach(img => {
            img.style.backgroundImage = `url('data:image/svg+xml;utf8,${svg}')`;
        });
    }
    
    function shuffleCards() {
        // Анимация перемешивания
        shuffleBtn.classList.add('animate__animated', 'animate__rotateIn');
        setTimeout(() => {
            shuffleBtn.classList.remove('animate__animated', 'animate__rotateIn');
        }, 1000);
        
        // Алгоритм Фишера-Йетса для перемешивания
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
        
        currentCardIndex = 0;
        updateCard();
    }
    
    function updateProgress() {
        const progress = ((currentCardIndex + 1) / shuffledCards.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : '');
        
        // Анимация переключения темы
        themeIcon.classList.add('animate__animated', 'animate__flip');
        setTimeout(() => {
            themeIcon.classList.remove('animate__animated', 'animate__flip');
        }, 1000);
        
        // Меняем иконку
        if (isDarkTheme) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Обновляем изображение карточки для новой темы
        updateCardImage(shuffledCards[currentCardIndex].image);
    }
});