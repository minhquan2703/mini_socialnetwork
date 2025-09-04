import { useEffect, useState } from "react";

export const useChatStore = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/messages');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, error, fetchMessages };
}