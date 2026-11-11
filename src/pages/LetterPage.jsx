import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import Draggable from '../components/Draggable'
import './LetterPage.css'

import envelopeIcon from '../assets/icons/envelope.png'

const stickerFiles = import.meta.glob('../assets/letter/stickers/*.png', {
  eager: true,
  import: 'default',
})

const STICKERS = Object.entries(stickerFiles).map(([path, src]) => ({
  id: path,
  src,
}))

function PlacedStickers({ stickers }) {
  return (
    <>
      {stickers.map((s) => (
        <img
          key={s.id}
          src={s.src}
          className="letter__sticker"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          alt=""
          draggable="false"
        />
      ))}
    </>
  )
}

function LetterPage() {
  const [text, setText] = useState('')
  const [editing, setEditing] = useState(false)
  const [stickers, setStickers] = useState([])
  const [phase, setPhase] = useState('idle')
  const paperRef = useRef(null)
  const usedIds = stickers.map((s) => s.stickerId)

  useEffect(() => {
    if (phase === 'tear') {
      const timer = setTimeout(() => setPhase('insert'), 900)
      return () => clearTimeout(timer)
    }
    if (phase === 'insert') {
      const timer = setTimeout(() => setPhase('done'), 1300)
      return () => clearTimeout(timer)
    }
  }, [phase])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setEditing(false)
    }
  }

  function handleDrop(sticker, point) {
    const box = paperRef.current.getBoundingClientRect()
    const x = ((point.x - box.left) / box.width) * 100
    const y = ((point.y - box.top) / box.height) * 100
    setStickers([
        ...stickers,
        { id: Date.now(), stickerId: sticker.id, src: sticker.src, x, y },
    ])
  }

  function handleUndoSticker() {
    setStickers(stickers.slice(0, -1))
  }

  function handleSend() {
    if (text.trim()) setPhase('tear')
  }

  function handleClose() {
    setPhase('idle')
  }

  return (
    <main className="letter">
      <header className="letter__header">
        <BackButton />
        <button
          className="letter__send"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Masukkan ucapan ke amplop"
        >
          <img src={envelopeIcon} alt="" draggable="false" />
        </button>
        <button
            className="letter__undo"
            onClick={handleUndoSticker}
            disabled={stickers.length === 0}
        >
            Batalkan stiker
        </button>
      </header>

      <div className="letter__body">
        <div
          className="letter__paper"
          ref={paperRef}
          onClick={() => setEditing(true)}
        >
          {editing ? (
            <textarea
              autoFocus
              value={text}
              maxLength={200}
              placeholder="Tulis ucapanmu..."
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setEditing(false)}
            />
          ) : (
            <p className={`letter__text ${text ? '' : 'letter__text--empty'}`}>
              {text || 'Ketuk untuk menulis...'}
            </p>
          )}
          <PlacedStickers stickers={stickers} />
        </div>

        <div className="letter__stickers">
            {STICKERS.map((s) => (
                <div className="letter__slot" key={s.id}>
                {!usedIds.includes(s.id) && (
                    <Draggable dropRef={paperRef} onDrop={(p) => handleDrop(s, p)}>
                    <img src={s.src} alt="Stiker" draggable="false" />
                    </Draggable>
                )}
                </div>
            ))}
        </div>
      </div>

      {phase !== 'idle' && (
        <div className="letter__overlay">
          <div className={`envelope envelope--${phase}`}>
            <div className="envelope__back" />
            <div className="envelope__paper">
              <p>{text}</p>
              <PlacedStickers stickers={stickers} />
            </div>
            <div className="envelope__front" />
          </div>

          {phase === 'done' && (
            <>
              <p className="letter__done">Ucapanmu sudah masuk amplop 💌</p>
              <button className="letter__close" onClick={handleClose}>
                Tutup
              </button>
            </>
          )}
        </div>
      )}
    </main>
  )
}

export default LetterPage