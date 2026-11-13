import { Link } from 'react-router'
import { useGift } from '../context/giftContext'
import { getProgress } from '../utils/giftProgress'
import './Home.css'
import bowl from '../assets/icons/bowl.png'
import envelope from '../assets/icons/envelope.png'
import camera from '../assets/icons/camera.png'
import giftIcon from '../assets/icons/gift.png'

function Home() {
  const { gift } = useGift()
  const progress = getProgress(gift)
  const doneCount = [progress.cake, progress.letter, progress.photo].filter(Boolean).length

  return (
    <main className="home">
      <Link to="/cake" className="home__icon home__icon--bowl">
        <img src={bowl} alt="cake bowl" />
      </Link>
      <Link to="/letter" className="home__icon home__icon--envelope">
        <img src={envelope} alt="envelope" />
      </Link>
      <Link to="/photobooth" className="home__icon home__icon--camera">
        <img src={camera} alt="camera" />
      </Link>

      {progress.all ? (
        <Link
          to="/gift"
          className="home__icon home__icon--gift"
          aria-label="Buka kado"
        >
          <img src={giftIcon} alt="" />
          <span className="home__progress">3/3</span>
        </Link>
      ) : (
        <div
          className="home__icon home__icon--gift home__icon--locked"
          aria-label={`Kado terkunci, ${doneCount} dari 3 selesai`}
        >
          <img src={giftIcon} alt="" />
          <span className="home__progress">{doneCount}/3</span>
        </div>
      )}
    </main>
  )
}

export default Home