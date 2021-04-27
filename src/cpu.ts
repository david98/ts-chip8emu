import { RAM } from './ram'
import { Chip8Screen } from './chip8screen'

interface IRawAccess {
    [key: string]: any
}

class Registers implements IRawAccess {
    [k: string]: any

    // registers V0-VF are 8 bit
    private V0: number = 0
    private V1: number = 0
    private V2: number = 0
    private V3: number = 0
    private V4: number = 0
    private V5: number = 0
    private V6: number = 0
    private V7: number = 0
    private V8: number = 0
    private V9: number = 0
    private VA: number = 0
    private VB: number = 0
    private VC: number = 0
    private VD: number = 0
    private VE: number = 0
    private VF: number = 0 // not to be used by programs
    private I: number = 0 // 16 bit

    private PC: number = 0 // 16 bit
    private SP: number = 0 // 8 bit

    private DT: number = 0 // 8-bit delay timer
    private ST: number = 0 // 8-bit sound timer

    public write(regName: string, value: number): void {
        if (this[regName] === undefined) {
            console.error(`Error: register ${regName} does not exist.`)
            return
        }
        if (regName === 'PC' || regName === 'SP') {
            console.error(
                `Error: access to register ${regName} is not permitted.`
            )
            return
        }
        if (typeof this[regName] !== 'number') {
            console.error(`What are you trying to access?`)
            return
        }

        let actualValue: number = 0

        if (regName === 'I') {
            actualValue = value & 0b1111111111111111
        } else {
            actualValue = value & 0b11111111
        }

        this[regName] = actualValue
    }

    public read(regName: string): number {
        if (this[regName] === undefined) {
            console.error(`Error: register ${regName} does not exist.`)
            return
        }
        if (regName === 'PC' || regName === 'SP') {
            console.error(
                `Error: access to register ${regName} is not permitted.`
            )
            return
        }

        if (typeof this[regName] !== 'number') {
            console.error(`What are you trying to access?`)
        }

        return this[regName]
    }

    public setPC(value: number): void {
        this.PC = value & 0b1111111111111111
    }

    public getPC(): number {
        return this.PC
    }

    public getSP(): number {
        return this.SP
    }

    public incrementSP(): void {
        this.SP += 1
        this.SP = this.SP & 0b11111111
    }

    public decrementSP(): void {
        this.SP -= 1
        this.SP = this.SP & 0b11111111
    }

    public setSP(value: number) {
        this.SP = value & 0b11111111
    }
}

export class CPU {
    constructor(canvas: HTMLCanvasElement) {
        this.screen = new Chip8Screen(canvas)
    }

    public screen: Chip8Screen
    public ram: RAM = new RAM()
    public registers: Registers = new Registers()
    private stack: number[] // 16 16-bit values

    private static NotImplemented(name: string): void {
        console.warn(`Instruction ${name} hasn't been implemented yet.`)
    }

    public CLS(): void {
        this.screen.clear()
    }

    public RET(): void {
        this.registers.setPC(this.stack[this.registers.getSP()])
        this.registers.decrementSP()
    }

    public JP(addr: number): void {
        this.registers.setPC(addr & 0b111111111111)
    }

    public CALL(addr: number): void {
        this.registers.incrementSP()
        this.stack[this.registers.getSP()] = this.registers.getPC()
        this.registers.setPC(addr & 0b111111111111)
    }

    public SE(reg: string, reg2: string): void
    public SE(reg: string, value: number): void
    public SE(reg: string, b: number | string): void {
        switch (typeof b) {
            case 'string': {
                if (this.registers.read(reg) === this.registers.read(b)) {
                    this.registers.setPC(this.registers.getPC() + 2)
                }
                break
            }
            case 'number': {
                let actualValue = b & 0b11111111

                if (this.registers.read(reg) === actualValue) {
                    this.registers.setPC(this.registers.getPC() + 2)
                }
                break
            }
        }
    }

    public SNE(reg: string, reg2: string): void
    public SNE(reg: string, value: number): void
    public SNE(reg: string, b: number | string): void {
        switch (typeof b) {
            case 'string': {
                if (this.registers.read(reg) !== this.registers.read(b)) {
                    this.registers.setPC(this.registers.getPC() + 2)
                }
                break
            }
            case 'number': {
                let actualValue = b & 0b11111111

                if (this.registers.read(reg) !== actualValue) {
                    this.registers.setPC(this.registers.getPC() + 2)
                }
                break
            }
        }
    }

    public LD(reg: string, reg2: string): void
    public LD(reg: string, value: number): void
    public LD(reg: string, b: number | string): void {
        switch (typeof b) {
            case 'string': {
                this.registers.write(reg, this.registers.read(b))
                break
            }
            case 'number': {
                let actualValue = b & 0b11111111
                this.registers.write(reg, actualValue)
                break
            }
        }
    }

    public DRW(regX: string, regY: string, nibble: number) {
        let sprite = this.ram.read(this.registers.read('I'), nibble & 0b1111)
        let x = this.registers.read(regX)
        let y = this.registers.read(regY)
        let collision = this.screen.draw(sprite, x, y)

        this.registers.write('VF', collision ? 1 : 0)
    }
}
