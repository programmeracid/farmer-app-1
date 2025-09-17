// services/authService.ts
export async function register(username: string, password: string) {
  const res = await fetch("http://172.16.46.27:8000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }
  return await res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch("http://172.16.46.27:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  return await res.json(); // { token: "..." }
}
