import { Link } from 'react-router'
import './BackButton.css'
import backIcon from '../assets/icons/backbutton.png'

function BackButton({ to = '/' }) {
  return (
    <Link to={to} className="back-button" aria-label="Kembali">
      <img src={backIcon} alt="" draggable="false" />
    </Link>
  )
}

export default BackButton