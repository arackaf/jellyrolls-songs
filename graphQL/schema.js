import { query as SongQuery, mutation as SongMutation, type as SongType } from './Song/schema';
    
export default `
  scalar JSON

  type QueryResultsMetadata {
    count: Int
  }

  input StringArrayUpdate {
    index: Int,
    value: String
  }

  input IntArrayUpdate {
    index: Int,
    value: Int
  }

  input FloatArrayUpdate {
    index: Int,
    value: Float
  }

  ${SongType}

  type Query {
    ${SongQuery}
  }

  type Mutation {
    ${SongMutation}
  }

`