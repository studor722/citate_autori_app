const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
    res.json({
        message: "Printing Quotes API is running...",
        endpoints: {
            quotes: "api/quotes",
            health: "api/health",
        }
    });
    
});

const JSON_SERVER_URL = "http://localhost:5001/api/quotes";

const validateId = (req, res, next) => {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }
    next();
}

const quoteSchema = Joi.object({
    author: Joi.string().min(3).required(),
    quote: Joi.string().min(5).required(),
});


// let quotes = [
//     {id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", image: "steve_jobs.jpg"},
//     {id: 2, text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", image: "albert_einstein.jpg"},
//     {id: 3, text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", image: "winston_churchill.jpg"},
//     {id: 4, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", image: "theodore_roosevelt.jpg"},
//     {id: 5, text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", image: "steve_jobs.jpg"},
//     {id: 6, text: "The best way to predict the future is to invent it.", author: "Alan Kay", image: "alan_kay.jpg"},
//     {id: 7, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", image: "confucius.jpg"},
//     {id: 8, text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", image: "franklin_roosevelt.jpg"},
//     {id: 9, text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", image: "theodore_roosevelt.jpg"},
//     {id: 10, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", image: "eleanor_roosevelt.jpg"},
// ];

// app.get("/api/quotes", (req, res) => {
//     res.status(200).json(quotes);
// });

// app.post("/api/quotes", (req, res) => {
//     const { text, author, image } = req.body;
//     if (!text || !author) {
//         return res.status(400).json({ error: "Text and author are required" });
//     }
//     const newQuote = {
//         id: quotes.length + 1,
//         text,
//         author,
//         image: image || "default.jpg",
//     };
//     quotes.push(newQuote);
//     res.status(201).json(newQuote);
// }
// );

// app.put("/api/quotes/:id", (req, res) => {
//     const quoteId = parseInt(req.params.id);
//     const { text, author, image } = req.body;
//     const quoteIndex = quotes.findIndex(q => q.id === quoteId);
//     if (quoteIndex === -1) {
//         return res.status(404).json({ error: "Quote not found" });
//     }
//     if (!text || !author) {
//         return res.status(400).json({ error: "Text and author are required" });
//     }
//     quotes[quoteIndex] = { id: quoteId, text, author, image: image || quotes[quoteIndex].image };
//     res.status(200).json(quotes[quoteIndex]);
// }
// );

// app.delete("/api/quotes/:id", (req, res) => {   

//     const quoteId = parseInt(req.params.id);

//     const quoteIndex = quotes.findIndex(q => q.id === quoteId);
//     if (quoteIndex === -1) {
//         return res.status(404).json({ error: "Quote not found" });
//     }
//     const deletedQuote = quotes.splice(quoteIndex, 1);
//     res.status(200).json(deletedQuote[0]);
// });

const json_url = path.join(__dirname, "db.json");
let quotes = JSON.parse(fs.readFileSync(json_url, "utf-8")).quotes;
app.get("/api/quotes", (req, res) => {
    res.status(200).json(quotes);
}); 

// app.post("/api/quotes", (req, res) => {
//     const { text, author, image } = req.body;
//     if (!text || !author) {
//         return res.status(400).json({ error: "Text and author are required" });
//     }
//     const newQuote = {
//         id: quotes.length + 1,
//         text,
//         author,
//         image: image || "default.jpg",
//     };
    
//     quotes.push(newQuote);
//     fs.writeFileSync(json_url, JSON.stringify(quotes, null, 2));
//     res.status(201).json(newQuote);
// }
// ); 

// app.put("/api/quotes/:id", (req, res) => {
//     const quoteId = parseInt(req.params.id);
//     const { text, author, image } = req.body;
//     const quoteIndex = quotes.findIndex(q => q.id === quoteId);
//     if (quoteIndex === -1) {
//         return res.status(404).json({ error: "Quote not found" });
//     }
//     if (!text || !author) {
//         return res.status(400).json({ error: "Text and author are required" });
//     }
//     quotes[quoteIndex] = { id: quoteId, text, author, image: image || quotes[quoteIndex].image };
//     fs.writeFileSync(json_url, JSON.stringify(quotes, null, 2));
//     res.status(200).json(quotes[quoteIndex]);
// }
// );

// app.delete("/api/quotes/:id", (req, res) => {

//     const quoteId = parseInt(req.params.id);

//     const quoteIndex = quotes.findIndex(q => q.id === quoteId);
//     if (quoteIndex === -1) {
//         return res.status(404).json({ error: "Quote not found" });
//     }
//     const deletedQuote = quotes.splice(quoteIndex, 1);
//     fs.writeFileSync(json_url, JSON.stringify(quotes, null, 2));
//     res.status(200).json(deletedQuote[0]);
// }
// );

app.get("/" , (req, res) => {
    res.send("Welcome to the Quotes API!");
});

app.get("/api/quotes", async    (req, res) => {
    try {
        const response = await fetch(JSON_SERVER_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch quotes");
        }
        const data = await response.json();
        res.status(200).json(data);
    }

    catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ error: "Failed to fetch quotes" });
    }
}
);

app.post("/api/quotes", async (req, res) => {
    const { text, author, image } = req.body;
    const { error } = quoteSchema.validate({ text, author });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const response = await fetch(JSON_SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, author, image: image || "default.jpg" }),
        });
        if (!response.ok) {
            throw new Error("Failed to create quote");
        }
        const newQuote = await response.json();
        res.status(201).json(newQuote);
    }

    catch (error) {
        console.error("Error creating quote:", error);
        res.status(500).json({ error: "Failed to create quote" });
    }
}
);

app.put("/api/quotes/:id", validateId, async (req, res) => {
    const quoteId = parseInt(req.params.id);
    const { text, author, image } = req.body;
    const { error } = quoteSchema.validate({ text, author });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const response = await fetch(`${JSON_SERVER_URL}/${quoteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, author, image: image || "default.jpg" }),
        });
        if (!response.ok) {
            throw new Error("Failed to update quote");
        }
        const updatedQuote = await response.json();
        res.status(200).json(updatedQuote);
    }

    catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ error: "Failed to update quote" });
    }
}   );

app.delete("/api/quotes/:id", validateId, async (req, res) => {
    const quoteId = parseInt(req.params.id);    

    try {   
        const response = await fetch(`${JSON_SERVER_URL}/${quoteId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete quote");
        }
        res.status(200).json({ message: "Quote deleted successfully" });
    }

    catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ error: "Failed to delete quote" });
    }
}
);
    


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Serving static images from: ${path.join(__dirname, "../images")}`);
}
)