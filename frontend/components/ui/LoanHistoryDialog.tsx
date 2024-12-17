import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { IBorrow, ISample } from "@/types";

interface LoanHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sample: ISample | null;
  borrows: IBorrow[];
  loading: boolean;
}

export function LoanHistoryDialog({
  open,
  onOpenChange,
  sample,
  borrows,
  loading,
}: LoanHistoryDialogProps) {
  if (!sample) return null;

  const getStatutStyle = (status: ISample['status']) => {
    const styles = {
      disponible: "bg-green-200 text-green-800 border-green-400",
      emprunté: "bg-yellow-200 text-yellow-800 border-yellow-400",
      réservé: "bg-blue-200 text-blue-800 border-blue-400",
      indisponible: "bg-gray-200 text-gray-800 border-gray-400",
    } as const;

    return styles[status] ?? "bg-zinc-200 text-zinc-800 border-zinc-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-zinc-800 text-zinc-100 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-normal gap-2 items-center text-zinc-100">
            <span>Historique des emprunts - {sample.unique_code}</span>
            <Badge className={`px-2 py-1 rounded ${getStatutStyle(sample.status)}`}>
              {sample.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-24 text-zinc-400">
              <p>Chargement de l'historique...</p>
            </div>
          ) : borrows.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-zinc-400">
              Aucun emprunt enregistré pour cet exemplaire
            </div>
          ) : (
            <div className="space-y-4">
              {borrows.map((borrow) => (
                <div key={borrow.id} className="border border-zinc-600 bg-zinc-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-zinc-100">{borrow.user.firstname} {borrow.user.lastname}</p>
                      <p className="text-sm text-zinc-400">ID Emprunt: {borrow.id}</p>
                    </div>
                    <Badge className={`px-2 py-1 rounded ${getStatutStyle(borrow.status as ISample['status'])}`}>
                      {borrow.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-400">Date de début</p>
                      <p className="text-zinc-200">{new Date(borrow.begin_date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Date de fin prévue</p>
                      <p className="text-zinc-200">{borrow.end_date ? new Date(borrow.end_date).toLocaleDateString("fr-FR") : '—'}</p>
                    </div>
                    {borrow.return_date && (
                      <div className="col-span-2">
                        <p className="text-zinc-400">Retourné le</p>
                        <p className="text-zinc-200">{new Date(borrow.return_date).toLocaleDateString("fr-FR")}</p>
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
