
export function isEmpty (value: any): boolean {
  return value === null || value === undefined
}
export function delay (delayInms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delayInms)
  })
}
