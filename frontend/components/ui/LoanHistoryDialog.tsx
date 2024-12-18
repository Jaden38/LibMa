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
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-lg shadow-xl">
        <DialogHeader className="border-b border-[#2c2c2c] pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <span>Historique des emprunts - {sample.unique_code}</span>
            <StatusBadge status={sample.status} />
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full pr-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-[#00f1a1] animate-pulse">Chargement de l'historique...</p>
              </div>
            ) : borrows.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-gray-400">
                Aucun emprunt enregistré pour cet exemplaire
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {borrows.map((borrow) => (
                    <motion.div
                      key={borrow.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-[#121212] border border-[#2c2c2c] rounded-lg p-4 space-y-3 hover:border-[#00f1a1] transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-white">
                            {borrow.user.firstname} {borrow.user.lastname}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ID Emprunt: {borrow.id}
                          </p>
                        </div>
                        <StatusBadge status={borrow.borrow_status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-[#2c2c2c]">
                        <div>
                          <p className="text-gray-400">Date de début</p>
                          <p className="text-white mt-1">
                            {new Date(borrow.begin_date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Date de fin prévue</p>
                          <p className="text-white mt-1">
                            {borrow.end_date ? new Date(borrow.end_date).toLocaleDateString("fr-FR") : '—'}
                          </p>
                        </div>
                        {borrow.return_date && (
                          <div className="col-span-2 pt-2 border-t border-[#2c2c2c]">
                            <p className="text-gray-400">Retourné le</p>
                            <p className="text-white mt-1">
                              {new Date(borrow.return_date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}