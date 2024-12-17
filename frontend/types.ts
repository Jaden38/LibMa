export interface IBorrow {
    id: number;
    begin_date: string; // Date as a string (e.g., '2024-12-01')
    end_date: string | null; // Nullable because it may be incomplete
    status: "en cours" | "terminé" | "en retard" | "annulé";
    user: {
      id: number;
      lastname: string;
      firstname: string;
    };
    return_date: string | null; // Date as a string or null if not returned
  }
  
  export interface IBook {
    id: number;
    title: string;
    author: string;
    genre: string;
    category: string;
    release_date: string; // Date as a string (e.g., '2024-12-01')
    description: string;
    image_url: string;
  }
  
  export interface ISample {
    id: number;
    unique_code: string;
    status: "disponible" | "emprunté" | "réservé" | "indisponible";
    localization: string | null;
  }
  