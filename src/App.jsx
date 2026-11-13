import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CakePage from './pages/CakePage'
import LetterPage from './pages/LetterPage'
import PhotoboothPage from './pages/PhotoboothPage'
import GiftPage from './pages/GiftPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cake" element={<CakePage />} />
      <Route path="/letter" element={<LetterPage />} />
      <Route path="/photobooth" element={<PhotoboothPage />} />
      <Route path="/gift" element={<GiftPage />} />
    </Routes>
  )
}

export default App