import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function FavoritesScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ThemedText type="title">Favoris</ThemedText>
      <ThemedText>Vos biens enregistrés apparaîtront ici.</ThemedText>
    </ThemedView>
  );
}
