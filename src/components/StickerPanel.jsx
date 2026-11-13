import Draggable from './Draggable'
import { STICKERS } from '../data/stickers'
import './StickerPanel.css'

function StickerPanel({ placed, dropRef, onPlace, onUndo, className = '' }) {
  const usedIds = placed.map((s) => s.stickerId)

  function handleDrop(sticker, point) {
    const box = dropRef.current.getBoundingClientRect()
    onPlace({
      id: Date.now(),
      stickerId: sticker.id,
      src: sticker.src,
      x: ((point.x - box.left) / box.width) * 100,
      y: ((point.y - box.top) / box.height) * 100,
    })
  }

  return (
    <aside className={`sticker-panel ${className}`}>
      <div className="sticker-panel__grid">
        {STICKERS.map((s) => (
          <div className="sticker-panel__slot" key={s.id}>
            {!usedIds.includes(s.id) && (
              <Draggable dropRef={dropRef} onDrop={(point) => handleDrop(s, point)}>
                <img src={s.src} alt="Stiker" draggable="false" />
              </Draggable>
            )}
          </div>
        ))}
      </div>

      <button
        className="sticker-panel__undo"
        onClick={onUndo}
        disabled={placed.length === 0}
        aria-label="Batalkan stiker"
        title="Batalkan stiker"
      >
        ↩
      </button>
    </aside>
  )
}

export default StickerPanel