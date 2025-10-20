import { CustomButton } from "@/src/components/CustomButton";
import { required } from "@/src/utils/validateForm";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
		const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

		function onSubmit() {
			const e = { email: required(email) ?? undefined, password: required(password) ?? undefined };
		setErrors(e);
				if (!e.email && !e.password) {
					// TODO: call auth service
					router.replace("/(tabs)" as any);
				}
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Bienvenue</ThemedText>
			<View style={styles.form}>
				<TextInput
					placeholder="Email"
					autoCapitalize="none"
					keyboardType="email-address"
					style={[styles.input, errors.email && styles.inputError]}
					value={email}
					onChangeText={setEmail}
				/>
				{errors.email ? <ThemedText style={styles.error}>{errors.email}</ThemedText> : null}

				<TextInput
					placeholder="Mot de passe"
					secureTextEntry
					style={[styles.input, errors.password && styles.inputError]}
					value={password}
					onChangeText={setPassword}
				/>
				{errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

				<CustomButton title="Se connecter" onPress={onSubmit} />

				<TouchableOpacity style={styles.linkRow}>
											<Link href={"/auth/forgot-password" as any} asChild>
						<ThemedText type="link">Mot de passe oublié ?</ThemedText>
					</Link>
				</TouchableOpacity>

				<View style={styles.bottomRow}>
					<ThemedText>Pas de compte ? </ThemedText>
											<Link href={"/auth/register" as any} asChild>
						<ThemedText type="link">Inscrivez-vous</ThemedText>
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
	linkRow: { alignSelf: "flex-end", marginTop: 8 },
	bottomRow: { flexDirection: "row", gap: 4, marginTop: 16 },
});

