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
