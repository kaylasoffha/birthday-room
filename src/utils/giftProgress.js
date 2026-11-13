export function getProgress(gift) {
  const cake = gift.cake.decorations.some((d) => d.type === 'candle')
  const letter = gift.letter.sent
  const photo = gift.photo !== null

  return { cake, letter, photo, all: cake && letter && photo }
}