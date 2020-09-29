$(() => {
    const sfxFlip = new Audio('sfx/flip.mp3');
    const sfxRoll = new Audio('sfx/roll.mp3');
    const sfxPawn = new Audio('sfx/pawn.mp3');

    let cardIndex = 0;

    pawnSetup();
    cardsSetup();
    keyboardSetup();

    function pawnSetup() {
        $('.pawn').draggable({
            stop: () => {playSound(sfxPawn);}
        });
    }

    function cardsSetup() {
        $.getJSON('questions.json', (data) => {
            // shuffle
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                const tmp = data[i];
                data[i] = data[j];
                data[j] = tmp;
            }
            
            $.each(data, (id, card) => {
                const template = $($('#card-template').html());
                template.find('.card-id').html(card.id);
                template.find('.category').html(card.category);
                template.find('.question').html(card.question);
                template.find('.answer').html(card.answer);

                $('.card-stack').append(template);
            });

            $('.card').flip({trigger: 'click'});
        });
    }

    function keyboardSetup() {
        $(document).keypress((evt) => {
            switch (evt.key) {
                case ' ':
                    evt.preventDefault();
                    toggleCardDisplay();
                    return;

                case 'x':
                case 'X':
                    evt.preventDefault();
                    flipCard();
                    return;

                case ',':
                case '<':
                    evt.preventDefault();
                    prevCard();
                    return;

                case '.':
                case '>':
                    evt.preventDefault();
                    nextCard();
                    return;

                case 'Enter':
                    evt.preventDefault();
                    rollDice();
                    return;
            }
        });
    }

    function playSound(sfx) {
        sfx.currentTime = 0;
        sfx.play();
    }

    function resetCardDisplay() {
        const cards = $('.card');
        cards.hide();
        cards.flip(false);
    }

    function toggleCardDisplay(fade) {
        const card = $($('.card')[cardIndex]);
        card.toggle();
        if (card.is(':visible')) {
            playSound(sfxFlip);
        }
    }

    function flipCard() {
        const card = $($('.card')[cardIndex]);
        if (!card.is(':visible')) {
            return;
        }
        playSound(sfxFlip);
        card.flip('toggle');
    }

    function prevCard() {
        if (cardIndex > 0) {
            cardIndex--;
        }
        resetCardDisplay(); 
        toggleCardDisplay();
    }

    function nextCard() {
        const cards = $('.card');
        if (cardIndex < cards.length - 1) {
            cardIndex++;
        }
        resetCardDisplay();
        toggleCardDisplay();
    }

    // random integer between min and max inclusive
    function rand(min, max) {
        return Math.floor(Math.random() * (1 + max - min)) + min;
    }

    function rollDice() {
        const cube = $('.cube');
        if (!cube.is(':visible')) {
            return;
        }
        cube.removeClass('roll');

        setTimeout(() => {
            cube.addClass('roll');
            playSound(sfxRoll);

            const timer = setInterval(() => {
                cube.css('background-image', 'url("img/die-roll-' + rand(1, 8) + '.png")');
            }, 100);

            setTimeout(() => {
                clearInterval(timer);
                cube.css('background-image', 'url("img/die-' + rand(1, 6) + '.png")');
            }, 1000);
        }, 100);
    }
});
