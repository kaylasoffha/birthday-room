import PlacedStickers from './PlacedStickers'
import './LetterView.css'

function LetterView({ text, stickers = [] }) {
  return (
    <div className="letter-view">
      <p className="letter-view__text">{text}</p>
      <PlacedStickers stickers={stickers} />
    </div>
  )
}

export default LetterView