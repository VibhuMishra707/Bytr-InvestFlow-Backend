const request = require('supertest');
const http = require('http');

const { app } = require('../index.js');

const { getAllStocks, getStockByTicker, validateTrade, addNewTrade } = require('../investFlow.js');

jest.mock('../investFlow.js', () => ({
    ...jest.requireActual('../investFlow.js'),      // Load the actual implementation
/*  --- Chat GPT - 4O ---
    When you mock a module with `jest.mock`, Jest replaces the entire module with mocked versions of its exports. If you still want to access the real implementation for certain parts of the module, `jest.requireActual` allows you to do so.
*/

    getAllStocks: jest.fn(),        // Mock only this function
    getStockByTicker: jest.fn(),
    validateTrade: jest.fn(),
    addNewTrade: jest.fn()
}));

let server;

beforeAll(async () => {     // '(done)' is not required if function calls are async
    server = http.createServer(app);
    server.listen(3001);
});

afterAll(async () => {
    server.close();
});


// ------------------------------------ //
//          Function Testing            //
// ------------------------------------ //
describe("Function testing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("getAllStocks should return all the stocks", async () => {
        const mockStocks = {
            "stocks": [
                {
                    "stockId": 1,
                    "ticker": "AAPL",
                    "companyName": "Apple Inc.",
                    "price": 150.75
                },
                {
                    "stockId": 2,
                    "ticker": "GOOGL",
                    "companyName": "Alphabet Inc.",
                    "price": 2750.1
                },
                {
                    "stockId": 3,
                    "ticker": "TSLA",
                    "companyName": "Tesla, Inc.",
                    "price": 695.5
                }
            ]
        };

          getAllStocks.mockResolvedValue(mockStocks);

          const result = await getAllStocks();

          expect(getAllStocks).toHaveBeenCalled();
          expect(getAllStocks).toHaveBeenCalledTimes(1);
          expect(result).toEqual({
            "stocks": [
                {
                    "stockId": 1,
                    "ticker": "AAPL",
                    "companyName": "Apple Inc.",
                    "price": 150.75
                },
                {
                    "stockId": 2,
                    "ticker": "GOOGL",
                    "companyName": "Alphabet Inc.",
                    "price": 2750.1
                },
                {
                    "stockId": 3,
                    "ticker": "TSLA",
                    "companyName": "Tesla, Inc.",
                    "price": 695.5
                }
            ]
        });
    });

    it("getStockByTicker should return stock By Ticker", async () => {
        const mockStock = {
            "stock": {
                "stockId": 2,
                "ticker": "GOOGL",
                "companyName": "Alphabet Inc.",
                "price": 2750.1
            }
        }

        getStockByTicker.mockResolvedValue(mockStock);

        const result = await getStockByTicker('GOOGL');

        expect(getStockByTicker).toHaveBeenCalled();
        expect(getStockByTicker).toHaveBeenCalledTimes(1);
        expect(getStockByTicker).toHaveBeenCalledWith('GOOGL');
        expect(result).toEqual({
            "stock": {
                "stockId": 2,
                "ticker": "GOOGL",
                "companyName": "Alphabet Inc.",
                "price": 2750.1
            }
        });
    });

    it("addNewTrade should return newTrade which is inserted", async () => {
        const mockNewTrade = {
            "newTrade": {
                "stockId": 1,
                "quantity": 15,
                "tradeType": "buy",
                "tradeDate": "2024-08-08"
            }
        };

            addNewTrade.mockResolvedValue(mockNewTrade);

            const result = await addNewTrade({
            "stockId": 1,
            "quantity": 15,
            "tradeType": "buy",
            "tradeDate": "2024-08-08"
            });

            expect(addNewTrade).toHaveBeenCalled();
            expect(addNewTrade).toHaveBeenCalledTimes(1);
            expect(addNewTrade).toHaveBeenCalledWith({
            "stockId": 1,
            "quantity": 15,
            "tradeType": "buy",
            "tradeDate": "2024-08-08"
            });
            expect(result).toEqual({
            "newTrade": {
                "stockId": 1,
                "quantity": 15,
                "tradeType": "buy",
                "tradeDate": "2024-08-08"
            }
        });
    });  
});

// ------------------------------------ //
//             API Testing              //
// ------------------------------------ //
describe("API testing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("GET API /stocks Should retrive All Stocks", async () => {
        const mockStocks = {
            "stocks": [
                {
                    "stockId": 1,
                    "ticker": "AAPL",
                    "companyName": "Apple Inc.",
                    "price": 150.75
                },
                {
                    "stockId": 2,
                    "ticker": "GOOGL",
                    "companyName": "Alphabet Inc.",
                    "price": 2750.1
                },
                {
                    "stockId": 3,
                    "ticker": "TSLA",
                    "companyName": "Tesla, Inc.",
                    "price": 695.5
                }
            ]
        };
          
          getAllStocks.mockResolvedValue(mockStocks);

          let result = await request(server).get("/stocks");
          
          expect(result.statusCode).toBe(200);
          expect(result.body).toEqual({
            "stocks": [
                {
                    "stockId": 1,
                    "ticker": "AAPL",
                    "companyName": "Apple Inc.",
                    "price": 150.75
                },
                {
                    "stockId": 2,
                    "ticker": "GOOGL",
                    "companyName": "Alphabet Inc.",
                    "price": 2750.1
                },
                {
                    "stockId": 3,
                    "ticker": "TSLA",
                    "companyName": "Tesla, Inc.",
                    "price": 695.5
                }
            ]
        });
    });

    it("GET API /stocks/GOOGL Should retrive stock by Ticker", async () => {
        const mockStock = {
            "stock": {
                "stockId": 2,
                "ticker": "GOOGL",
                "companyName": "Alphabet Inc.",
                "price": 2750.1
            }
        };

        getStockByTicker.mockResolvedValue(mockStock);

        let result = await request(server).get("/stocks/GOOGL");

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({
            "stock": {
                "stockId": 2,
                "ticker": "GOOGL",
                "companyName": "Alphabet Inc.",
                "price": 2750.1
            }
        });
    });

    it("POST API /trades/new Should retrieve new trade added", async() => {
        const mockNewTrade = {
            "newTrade": {
                "stockId": 1,
                "quantity": 15,
                "tradeType": "buy",
                "tradeDate": "2024-08-08"
            }
        };

        addNewTrade.getResolvedValue(mockNewTrade);

        let result = await request(server).post('/trades/new').send({
            "stockId": 1,
            "quantity": 15,
            "tradeType": "buy",
            "tradeDate": "2024-08-08"
          });

          expect(result.statusCode).toBe(201);
          expect(result.body).toEqual({
            "newTrade": {
                "stockId": 1,
                "quantity": 15,
                "tradeType": "buy",
                "tradeDate": "2024-08-08"
            }
        });
    });
});

// ------------------------------------ //
//          API Error Testing           //
// ------------------------------------ //
describe("API Error Testing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("GET API /stocks should return 404 if no stocks found", async() => {
        getAllStocks.mockResolvedValue({ stocks: [] });

        let result = await request(server).get('/stocks');
        expect(result.status).toBe(404);
    });

    it("GET API /stocks/MSFT should return 404 if no stock found", async() => {
        getStockByTicker.mockResolvedValue({ stock : null });

        let result = await request(server).get('/stocks/MSFT');
        expect(result.statusCode).toBe(404);
    });
});


// ------------------------------------ //
//        API Validation Testing        //
// ------------------------------------ //
describe("API Data Validation Testing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return 400 for not passing stockId", async () => {
        let response = await request(server).post('/trades/new').send({
            "quantity": 15,
            "tradeType": "buy",
            "tradeDate": "2024-08-08"
          });
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual("Stock Id is required and should be a positive number.");
    });

    it("Should return 400 for not passing quantity", async() => {
        let response = (await request(server).post('/trades/new')).send({
            "stockId": 1,
            "tradeType": "buy",
            "tradeDate": "2024-08-08"
          });
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual("Quantity is required and should be a positive number.");
    });

    it("Should return 400 for passing invalid tradeType", async() => {
        let response = await request(server).post('/trades/new').send({
                "stockId": 1,
                "quantity": 15,
                "tradeType": "buying",
                "tradeDate": "2024-08-08"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Trade Type is required and should be a 'buy' or 'sell' string.");
    });

    it("Should return 400 for invalid tradeDate", async() => {
        let response = await request(server).post('/trades/new').send({
            "stockId": 1,
            "quantity": 15,
            "tradeType": "buy",
            "tradeDate": "2nd-Jan-2020"
          });
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual("Trade date is required and should be 'yyyy-mm-dd' format.");
    });
});