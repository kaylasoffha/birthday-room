import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import PlacedStickers from '../components/PlacedStickers'
import StickerPanel from '../components/StickerPanel'
import { useGift } from '../context/giftContext'
import './LetterPage.css'

import envelopeIcon from '../assets/icons/envelope.png'


function LetterPage() {
  const { gift, updateGift } = useGift()
  const { text, stickers } = gift.letter

  const setText = (value) =>
    updateGift('letter', (letter) => ({ ...letter, text: value }))
  const setStickers = (value) =>
    updateGift('letter', (letter) => ({ ...letter, stickers: value }))

  const [editing, setEditing] = useState(false)
  const [phase, setPhase] = useState('idle')
  const paperRef = useRef(null)

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
    if (!text.trim()) return
    updateGift('letter', (letter) => ({ ...letter, sent: true }))
    setPhase('tear')
  }

  function handleClose() {
    setPhase('idle')
  }

  return (
    <main className="letter">
      <header className="letter__header">
        <BackButton />
      </header>

      <div className="letter__body">
        <div className="letter__row">
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

          <StickerPanel
            className="letter__stickers"
            placed={stickers}
            dropRef={paperRef}
            onPlace={(sticker) => setStickers([...stickers, sticker])}
            onUndo={handleUndoSticker}
          />
        </div>

        <button
          className="letter__send"
          onClick={handleSend}
          disabled={!text.trim()}
        >
          <img src={envelopeIcon} alt="" draggable="false" />
        </button>
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