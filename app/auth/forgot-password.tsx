import { CustomButton } from "@/src/components/CustomButton";
import { required } from "@/src/utils/validateForm";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function ForgotPasswordScreen() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	function onSubmit() {
		const e = required(email) ?? undefined;
		setError(e);
		if (!e) {
			// TODO: trigger password reset
			setSent(true);
		}
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Réinitialiser le mot de passe</ThemedText>
			<View style={styles.form}>
				<TextInput
					placeholder="Email"
					autoCapitalize="none"
					keyboardType="email-address"
					style={[styles.input, error && styles.inputError]}
					value={email}
					onChangeText={setEmail}
				/>
				{error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

				<CustomButton title="Envoyer le lien" onPress={onSubmit} />

				{sent ? <ThemedText>Vérifiez votre boîte mail pour le lien de réinitialisation.</ThemedText> : null}

				<View style={styles.bottomRow}>
					<ThemedText>Se souvenir du mot de passe ? </ThemedText>
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

