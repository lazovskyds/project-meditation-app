const app = document.querySelector('.app'),
      timerInput = app.querySelector('[name="timer"]'),
      breatheInInput = app.querySelector('[name="breatheIn"]'),
      breatheInAudio = app.querySelector('[data-audio="breathe-in"]'),
      breatheOutInput = app.querySelector('[name="breatheOut"]'),
      breatheOutAudio = app.querySelector('[data-audio="breathe-out"]'),
      signalVolumeInput = app.querySelector('[name="signalVolumeInput"]'),
      backgroundAudio = app.querySelector('[data-audio="raining-hard"]'),
      backgroundVolumeInput = app.querySelector('[name="backgroundVolumeInput"]'),
      startBtn = app.querySelector('button.settings__button_start'),
      stopBtn = app.querySelector('button.settings__button_stop'),
      circle = app.querySelector('.cover__animated-circle'),
      circleText = app.querySelector('.cover__animated-text'),
      message = app.querySelector('.settings__message');
      
let meditateTimer, meditateInterval;

HTMLAudioElement.prototype.stop = function() {
    this.pause();
    this.currentTime = 0.0;
};

startBtn.addEventListener('click', () => {
    core.time.timer = +timerInput.value;
    core.time.breatheIn = +breatheInInput.value;
    core.time.breatheOut = +breatheOutInput.value;
    meditate();
});

stopBtn.addEventListener('click', () => {
    stopMeditate();
});

signalVolumeInput.addEventListener('change', () => {
    breatheInAudio.volume = signalVolumeInput.value / 100;
    breatheOutAudio.volume = signalVolumeInput.value / 100;
});

backgroundVolumeInput.addEventListener('change', () => {
    backgroundAudio.volume = backgroundVolumeInput.value / 100;
});

const core = {
    isMeditate: false,
    circleText: {
        waiting: 'Ожидание',
        breatheIn: 'Вдох',
        breatheOut: 'Выдох'
    },
    time: {
        timer: 0,
        breatheIn: 0,
        breatheOut: 0
    },
    message: {
        good: '',
        bad: 'Ошибка! Проверьте правильно ли заполнены поля выше'
    }
};

function meditate() {
    if(core.time.timer === 0 || core.time.breatheIn === 0 || core.time.breatheOut === 0 || core.time.timer < 1 || core.time.breatheIn < 4 || core.time.breatheOut < 4) {
        message.innerText = core.message.bad;
    } else {
        [timerInput, breatheInInput, breatheOutInput, startBtn].forEach((elem) => elem.setAttribute('disabled', 'disabled'));
        core.isMeditate = true;
        message.innerText = core.message.good;
        backgroundAudio.play();
        makeBreatheCycle();
        meditateInterval = setInterval(() => {
            if(core.isMeditate) {
                makeBreatheCycle();
            }
        }, core.time.breatheIn * 1000 + core.time.breatheOut * 1000);
        meditateTimer = setTimeout(stopMeditate, core.time.timer * 60 * 1000);
    }
}

function makeBreatheCycle() {
    makeBreatheIn();
    setTimeout(() => {
        if (core.isMeditate) {
            makeBreatheOut();
        }
    }, core.time.breatheIn * 1000);
}

function makeBreatheIn() {
    circleText.innerText = core.circleText.breatheIn;
    breatheInAudio.play();
    circle.style.cssText = `
        transform: scale(1.4);
        transition: ${core.time.breatheIn}s;
    `;
}

function makeBreatheOut() {
    circleText.innerText = core.circleText.breatheOut;
    breatheOutAudio.play();
    circle.style.cssText = `
        transform: scale(1);
        transition: ${core.time.breatheOut}s;
    `;
}

function stopMeditate() {
    core.isMeditate = false;
    circleText.innerText = core.circleText.waiting;
    [timerInput, breatheInInput, breatheOutInput, startBtn].forEach((elem) => elem.removeAttribute('disabled'));
    [breatheInAudio, breatheOutAudio, backgroundAudio].forEach((elem) => elem.stop())
    clearTimeout(meditateTimer);
    clearInterval(meditateInterval);
    circle.style.cssText = `
        transform: scale(1);
        transition: .5s;
    `;
}