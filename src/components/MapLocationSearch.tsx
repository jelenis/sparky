import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface MapLocationSearchProps {
  query: string;
}

export default function MapLocationSearch({ query }: MapLocationSearchProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !query) return;

    // use the places api to search for the location
    // this is more robust than geocoding alone
    fetch(`https://places.googleapis.com/v1/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_KEY,
        'X-Goog-FieldMask': 'places.formatted_address,places.location',
      },
      body: JSON.stringify({
        "textQuery": query,
      }),
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error requesting place ${res.status}`);
        }
        return res.json();
    })
      .then(data => {
        const { places } = data;
        if (!places.length) return;

        console.log("Search places:", places);
        const location = places[0].location;
        // they have a differnt nameing convention
        // in the places api
        map.setCenter({ lat: location.latitude, lng: location.longitude });
        map.setZoom(18);
      }).catch(err => {
        console.error("Query error:", err);
      });

  }, [map, query]);

  return null;
}