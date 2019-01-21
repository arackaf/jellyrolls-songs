import React, { Component } from "react";
import { render } from "react-dom";

import "./css/bootstrap/css/bootstrap.css";

import SONG_QUERY from "./graphql/mainQuery.graphql";
import { setDefaultClient, Client, GraphQL, buildQuery } from "micro-graphql-react";

const client = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(client);

class Main extends Component {
  state = { title: "", singers: [], group: false };
  singersPendingState = [];
  groupPending = false;

  search = evt => {
    this.setState({ title: this.title.value, group: this.groupPending, singers: [...new Set(this.singersPendingState)] });
  };

  singerToggle = (name, add) => {
    if (add) {
      this.singersPendingState.push(name);
    } else {
      this.singersPendingState = this.singersPendingState.filter(singer => singer != name);
    }
  };

  toggleGroup = (_, add) => {
    this.groupPending = add;
  };

  keyDown = evt => {
    if (evt.keyCode == 13) {
      this.search();
    }
  };

  render() {
    let { title, artist, singers, group } = this.state;
    title = title.replace(/’/g, "'");

    let multiArtistRegex = /artist:"(.+)"/i;
    let singleArtistRegex = /artist:\s+(\S+)/i;

    let multiArtist = title.match(multiArtistRegex);
    if (multiArtist) {
      let [wholeMatch, artistFilter] = multiArtist;
      artist = artistFilter;
      title = title.replace(wholeMatch, "");
    } else {
      let singleArtist = title.match(singleArtistRegex);
      if (singleArtist) {
        let [wholeMatch, artistFilter] = singleArtist;
        artist = artistFilter.trim();
        title = title.replace(wholeMatch, "");
      }
    }

    title = title.trim();

    return (
      <GraphQL
        query={{
          loadSongs: buildQuery(SONG_QUERY, {
            title: title || void 0,
            singers: !group && singers.length ? singers : void 0,
            group: group || void 0,
            artist: artist || void 0
          })
        }}
      >
        {({ loadSongs: { loading, loaded, data, error } }) => (
          <div style={{ padding: "5px" }}>
            <div className="form-inline">
              <div className="form-group">
                <SingerToggle singer="Michael" onChange={this.singerToggle} />
                <SingerToggle singer="Matt" onChange={this.singerToggle} />
                <SingerToggle singer="Rob" onChange={this.singerToggle} />
                <SingerToggle singer="Jason" onChange={this.singerToggle} />
                <SingerToggle singer="Ray" onChange={this.singerToggle} />
                <SingerToggle singer="Scotty" onChange={this.singerToggle} />
                <SingerToggle singer="Jordan" onChange={this.singerToggle} />
              </div>
            </div>
            <br />
            <div className="form-inline" style={{ marginTop: "15px" }}>
              <div className="form-group">
                <input
                  ref={el => (this.title = el)}
                  onKeyDown={this.keyDown}
                  className="form-control"
                  style={{ width: "200px", marginRight: "5px" }}
                  placeholder="Song"
                />
                <SingerToggle regularSize={true} singer="Group?" onChange={this.toggleGroup} />
                <button onClick={this.search} className="btn btn-default">
                  Go
                </button>
              </div>
            </div>
            <div>
              {loaded && data && data.allSongs ? <DisplaySongs songs={data.allSongs.Songs} /> : null}
              <br />
            </div>
          </div>
        )}
      </GraphQL>
    );
  }
}

class SingerToggle extends Component {
  render() {
    return (
      <div className="form-group" style={{ marginRight: "5px" }}>
        <div className={`checkbox ${this.props.regularSize ? "" : "checkbox-small"}`} style={{}}>
          <label>
            <input onChange={evt => this.props.onChange(this.props.singer, evt.target.checked)} type="checkbox" /> {this.props.singer}
          </label>
        </div>
      </div>
    );
  }
}

class DisplaySongs extends Component {
  render() {
    let { songs } = this.props;
    return (
      <div>
        <table className="table table-condensed table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Singers</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song => (
              <tr>
                <td>
                  {song.title}
                  <br />
                  <i>{song.artist}</i>
                </td>
                <td>{song.group ? "Group" : song.singers && song.singers.length ? song.singers.join(", ") : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

render(<Main />, document.getElementById("main"));
