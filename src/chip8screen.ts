export class Chip8Screen {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    }

    private size: {
        x: number
        y: number
    } = { x: 64, y: 32 }

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private isEmpty(x: number, y: number, w: number, h: number): boolean {
        let idata = this.ctx.getImageData(x, y, w, h), // needed as usual ...
            u32 = new Uint32Array(idata.data.buffer), // reads 1x uint32 instead of 4x uint8
            i = 0,
            len = u32.length

        while (i < len) if (u32[i++]) return false // if !== 0 return false, not empty
        return true // all empty, all OK
    }

    public draw(sprite: number[], x: number, y: number): boolean {
        let collision = false
        x = x % this.size.x
        y = y % this.size.y
        for (let j = 0; j < sprite.length; j++) {
            let row = sprite[j]
            let pixels = row.toString(2)
            for (let i = 0; i < 8; i++) {
                if (
                    pixels[i] === '1' &&
                    x + i < this.size.x &&
                    y + j < this.size.y
                ) {
                    if (!this.isEmpty(x + i, y + j, 1, 1)) {
                        collision = true
                    }
                    this.ctx.fillRect(x + i, y + j, 1, 1)
                }
            }
        }
        return collision
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y)
    }
}
