export async function login(email: string, _password: string) {
  return { id: "demo", email };
}
export async function register(email: string, _password: string) {
  return { id: "demo", email };
}
export async function logout() {
  return true;
}
