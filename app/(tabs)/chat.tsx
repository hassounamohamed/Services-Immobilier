import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function ChatScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ThemedText type="title">Messagerie</ThemedText>
      <ThemedText>Discutez avec les propriétaires et locataires.</ThemedText>
    </ThemedView>
  );
}
