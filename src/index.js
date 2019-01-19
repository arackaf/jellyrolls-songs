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
  state = { title: "", singers: [], group: false };
  singersPendingState = [];
  groupPending = false;

  search = evt => {
    evt.preventDefault();
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

  render() {
    let { title, singers, group } = this.state;
    return (
      <GraphQL
        query={{
          loadSongs: buildQuery(SONG_QUERY, { title: title || void 0, singers: !group && singers.length ? singers : void 0, group: group || void 0 })
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
              </div>
            </div>
            <div className="form-inline">
              <div className="form-group">
                <SingerToggle singer="Ray" onChange={this.singerToggle} />
                <SingerToggle singer="Scotty" onChange={this.singerToggle} />
                <SingerToggle singer="Jordan" onChange={this.singerToggle} />
              </div>
            </div>
            <br />
            <div className="form-inline" style={{ marginBottom: "5px" }}>
              <div className="form-group">
                <input ref={el => (this.title = el)} className="form-control" style={{ width: "150px", marginRight: "5px" }} placeholder="Song" />
                <SingerToggle singer="Include Group" onChange={this.toggleGroup} />
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
        <div className="checkbox" style={{}}>
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
