import {
  CAPTION_FONT,
  CAPTION_TEXT,
  FRAME_LAYOUTS,
  FRAME_RADIUS,
} from '../data/photoFrame'

const SCALE = 3

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function renderFrame({ frameId, photos, color, textColor, stickers }) {
  const layout = FRAME_LAYOUTS[frameId]
  const W = layout.width * SCALE
  const H = layout.height * SCALE

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  await document.fonts.ready

  ctx.beginPath()
  ctx.roundRect(0, 0, W, H, FRAME_RADIUS * SCALE)
  ctx.clip()

  ctx.fillStyle = color
  ctx.fillRect(0, 0, W, H)

  const photoImages = await Promise.all(photos.map(loadImage))
  layout.slots.forEach((slot, i) => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(slot.x * SCALE, slot.y * SCALE, slot.w * SCALE, slot.h * SCALE)
    if (photoImages[i]) {
      ctx.drawImage(
        photoImages[i],
        slot.x * SCALE,
        slot.y * SCALE,
        slot.w * SCALE,
        slot.h * SCALE,
      )
    }
  })

  ctx.fillStyle = textColor
  ctx.font = `${layout.caption.size * SCALE}px ${CAPTION_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(
    CAPTION_TEXT,
    W / 2,
    (layout.caption.y + layout.caption.h / 2) * SCALE,
  )

  const stickerImages = await Promise.all(stickers.map((s) => loadImage(s.src)))
  stickers.forEach((s, i) => {
    const img = stickerImages[i]
    const w = (layout.stickerSize / 100) * W
    const h = w * (img.naturalHeight / img.naturalWidth)
    ctx.drawImage(img, (s.x / 100) * W - w / 2, (s.y / 100) * H - h / 2, w, h)
  })

  return canvas
}

export async function downloadFrame(data) {
  const canvas = await renderFrame(data)
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'birthday-photobooth.png'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}