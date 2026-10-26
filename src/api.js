const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Can’t reach the bookstore server. Start MySQL and the Spring Boot API, then try again.");
    }
    throw error;
  }

  if (!response.ok) {
    const responseBody = await response.text();
    let message;
    try {
      const error = JSON.parse(responseBody);
      message = error.message ?? error.detail;
    } catch {
      message = undefined;
    }
    const apiError = new Error(message ?? `The bookstore server returned an error (${response.status}). Please try again.`);
    apiError.status = response.status;
    throw apiError;
  }

  return response.json();
}

export const getBooks = () => request("/api/books");
export const register = (details) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  });
export const login = (credentials) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export function isServerUnavailable(error) {
  return error.message.startsWith("Can’t reach the bookstore server.")
    || [502, 503, 504].includes(error.status);
}
