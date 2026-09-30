import { Button } from 'primereact/button'
import type { PlayerData } from './Room'
import '../styles/lobby.scss'

interface LobbyProps {
  players: PlayerData[]
  currentSocketId?: string
  hasError?: boolean
  onStartGame: () => void
  onLeave: () => void
}

function Lobby({ players, currentSocketId, hasError, onStartGame, onLeave }: LobbyProps) {
  const isHost = players.find((p) => p.id === currentSocketId)?.isHost ?? false

  return (
    <section className="lobby">
      <h1 className="lobby-title">Listado de jugadores</h1>

      <div className="lobby-players">
        {players.map((player) => (
          <div key={player.id} className="lobby-player">
            <span className="lobby-player-name">{player.name}</span>
            {player.isHost && <span className="lobby-player-host">Host</span>}
          </div>
        ))}
      </div>

      <div className="lobby-actions">
        {/* Only Host can push the button */}
        {!hasError ? (
          <>
            {isHost ? (
              <Button label="Iniciar Juego" onClick={onStartGame} />
            ) : (
              <p>Esperando a que el Host inicie la partida...</p>
            )}
            <Button label="Salir de la sala" severity="secondary" onClick={onLeave} />
          </>
        ) : (
          <Button label="Salir de la sala" severity="secondary" onClick={onLeave} />
        )}
      </div>
    </section>
  )
}

export default Lobby

