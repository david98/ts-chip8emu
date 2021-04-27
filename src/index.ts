import { CPU } from './cpu'

window.addEventListener('load', () => {
    let cpu = new CPU(document.getElementById('screen') as HTMLCanvasElement)
    cpu.ram.content[0x200] = 0xf0
    cpu.ram.content[0x201] = 0x90
    cpu.ram.content[0x202] = 0x90
    cpu.ram.content[0x203] = 0x90
    cpu.ram.content[0x204] = 0xf0
})
