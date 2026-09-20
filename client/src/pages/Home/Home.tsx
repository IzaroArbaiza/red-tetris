import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

function Home() {
  const [nickname, setNickname] = useState('')
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()

  const handleJoin = () => {
    navigate(`/${roomName}/${nickname}`)
  }

  return (
    <section id="center">
      <h1>Red-tetris</h1>

      <div>
        <label htmlFor="nickname">Nickname</label>
        <InputText
          id="nickname"
          value={nickname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
          placeholder="Ingresa tu nickname"
        />
      </div>

      <div>
        <label htmlFor="roomName">Sala</label>
        <InputText
          id="roomName"
          value={roomName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
          placeholder="Nombre de la sala"
        />
      </div>

      <Button label="Jugar" onClick={handleJoin} />
    </section>
  )
}

export default Home
