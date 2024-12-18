import { IBorrow, IBook, ISample, IUser } from "@/types";

const BASE_URL = "http://localhost:5000";

export async function fetchBorrows(): Promise<IBorrow[]> {
  const res = await fetch(`${BASE_URL}/emprunts`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des emprunts");
  return res.json();
}

export async function fetchBooks(): Promise<IBook[]> {
  const res = await fetch(`${BASE_URL}/livres`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des livres");
  return res.json();
}

export async function fetchSamples(): Promise<ISample[]> {
  const res = await fetch(`${BASE_URL}/exemplaires`);
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des exemplaires (samples)");
  return res.json();
}

export async function fetchUserByEmail(email: string): Promise<IUser | null> {
  try {
    const tokens = localStorage.getItem("tokens");
    if (!tokens) {
      throw new Error("No tokens found in localStorage");
    }

    const { access_token } = JSON.parse(tokens);

    const res = await fetch(
      `${BASE_URL}/membres/?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function fetchApproverById(userId: number): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/libraires/${userId}`);
  if (!res.ok)
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  return res.json();
}

export async function fetchSamplesByBookId(bookId: string): Promise<ISample[]> {
  const res = await fetch(`${BASE_URL}/livres/${bookId}/exemplaires`);
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des exemplaires");
  return res.json();
}

export async function approveBorrow(borrowId: number, approverId: number) {
  const res = await fetch(`${BASE_URL}/emprunts/${borrowId}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved_by: approverId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de l'approbation");
  }
  return res.json();
}

export async function rejectBorrow(borrowId: number, approverId: number) {
  const res = await fetch(`${BASE_URL}/emprunts/${borrowId}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved_by: approverId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors du rejet");
  }
  return res.json();
}

export async function createBorrow(borrowData: {
  user_id: number;
  sample_id: string;
  begin_date: string;
  end_date: string;
}): Promise<IBorrow> {
  const res = await fetch(`${BASE_URL}/emprunts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(borrowData),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'emprunt");
  return res.json();
}

export async function updateBorrow(
  borrowId: number,
  data: Partial<IBorrow>
): Promise<IBorrow> {
  const res = await fetch(`${BASE_URL}/emprunts/${borrowId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      begin_date: data.begin_date,
      end_date: data.end_date,
      status: data.status,
      return_date: data.return_date,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de la mise à jour de l'emprunt"
    );
  }
  return res.json();
}