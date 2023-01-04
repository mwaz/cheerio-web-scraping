const request = require("supertest");
const fs = require("fs");
const { generateFilename, saveProductJson } = require("../src/utils");
const server = require("../src/server");

// Build it up, tear it down :)
const cleanTestData = () => {
    // delete the test data directory
    fs.rm("./test-data", { recursive: true }, (err) => {
        if (err) {
            console.log("Error deleting directory", err);
        }
    });
}

// Scraper test suite
describe("scraper", () => {
    // Test unique filename generator (type of test: unit)
    test("generateFilename() returns a string", () => {
        // Assert that the generateFilename function returns a string
        expect(typeof generateFilename()).toBe("string");
        // Assert that the generateFilename function returns a string with a .json extension
        expect(generateFilename()).toMatch(/\.json$/);
    });

    // Test saveProductJson() function (type of test: unit)
    test("saveProductJson() saves a file", async () => {
        // Create a mock products array
        const products = [
            {
                title: "Mock Product",
                price: "99.99",
                link: "https://www.amazon.com/Mock-Product/dp/B07YXJ9XZ8",
            },
        ];
        // Call the saveProductJson function with the mock products array
        const savedProducts = await saveProductJson(products);
        // Assert that the saveProductJson function returns a string
        expect(typeof savedProducts).toBe("string");
        // assert that is returns a path with ./data/ and .json
        expect(savedProducts).toMatch(/^\.\/data\/.*\.json$/);
    });

    // Test the /scrape route (type of test: integration)
    test("POST /scrape returns a 200 status code", async () => {
        // Create a mock request body
        testScrapUrl =
            "https://www.amazon.com/s?k=all+headphones&crid=2TTXQBOK238J3&qid=1667301526&sprefix=all+headphones%2Caps%2C284&ref=sr_pg_1";

        const body = {
            url: testScrapUrl,
        };
        // Make a POST request to the /scrape route
        const response = await request(server).post("/scrape").send(body);
        // Assert that the response status code is 200
        expect(response.statusCode).toBe(200);
        // Assert that the response body has a products property
        expect(response.body).toHaveProperty("products_saved");
    });
});
// close the server and delete the test data directory after all tests have run
afterAll(() => {
    cleanTestData();
    server.close();
});
