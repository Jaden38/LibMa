export interface IBorrow {
  id: number;
  begin_date: string;
  end_date: string | null;
  status: "en cours" | "terminé" | "en retard" | "annulé";
  user: {
    id: number;
    lastname: string;
    firstname: string;
  };
  return_date: string | null;
  sample: IBook;
}

export interface IBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  category: string;
  release_date: string;
  description: string;
  image_url: string;
}

export interface ISample {
  id: number;
  unique_code: string;
  status: "disponible" | "emprunté" | "réservé" | "indisponible";
  localization: string | null;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "membre" | "bibliothecaire" | "administrateur";
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: IUser;
}