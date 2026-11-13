import { useCallback, useMemo, useState } from 'react'
import { GiftContext, INITIAL_GIFT } from './giftContext'

export default function GiftProvider({ children }) {
  const [gift, setGift] = useState(INITIAL_GIFT)

  const updateGift = useCallback((section, update) => {
    setGift((prev) => ({
      ...prev,
      [section]: typeof update === 'function' ? update(prev[section]) : update,
    }))
  }, [])

  const resetGift = useCallback(() => setGift(INITIAL_GIFT), [])

  const value = useMemo(
    () => ({ gift, updateGift, resetGift }),
    [gift, updateGift, resetGift],
  )

  return <GiftContext.Provider value={value}>{children}</GiftContext.Provider>
}