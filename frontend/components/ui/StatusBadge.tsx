import { motion } from "framer-motion"
import { Clock, Check, XCircle, AlertTriangle } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'en cours':
                return {
                    icon: Clock,
                    bg: 'bg-blue-500/20',
                    border: 'border-blue-500',
                    text: 'text-blue-400',
                    label: 'En cours'
                };
            case 'terminé':
                return {
                    icon: Check,
                    bg: 'bg-green-500/20',
                    border: 'border-green-500',
                    text: 'text-green-400',
                    label: 'Terminé'
                };
            case 'annulé':
                return {
                    icon: XCircle,
                    bg: 'bg-red-500/20',
                    border: 'border-red-500',
                    text: 'text-red-400',
                    label: 'Annulé'
                };
            case 'en retard':
                return {
                    icon: AlertTriangle,
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500',
                    text: 'text-yellow-400',
                    label: 'En retard'
                };
            default:
                return {
                    icon: Clock,
                    bg: 'bg-gray-500/20',
                    border: 'border-gray-500',
                    text: 'text-gray-400',
                    label: status
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                inline-flex items-center gap-2 px-3 py-1 
                rounded-full border ${config.border} ${config.bg}
                font-medium ${config.text}
                transition-all duration-200
            `}
        >
            <Icon size={14} className="animate-pulse" />
            <span>{config.label}</span>
        </motion.div>
    );
};