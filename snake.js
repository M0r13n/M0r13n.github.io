var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight * 2,
    ctx = c.getContext('2d'),

    opts = {
        count: 150,
        variation: 1.7,
        baseLife: 1750,
        addedLife: 600,

        cx: w / 2,
        cy: h / 2,

        bgR: 250, // default
        bgG: 250, // default
        bgB: 250, // default

        repaintAlpha: .5,

        fps: 25,

        saturation: "50%",
        lightness: "80%",

        fixedColorHue: 220,

        sizeGain: 1.5,

        positionHorizontal: 'left',
        positionVertical: 'top',

    },

    snakes = [],
    tick = (Math.random() * 360) | 0,
    first = true,
    toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    setColor();
}

function setColor() {
    backgroundColor = getRGBA(getComputedStyle(document.body).backgroundColor);
    opts.bgR = backgroundColor.r;
    opts.bgG = backgroundColor.g;
    opts.bgB = backgroundColor.b;
}

function getRGBA(colorStr) {
    colorStr = colorStr.slice(colorStr.indexOf('(') + 1, colorStr.indexOf(')'));
    let colorArr = colorStr.split(','),
        i = colorArr.length;
    while (i--) {
        colorArr[i] = parseInt(colorArr[i], 10);
    }
    return {
        r: colorArr[0],
        g: colorArr[1],
        b: colorArr[2],
        a: colorArr[3]
    }
}

function resize() {
    w = c.width = window.innerWidth,
        h = c.height = window.innerHeight * 2;

    moveCenter();

    setTimeout(function () {
        warmupIterations = 30;
        for (i = 0; i <= warmupIterations; i++) {
            update();
            render();
        }
    }, 3);
}


function moveCenter() {
    if (opts.positionHorizontal == "left") {
        opts.cx = 0;
    }
    if (opts.positionHorizontal == "center") {
        opts.cx = w / 2;
    }
    if (opts.positionHorizontal == "right") {
        opts.cx = w - 1;
    }
    if (opts.positionVertical == "top") {
        opts.cy = 0;
    }
    if (opts.positionVertical == "center") {
        opts.cy = h / 2;
    }
    if (opts.positionVertical == "bottom") {
        opts.cy = h - 1;
    }
}

function init() {
    setColor();
    snakes.length = 0;
    ctx.fillStyle = `rgb(${opts.bgR}, ${opts.bgG}, ${opts.bgB})`;
    ctx.fillRect(0, 0, w, h);

    if (first) {
        moveCenter();
        anim();
        first = false;
    }
}

function anim() {
    // window.requestAnimationFrame(anim);
    setInterval(function () {
        update();
        render();
    }, 1000 / opts.fps);
}

function update() {

    ++tick;

    if (snakes.length < opts.count)
        snakes.push(new Snake);

    snakes.map(function (snake) {
        snake.update();
    });
}

function render() {

    ctx.fillStyle = `rgba(${opts.bgR}, ${opts.bgG}, ${opts.bgB}, ${opts.repaintAlpha})`;
    ctx.fillRect(0, 0, w, h);

    snakes.map(function (snake) {
        snake.render();
    });
}

function Snake() {

    this.reset();
}
Snake.prototype.reset = function () {

    this.x1 = opts.cx + Math.random();
    this.x2 = opts.cx + Math.random();
    this.x3 = opts.cx + Math.random();
    this.y1 = opts.cy + Math.random();
    this.y2 = opts.cy + Math.random();
    this.y3 = opts.cy + Math.random();

    this.rad = Math.random() * Math.PI * 2;

    this.direction = Math.random() < .5 ? 1 : -1;
    this.size = 1;
    this.life = opts.baseLife + Math.random() * opts.addedLife;

    // 'hsla(hue, saturation, lightness, alp)
    this.color = `hsla(${opts.fixedColorHue + (this.rad / Math.PI / 2 * 50)}, ${opts.saturation}, ${opts.lightness}, alp )`
}

Snake.prototype.update = function () {

    --this.life;

    this.size += 1 + (Math.random() * opts.sizeGain) / 2;
    this.direction *= -1;
    this.rad += Math.random() * opts.variation * (Math.random() < .5 ? 1 : -1) + Math.PI / 2 * this.direction;

    var x4 = this.x3 + Math.cos(this.rad) * this.size,
        y4 = this.y3 + Math.sin(this.rad) * this.size;

    this.x1 = this.x2;
    this.y1 = this.y2;
    this.x2 = this.x3;
    this.y2 = this.y3;
    this.x3 = x4;
    this.y3 = y4;

    if (this.life <= 0 || this.x1 > w || this.x1 < 0 || this.y1 > h || this.y1 < 0) this.reset();
}
Snake.prototype.render = function () {

    ctx.fillStyle = this.color.replace('alp', .25 + Math.random() * .5);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.fill();
}

toggleSwitch.addEventListener('change', switchTheme, false);
window.onresize = resize;
init();