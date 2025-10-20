import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
};

export function CustomButton({ title, onPress, variant = "primary" }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, variant === "secondary" ? styles.secondary : styles.primary]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center" },
  primary: { backgroundColor: "#2563eb" },
  secondary: { backgroundColor: "#9ca3af" },
  text: { color: "white", fontWeight: "600" },
});
