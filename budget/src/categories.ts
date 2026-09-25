import type { Category, CategoryId } from './types';

export const CATEGORIES: Category[] = [
  { id: 'courses', label: 'Courses', emoji: '🛒', color: '#22A06B' },
  { id: 'resto', label: 'Resto', emoji: '🍽️', color: '#E2711D' },
  { id: 'transport', label: 'Transport', emoji: '🚌', color: '#2F6FEB' },
  { id: 'logement', label: 'Logement', emoji: '🏠', color: '#8E44AD' },
  { id: 'sante', label: 'Santé', emoji: '💊', color: '#D63864' },
  { id: 'loisirs', label: 'Loisirs', emoji: '🎬', color: '#0FA3B1' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#C9A227' },
  { id: 'autre', label: 'Autre', emoji: '📦', color: '#6B7280' },
];

const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;

export const getCategory = (id: CategoryId): Category => byId[id] ?? byId.autre;
