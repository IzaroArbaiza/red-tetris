import { Routes, Route } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import Home from './pages/Home/Home'
import Lobby from './pages/Lobby/Lobby'
import './App.css'

function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomName/:playerName" element={<Lobby />} />
      </Routes>
    </PrimeReactProvider>
  )
}

export default App
