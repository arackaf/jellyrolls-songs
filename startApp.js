console.log("HELLO WORLD");

import connect from "./connect";

async function fill() {
  let db = await connect();
  console.log(typeof db);
}

fill();
