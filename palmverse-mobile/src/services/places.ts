import Constants from "expo-constants";

const key =
  (Constants.expoConfig?.extra as { googleMapsApiKey?: string })?.googleMapsApiKey ?? "";

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export async function autocompletePlaces(input: string): Promise<PlaceSuggestion[]> {
  if (!input || input.length < 2 || !key) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${key}&types=(cities)`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.predictions ?? []).map((p: { description: string; place_id: string }) => ({
    description: p.description,
    placeId: p.place_id,
  }));
}

export async function getPlaceLatLng(placeId: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  const loc = data.result?.geometry?.location;
  return { lat: loc.lat as number, lng: loc.lng as number, name: data.result.name as string };
}
