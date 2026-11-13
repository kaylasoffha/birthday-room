import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import PhotoFrameView from '../components/PhotoFrameView'
import StickerPanel from '../components/StickerPanel'
import useCamera from '../hooks/useCamera'
import { useGift } from '../context/giftContext'
import { FRAME_COLORS } from '../data/photoFrame'
import { downloadFrame } from '../utils/exportFrame'
import './PhotoboothPage.css'

import cameraIcon from '../assets/icons/camera.png'
import frameSingle from '../assets/photobooth/oneframe.png'
import frameDouble from '../assets/photobooth/duoframe.png'
import noteChoose from '../assets/photobooth/stickynote.png'

const FRAMES = [
  { id: 'single', label: 'Frame 1 foto', shots: 1, image: frameSingle },
  { id: 'double', label: 'Frame 2 foto', shots: 2, image: frameDouble },
]

const PHOTO_WIDTH = 600
const PHOTO_HEIGHT = 800

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function PhotoboothPage() {
  const { gift, updateGift } = useGift()
  const photo = gift.photo
  const color =
    FRAME_COLORS.find((c) => c.id === photo?.colorId) ?? FRAME_COLORS[0]

  const [phase, setPhase] = useState(photo ? 'result' : 'choose')
  const [frame, setFrame] = useState(
    () => FRAMES.find((f) => f.id === photo?.frameId) ?? null,
  )
  const [count, setCount] = useState(null)
  const [flash, setFlash] = useState(false)
  const [busy, setBusy] = useState(false)

  const { stream, error } = useCamera(phase !== 'result')
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream, phase])

  const errorMessage =
    error === 'denied'
      ? 'Kamera tidak bisa diakses. Izinkan kamera di pengaturan browser, lalu muat ulang halaman.'
      : error === 'unsupported'
        ? 'Browser ini tidak mendukung kamera, atau halaman tidak dibuka lewat HTTPS.'
        : null

  function handleChooseFrame(f) {
    setFrame(f)
    setPhase('shoot')
  }

  function handleRetake() {
    updateGift('photo', null)
    setPhase('shoot')
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = PHOTO_WIDTH
    canvas.height = PHOTO_HEIGHT
    const ctx = canvas.getContext('2d')

    const targetRatio = PHOTO_WIDTH / PHOTO_HEIGHT
    const sourceRatio = video.videoWidth / video.videoHeight
    let sx = 0
    let sy = 0
    let sw = video.videoWidth
    let sh = video.videoHeight

    if (sourceRatio > targetRatio) {
      sw = video.videoHeight * targetRatio
      sx = (video.videoWidth - sw) / 2
    } else {
      sh = video.videoWidth / targetRatio
      sy = (video.videoHeight - sh) / 2
    }

    ctx.translate(PHOTO_WIDTH, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT)
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  async function startSession() {
    const video = videoRef.current
    if (busy || !stream || !video || video.readyState < 2) return

    setBusy(true)
    const taken = []

    for (let i = 0; i < frame.shots; i++) {
      for (let n = 3; n >= 1; n--) {
        setCount(n)
        await sleep(1000)
        if (!aliveRef.current) return
      }
      setCount(null)
      setFlash(true)
      taken.push(capturePhoto())
      await sleep(250)
      setFlash(false)
      await sleep(400)
      if (!aliveRef.current) return
    }

    updateGift('photo', {
      frameId: frame.id,
      photos: taken,
      colorId: FRAME_COLORS[0].id,
      stickers: [],
    })
    setBusy(false)
    setPhase('result')
  }

  function handleColor(colorId) {
    updateGift('photo', (p) => ({ ...p, colorId }))
  }

  function handlePlaceSticker(sticker) {
    updateGift('photo', (p) => ({ ...p, stickers: [...p.stickers, sticker] }))
  }

  function handleUndoSticker() {
    updateGift('photo', (p) => ({ ...p, stickers: p.stickers.slice(0, -1) }))
  }

  function handleDownload() {
    downloadFrame({
      frameId: photo.frameId,
      photos: photo.photos,
      color: color.value,
      textColor: color.text,
      stickers: photo.stickers,
    })
  }

  return (
    <main className={`booth booth--${phase}`}>
      <header className="booth__header">
        <BackButton />
      </header>

      {phase === 'choose' && (
        <div className="booth__choose">
          <img src={noteChoose} className="booth__note" alt="Pilih frame" />
          {FRAMES.map((f) => (
            <button
              key={f.id}
              className={`booth__frame booth__frame--${f.id}`}
              onClick={() => handleChooseFrame(f)}
              aria-label={f.label}
            >
              <img src={f.image} alt="" draggable="false" />
            </button>
          ))}
          {errorMessage && <p className="booth__message">{errorMessage}</p>}
        </div>
      )}

      {phase === 'shoot' && (
        <div className="booth__shoot">
          <div className="booth__screen-wrap">
            <div className="booth__screen" onClick={startSession}>
              {errorMessage ? (
                <p className="booth__error">{errorMessage}</p>
              ) : (
                <video
                  ref={videoRef}
                  className="booth__video"
                  autoPlay
                  playsInline
                  muted
                />
              )}
              {count !== null && <span className="booth__count">{count}</span>}
              {flash && <div className="booth__flash" />}
              {!busy && !errorMessage && (
                <p className="booth__hint">Ketuk layar untuk mulai</p>
              )}
            </div>
          </div>

          <button
            className="booth__shutter"
            onClick={startSession}
            disabled={busy || !!errorMessage}
            aria-label="Mulai ambil foto"
          />

          {!busy && (
            <button className="booth__link" onClick={() => setPhase('choose')}>
              Ganti frame
            </button>
          )}
        </div>
      )}

      {phase === 'result' && photo && (
        <div className="booth__result">
          <div className="booth__row">
            <div className="booth__frame-area" ref={frameRef}>
              <PhotoFrameView
                frameId={photo.frameId}
                photos={photo.photos}
                color={color.value}
                textColor={color.text}
                stickers={photo.stickers}
              />
            </div>

            <StickerPanel
              className="booth__stickers"
              placed={photo.stickers}
              dropRef={frameRef}
              onPlace={handlePlaceSticker}
              onUndo={handleUndoSticker}
            />
          </div>

          <div className="booth__colors">
            {FRAME_COLORS.map((c) => (
              <button
                key={c.id}
                className={`booth__swatch ${c.id === color.id ? 'booth__swatch--active' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => handleColor(c.id)}
                aria-label={`Warna ${c.name}`}
                aria-pressed={c.id === color.id}
              />
            ))}
          </div>

          <button className="booth__download" onClick={handleDownload}>
            Unduh foto
          </button>
          <button className="booth__link" onClick={handleRetake}>
            Ambil ulang
          </button>
        </div>
      )}
    </main>
  )
}

export default PhotoboothPage