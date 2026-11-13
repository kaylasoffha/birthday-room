import { createContext, useContext } from 'react'

export const INITIAL_GIFT = {
  cake: { base: 0, decorations: [] },
  letter: { text: '', stickers: [], sent: false },
  photo: null,
}

export const GiftContext = createContext(null)

export function useGift() {
  const value = useContext(GiftContext)
  if (!value) {
    throw new Error('useGift harus dipakai di dalam <GiftProvider>')
  }
  return value
}