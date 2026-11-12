/** Keeps an amount with its unit on one line ("3.78 B coins"): a reward never breaks inside its own amount. */
export const noBreak = (x: string) => x.replace(/ /g, '\u00a0')
