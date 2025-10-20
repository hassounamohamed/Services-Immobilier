import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth/login" options={{ title: "Connexion" }} />
      <Stack.Screen name="auth/register" options={{ title: "Inscription" }} />
      <Stack.Screen name="auth/forgot-password" options={{ title: "Mot de passe oublié" }} />
    </Stack>
  );
}
