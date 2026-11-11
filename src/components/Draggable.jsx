import './Draggable.css'
import { useRef, useState } from 'react'

function Draggable({ children, dropRef, onDrop }) {
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const start = useRef({ x: 0, y: 0 })

    function handlePointerDown(e) {
        e.currentTarget.setPointerCapture(e.pointerId)
        start.current = { x: e.clientX, y: e.clientY }
        setIsDragging(true)
    }

    function handlePointerMove(e) {
        if (!isDragging) return
        setOffset({
            x: e.clientX - start.current.x,
            y: e.clientY - start.current.y,
        })
    }

    function handlePointerUp(e) {
        if (!isDragging) return
        setIsDragging(false)
        setOffset({ x: 0, y: 0 })

        const box = dropRef.current.getBoundingClientRect()
        const inside =
            e.clientX >= box.left &&
            e.clientX <= box.right &&
            e.clientY >= box.top &&
            e.clientY <= box.bottom

        if (inside) onDrop({ x: e.clientX, y: e.clientY })
    }

    function handlePointerCancel() {
        setIsDragging(false)
        setOffset({ x: 0, y: 0 })
    }

    return (
        <div
            className={`draggable ${isDragging ? 'draggable--active' : ''}`}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            {children}
        </div>
    )
}

export default Draggable 