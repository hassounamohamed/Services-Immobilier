import { CustomButton } from "@/src/components/CustomButton";
import { required } from "@/src/utils/validateForm";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function RegisterScreen() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

	function onSubmit() {
		const e = {
			name: required(name) ?? undefined,
			email: required(email) ?? undefined,
			password: required(password) ?? undefined,
			confirm: password === confirm ? undefined : "Les mots de passe ne correspondent pas",
		};
		setErrors(e);
		if (!e.name && !e.email && !e.password && !e.confirm) {
			// TODO: call register service
			router.replace("/(tabs)" as any);
		}
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Créer un compte</ThemedText>
			<View style={styles.form}>
				<TextInput placeholder="Nom" style={[styles.input, errors.name && styles.inputError]} value={name} onChangeText={setName} />
				{errors.name ? <ThemedText style={styles.error}>{errors.name}</ThemedText> : null}

				<TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={[styles.input, errors.email && styles.inputError]} value={email} onChangeText={setEmail} />
				{errors.email ? <ThemedText style={styles.error}>{errors.email}</ThemedText> : null}

				<TextInput placeholder="Mot de passe" secureTextEntry style={[styles.input, errors.password && styles.inputError]} value={password} onChangeText={setPassword} />
				{errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

				<TextInput placeholder="Confirmer le mot de passe" secureTextEntry style={[styles.input, errors.confirm && styles.inputError]} value={confirm} onChangeText={setConfirm} />
				{errors.confirm ? <ThemedText style={styles.error}>{errors.confirm}</ThemedText> : null}

				<CustomButton title="S'inscrire" onPress={onSubmit} />

				<View style={styles.bottomRow}>
					<ThemedText>Déjà un compte ? </ThemedText>
					<Link href={"/auth/login" as any} asChild>
						<ThemedText type="link">Se connecter</ThemedText>
					</Link>
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 16 },
	form: { gap: 10 },
	input: { height: 48, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingHorizontal: 12 },
	inputError: { borderColor: "#ef4444" },
	error: { color: "#ef4444", fontSize: 12 },
	bottomRow: { flexDirection: "row", gap: 4, marginTop: 16 },
});

