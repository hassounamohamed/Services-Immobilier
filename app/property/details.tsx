import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProperty, type Property } from '@/src/services/propertyService';
import { formatPrice } from '@/src/utils/formatPrice';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function PropertyDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [property, setProperty] = useState<Property | null>(null);

	useEffect(() => {
		if (id) {
			getProperty(String(id)).then(setProperty);
		}
	}, [id]);

	if (!property) return (
		<ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<ThemedText>Chargement...</ThemedText>
		</ThemedView>
	);

	return (
		<ThemedView style={{ flex: 1, padding: 16, gap: 8 }}>
			<ThemedText type="title">{property.title}</ThemedText>
			<ThemedText type="subtitle">{formatPrice(property.price)}</ThemedText>
			<ThemedText>{property.location}</ThemedText>
			<ThemedText>{property.type === 'rent' ? 'Location' : 'Vente'}</ThemedText>
		</ThemedView>
	);
}

