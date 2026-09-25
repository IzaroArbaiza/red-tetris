import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import '../styles/lobby.scss'

const initialPlayers = ['Player1', 'Player2', 'Player3']

interface LobbyProps {
  onPlay: () => void
}

function Lobby({ onPlay }: LobbyProps) {
  const { playerName } = useParams()
  const navigate = useNavigate()
  const [players, setPlayers] = useState(initialPlayers)
  const [readyMap, setReadyMap] = useState<Record<string, boolean>>({})

  const host = players[0]

  const toggleReady = (player: string) => {
    setReadyMap((prev) => ({ ...prev, [player]: !prev[player] }))
  }

  const handleLeave = () => {
    setPlayers((prev) => prev.filter((player) => player !== playerName))
    navigate('/')
  }

  return (
    <section className="lobby">
      <h1 className="lobby-title">Listado de jugadores</h1>

      <div className="lobby-players">
        {players.map((player) => (
          <div key={player} className="lobby-player" onClick={() => toggleReady(player)}>
            <span className="lobby-player-name">{player}</span>
            {player === host && <span className="lobby-player-host">Host</span>}
            <span className={`lobby-player-ready${readyMap[player] ? ' is-ready' : ''}`}>
              {readyMap[player] ? '✔' : '✘'}
            </span>
          </div>
        ))}
      </div>

      <div className="lobby-actions">
        <Button label="Jugar" onClick={onPlay} />
        <Button label="Salir de la sala" severity="secondary" onClick={handleLeave} />
      </div>
    </section>
  )
}

export default Lobby
