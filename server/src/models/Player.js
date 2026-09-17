export class Player {
	constructor(id, name, isHost = false) {
		this.id = id
		this.name = name
		this.isHost = isHost
		this.grid = this.createEmptyGrid()
		this.spectrum = Array(10).fill(10)
		this.lost = false
	}

	createEmptyGrid() {
		return Array.from({length: 20}, () => Array(10).fill(10))
	}

	updateSpectrum() {
		const spectrum = Array(10).fill(10)
		for(let col = 0; col < 10; col++) {
			for(let row = 0; row < 20; row++) {
				if(this.grid[row][col] !== 0) {
					spectrum[col] = 20 - row
					break
				}
			}
		}
		this.spectrum = spectrum
		return this.spectrum
	}
}