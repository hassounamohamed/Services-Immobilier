import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PropertyCard } from '@/src/components/PropertyCard';
import { SearchBar } from '@/src/components/SearchBar';
import { useAppTheme } from '@/src/context/ThemeContext';
import { listProperties, type Property } from '@/src/services/propertyService';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { toggle, scheme } = useAppTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [data, setData] = useState<Property[]>([]);

  useEffect(() => {
    listProperties().then(setData);
  }, []);

  const filtered = data.filter((p) =>
    (filter === 'all' || p.type === filter) &&
    (query.trim().length === 0 || p.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <ThemedText type="title">Trouvez votre prochain chez‑vous</ThemedText>
          <ThemedText>Explorez des milliers d’annonces en location et vente.</ThemedText>
        </View>
        <ThemeToggle onPress={toggle} scheme={scheme} />
      </View>
      <SearchBar placeholder="Rechercher un bien, ex: appartement" onChange={setQuery} />

      <View style={styles.filters}>
        <FilterChip label="Tout" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip label="Location" active={filter === 'rent'} onPress={() => setFilter('rent')} />
        <FilterChip label="Vente" active={filter === 'sale'} onPress={() => setFilter('sale')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8, gap: 16 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/property/details', params: { id: item.id } }} asChild>
            <View>
              <PropertyCard title={item.title} price={item.price} location={item.location} imageUrl={item.imageUrl} />
            </View>
          </Link>
        )}
        ListEmptyComponent={<ThemedText>Aucun résultat</ThemedText>}
      />
    </ThemedView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <ThemedText
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: active ? '#2563eb' : '#e5e7eb',
        color: active ? '#2563eb' : undefined,
      }}
    >
      {label}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  filters: { flexDirection: 'row', gap: 8, marginVertical: 8 },
});

function ThemeToggle({ onPress, scheme }: { onPress: () => void; scheme: 'light' | 'dark' }) {
  return (
    <ThemedText
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
      }}
    >
      {scheme === 'light' ? '🌙 Sombre' : '☀️ Clair'}
    </ThemedText>
  );
}
