import React, { Component } from "react";
import { render } from "react-dom";

import "./css/bootstrap/css/bootstrap.min.css";

import SONG_QUERY from "./graphql/mainQuery.graphql";
import { setDefaultClient, Client, GraphQL, buildQuery } from "micro-graphql-react";

const client = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(client);

class Main extends Component {
  render() {
    return (
      <GraphQL
        query={{
          loadSongs: buildQuery(SONG_QUERY, { title: "dr" })
        }}
      >
        {({ loadSongs: { loading, loaded, data, error } }) => (
          <div>
            {loading ? <span>Loading...</span> : null}
            {loaded && data && data.allSongs ? <DisplaySongs songs={data.allSongs.Songs} /> : null}
            <br />
          </div>
        )}
      </GraphQL>
    );
  }
}

class DisplaySongs extends Component {
  render() {
    let { songs } = this.props;
    return (
      <div style={{ padding: "5px" }}>
        <table className="table table-condensed table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Singers</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song => (
              <tr>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.singers && song.singers.length ? song.singers.join(", ") : ""}</td>
                <td>{song.group ? "Yes" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

render(<Main />, document.getElementById("main"));
