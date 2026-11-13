const stickerFiles = import.meta.glob('../assets/letter/stickers/*.png', {
  eager: true,
  import: 'default',
})

export const STICKERS = Object.entries(stickerFiles).map(([path, src]) => ({
  id: path,
  src,
}))