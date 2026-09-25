const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export const formatEuro = (n: number) => euro.format(n);

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local date as YYYY-MM-DD (avoids UTC shifts from toISOString). */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Month key as YYYY-MM. */
export const monthKey = (year: number, month: number) => `${year}-${pad(month + 1)}`;

export const monthLabel = (year: number, month: number) => `${MONTHS[month]} ${year}`;

export function dayLabel(iso: string): string {
  const today = toISODate(new Date());
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (iso === today) return "Aujourd'hui";
  if (iso === toISODate(y)) return 'Hier';
  const [yy, mm, dd] = iso.split('-').map(Number);
  const d = new Date(yy, mm - 1, dd);
  return `${DAYS[d.getDay()]} ${dd} ${MONTHS[mm - 1].toLowerCase()}`;
}

/** Parses "12,50" or "12.5" into a number, or NaN. */
export const parseAmount = (s: string) => Number(s.replace(/\s/g, '').replace(',', '.'));
