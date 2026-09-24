import { Routes, Route } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import Home from './pages/Home/Home'
import Room from './pages/Room/Room'
import './App.css'

function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomName/:playerName" element={<Room />} />
      </Routes>
    </PrimeReactProvider>
  )
}

export default App
