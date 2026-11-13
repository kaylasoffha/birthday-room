import './PlacedStickers.css'

function PlacedStickers({ stickers, size = 14 }) {
  return (
    <>
      {stickers.map((s) => (
        <img
          key={s.id}
          src={s.src}
          className="placed-sticker"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${size}%` }}
          alt=""
          draggable="false"
        />
      ))}
    </>
  )
}

export default PlacedStickers