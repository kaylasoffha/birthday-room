export const CAPTION_TEXT = 'Happy Birthday! <3'
export const CAPTION_FONT = 'system-ui, sans-serif'
export const FRAME_RADIUS = 12

export const FRAME_LAYOUTS = {
  single: {
    width: 280,
    height: 400,
    slots: [{ x: 20, y: 20, w: 240, h: 320 }],
    caption: { y: 340, h: 60, size: 20 },
    stickerSize: 16,
  },
  double: {
    width: 420,
    height: 320,
    slots: [
      { x: 20, y: 20, w: 180, h: 240 },
      { x: 220, y: 20, w: 180, h: 240 },
    ],
    caption: { y: 260, h: 60, size: 20 },
    stickerSize: 11,
  },
}

export const FRAME_COLORS = [
  { id: 'pink', name: 'Pink', value: '#ea5a8b', text: '#ffffff' },
  { id: 'red', name: 'Merah', value: '#e0433f', text: '#ffffff' },
  { id: 'orange', name: 'Oranye', value: '#f39a3d', text: '#ffffff' },
  { id: 'yellow', name: 'Kuning', value: '#f6d64a', text: '#5a4300' },
  { id: 'green', name: 'Hijau', value: '#6dbb6f', text: '#ffffff' },
  { id: 'teal', name: 'Tosca', value: '#3fb2a8', text: '#ffffff' },
  { id: 'blue', name: 'Biru', value: '#4b8fe2', text: '#ffffff' },
  { id: 'purple', name: 'Ungu', value: '#9a6bd0', text: '#ffffff' },
  { id: 'brown', name: 'Cokelat', value: '#85583a', text: '#ffffff' },
  { id: 'white', name: 'Putih', value: '#ffffff', text: '#5a3a3a' },
]