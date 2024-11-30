import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Emprunt {
  id_emprunt: number;
  date_debut: string;
  date_fin: string;
  date_retour: string | null;
  statut: "en cours" | "terminé" | "en retard" | "annulé";
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
  };
}

interface DialogEmpruntHistoriqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exemplaire: {
    code_unique: string;
    statut: "disponible" | "emprunté" | "réservé" | "indisponible";
  } | null;
  emprunts: Emprunt[];
  loading: boolean;
}

export function DialogEmpruntHistorique({
  open,
  onOpenChange,
  exemplaire,
  emprunts,
  loading,
}: DialogEmpruntHistoriqueProps) {
  if (!exemplaire) return null;

  const getStatutStyle = (statut: string) => {
    const styles = {
      disponible: "bg-green-200 text-green-800 border-green-400",
      emprunté: "bg-yellow-200 text-yellow-800 border-yellow-400",
      réservé: "bg-blue-200 text-blue-800 border-blue-400",
      indisponible: "bg-gray-200 text-gray-800 border-gray-400",
    };
    return styles[statut] || "bg-zinc-200 text-zinc-800 border-zinc-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-zinc-800 text-zinc-100 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-normal gap-2 items-center text-zinc-100">
            <span>Historique des emprunts - {exemplaire.code_unique}</span>
            <Badge
              variant="secondary"
              className={`px-2 py-1 rounded ${getStatutStyle(
                exemplaire.statut
              )}`}
            >
              {exemplaire.statut}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-24 text-zinc-400">
              <p>Chargement de l'historique...</p>
            </div>
          ) : emprunts.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-zinc-400">
              Aucun emprunt enregistré pour cet exemplaire
            </div>
          ) : (
            <div className="space-y-4">
              {emprunts.map((emprunt) => (
                <div
                  key={emprunt.id_emprunt}
                  className="border border-zinc-600 bg-zinc-700 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-zinc-100">
                        {emprunt.utilisateur.prenom} {emprunt.utilisateur.nom}
                      </p>
                      <p className="text-sm text-zinc-400">
                        ID Emprunt: {emprunt.id_emprunt}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`px-2 py-1 rounded ${getStatutStyle(
                        emprunt.statut
                      )}`}
                    >
                      {emprunt.statut}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-400">Date de début</p>
                      <p className="text-zinc-200">
                        {new Date(emprunt.date_debut).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Date de fin prévue</p>
                      <p className="text-zinc-200">
                        {new Date(emprunt.date_fin).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    {emprunt.date_retour && (
                      <div className="col-span-2">
                        <p className="text-zinc-400">Retourné le</p>
                        <p className="text-zinc-200">
                          {new Date(emprunt.date_retour).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
