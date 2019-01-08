import GraphQLJSON from 'graphql-type-json';

import Song, { Song as SongRest } from './Song/resolver';

const { Query: SongQuery, Mutation: SongMutation } = Song;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    SongQuery
  ),
  Mutation: Object.assign({},
    SongMutation
  ),
  Song: {
    ...SongRest
  }
};

