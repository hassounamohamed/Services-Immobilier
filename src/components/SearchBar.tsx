import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  placeholder?: string;
  onChange?: (text: string) => void;
};

export function SearchBar({ placeholder = "Rechercher...", onChange }: Props) {
  const [value, setValue] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={(t) => {
          setValue(t);
          onChange?.(t);
        }}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingHorizontal: 12 },
  input: { height: 40 },
});
