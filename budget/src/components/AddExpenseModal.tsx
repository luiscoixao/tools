import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CATEGORIES } from '../categories';
import { parseAmount, toISODate } from '../format';
import { colors } from '../theme';
import type { CategoryId, Expense } from '../types';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (e: Omit<Expense, 'id'>) => void;
};

const DAY_OPTIONS = [
  { label: "Aujourd'hui", offset: 0 },
  { label: 'Hier', offset: 1 },
  { label: 'Avant-hier', offset: 2 },
];

export function AddExpenseModal({ visible, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<CategoryId>('courses');
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    if (visible) {
      setAmount('');
      setLabel('');
      setDayOffset(0);
    }
  }, [visible]);

  const value = parseAmount(amount);
  const valid = Number.isFinite(value) && value > 0;

  const save = () => {
    if (!valid) return;
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    onSave({
      amount: Math.round(value * 100) / 100,
      label: label.trim(),
      category,
      date: toISODate(d),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Nouvelle dépense</Text>

          <View style={styles.amountRow}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              autoFocus
            />
            <Text style={styles.euro}>€</Text>
          </View>

          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="Description (optionnel)"
            placeholderTextColor={colors.muted}
            returnKeyType="done"
            onSubmitEditing={save}
          />

          <Text style={styles.section}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {CATEGORIES.map((c) => {
              const active = c.id === category;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={[styles.chip, active && { backgroundColor: c.color, borderColor: c.color }]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {c.emoji} {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.section}>Date</Text>
          <View style={styles.row}>
            {DAY_OPTIONS.map((o) => {
              const active = o.offset === dayOffset;
              return (
                <Pressable
                  key={o.offset}
                  onPress={() => setDayOffset(o.offset)}
                  style={[styles.chip, active && styles.chipDark]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={save}
            disabled={!valid}
            style={({ pressed }) => [styles.button, (!valid || pressed) && { opacity: valid ? 0.8 : 0.4 }]}
          >
            <Text style={styles.buttonText}>Ajouter</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  amountInput: { fontSize: 44, fontWeight: '700', color: colors.text, minWidth: 120, textAlign: 'right' },
  euro: { fontSize: 36, fontWeight: '600', color: colors.muted, marginLeft: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  section: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row' },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipDark: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontSize: 14, color: colors.text },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
