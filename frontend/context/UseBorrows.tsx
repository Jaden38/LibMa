import { useEffect, useState, useMemo } from 'react';
import { IBorrow, IBook, ISample } from '@/types';
import { fetchBorrows, fetchBooks, fetchSamples } from '@/api';

export function useBorrows() {
    const [borrowRequests, setBorrowRequests] = useState<IBorrow[]>([]);
    const [books, setBooks] = useState<IBook[]>([]);
    const [samples, setSamples] = useState<ISample[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [borrowsData, booksData, samplesData] = await Promise.all([
                fetchBorrows(),
                fetchBooks(),
                fetchSamples()
            ]);
            setBorrowRequests(borrowsData);
            setBooks(booksData);
            setSamples(samplesData);
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const bookMap = useMemo(() => {
        const map: { [key: number]: IBook } = {};
        for (const b of books) {
            map[b.id] = b;
        }
        return map;
    }, [books]);

    const sampleMap = useMemo(() => {
        const map: { [key: number]: ISample } = {};
        for (const s of samples) {
            map[s.id] = s;
        }
        return map;
    }, [samples]);

    return {
        borrowRequests,
        setBorrowRequests,
        books,
        loading,
        error,
        refetch: loadData,
        bookMap,
        sampleMap
    };
}
