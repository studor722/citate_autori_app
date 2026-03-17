export default function QuoteCard({ quote, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <img src={quote.image} alt={quote.author} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{quote.author}</h2>
                <p className="text-gray-700 mb-4">{quote.text}</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => onEdit(quote)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => onDelete(quote.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
            </div>
        </div>  
    );
}