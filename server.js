const express = require("express");
const Web3 = require("web3");
const { addresses } = require("./addresses");

const app = express();

const rentAddress = addresses.avalanche.rent;
const rentABI = require("./abis/RentNft.json").abi;

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://api.avax-test.network/ext/bc/C/rpc")
);
const rent = new web3.eth.Contract(rentABI, rentAddress);

app.get("/", (req, res) => {
  res.send("Online!");
});

app.get("/listings", async (req, res) => {
  try {
    const listingCount = await rent.methods.getListingCount().call();

    let listings = [];
    for (let i = 0; i < listingCount; i++) {
      const data = await rent.methods.listings(i).call();
      data.id = i;
      listings.push(data);
    }
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/borrows", async (req, res) => {
  try {
    const borrowCount = await rent.methods.getBorrowCount().call();

    let borrows = [];
    for (let i = 0; i < borrowCount; i++) {
      const data = await rent.methods.borrows(i).call();
      data.id = i;
      borrows.push(data);
    }
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
