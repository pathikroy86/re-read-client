const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getBackendHealth() {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Backend is not reachable",
    };
  }
}

export async function addBook(data: unknown) {
  const res = await fetch(`${API_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}
