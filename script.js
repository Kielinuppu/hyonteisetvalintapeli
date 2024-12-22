document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const hyonteisImage = document.getElementById('hyonteisImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');

    // Väitteet ja niiden vastaavat kuvat (index+1.png)
    const statements = [
        "MUURAHAINEN LENTÄÄ",      // 0
        "MUURAHAINEN RAKENTAA",    // 1
        "KUORIAINEN KIPITTÄÄ",     // 2
        "KUORIAINEN KUORSAA",      // 3
        "HÄMÄHÄKKI SURISEE",       // 4
        "HÄMÄHÄKKI KUTOO VERKKOA", // 5
        "LEPPÄKERTTU ON PUNAINEN", // 6
        "LEPPÄKERTTU ON SININEN",  // 7
        "AMPIAINEN LENTÄÄ",        // 8
        "AMPIAINEN NUKKUU",        // 9
        "KÄRPÄNEN SURISEE",        // 10
        "KÄRPÄNEN HUUTAA",         // 11
        "PERHONEN LENTÄÄ",         // 12
        "PERHONEN LAULAA",         // 13
        "HYTTYNEN INISEE",         // 14
        "HYTTYNEN PUHUU"           // 15
    ];

    // Kuvavastaavuudet väitteille
    const imageMap = {
        0: 'muurahainen',
        1: 'muurahainen',
        2: 'kuoriainen',
        3: 'kuoriainen',
        4: 'hamahakki',
        5: 'hamahakki',
        6: 'leppakerttu',
        7: 'leppakerttu',
        8: 'ampiainen',
        9: 'ampiainen',
        10: 'karpanen',
        11: 'karpanen',
        12: 'perhonen',
        13: 'perhonen',
        14: 'hyttynen',
        15: 'hyttynen'
    };

    // Oikeat väitteet
    const correctStatements = [1, 2, 5, 6, 8, 10, 12, 14];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;
        
        // Valitaan 2 oikeaa väitettä
        while (trueCount < 2) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
                trueCount++;
            }
        }
        
        // Valitaan 3 väärää väitettä
        while (questions.length < 5) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                !correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex } = question;
        hyonteisImage.src = `${imageMap[statementIndex]}.png`;
        hyonteisImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        const audioPrefix = 'V_';
        const audioMap = {
            0: 'muurahainen_lentaa',
            1: 'muurahainen_rakentaa',
            2: 'kuoriainen_kipittaa',
            3: 'kuoriainen_kuorsaa',
            4: 'hamahakki_surisee',
            5: 'hamahakki_kutoo_verkkoa',
            6: 'leppakerttu_punainen',
            7: 'leppakerttu_sininen',
            8: 'ampiainen_lentaa',
            9: 'ampiainen_nukkuu',
            10: 'karpanen_surisee',
            11: 'karpanen_huutaa',
            12: 'perhonen_lentaa',
            13: 'perhonen_laulaa',
            14: 'hyttynen_inisee',
            15: 'hyttynen_puhuu'
        };
        playAudio(`${audioPrefix}${audioMap[statementIndex]}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex } = gameQuestions[currentRound];
        const correctAnswer = correctStatements.includes(statementIndex);
        if ((isTrue && correctAnswer) || (!isTrue && !correctAnswer)) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }
    
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
});