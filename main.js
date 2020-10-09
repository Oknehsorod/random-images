const axios = require("axios");
const fs = require("fs");

function getRandElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function genHash() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const upAlphabet = alphabet.toUpperCase();

  const variants = [alphabet, upAlphabet];

  let hash = "";
  for (let i = 0; i < 5; i += 1) {
    const type = getRandElement(variants);
    hash += getRandElement(type.split(""));
  }
  return hash;
}

async function downloadImage(url, id, folder) {
  const response = await axios.get(url, {
    responseType: "stream",
  });

  if (response.request.res.responseUrl !== "https://i.imgur.com/removed.png") {
    const writer = fs.createWriteStream("./" + folder + "/" + id + ".jpg");
    response.data.pipe(writer);
    return true;
  } else {
    return false;
  }
}

const argv = process.argv.slice(2);
const count = argv[0] || 10;
const treat = argv[1] || 10;

async function loop(c) {
  if (c === 0) {
    return;
  }
  const id = genHash();
  const url = "https://i.imgur.com/" + id + ".jpg";
  const result = await downloadImage(url, id, "imgs");
  if (result) {
    loop(c - 1);
  } else {
    loop(c);
  }
}

console.info("Running: Count: " + count + " Streams: " + treat);
try {
  fs.mkdirSync("./imgs")
} catch(e) {}
for (let i = 0; i < treat; i += 1) {
  loop(Math.floor(count / treat));
}
