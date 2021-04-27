export class RAM {
    public content: number[] = new Array<number>(4096)

    public read(index: number, nBytes: number): number[] {
        return this.content.slice(index, index + nBytes)
    }
}
