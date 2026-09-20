import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

const initialPlayers = ['Player1', 'Player2', 'Player3']

function Lobby() {
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
    <section id="center">
      <h1>Listado de jugadores</h1>

      {players.map((player) => (
        <Card key={player} onClick={() => toggleReady(player)}>
          <span>{player}</span>
          {player === host && <span> (Host)</span>}
          <span>{readyMap[player] ? '✔' : '✘'}</span>
        </Card>
      ))}

      <Button label="Salir de la sala" onClick={handleLeave} />
    </section>
  )
}

export default Lobby
