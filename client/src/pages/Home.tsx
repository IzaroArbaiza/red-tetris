import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import '../styles/home.scss'

function Home() {
  const [nickname, setNickname] = useState('')
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()

  const canJoin = nickname.trim().length > 0 && roomName.trim().length > 0

  const handleJoin = () => {
    if (!canJoin) return
    navigate(`/${roomName}/${nickname}`)
  }

  return (
    <section className="home">
      <h1 className="home-title">
        Red<span>-</span>tetris
      </h1>

      <div className="home-panel">
        <div className="home-field">
          <label htmlFor="nickname">Nickname</label>
          <InputText
            id="nickname"
            value={nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
            placeholder="Ingresa tu nickname"
          />
        </div>

        <div className="home-field">
          <label htmlFor="roomName">Sala</label>
          <InputText
            id="roomName"
            value={roomName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
            placeholder="Nombre de la sala"
          />
        </div>

        <Button className="home-submit" label="Jugar" onClick={handleJoin} disabled={!canJoin} />
      </div>
    </section>
  )
}

export default Home
