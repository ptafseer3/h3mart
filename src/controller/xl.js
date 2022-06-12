const xlReader = require("xlsx");
const axios = require("axios");

var product_price = [];
var product_data = [];
var file = xlReader.readFile(
  "D:\\Web Devlopment\\h3mart\\src\\controller\\product_list.xlsx"
);

async function getPrice(data) {
  return await axios
    .get(`https://api.storerestapi.com/products/${data}`)
    .then((res) => {
      product_price.push({
        product_code: data,
        price: `${res.data.data.price}`,
      });
    });
}

async function caller() {
  product_price = [];
  product_data = [];
  file = xlReader.readFile(
    "D:\\Web Devlopment\\h3mart\\src\\controller\\product_list.xlsx"
  );
  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = xlReader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      product_data.push(res);
    });
  }
  product_data.map(async (data) => {
    await getPrice(data.product_code);
  });
  return product_price;
}

module.exports = caller;
