/** Format a wei amount (as returned by the API, always a string) as OKB. */
export function formatOkb(weiString: string, fractionDigits = 4): string {
  return (Number(weiString) / 1e18).toFixed(fractionDigits);
}
