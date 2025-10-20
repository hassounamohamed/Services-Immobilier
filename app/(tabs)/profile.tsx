import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function ProfileScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ThemedText type="title">Profil</ThemedText>
      <ThemedText>Gérez votre compte et vos préférences.</ThemedText>
    </ThemedView>
  );
}
