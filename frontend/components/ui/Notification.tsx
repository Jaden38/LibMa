// components/ui/Notification.tsx
import React from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div className={`p-4 rounded ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
      {message}
    </div>
  );
};

export default Notification;