import React from 'react';
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
  statut: 'en cours' | 'terminé' | 'en retard' | 'annulé';
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
    statut: string;
  } | null;
  emprunts: Emprunt[];
  loading: boolean;
}

export function DialogEmpruntHistorique({
  open,
  onOpenChange,
  exemplaire,
  emprunts,
  loading
}: DialogEmpruntHistoriqueProps) {
  if (!exemplaire) return null;

  const getStatutStyle = (statut: Emprunt['statut']) => {
    const styles = {
      'en cours': 'bg-blue-100 text-blue-800',
      'terminé': 'bg-green-100 text-green-800',
      'en retard': 'bg-red-100 text-red-800',
      'annulé': 'bg-gray-100 text-gray-800'
    };
    return styles[statut];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Historique des emprunts - {exemplaire.code_unique}</span>
            <Badge variant="secondary" className="ml-2">
              {exemplaire.statut}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <p>Chargement de l'historique...</p>
            </div>
          ) : emprunts.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-gray-500">
              Aucun emprunt enregistré pour cet exemplaire
            </div>
          ) : (
            <div className="space-y-4">
              {emprunts.map((emprunt) => (
                <div
                  key={emprunt.id_emprunt}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {emprunt.utilisateur.prenom} {emprunt.utilisateur.nom}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID Emprunt: {emprunt.id_emprunt}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={getStatutStyle(emprunt.statut)}
                    >
                      {emprunt.statut}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date de début</p>
                      <p>{new Date(emprunt.date_debut).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date de fin prévue</p>
                      <p>{new Date(emprunt.date_fin).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {emprunt.date_retour && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Retourné le</p>
                        <p>{new Date(emprunt.date_retour).toLocaleDateString('fr-FR')}</p>
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