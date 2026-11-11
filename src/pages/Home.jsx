import {Link} from 'react-router'
import './Home.css'
import bowl from '../assets/icons/bowl.png'
import envelope from '../assets/icons/envelope.png'
import camera from '../assets/icons/camera.png'

function Home() {
    return (
        <main className="home">
            <Link to="/cake" className="home__icon home__icon--bowl">
                <img src={bowl} alt="cake bowl" />
            </Link>
            <Link to="/wish" className="home__icon home__icon--envelope">
                <img src={envelope} alt="envelope" />
            </Link>
            <Link to="/photobooth" className="home__icon home__icon--camera">
                <img src={camera} alt="camera" />
            </Link>
        </main>
    )
}

export default Home