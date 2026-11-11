import { useRef, useState } from 'react'
import { Link } from 'react-router'
import Draggable from '../components/Draggable'
import './CakePage.css'

import tierStand from '../assets/cake/tierstand.png'
import stackedCake from '../assets/cake/stackedcake.png'
import wpCake from '../assets/cake/wpcake.png'
import tray from '../assets/cake/ompreng.png'
import cake from '../assets/cake/cake.png'
import whippedCream from '../assets/cake/whippedcream.png'
import cherry from '../assets/cake/cherry.png'
import cherries from '../assets/cake/cherries.png'
import candles from '../assets/cake/candles.png'
import candlesLit from '../assets/cake/candleslit.png'

const CAKE_LAYERS = [
  null,
  { src: stackedCake, name: 'stacked' },
  { src: wpCake, name: 'wp' },
]
const ITEMS = [
  { id: 'cherry', label: 'Ceri', icon: cherry, pile: cherries  },
  { id: 'cream', label: 'Krim', icon: whippedCream },
  { id: 'candle', label: 'Lilin 22', icon: candles },
  { id: 'cake', label: 'Kue', icon: cake },
]

const DECOR_IMAGES = { cherry, candle: candlesLit }

function CakePage() {
  const [base, setBase] = useState(0)
  const [decorations, setDecorations] = useState([])
  const stageRef = useRef(null)

  const hasCandle = decorations.some((d) => d.type === 'candle')

  function getStatus(id) {
    if (id === 'cake') return base === 0 ? 'ready' : 'used'
    if (id === 'cream') return base === 0 ? 'locked' : base === 1 ? 'ready' : 'used'
    if (id === 'cherry') return base < 2 ? 'locked' : 'ready'
    if (id === 'candle') return base < 2 ? 'locked' : hasCandle ? 'used' : 'ready'
  }

  function handleDrop(id, point) {
    if (id === 'cake') return setBase(1)
    if (id === 'cream') return setBase(2)

    const box = stageRef.current.getBoundingClientRect()
    const x = ((point.x - box.left) / box.width) * 100
    const y = ((point.y - box.top) / box.height) * 100
    setDecorations([...decorations, { id: Date.now(), type: id, x, y }])
  }

  function handleUndo() {
    setDecorations(decorations.slice(0, -1))
  }

  function handleReset() {
    setBase(0)
    setDecorations([])
  }

  return (
    <main className="cake">
      <header className="cake__header">
        <Link to="/">←</Link>
      </header>

      <div className="cake__area">
        <div className="cake__stage" ref={stageRef}>
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
        </div>
      </div>

      <div className="cake__actions">
        <button onClick={handleUndo} disabled={decorations.length === 0}>
          Batalkan
        </button>
        <button onClick={handleReset}>Ulangi</button>
      </div>

      <div className="cake__tray" style={{ backgroundImage: `url(${tray})` }}>
        {ITEMS.map((item) => {
          const status = getStatus(item.id)
          return (
            <div className="cake__slot" key={item.id}>
                {item.pile && (
                    <img
                    src={item.pile}
                    alt=""
                    className={`cake__pile ${status === 'locked' ? 'cake__locked' : ''}`}
                    draggable="false"
                    />
                )}
                {status === 'ready' && (
                    <Draggable
                    dropRef={stageRef}
                    onDrop={(point) => handleDrop(item.id, point)}
                    >
                    <img src={item.icon} alt={item.label} draggable="false" />
                    </Draggable>
                )}
                {status === 'locked' && (
                    <img
                    src={item.icon}
                    alt={item.label}
                    className="cake__locked"
                    draggable="false"
                    />
                )}
                </div>
          )
        })}
      </div>
    </main>
  )
}

export default CakePage