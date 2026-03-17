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

const JSON_SERVER_URL = "http://localhost:3000/quotes";

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

const json_url = path.join(__dirname, "db.json");
let quotes = JSON.parse(fs.readFileSync(json_url, "utf-8"));

app.get("/api/quotes", (req, res) => {
    res.status(200).json(quotes);
});

app.get("/" , (req, res) => {
    res.send("Welcome to the Quotes API!");
});

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