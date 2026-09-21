import { Piece } from './Piece.js'
import { Player } from './Player.js'

export class Game {
	constructor(name) {
		this.name = name
		this.players = new Map()	//For shocketId -> Player
		this.piece = []				//Piece sequence (could change)
		this.status = 'waiting'		//waiting || playing for players (multiplayer)
	}

	isNameTaken(playerName) {
		const players = Array.from(this.players.values())
		for(let i = 0; i < players.length; i++) {
			const actualPlayer = players[i];
			if(actualPlayer.name.toLowerCase() === playerName.toLowerCase()) {
				return true
			}
		}
		return false
	}

	addPlayer(socketId, name) {
		const isHost = this.players.size === 0	//If room has only player, it's the host
		const newPlayer = new Player(socketId, name, isHost)
		this.players.set(socketId, newPlayer)
		return newPlayer
	}

	removePlayer(socketId) {
		const playerToRemove = this.players.get(socketId)
		if(!playerToRemove)
			return null
		this.players.delete(socketId)

		//If host leaves and are still players, next one gots host of room
		if(playerToRemove && playerToRemove.isHost && this.players.size > 0) {
			const nextPlayer = this.players.values().next().value
			nextPlayer.isHost  = true
		}
		return playerToRemove
	}
	
	addMorePieces(count = 10) {
		for(let i = 0; i < count; i++) {
			this.pieces.push(Piece.getRandomPiece())
		}
	}

	getPieces(startIndex, count = 5) {
		while(this.pieces.length < startIndex + count) {
			this.addMorePieces(10)
		}
		return this.pieces.slice(startIndex, startIndex + count)
	}

	start() {
		this.status = 'playing'
		this.pieces = []
		this.addMorePieces(20)		//Starting 20 pieces
	}
}