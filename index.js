const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Sprite {
    constructor({
                    position,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offset = { x: 0, y: 0 }
                }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        //drawImage를 알아야 함.
        ctx.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        };
        this.isJumping = false;
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.isAttacking) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
            this.velocity.y = 0;
            this.isJumping = false;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/oak_woods_v1.0/background/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 130
    },
    imageSrc: './assets/oak_woods_v1.0/decorations/shop_anim.png',
    scale: 2.75,
    framesMax: 6
});

const player = new Fighter({
    position: {x: 100, y: 0},
    velocity: {x: 0, y: 0},
    offset: {
        x: 0,
        y: 0
    }
});
const enemy = new Fighter({
    position: {x: 900, y: 0},
    velocity: {x: 0, y: 0},
    offset: {
        x: 50,
        y: 0
    },
    color: 'blue'
});

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width > rectangle2.position.x
        && rectangle1.attackBox.position.x < rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height > rectangle2.position.y
        && rectangle1.attackBox.position.y < rectangle2.position.y + rectangle2.height
    )
}

const displayText = document.querySelector('#displayText');

let timer = 60;
let timerId;

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        if (player.health === enemy.health) {
            displayText.innerHTML = 'Draw';
            displayText.style.display = 'flex';
        }
    }
}

decreaseTimer();

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    if (rectangularCollision({rectangle1: player, rectangle2: enemy})
        && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 10;
        document.querySelector('#player2Health').style.width = `${enemy.health}%`;
    }

    if (enemy.health === 0) {
        displayText.innerHTML = 'Player1 Won';
        displayText.style.display = 'flex';
    }
}

animate();

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && !player.isJumping) {
        player.velocity.y = -7;
        player.isJumping = true;
    } else if (e.key === 'ArrowLeft') {
        player.velocity.x = -5;
    } else if (e.key === 'ArrowRight') {
        player.velocity.x = 5;
    } else if (e.key === ' ') {
        player.attack();
    }
});

addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.velocity.x = 0;
    } else if (e.key === 'ArrowRight') {
        player.velocity.x = 0;
    }
});
