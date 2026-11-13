import PlacedStickers from './PlacedStickers'
import {
  CAPTION_FONT,
  CAPTION_TEXT,
  FRAME_LAYOUTS,
  FRAME_RADIUS,
} from '../data/photoFrame'
import './PhotoFrameView.css'

const percent = (value, total) => `${(value / total) * 100}%`

function PhotoFrameView({ frameId, photos = [], color, textColor, stickers = [] }) {
  const layout = FRAME_LAYOUTS[frameId]

  return (
    <div
      className="photo-frame"
      style={{
        aspectRatio: `${layout.width} / ${layout.height}`,
        backgroundColor: color,
        color: textColor,
        borderRadius: `${percent(FRAME_RADIUS, layout.width)} / ${percent(FRAME_RADIUS, layout.height)}`,
      }}
    >
      {layout.slots.map((slot, i) => (
        <div
          className="photo-frame__slot"
          key={i}
          style={{
            left: percent(slot.x, layout.width),
            top: percent(slot.y, layout.height),
            width: percent(slot.w, layout.width),
            height: percent(slot.h, layout.height),
          }}
        >
          {photos[i] && <img src={photos[i]} alt={`Foto ${i + 1}`} draggable="false" />}
        </div>
      ))}

      <p
        className="photo-frame__caption"
        style={{
          top: percent(layout.caption.y, layout.height),
          height: percent(layout.caption.h, layout.height),
          fontSize: `${(layout.caption.size / layout.width) * 100}cqw`,
          fontFamily: CAPTION_FONT,
        }}
      >
        {CAPTION_TEXT}
      </p>

      <PlacedStickers stickers={stickers} size={layout.stickerSize} />
    </div>
  )
}

export default PhotoFrameView