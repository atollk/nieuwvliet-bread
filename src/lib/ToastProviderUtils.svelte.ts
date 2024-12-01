const toasts = $state<string[]>([])

export function getToasts(): ReadonlyArray<string> {
    return toasts
}

export function addToast(text: string): void {
    toasts.push(text)
}