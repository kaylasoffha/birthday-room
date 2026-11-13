import tierStand from '../assets/cake/tierstand.png'
import stackedCake from '../assets/cake/stackedcake.png'
import wpCake from '../assets/cake/wpcake.png'
import cherry from '../assets/cake/cherry.png'
import candlesLit from '../assets/cake/candleslit.png'

const CAKE_LAYERS = [
  null,
  { src: stackedCake, name: 'stacked' },
  { src: wpCake, name: 'wp' },
]

const DECOR_IMAGES = { cherry, candle: candlesLit }

function CakeView({ base, decorations }) {
  return (
    <>
      <img src={tierStand} className="cake__layer cake__layer--stand" alt="" />
      {CAKE_LAYERS[base] && (
        <img
          src={CAKE_LAYERS[base].src}
          className={`cake__layer cake__layer--${CAKE_LAYERS[base].name}`}
          alt="Kue"
        />
      )}
      {decorations.map((d) => (
        <img
          key={d.id}
          src={DECOR_IMAGES[d.type]}
          className={`cake__decor cake__decor--${d.type}`}
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
          alt=""
          draggable="false"
        />
      ))}
    </>
  )
}

export default CakeView