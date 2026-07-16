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
  rating?: number;
  reviewCount?: number;
  ownerName?: string;
  ownerEmail?: string;
  status: string;
  createdAt: string;
};

export type TFavorite = {
  id: string;
  bookId: string;
  userEmail: string;
  createdAt: string;
  book: TBook;
};

export type TCartItem = {
  id: string;
  bookId: string;
  userEmail: string;
  createdAt: string;
  book: TBook;
};

export type TContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  userEmail: string;
  status: string;
  createdAt: string;
};

export type TBlogComment = {
  id: string;
  blogId: string;
  comment: string;
  userName: string;
  userEmail: string;
  createdAt: string;
};

export type TBlog = {
  id: string;
  title: string;
  bookTitle: string;
  category: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorEmail: string;
  readTime: string;
  status: string;
  commentsCount: number;
  comments?: TBlogComment[];
  createdAt: string;
};

export type TProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  updatedAt?: string | null;
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

export async function getBook(id: string) {
  try {
    const res = await fetch(`/api/books/${id}`, {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Book is not reachable",
      data: null,
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

export async function deleteBook(id: string) {
  const res = await fetch(`/api/books/${id}`, {
    method: "DELETE",
  });

  return await res.json();
}

export async function saveFavorite(data: unknown) {
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function getFavorites(userEmail: string) {
  try {
    const res = await fetch(
      `/api/favorites?userEmail=${encodeURIComponent(userEmail)}`,
      {
        cache: "no-store",
      }
    );

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Favorites are not reachable",
      data: [],
    };
  }
}

export async function addToCart(data: unknown) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (result.success && typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }

  return result;
}

export async function getCartItems() {
  try {
    const res = await fetch("/api/cart", {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Cart is not reachable",
      data: [],
    };
  }
}

export async function removeCartItem(id: string) {
  const res = await fetch(`/api/cart/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (result.success && typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }

  return result;
}

export async function sendContactMessage(data: unknown) {
  const res = await fetch("/api/contact-messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function getContactMessages(userEmail: string) {
  try {
    const res = await fetch(
      `/api/contact-messages?userEmail=${encodeURIComponent(userEmail)}`,
      {
        cache: "no-store",
      }
    );

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Messages are not reachable",
      data: [],
    };
  }
}

export async function getBlogs() {
  try {
    const res = await fetch("/api/blogs", {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Blogs are not reachable",
      data: [],
    };
  }
}

export async function getBlog(id: string) {
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Blog is not reachable",
      data: null,
    };
  }
}

export async function addBlog(data: unknown) {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function addBlogComment(blogId: string, data: unknown) {
  const res = await fetch(`/api/blogs/${blogId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function getProfile() {
  try {
    const res = await fetch("/api/profile", {
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Profile is not reachable",
      data: null,
    };
  }
}

export async function updateProfile(data: unknown) {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (result.success && typeof window !== "undefined") {
    window.dispatchEvent(new Event("profile-updated"));
  }

  return result;
}
