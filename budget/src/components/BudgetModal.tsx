import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { parseAmount } from '../format';
import { colors } from '../theme';

type Props = {
  visible: boolean;
  current: number;
  onClose: () => void;
  onSave: (budget: number) => void;
};

export function BudgetModal({ visible, current, onClose, onSave }: Props) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText(current ? String(current).replace('.', ',') : '');
  }, [visible, current]);

  const save = () => {
    const v = parseAmount(text);
    onSave(Number.isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : 0);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Budget mensuel</Text>
          <Text style={styles.hint}>Laissez vide pour ne pas fixer de budget.</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="ex. 1500"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            autoFocus
            onSubmitEditing={save}
          />
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.action}>
              <Text style={styles.cancel}>Annuler</Text>
            </Pressable>
            <Pressable onPress={save} style={styles.action}>
              <Text style={styles.ok}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  box: { backgroundColor: colors.card, borderRadius: 20, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  hint: { fontSize: 13, color: colors.muted, marginTop: 4, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: colors.text,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  action: { paddingHorizontal: 12, paddingVertical: 8 },
  cancel: { fontSize: 16, color: colors.muted },
  ok: { fontSize: 16, color: colors.primary, fontWeight: '700' },
});
