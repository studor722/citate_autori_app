const BASE_URL = 'http://localhost:5000/api/quotes';


export async function getAllQuotes() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch quotes');
    }
    return await response.json();

}

export async function addQuote(quote) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
    });
    if (!response.ok) {
        throw new Error('Failed to add quote');
    }
    return await response.json();
}

export async function updateQuote(id, quote) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
    });
    if (!response.ok) {
        throw new Error('Failed to update quote');
    }
    return await response.json();
}

export async function deleteQuote(id) {


    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete quote');
    }
    return true;
}
