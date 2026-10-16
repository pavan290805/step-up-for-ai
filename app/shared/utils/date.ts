export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60_000);
}

export function isPast(value: Date | string | number): boolean {
  return new Date(value).getTime() < Date.now();
}
