const PIECE_TYPES = {
	I: {
		shape: [
			[1,1,1,1]
		],
		color: 'cyan'
	},
	O: {
		shape: [
			[1,1],
			[1,1]
		],
		color: 'yellow'
	},
	T: {
        shape: [
            [0,1,0],
            [1,1,1]
        ],
        color: "purple"
    },
    J: {
        shape: [
            [1,1,1],
            [0,0,1]
        ],
        color: "blue"
    },
    L: {
        shape: [
            [1,1,1],
            [1,0,0]
        ],
        color: "orange"
    },
    S: {
        shape: [
            [0,1,1],
            [1,1,0]
        ],
        color: "green"
    },
    Z: {
        shape: [
            [1,1,0],
            [0,1,1]
        ],
        color: "red"
    }
};

export class Piece {
	constructor(type) {
		const pieceData = PIECE_TYPES[type]
		this.type = type
		this.shape = pieceData.shape
		this.color = pieceData.color
	}

	static getRandomPiece() {
		const types = Object.keys(PIECE_TYPES)
		const randomType = types[Math.floor(Math.random() * types.length)]
		return new Piece(randomType)
	}
}