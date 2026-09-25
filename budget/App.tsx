import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AddExpenseModal } from './src/components/AddExpenseModal';
import { BudgetModal } from './src/components/BudgetModal';
import { CATEGORIES, getCategory } from './src/categories';
import { dayLabel, formatEuro, monthKey, monthLabel } from './src/format';
import { useData } from './src/storage';
import { colors } from './src/theme';
import type { Expense } from './src/types';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Home />
    </SafeAreaProvider>
  );
}

function confirmDelete(e: Expense, onConfirm: () => void) {
  const msg = `${e.label || getCategory(e.category).label} — ${formatEuro(e.amount)}`;
  if (Platform.OS === 'web') {
    if (window.confirm(`Supprimer cette dépense ?\n${msg}`)) onConfirm();
    return;
  }
  Alert.alert('Supprimer cette dépense ?', msg, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Supprimer', style: 'destructive', onPress: onConfirm },
  ]);
}

function Home() {
  const { data, loaded, update } = useData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [adding, setAdding] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const { total, byCategory, sections } = useMemo(() => {
    const key = monthKey(year, month);
    const list = data.expenses
      .filter((e) => e.date.startsWith(key))
      .sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)));

    const sums = new Map<string, number>();
    const days = new Map<string, Expense[]>();
    let total = 0;
    for (const e of list) {
      total += e.amount;
      sums.set(e.category, (sums.get(e.category) ?? 0) + e.amount);
      days.set(e.date, [...(days.get(e.date) ?? []), e]);
    }

    return {
      total,
      byCategory: CATEGORIES.filter((c) => sums.has(c.id))
        .map((c) => ({ ...c, sum: sums.get(c.id)! }))
        .sort((a, b) => b.sum - a.sum),
      sections: [...days].map(([date, items]) => ({
        date,
        sum: items.reduce((s, e) => s + e.amount, 0),
        data: items,
      })),
    };
  }, [data.expenses, year, month]);

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    update((d) => ({ ...d, expenses: [...d.expenses, { ...e, id }] }));
    setAdding(false);
    // Jump to the month of the new expense (e.g. "hier" on the 1st).
    const [y, m] = e.date.split('-').map(Number);
    setYear(y);
    setMonth(m - 1);
  };

  const removeExpense = (id: string) =>
    update((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));

  if (!loaded) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const budget = data.budget;
  const ratio = budget > 0 ? total / budget : 0;
  const barColor = ratio >= 1 ? colors.danger : ratio >= 0.8 ? colors.warn : colors.ok;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysLeft = isCurrentMonth ? daysInMonth - now.getDate() + 1 : 0;

  const header = (
    <View>
      <View style={styles.monthNav}>
        <Pressable onPress={() => shiftMonth(-1)} hitSlop={12} style={styles.navBtn}>
          <Text style={styles.navText}>‹</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{monthLabel(year, month)}</Text>
        <Pressable onPress={() => shiftMonth(1)} hitSlop={12} style={styles.navBtn}>
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Dépensé ce mois</Text>
        <Text style={styles.total}>{formatEuro(total)}</Text>

        {budget > 0 ? (
          <>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(ratio, 1) * 100}%`, backgroundColor: barColor }]} />
            </View>
            <View style={styles.budgetRow}>
              <Text style={[styles.budgetText, { color: barColor }]}>
                {ratio >= 1
                  ? `Dépassé de ${formatEuro(total - budget)}`
                  : `Reste ${formatEuro(budget - total)}`}
              </Text>
              <Pressable onPress={() => setEditingBudget(true)} hitSlop={8}>
                <Text style={styles.link}>sur {formatEuro(budget)}</Text>
              </Pressable>
            </View>
            {isCurrentMonth && ratio < 1 && (
              <Text style={styles.hint}>
                ≈ {formatEuro((budget - total) / daysLeft)} / jour pendant {daysLeft} jour{daysLeft > 1 ? 's' : ''}
              </Text>
            )}
          </>
        ) : (
          <Pressable onPress={() => setEditingBudget(true)} hitSlop={8}>
            <Text style={[styles.link, { marginTop: 8 }]}>+ Définir un budget mensuel</Text>
          </Pressable>
        )}
      </View>

      {byCategory.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Par catégorie</Text>
          <View style={styles.stack}>
            {byCategory.map((c) => (
              <View key={c.id} style={{ flex: c.sum, backgroundColor: c.color }} />
            ))}
          </View>
          {byCategory.map((c) => (
            <View key={c.id} style={styles.catRow}>
              <Text style={styles.catName}>
                {c.emoji} {c.label}
              </Text>
              <Text style={styles.catPct}>{Math.round((c.sum / total) * 100)} %</Text>
              <Text style={styles.catSum}>{formatEuro(c.sum)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <SectionList
        sections={sections}
        keyExtractor={(e) => e.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🧾</Text>
            <Text style={styles.emptyText}>Aucune dépense ce mois-ci.</Text>
            <Text style={styles.hint}>Appuyez sur + pour en ajouter une.</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{dayLabel(section.date)}</Text>
            <Text style={styles.daySum}>{formatEuro(section.sum)}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const c = getCategory(item.category);
          return (
            <Pressable
              onLongPress={() => confirmDelete(item, () => removeExpense(item.id))}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
            >
              <View style={[styles.icon, { backgroundColor: c.color + '22' }]}>
                <Text style={styles.iconText}>{c.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {item.label || c.label}
                </Text>
                {!!item.label && <Text style={styles.itemCat}>{c.label}</Text>}
              </View>
              <Text style={styles.itemAmount}>−{formatEuro(item.amount)}</Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          sections.length > 0 ? (
            <Text style={[styles.hint, styles.footer]}>Appui long sur une dépense pour la supprimer.</Text>
          ) : null
        }
      />

      <Pressable
        onPress={() => setAdding(true)}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}
        accessibilityLabel="Ajouter une dépense"
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddExpenseModal visible={adding} onClose={() => setAdding(false)} onSave={addExpense} />
      <BudgetModal
        visible={editingBudget}
        current={budget}
        onClose={() => setEditingBudget(false)}
        onSave={(b) => {
          update((d) => ({ ...d, budget: b }));
          setEditingBudget(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 120 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 24, color: colors.text, marginTop: -3 },
  monthTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12 },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.muted },
  total: { fontSize: 36, fontWeight: '800', color: colors.text, marginTop: 4 },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.border, marginTop: 14, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  budgetText: { fontSize: 14, fontWeight: '600' },
  link: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  hint: { fontSize: 13, color: colors.muted, marginTop: 6 },
  stack: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginVertical: 12, gap: 2 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  catName: { flex: 1, fontSize: 15, color: colors.text },
  catPct: { width: 50, textAlign: 'right', fontSize: 13, color: colors.muted },
  catSum: { width: 100, textAlign: 'right', fontSize: 15, fontWeight: '600', color: colors.text },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 6, paddingHorizontal: 4 },
  dayTitle: { fontSize: 13, fontWeight: '700', color: colors.muted, textTransform: 'capitalize' },
  daySum: { fontSize: 13, fontWeight: '600', color: colors.muted },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 6,
    gap: 12,
  },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  itemLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  itemCat: { fontSize: 13, color: colors.muted, marginTop: 1 },
  itemAmount: { fontSize: 16, fontWeight: '700', color: colors.text },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 8 },
  footer: { textAlign: 'center', marginTop: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 34, fontWeight: '400', marginTop: -2 },
});
