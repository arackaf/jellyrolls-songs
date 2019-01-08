import connect from "./connect";
import readXls from "read-excel-file/node";

const singers = {
  Michael: 0,
  Jordan: 1,
  Ray: 2,
  Matt: 3,
  Rob: 4,
  Jason: 5,
  Scotty: 6
};

const allSongs = new Map([]);

async function fill() {
  let db = await connect();
  //console.log(typeof db);

  let rows = await readXls("./jellyrolls.xlsx");
  for (let i = 1; i < rows.length; i++) {
    getSongs(rows[i]);
  }

  await db.collection("songs").insertMany([...allSongs.values()]);
  console.log("DONE!!!");
}

function getSongs(row) {
  Object.keys(singers).forEach(singer => {
    let index = singers[singer];
    processSong(row[index], singer);
  });
  processGroupSong(row[7]);
}

function processSong(txt, singer) {
  if (!txt) {
    return;
  }
  let [title, artist] = processSongData(txt);

  let song = allSongs.has(title) ? allSongs.get(title) : { title, artist, singers: [] };
  if (!song.singers) {
    console.log(txt);
  }
  song.singers.push(singer);

  allSongs.set(title, song);
}

function processGroupSong(txt) {
  if (!txt) {
    return;
  }
  let [title, artist] = processSongData(txt);

  let song = { title, artist, group: true };
  allSongs.set(title, song);
}

function processSongData(txt) {
  txt = txt.replace(/(\n|\r)/g, "");
  let artistMatches = txt.match(/\s*\(.*\)/);
  let title = txt;
  let artist = "";

  if (artistMatches && artistMatches.length) {
    artist = artistMatches[0];
    title = title.replace(artist, "");
    artist = artist.replace("(", "").replace(")", "");
  }
  title = title.trim();
  artist = artist.trim();

  return [title, artist];
}

fill();
