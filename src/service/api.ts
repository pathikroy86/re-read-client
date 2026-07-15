export type TBook = {
  id: string;
  title: string;
  author: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  genre: string;
  condition: string;
  location: string;
  language: string;
  edition: string;
  imageUrl?: string;
  ownerName?: string;
  ownerEmail?: string;
  status: string;
  createdAt: string;
};

export async function getBackendHealth() {
  try {
    const res = await fetch("/api/backend-health", {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Backend is not reachable",
    };
  }
}

export async function getBooks() {
  try {
    const res = await fetch("/api/books", {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Books are not reachable",
      data: [],
    };
  }
}

export async function addBook(data: unknown) {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}
