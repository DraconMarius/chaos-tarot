// meaning & data sources: 
/*
Labyrinthos
https://labyrinthos.co/blogs/tarot-card-meanings-list

*/

const db = require("../config/connection");
const { Tarot } = require("../models");
const tarotData = require("./tarotData.json");
//seed the db. delete existing db every time we seed
db.once("open", async () => {
  try {
    await Tarot.deleteMany({});

    await Tarot.create(tarotData);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("tarotDB seeded!");
  process.exit(0);
});
