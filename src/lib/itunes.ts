export interface ITunesAlbum {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  collectionViewUrl?: string;
  releaseDate?: string;
  trackCount?: number;
}

interface ITunesSearchResponse {
  results: ITunesAlbum[];
}

export async function searchAppleAlbums(
  term: string
): Promise<ITunesAlbum[]> {
  const url = new URL("https://" + "itunes.apple.com" + "/search");
  url.searchParams.set("term", term);
  url.searchParams.set("entity", "album");
  url.searchParams.set("limit", "30");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to search Apple's music catalog.");
  }

  const data: ITunesSearchResponse = await response.json();
  return data.results;
}
