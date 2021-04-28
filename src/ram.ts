export class RAM {
    public content: number[] = new Array<number>(4096)

    public write(addr: number, byte: number): number {
        if (addr > 4095 || addr < 0x200) {
            console.error('SEGFAULT')
        }
        this.content[addr] = byte & 0b11111111
        return this.content[addr]
    }

    public read(index: number, nBytes: number): number[] {
        return this.content.slice(index, index + nBytes)
    }
}
