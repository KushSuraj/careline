export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dayFromToday(offset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return localDate(date)
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', options)
}

export function formatTime(time: string): string {
  const [hour, minutes] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minutes).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
}

export function isFutureSlot(date: string, time: string): boolean {
  return new Date(`${date}T${time}:00`).getTime() > Date.now()
}

export function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}
