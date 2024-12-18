import { useEffect, useState } from 'react';
import { IUser } from "@/types";

export default function ApproverInfo({ approverId, state, approvers, getApprover }: {
    approverId: number | null,
    state: string,
    approvers: { [key: number]: IUser },
    getApprover: (id: number) => Promise<IUser | null>
}) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!approverId || approvers[approverId]) return;
        setLoading(true);
        getApprover(approverId).finally(() => setLoading(false));
    }, [approverId, approvers, getApprover]);

    if (!approverId) return null;

    const approver = approvers[approverId];
    if (loading && !approver) return <span className="animate-pulse">Chargement...</span>;
    if (!approver) return <span className="animate-pulse">Chargement...</span>;

    return (
        <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f1a1]" />
            <span>
                Emprunt {state === "annulé" ? "annulé" : "approuvé"} par {approver.firstname} {approver.lastname}
            </span>
        </div>
    );
}
