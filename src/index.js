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
  state = { title: "" };

  search = evt => {
    evt.preventDefault();
    this.setState({ title: this.title.value });
  };

  render() {
    let { title } = this.state;
    return (
      <div style={{ padding: "5px" }}>
        <form className="form-inline">
          <div className="form-group">
            <input ref={el => (this.title = el)} className="form-control padd-input" id="exampleInputName2" placeholder="Song" />
            <SingerToggle singer="Michael" onChange={this.singerToggle} />
            <SingerToggle singer="Matt" onChange={this.singerToggle} />
            <SingerToggle singer="Rob" onChange={this.singerToggle} />
            <SingerToggle singer="Jason" onChange={this.singerToggle} />
            <SingerToggle singer="Ray" onChange={this.singerToggle} />
            <SingerToggle singer="Scotty" onChange={this.singerToggle} />
            <SingerToggle singer="Jordan" onChange={this.singerToggle} />
          </div>

          <button onClick={this.search} className="btn btn-default">
            Go
          </button>
        </form>
        <br />
        <GraphQL
          query={{
            loadSongs: buildQuery(SONG_QUERY, { title: title || void 0 })
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
      </div>
    );
  }
}

class SingerToggle extends Component {
  render() {
    return (
      <div className="form-group" style={{ marginRight: "15px" }}>
        <div className="checkbox" style={{}}>
          <label>
            <input onChange={evt => this.props.onChange(evt.target.checked)} type="checkbox" /> {this.props.singer}
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
