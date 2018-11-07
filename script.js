let canvas = document.getElementById('canvas-area');
let ctx = canvas.getContext('2d');
let deleteButton = document.getElementById('delete-figure');

deleteButton.disabled = true;

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
    rotate: false,
};
let xDiffer = 0;
let yDiffer = 0;
let initialX = 0;
let initialY = 0;

const INACCUR = 25;
const X_OFFSET = 422;
const Y_OFFSET = 297;
const MIN = 10;
const MAX = 560;
const MIN_LENGTH = 30;
const MAX_LENGTH = 200;
const IMAGE_SIDE = 20;
const CIRCLE_OFFSET = 50;
const ANGLIFY = Math.PI / 180;


canvas.style.cursor = 'default';

function getRandomPosition() {
    return Math.random() * (MAX - MIN) + MIN;
}

function getRandomLength(coord) {
    let length;
    do {
        length = Math.random() * (MAX_LENGTH - MIN_LENGTH) + MIN_LENGTH;
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

function addImage(x, y, w) {
    let xImage = x + w / 2 - IMAGE_SIDE / 2;
    let yImage = y - CIRCLE_OFFSET;
    let imageCircle = new Image();
    imageCircle.src = 'images/circle.png';
    ctx.drawImage(imageCircle, xImage, yImage, IMAGE_SIDE, IMAGE_SIDE);
}

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = 0;
}

Rect.prototype = {
    draw() {
        fillRect(this.x, this.y, this.w, this.h);
    },

    stroke() {
        strokeRect(this.x, this.y, this.w, this.h);
    },

    addImg() {
        addImage(this.x, this.y, this.w, this.h);
    }
};

let i = -1;
let rect = [];
update();

function positivateAngle(angle) {
    return angle % 360 + 360;
}

function anglifier(angle) {
    return angleCounter(angle) * ANGLIFY;
}

function angleCounter(angle) {
    return (positivateAngle(angle) % 90);
}

function sectionCounter(angle) {
    return !!(positivateAngle(angle) / 90 % 2);
}

function isCursorOnRect(x, y, rect) {
    const side1 = Math.cos(anglifier(rect.a)) * rect.w
        + Math.sin(anglifier(rect.a)) * rect.h;
    const side2 = Math.sin(anglifier(rect.a)) * rect.w
        + Math.cos(anglifier(rect.a)) * rect.h;
    const w = (!sectionCounter(rect.a)) ? side1 : side2;
    const h = (!sectionCounter(rect.a)) ? side2 : side1;
    const xTransformed = rect.x + (rect.w - w) / 2;
    const yTransformed = rect.y + (rect.h - h) / 2;

    return x > xTransformed - INACCUR
        && x < xTransformed + w + INACCUR
        && y >= yTransformed - INACCUR
        && y <= yTransformed + h + INACCUR
}

function isCursorOnTopLeftCorner(x, y, rect) {
    return x > rect.x
        && x < rect.x + INACCUR
        && y > rect.y
        && y < rect.y + INACCUR;
}

function isCursorOnTopRight(x, y, rect) {
    return x > rect.x + rect.w - INACCUR
        && x < rect.x + rect.w
        && y > rect.y
        && y < rect.y + INACCUR;
}

function isCursorOnBottomLeft(x, y, rect) {
    return x > rect.x
        && x < rect.x + INACCUR
        && y > rect.y + rect.h - INACCUR
        && y < rect.y + rect.h;
}

function isCursorOnBottomRight(x, y, rect) {
    return x > rect.x + rect.w - INACCUR
        && x < rect.x + rect.w
        && y > rect.y + rect.h - INACCUR
        && y < rect.y + rect.h;
}

function isCursorOnTop(x, y, rect) {
    return x > rect.x
        && x < rect.x + rect.w
        && y > rect.y
        && y < rect.y + INACCUR;
}

function isCursorOnLeft(x, y, rect) {
    return x > rect.x
        && x < rect.x + INACCUR
        && y > rect.y
        && y < rect.y + rect.h;
}

function isCursorOnBottom(x, y, rect) {
    return x > rect.x
        && x < rect.x + rect.w
        && y > rect.y + rect.h - INACCUR
        && y < rect.y + rect.h;
}

function isCursorOnRight(x, y, rect) {
    const LEFT_BORDER = rect.x + rect.w - INACCUR;
    const RIGHT_BORDER = rect.x + rect.w;
    const TOP_BORDER = rect.y;
    const BOTTOM_BORDER = rect.y + rect.h;

    return x > LEFT_BORDER
        && x < RIGHT_BORDER
        && y > TOP_BORDER
        && y < BOTTOM_BORDER;
}

function getRotateData(rect) {
    return [rect.x + rect.w / 2 - IMAGE_SIDE / 2,
        rect.x + rect.w / 2 + IMAGE_SIDE / 2,
        rect.y - CIRCLE_OFFSET - IMAGE_SIDE / 2,
        rect.y - CIRCLE_OFFSET + IMAGE_SIDE / 2,
        rect.x + rect.w / 2,
        rect.y - CIRCLE_OFFSET];
}

function isCursorOnRotate(x, y, rect) {
    let rotateData = getRotateData(rect);

    return x > rotateData[0]
        && x < rotateData[1]
        && y > rotateData[2]
        && y < rotateData[3];
}

document.body.onclick = function (e) {
    let x = e.pageX - (window.innerWidth / 2 - X_OFFSET);
    let y = e.pageY - (window.innerHeight / 2 - Y_OFFSET);

    for (let index = i; index >= 0; index--) {
        if (isCursorOnRect(x, y, rect[index]) || isCursorOnRotate(x, y, rect[index])) {
            selected = index;
            update();
            deleteButton.disabled = false;
            return;
        }
        if (!isCursorOnRect(x, y, rect[index])) {
            deleteButton.disabled = true;
            ctx.restore();
        }
    }
    selected = -1;
    ctx.restore();
    update();
};

document.body.onmousedown = function (e) {
    if (e.button !== 0 || selected < 0) return;

    ctx.save();

    let x = e.pageX - (window.innerWidth / 2 - X_OFFSET);
    let y = e.pageY - (window.innerHeight / 2 - Y_OFFSET);

    initialX = x;
    initialY = y;

    const X = rect[selected].x + rect[selected].w / 2;
    const Y = rect[selected].y + rect[selected].h / 2;
    const ANGLE = rect[selected].a * (Math.PI / 180);

    ctx.translate(X, Y);

    if (ANGLE != 0) {
        ctx.rotate(ANGLE);
    }

    ctx.translate(-X, -Y);

    if (isCursorOnRotate(x, y, rect[selected])) {
        mousePressed.rotate = true;
        return;
    }
    if (isCursorOnRect(x, y, rect[selected])) {
        if (isCursorOnTopLeftCorner(x, y, rect[selected])) {
            mousePressed.resizeTopLeft = true;
            return;
        }
        if (isCursorOnTopRight(x, y, rect[selected])) {
            mousePressed.resizeTopRight = true;
            return;
        }
        if (isCursorOnBottomLeft(x, y, rect[selected])) {
            mousePressed.resizeBottomLeft = true;
            return;
        }
        if (isCursorOnBottomRight(x, y, rect[selected])) {
            mousePressed.resizeBottomRight = true;
            return;
        }
        if (isCursorOnTop(x, y, rect[selected])) {
            mousePressed.resizeTop = true;
            return;
        }
        if (isCursorOnLeft(x, y, rect[selected])) {
            mousePressed.resizeLeft = true;
            return;
        }
        if (isCursorOnBottom(x, y, rect[selected])) {
            mousePressed.resizeBottom = true;
            return;
        }
        if (isCursorOnRight(x, y, rect[selected])) {
            mousePressed.resizeRight = true;
            return;
        }
        mousePressed.move = true;
        xDiffer = x - rect[selected].x;
        yDiffer = y - rect[selected].y;
    }
};

document.body.onmouseup = function () {
    for (let key in mousePressed) {
        mousePressed[key] = false;
    }
};

document.body.onmousemove = function (e) {
    const x = e.pageX - (window.innerWidth / 2 - X_OFFSET);
    const y = e.pageY - (window.innerHeight / 2 - Y_OFFSET);

    let isOverRect = false;

    for (let elem of rect) {
        if (isCursorOnRect(x, y, elem)) {
            canvas.style.cursor = 'pointer';
            isOverRect = true;
        }
        if (isCursorOnRight(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnBottom(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnLeft(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnTop(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnBottomRight(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnBottomLeft(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnTopRight(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
        if (isCursorOnTopLeftCorner(x, y, elem)) {
            canvas.style.cursor = 'grab';
        }
    }
    if (!isOverRect) {
        canvas.style.cursor = 'default';
    }

    let mouseEvent = -1;
    let arrayOfMousePressed = Object.values(mousePressed);

    for (let [index, key] of arrayOfMousePressed.entries()) {
        if (key) {
            mouseEvent = index;
        }
    }
    if (mouseEvent === -1) return;

    switch (mouseEvent) {
        case 0: {
            rect[selected].x = x - xDiffer;
            rect[selected].y = y - yDiffer;
            ctx.restore();
            update();
            break;
        }
        case 1: {
            rect[selected].w += rect[selected].x - x;
            rect[selected].h += rect[selected].y - y;
            rect[selected].x = x;
            rect[selected].y = y;
            ctx.restore();
            update();
            break;
        }
        case 2: {
            rect[selected].w = x - rect[selected].x;
            rect[selected].h += rect[selected].y - y;
            rect[selected].y = y;
            ctx.restore();
            update();
            break;
        }
        case 3: {
            rect[selected].w += rect[selected].x - x;
            rect[selected].h = y - rect[selected].y;
            rect[selected].x = x;
            ctx.restore();
            update();
            break;
        }
        case 4: {
            rect[selected].w = x - rect[selected].x;
            rect[selected].h = y - rect[selected].y;
            ctx.restore();
            update();
            break;
        }
        case 5: {
            rect[selected].h += initialY - y;
            rect[selected].y += y - initialY;
            initialY = y;
            ctx.restore();
            update();
            break;
        }
        case 6: {
            rect[selected].w += initialX - x;
            rect[selected].x += x - initialX;
            initialX = x;
            ctx.restore();
            update();
            break;
        }
        case 7: {
            rect[selected].h += y - initialY;
            initialY = y;
            ctx.restore();
            update();
            break;
        }
        case 8: {
            rect[selected].w += x - initialX;
            initialX = x;
            ctx.restore();
            update();
            break;
        }
        case 9: {
            rect[selected].a += x - initialX;
            initialX = x;
            ctx.restore();
            update();
            break;
        }
        default:
            break;
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
    ctx.restore();
    update();
}

function deleteElem(index) {
    rect.splice(index, 1);
    selected = -1;
    ctx.restore();
    update();
    i--;
}

function deleteRect() {
    if (selected > -1) {
        deleteElem(selected);
        deleteButton.disabled = true;
    }
}

function clearArea() {
    rect = [];
    selected = -1;
    i = -1;
    ctx.restore();
    update();
}

function update() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.restore();
    for (let i = 0; i < rect.length; i++) {
        ctx.save();

        const X = rect[i].x + rect[i].w / 2;
        const Y = rect[i].y + rect[i].h / 2;
        const ANGLE = rect[i].a * (Math.PI / 180);

        ctx.translate(X, Y);

        if (ANGLE != 0) {
            ctx.rotate(ANGLE);
        }

        ctx.translate(-X, -Y);
        rect[i].draw();

        if (selected === i) {
            rect[selected].stroke();
        }
        ctx.restore();
    }
    if (selected > -1) {
        rect[selected].addImg();
    }
}