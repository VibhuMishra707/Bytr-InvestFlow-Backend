const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const { getAllStocks, getStockByTicker, addNewTrade, validateTrade } = require('./investFlow.js');

app.get('/', (req, res) => {
    res.send("Welcome to Invest Flow - Stock Trading Project");
});

app.get('/stocks', async (req, res) => {
    try {
        let result = await getAllStocks();
        if (result.stocks.length === 0) {
            return res.status(404).json({message: "No Stocks Found!"});
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});

    }
});

app.get('/stocks/:ticker', async (req, res) => {
    try {
        let ticker = req.params.ticker;
        if (!ticker) {
            return res.status(400).json({message: "Ticker should be a string."});
        }
        let result = await getStockByTicker(ticker);
        if (!result.stock) {
            return res.status(404).json({message: "No Stock Found!"})
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

app.post('/trades/new', async (req, res) => {
    try {
        let newTrade = req.body;
        let error = validateTrade(newTrade);
        if (error) return res.status(400).json({message: error});
        let result = await addNewTrade(newTrade);       // without `await` // {}
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found!" });
});     // Default Endpoint If required page not found!

module.exports = { app };