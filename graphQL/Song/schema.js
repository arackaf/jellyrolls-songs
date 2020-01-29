export const type = `
  
  type Song {
    _id: String
    title: String
    artist: String
    group: Boolean
    singers: [String]
  }

  type SongQueryResults {
    Songs: [Song]
    Meta: QueryResultsMetadata
  }

  type SongSingleQueryResult {
    Song: Song
  }

  type SongMutationResult {
    success: Boolean
    Song: Song
  }

  type SongMutationResultMulti {
    success: Boolean
    Songs: [Song]
  }

  type SongBulkMutationResult {
    success: Boolean
  }

  input SongInput {
    _id: String
    title: String
    artist: String
    group: Boolean
    singers: [String]
  }

  input SongMutationInput {
    title: String
    artist: String
    group: Boolean
    singers: [String]
    singers_PUSH: String
    singers_CONCAT: [String]
    singers_UPDATE: StringArrayUpdate
    singers_UPDATES: [StringArrayUpdate]
    singers_PULL: [String]
    singers_ADDTOSET: [String]
  }

  input SongSort {
    _id: Int
    title: Int
    artist: Int
    group: Int
    singers: Int
  }

  input SongFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    title_contains: String
    title_startsWith: String
    title_endsWith: String
    title_regex: String
    title: String
    title_ne: String
    title_in: [String]
    artist_contains: String
    artist_startsWith: String
    artist_endsWith: String
    artist_regex: String
    artist: String
    artist_ne: String
    artist_in: [String]
    group: Boolean
    group_ne: Boolean
    group_in: [Boolean]
    singers_count: Int
    singers_textContains: String
    singers_startsWith: String
    singers_endsWith: String
    singers_regex: String
    singers: [String]
    singers_in: [[String]]
    singers_contains: String
    singers_containsAny: [String]
    singers_ne: [String]
    OR: [SongFilters]
  }
  
`;
  
  
export const mutation = `

  createSong (
    Song: SongInput
  ): SongMutationResult

  updateSong (
    _id: String,
    Updates: SongMutationInput
  ): SongMutationResult

  updateSongs (
    _ids: [String],
    Updates: SongMutationInput
  ): SongMutationResultMulti

  updateSongsBulk (
    Match: SongFilters,
    Updates: SongMutationInput
  ): SongBulkMutationResult

  deleteSong (
    _id: String
  ): Boolean

`;


export const query = `

  allSongs (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    title_contains: String,
    title_startsWith: String,
    title_endsWith: String,
    title_regex: String,
    title: String,
    title_ne: String,
    title_in: [String],
    artist_contains: String,
    artist_startsWith: String,
    artist_endsWith: String,
    artist_regex: String,
    artist: String,
    artist_ne: String,
    artist_in: [String],
    group: Boolean,
    group: Boolean,
    group_ne: Boolean,
    group_in: [Boolean],
    singers_count: Int,
    singers_textContains: String,
    singers_startsWith: String,
    singers_endsWith: String,
    singers_regex: String,
    singers: [String],
    singers_in: [[String]],
    singers_contains: String,
    singers_containsAny: [String],
    singers_ne: [String],
    OR: [SongFilters],
    SORT: SongSort,
    SORTS: [SongSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): SongQueryResults

  getSong (
    _id: String
  ): SongSingleQueryResult

`;
  
