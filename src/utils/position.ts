export function getPosition(index: number, size: number) {
  return {
    first: index === 0,
    last: index === size - 1,
  }
}