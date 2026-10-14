export interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
  previewUrl?: string;
}

interface ITunesSearchResponse {
  results: ITunesTrack[];
}

export async function searchAppleCatalog(
  term: string
): Promise<ITunesTrack[]> {
  const url = new URL("https://" + "itunes.apple.com" + "/search");
  url.searchParams.set("term", term);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "30");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to search Apple's music catalog.");
  }

  const data: ITunesSearchResponse = await response.json();
  return data.results;
}
