let canvas = document.getElementById('canvas-area');
let ctx = canvas.getContext('2d');
document.getElementById('delete-figure').disabled = true;
let min = 10;
let max = 560;
let minLength = 30;
let maxLength = 200;
let selected = -1;
let mousePressed = {
    move: false,
    resizeTopLeft: false,
    resizeTopRight: false,
    resizeBottomLeft: false,
    resizeBottomRight: false,
    resizeTop: false,
    resizeLeft: false,
    resizeBottom: false,
    resizeRight: false,
};
let xDiffer = 0;
let yDiffer = 0;
const INACCUR = 25;

canvas.style.cursor = 'pointer';

function getRandomPosition() {
    return Math.random() * (max - min) + min;
}

function getRandomLength(coord) {
    let length;
    do {
        length = Math.random() * (maxLength - minLength) + minLength;
    } while (coord + length > 590);
    return length;
}

ctx.fillStyle = '#FF9999';
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

function fillRect(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
}

function strokeRect(x, y, w, h) {
    ctx.strokeRect(x, y, w, h);
}

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Rect.prototype = {
    draw: function () {
        fillRect(this.x, this.y, this.w, this.h);
    },

    stroke: function () {
        strokeRect(this.x, this.y, this.w, this.h);
    }
};

let i = -1;
let rect = [];

function isCursorOnRect(x, y, rect) {
    return x + INACCUR > rect.x && x - INACCUR < rect.x + rect.w &&
        y + INACCUR > rect.y && y - INACCUR < rect.y + rect.h;
}

function isCursorOnTopLeftCorner(x, y, rect) {
    return x > rect.x && x < rect.x + INACCUR &&
        y > rect.y && y < rect.y + INACCUR;
}

function isCursorOnTopRight(x, y, rect) {
    return x > rect.x + rect.w - INACCUR && x < rect.x + rect.w &&
        y > rect.y && y < rect.y + INACCUR;
}

function isCursorOnBottomLeft(x, y, rect) {
    return x > rect.x && x < rect.x + INACCUR &&
        y > rect.y + rect.h - INACCUR && y < rect.y + rect.h;
}

function isCursorOnBottomRight(x, y, rect) {
    return x > rect.x + rect.w - INACCUR && x < rect.x + rect.w &&
        y > rect.y + rect.h - INACCUR && y < rect.y + rect.h;
}

function isCursorOnTop(x, y, rect) {
    return x > rect.x && x < rect.x + rect.w &&
        y > rect.y && y < rect.y + INACCUR;
}

function isCursorOnLeft(x, y, rect) {
    return x > rect.x && x < rect.x + INACCUR &&
        y > rect.y && y < rect.y + rect.h;
}

function isCursorOnBottom(x, y, rect) {
    return x > rect.x && x < rect.x + rect.w &&
        y > rect.y + rect.h - INACCUR && y < rect.y + rect.h;
}

function isCursorOnRight(x, y, rect) {
    const LEFT_BORDER = rect.x + rect.w - INACCUR;
    const RIGHT_BORDER = rect.x + rect.w;
    const TOP_BORDER = rect.y;
    const BOTTOM_BORDER = rect.y + rect.h;
    return x > LEFT_BORDER && x < RIGHT_BORDER &&
        y > TOP_BORDER && y < BOTTOM_BORDER;
}

canvas.onclick = function (e) {
    let x = e.pageX - (window.innerWidth / 2 - 425);
    let y = e.pageY - (window.innerHeight / 2 - 300);
    for (let index = i; index >= 0; index--) {
        if (isCursorOnRect(x, y, rect[index])) {
            selected = index;
            update();
            document.getElementById('delete-figure').disabled = false;
            return;
        }
    }
    selected = -1;
    update();
};

canvas.onmousedown = function (e) {
    if (e.button !== 0 || selected < 0) {
        return;
    }
    let x = e.pageX - (window.innerWidth / 2 - 422);
    let y = e.pageY - (window.innerHeight / 2 - 297);
    if (isCursorOnRect(x, y, rect[selected])) {
        if (isCursorOnTopLeftCorner(x, y, rect[selected])){
            mousePressed.resizeTopLeft = true;
            return;
        }
        if (isCursorOnTopRight(x, y, rect[selected])){
            mousePressed.resizeTopRight = true;
            return;
        }
        if (isCursorOnBottomLeft(x, y, rect[selected])){
            mousePressed.resizeBottomLeft = true;
            return;
        }
        if (isCursorOnBottomRight(x, y, rect[selected])){
            mousePressed.resizeBottomRight = true;
            return;
        }
        if (isCursorOnTop(x, y, rect[selected])){
            mousePressed.resizeTop = true;
            return;
        }
        if (isCursorOnLeft(x, y, rect[selected])){
            mousePressed.resizeLeft = true;
            return;
        }
        if (isCursorOnBottom(x, y, rect[selected])){
            mousePressed.resizeBottom = true;
            return;
        }
        if (isCursorOnRight(x, y, rect[selected])){
            mousePressed.resizeRight = true;
            return;
        }
        mousePressed.move = true;
        xDiffer = x - rect[selected].x;
        yDiffer = y - rect[selected].y;
    }
};

canvas.onmouseup = function () {
    for (let key in mousePressed) {
        mousePressed[key] = false;
    }
};

canvas.onmousemove = function (e) {
    let mouseEvent = -1;
    let arrayOfMousePressed = Object.values(mousePressed);
    for (let [index, key] of arrayOfMousePressed.entries()) {
        if (key) {
            mouseEvent = index;
        }
    }
    if (mouseEvent === -1) {
        return;
    }
    let x = e.pageX - (window.innerWidth / 2 - 422);
    let y = e.pageY - (window.innerHeight / 2 - 297);
    switch (mouseEvent) {
        case 0: {
            rect[selected].x = x - xDiffer;
            rect[selected].y = y - yDiffer;
            update();
            break;
        }
        case 1: {
            rect[selected].w += rect[selected].x - x;
            rect[selected].h += rect[selected].y - y;
            rect[selected].x = x;
            rect[selected].y = y;
            update();
            break;
        }
        case 2: {
            rect[selected].w = x - rect[selected].x;
            rect[selected].h += rect[selected].y - y;
            rect[selected].y = y;
            update();
            break;
        }
        case 3: {
            rect[selected].w += rect[selected].x - x;
            rect[selected].h = y - rect[selected].y;
            rect[selected].x = x;
            update();
            break;
        }
        case 4: {
            rect[selected].w = x - rect[selected].x;
            rect[selected].h = y - rect[selected].y;
            update();
            break;
        }
        case 5: {
            rect[selected].h += rect[selected].y - y;
            rect[selected].y = y;
            update();
            break;
        }
        case 6: {
            rect[selected].w += rect[selected].x - x;
            rect[selected].x = x;
            update();
            break;
        }
        case 7: {
            rect[selected].h = y - rect[selected].y;
            update();
            break;
        }
        case 8: {
            rect[selected].w = x - rect[selected].x;
            update();
            break;
        }
        default: {
            break;
        }
    }
};

function drawRect() {
    if (i < 9) {
        i++;
        let x = getRandomPosition();
        let y = getRandomPosition();
        rect.push(new Rect(x, y, getRandomLength(x), getRandomLength(y)));
    } else {
        alert('The canvas is full!');
    }
    update();
}

function deleteElem(index) {
    rect.splice(index, 1);
    selected = -1;
    update();
    i--;
}

function deleteRect() {
    if (selected > -1) {
        deleteElem(selected);
        document.getElementById('delete-figure').disabled = true;
    }
}

function clearArea() {
    rect = [];
    update();
    i = -1;
    selected = -1;
}

function update() {
    ctx.clearRect(0, 0, 600, 600);
    for (let i in rect) {
        rect[i].draw();
    }
    if (selected > -1) {
        rect[selected].stroke();
    }
}