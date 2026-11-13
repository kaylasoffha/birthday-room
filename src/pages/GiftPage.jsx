import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import BackButton from '../components/BackButton'
import CakeView from '../components/CakeView'
import LetterView from '../components/LetterView'
import PhotoFrameView from '../components/PhotoFrameView'
import { useGift } from '../context/giftContext'
import { FRAME_COLORS } from '../data/photoFrame'
import { downloadFrame } from '../utils/exportFrame'
import { getProgress } from '../utils/giftProgress'
import './GiftPage.css'

import giftIcon from '../assets/icons/gift.png'

function GiftPage() {
  const { gift, resetGift } = useGift()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)

  if (!getProgress(gift).all) {
    return <Navigate to="/" replace />
  }

  const { cake, letter, photo } = gift
  const color =
    FRAME_COLORS.find((c) => c.id === photo.colorId) ?? FRAME_COLORS[0]

  function handleDownload() {
    downloadFrame({
      frameId: photo.frameId,
      photos: photo.photos,
      color: color.value,
      textColor: color.text,
      stickers: photo.stickers,
    })
  }

  function handleRestart() {
    if (window.confirm('Semua hasil akan dihapus. Mulai dari awal?')) {
      resetGift()
      navigate('/')
    }
  }

  return (
    <main className="gift">
      <header className="gift__header">
        <BackButton />
      </header>

      {!opened ? (
        <button className="gift__box" onClick={() => setOpened(true)}>
          <img src={giftIcon} alt="Kado" draggable="false" />
          <span>Ketuk untuk membuka</span>
        </button>
      ) : (
        <div className="gift__content">
          <section className="gift__item" style={{ animationDelay: '0s' }}>
            <h2>Kue ulang tahunmu</h2>
            <div className="cake__stage gift__cake">
              <CakeView base={cake.base} decorations={cake.decorations} />
            </div>
          </section>

          <section className="gift__item" style={{ animationDelay: '0.5s' }}>
            <h2>Ucapanmu</h2>
            <div className="gift__letter">
              <LetterView text={letter.text} stickers={letter.stickers} />
            </div>
          </section>

          <section className="gift__item" style={{ animationDelay: '1s' }}>
            <h2>Foto kenangan</h2>
            <div className="gift__photo">
              <PhotoFrameView
                frameId={photo.frameId}
                photos={photo.photos}
                color={color.value}
                textColor={color.text}
                stickers={photo.stickers}
              />
            </div>
            <button className="gift__button" onClick={handleDownload}>
              Unduh foto
            </button>
          </section>

          <button className="gift__link" onClick={handleRestart}>
            Buat ulang dari awal
          </button>
        </div>
      )}
    </main>
  )
}

export default GiftPage