import { IBorrow, IBook, IUser } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ApproverInfo from "@/components/ui/ApproverInfo";
import StatusBadge from "@/components/ui/StatusBadge";
import React, { useState } from "react";

interface BorrowsTableProps {
    borrows: IBorrow[];
    approvers: { [key: number]: IUser };
    getApprover: (id: number) => Promise<IUser | null>;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onEdit: (borrow: IBorrow) => void;
}

export default function BorrowsTable({
    borrows,
    approvers,
    getApprover,
    onApprove,
    onReject,
    onEdit
}: BorrowsTableProps) {
    const [confirmActionId, setConfirmActionId] = useState<{ id: number; action: "approve" | "reject" } | null>(null);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    const buttonVariants = {
        initial: {
            opacity: 0,
            y: 10,
            scale: 0.95,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg overflow-x-auto mt-8"
        >
            <h2 className="text-2xl font-bold text-center mb-6 text-white uppercase tracking-wider">
                Liste des Emprunts
            </h2>
            {borrows.length === 0 ? (
                <p className="text-center text-gray-300">Aucune demande d'emprunt en attente.</p>
            ) : (
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="border-b border-[#2c2c2c]">
                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Livre</th>
                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Utilisateur</th>
                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Date début</th>
                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Date fin</th>
                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Actions/Approuvé par</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {borrows.map((request) => {
                                const bookTitle = request.sample.book.title;
                                return (
                                    <motion.tr
                                        key={request.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="border-b border-[#2c2c2c] hover:bg-[#1f1f1f] transition cursor-pointer"
                                        onClick={() => onEdit(request)}
                                    >
                                        <td className="p-4 text-white">{bookTitle}</td>
                                        <td className="p-4 text-gray-300">
                                            {request.user.firstname} {request.user.lastname}
                                        </td>
                                        <td className="p-4">
                                            {new Date(request.begin_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {request.end_date ? new Date(request.end_date).toLocaleDateString() : ""}
                                        </td>
                                        {!request.approved_by && request.status !== "annulé" ? (
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 relative">
                                                    <AnimatePresence mode="wait">
                                                        {(!confirmActionId || confirmActionId.id !== request.id) ? (
                                                            <motion.div
                                                                key="actions"
                                                                variants={containerVariants}
                                                                initial="initial"
                                                                animate="animate"
                                                                exit="exit"
                                                                className="flex items-center gap-3"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="bg-[#00f1a1c2] text-black px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-[#05e799] transition-colors duration-200 focus:outline-none"
                                                                    onClick={() => setConfirmActionId({ id: request.id, action: "approve" })}
                                                                >
                                                                    Approuver
                                                                </motion.button>
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="px-4 py-2 rounded-lg font-medium bg-[#1a1a1a] text-[#00f1a1c2] border border-[#00f1a1] shadow-lg hover:bg-[#2a2a2a] hover:text-white transition-colors duration-200 focus:outline-none"
                                                                    onClick={() => setConfirmActionId({ id: request.id, action: "reject" })}
                                                                >
                                                                    Rejeter
                                                                </motion.button>
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="px-4 py-2 rounded-lg font-medium bg-[#1a1a1a] text-[#00f1a1c2] border border-[#00f1a1] shadow-lg hover:bg-[#2a2a2a] hover:text-white transition-colors duration-200 focus:outline-none flex items-center gap-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEdit(request);
                                                                    }}
                                                                >
                                                                    <Edit size={16} /> Modifier
                                                                </motion.button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="confirm"
                                                                variants={containerVariants}
                                                                initial="initial"
                                                                animate="animate"
                                                                exit="exit"
                                                                className="flex items-center gap-3"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="bg-[#00f1a1] text-black px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-[#05e799] transition-colors duration-200 focus:outline-none flex items-center gap-2"
                                                                    onClick={() => confirmActionId && confirmActionId.action === "approve" ? onApprove(request.id) : onReject(request.id)}
                                                                >
                                                                    <Check size={16} /> Confirmer
                                                                </motion.button>
                                                                <motion.button
                                                                    variants={buttonVariants}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="px-4 py-2 rounded-lg font-medium bg-[#1f1f1f] text-gray-300 shadow-lg hover:text-white hover:bg-[#2a2a2a] transition-colors duration-200 focus:outline-none flex items-center gap-2"
                                                                    onClick={() => setConfirmActionId(null)}
                                                                >
                                                                    <X size={16} /> Annuler
                                                                </motion.button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="p-4">
                                                <StatusBadge status={request.status} />
                                                <ApproverInfo
                                                    approverId={request.approved_by}
                                                    state={request.status}
                                                    approvers={approvers}
                                                    getApprover={getApprover}
                                                />
                                            </td>
                                        )}
                                    </motion.tr>
                                )
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            )}
        </motion.section>
    );
}
