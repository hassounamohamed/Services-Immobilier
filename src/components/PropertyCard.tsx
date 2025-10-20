import { formatPrice } from "@/src/utils/formatPrice";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/themed-text";

type Props = {
  title: string;
  price: string | number;
  imageUrl?: string;
  location?: string;
};

export function PropertyCard({ title, price, imageUrl, location }: Props) {
  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <ThemedText>{location}</ThemedText>
  <ThemedText type="subtitle">{typeof price === 'number' ? formatPrice(price) : price}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  image: { width: "100%", aspectRatio: 16 / 9, borderRadius: 8 },
  placeholder: { backgroundColor: "#e5e7eb" },
});
