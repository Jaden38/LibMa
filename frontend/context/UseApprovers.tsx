import { useState, useCallback } from "react";
import { IUser } from "@/types";
import { fetchApproverById } from "@/api";

export function useApprovers() {
    const [approvers, setApprovers] = useState<{ [key: number]: IUser }>({});

    const getApprover = useCallback(async (userId: number) => {
        if (approvers[userId]) {
            return approvers[userId];
        }

        try {
            const userData = await fetchApproverById(userId);
            if (userData) {
                setApprovers((prev) => ({ ...prev, [userId]: userData }));
            }
            return userData;
        } catch (err) {
            console.error("Erreur lors de la récupération de l'approbateur:", err);
            return null;
        }
    }, [approvers]);

    return { approvers, getApprover };
}
