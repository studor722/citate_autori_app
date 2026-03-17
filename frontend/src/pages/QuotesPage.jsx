import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import QuoteCard from "../components/QuoteCard";
import { getAllQuotes } from "../api/quotesAPI";

export default function QuotesPage() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchQuotes() {
            try {
                const data = await getAllQuotes();
                setQuotes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchQuotes();
    }, []);

    if (loading) return (<div className="min-h-screen   flex items-center justify-center"><p>Loading...</p></div>);
    if (error) return (<div className="text-brand text-lg font-medium animate-pulse"><p>Error: {error}</p></div>);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quotes</h1>
                <Link to="/add" className="px-4 py-2 bg-green-500   text-white rounded hover:bg-green-600">Add Quote</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotes.map((quote) => (
                    <QuoteCard key={quote.id} quote={quote} />
                ))}
            </div>
        </div>
    );
}