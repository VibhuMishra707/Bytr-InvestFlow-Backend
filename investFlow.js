let stocks = [
    { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
    { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
    { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
  ];
  
  let trades = [
    { tradeId: 1, stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' },
    { tradeId: 2, stockId: 2, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' },
    { tradeId: 3, stockId: 3, quantity: 7, tradeType: 'buy', tradeDate: '2024-08-05' },
  ];
  
async function getAllStocks() {
    return {stocks: stocks};
}

async function getStockByTicker(ticker) {
    let stock = stocks.find((stock) => stock.ticker === ticker);        // If 'stock' not found by ticker then `find` method returns undefined object if found it will return the only the first 'object' not 'list'. That's why using return Null if 'stock' is not there
    return stock ? {stock} : {stock : null};
}

async function addNewTrade(newTrade) {
    const insertNewTrade = {tradeId: trades.length + 1, ...newTrade};
    trades.push(insertNewTrade);
    return {newTrade: insertNewTrade};
}

function validateTrade(newTrade) {
    if (!newTrade.stockId || typeof newTrade.stockId !== 'number' || newTrade.stockId < 0) {
        return "Stock Id is required and should be a positive number.";
    }
    if (!newTrade.quantity || typeof newTrade.quantity !== 'number' || newTrade.quantity < 0) {
        return "Quantity is required and should be a positive number.";
    }
    if (!newTrade.tradeType || typeof newTrade.tradeType !== 'string' || !['buy', 'sell'].includes(newTrade.tradeType)) {
        return "Trade Type is required and should be a 'buy' or 'sell' string."
    }
    if (!newTrade.tradeDate || isNaN(Date.parse(newTrade.tradeDate))) {     // When you apply parse method over 'Date' object and if it is valid then output would be returned in number
        return "Trade date is required and should be 'yyyy-mm-dd' format.";
    }
    return null;
}

module.exports = { getAllStocks, getStockByTicker, validateTrade, addNewTrade }