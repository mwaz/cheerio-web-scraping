const fs = require("fs");

const generateTitle = (product, link) => {
    // Get the product title
    const title = product
        .find(".a-size-medium.a-color-base.a-text-normal")
        .text();
    // If title is empty
    if (title === "") {
        const urlSegment = link;
        if (typeof urlSegment === "string") {
            const urlSegmentStripped = urlSegment.split("/")[1];
            const title = urlSegmentStripped.replace(/-/g, " ");
            return title;
        }
    }
    return title;
};
// generate unique filenames
const generateFilename = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    // return a string with the date and time as the filename
    const filename = `${year}-${month}-${day}-${hour}-${minute}-${second}.json`;
    return filename;
};

const saveProductJson = (products) => {
    // create a new file with a unique filename, using the generateFilename function
    const filename = generateFilename();
    // JSON.stringify() converts the products array into a string
    const jsonProducts = JSON.stringify(products, null, 2);

    // If env == test create a test data folder, else create a data folder
    const folder = process.env.NODE_ENV === "test" ? "test-data" : "data";
    // create a new folder if it doesn't exist
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    // write the file to the data folder
    fs.writeFileSync(`${folder}/${filename}`, jsonProducts);
    // return the path to the file
    return `./data/${filename}`;
};
// Export the functions
module.exports = {
    generateFilename,
    saveProductJson,
    generateTitle,
};