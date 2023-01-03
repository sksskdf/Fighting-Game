const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
class Sprite {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50,
        };
        this.isJumping = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 50, 150);
        ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.isJumping = false;
        } else {
            this.velocity.y += gravity;
        }
    }
}

const player = new Sprite({position: {x: 0, y: 0}, velocity: {x: 0, y: 0}});
const enemy = new Sprite({position: {x: 200, y: 0}, velocity: {x: 0, y: 0}});

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
}

animate();

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && !player.isJumping) {
        player.velocity.y = -7;
        player.isJumping = true;
    } else if (e.key === 'ArrowDown') {
        // player.velocity.y = 5;
    } else if (e.key === 'ArrowLeft') {
        player.velocity.x = -5;
    } else if (e.key === 'ArrowRight') {
        player.velocity.x = 5;
    }
});

addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.velocity.x = 0;
    } else if (e.key === 'ArrowRight') {
        player.velocity.x = 0;
    }
});
