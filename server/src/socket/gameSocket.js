import { Game } from '../models/Game.js'

const games = new Map()

export function setupSocketEvents(io) {
	io.on('connection', (socket) => {
		console.log(`[Socket] User connected with ID: ${socket.id}`)

		socket.on('joinGame', ({room, playerName}) => {
			if (!room || !playerName) {
				socket.emit('error', {message: 'Player or room name missing'})
				return
			}

			if(!games.has(room)) {
				games.set(room, new Game(room))
				console.log(`[Game] Room created: ${room}`)
			}
			const game = games.get(room)
			if(game.status === 'playing') {
				socket.emit('error', {message: `Game already started`})
				return
			}

			socket.join(room)

			const newPlayer = game.addPlayer(socket.id, playerName)
			console.log(`[Game] ${playerName} (${socket.id}) is ${newPlayer.isHost ? 'HOST' : 'PAYER'} joined room: ${room}`)
			
			io.to(room).emit('gameUpdated', {
				room: game.name,
				status: game.status,
				players: Array.from(game.players.values())
			})
		})

		socket.on('startGame', ({room}) => {
			const game = games.get(room)
			if(!game) {
				socket.emit('error', {message: `Room doesn't exist`})
				return
			}

			const player = game.players.get(socket.id)
			if(!player || !player.isHost){
				socket.emit('error', {message: `Only player host can start`})
				return
			}

			game.start()
			console.log(`[Game] Game started in room: ${room}`)

			io.to(room).emit('gameStarted', {
				status: game.status,
				pieces: game.pieces
			})
		})

		socket.on('disconnect', () => {
			console.log(`[Socket] User disconnected, ID: ${socket.id}`)
			games.forEach((game, roomName) => {
				if(game.players.has(socket.id)){
					game.removePlayer(socket.id)
					if(game.players.size === 0) {
						games.delete(roomName)
						console.log(`[Game] Room ${roomName} removed`)
					} else {
						io.to(roomName).emit('gameUpdated', {
							room: game.name,
							status: game.status,
							players: Array.from(game.players.values())
						})
					}
				}
			})
		})
	})
}
