
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useMap } from "@vis.gl/react-google-maps";
import Card from "./Card";
import { MapControl, ControlPosition, useMapsLibrary, } from '@vis.gl/react-google-maps';
import clsx from "clsx";

function RouteOverlay({ polyline, setPolyline, onChange }: {
  polyline: google.maps.Polyline | null;
  setPolyline: (polyline: google.maps.Polyline | null) => void;
  onChange: (distance: number) => void;
}) {
  const map = useMap();


  // run once to create polyline, on map load
  useEffect(() => {
    if (!map) return;

    // Create editable polyline
    const pl = new google.maps.Polyline({
      map,
      path: [],
      editable: true,
      strokeColor: "#4285F4",
      strokeWeight: 4,

    });

    setPolyline(pl);
    const path = pl.getPath();
      // When a point is moved 
      path.addListener("set_at", () => {
        const meters = google.maps.geometry?.spherical.computeLength(pl.getPath());
        if (!meters) return;
        onChange(meters);

      });

      // New point added
      path.addListener("insert_at", () => {
      const meters = google.maps.geometry?.spherical.computeLength(pl.getPath());
      if (!meters) return;
      onChange(meters);

      });

      // Point removed
      path.addListener("remove_at", (index: number) => {

        if (index === 0) {
          onChange(0);
        }
  
      });



    return () => pl.setMap(null);
  }, [map]);

 
  // Add points on click
  useEffect(() => {
    if (!map || !polyline) return;

    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const path = polyline.getPath();
      path.push(e.latLng);  // add latitude and longitude


    });

    const rightClickListener = map.addListener("rightclick", () => {
      if (!polyline) return;
      polyline.getPath().clear();
      
    });

    map.getDiv().addEventListener("keyup", escapeHandler);
    function escapeHandler(e: Event) {
      if (!polyline) return;
      if ((e as KeyboardEvent).key === "Escape") {
        polyline.getPath().clear();
      }
    }

    return () => {
      listener.remove();
      rightClickListener.remove();
      map.getDiv().removeEventListener("keyup", escapeHandler);
    };
  }, [map, polyline]);

  return null;
}

function GeocodingComponent({ query }: { query: string }) {
  const geocodingLib = useMapsLibrary("geocoding");
  const map = useMap();

  useEffect(() => {
    if (!geocodingLib || !map || !query) return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(18);
        console.log('Geocoding results:', results);
      } else {
        console.warn('Geocoding failed:', status);
      }
    });
  }, [geocodingLib, map, query]);

  return null;
}

export default function MapComponent({enabled,onToggle, onChange}: 
  {
    enabled: boolean; 
    onToggle: () => void; 
    onChange: (distance: number) => void}) {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  

  const [searchQuery, setSearchQuery] = useState<string>("Toronto, ON");

  const clearPolyline = () => {
    if (polyline) {
      polyline.getPath().clear();
    }
  };

  const handleAction = useCallback((formData: FormData) => {
    const queryValue = formData.get("query") as string;
    const trimmedQuery = queryValue.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
    }

  }, []);

  const disabledOptions = enabled ? {} : {
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    disableDefaultUI: true,
  };

  return (
    <Card  style={{ width: "100%", height: "100%", }}>
      <div className="flex flex-col h-full">
      <form action={handleAction}  className="mb-8 flex justify-between" >
        <div>
          <label className="label mt-2 ">
            <input  type="checkbox"  className="toggle toggle-success" onChange={onToggle} checked={enabled}/>
            Use Map For Length
          </label>
        </div>
        <div>
          
        
        <label className="input label md:max-w-[15rem] sm:max-w-[10rem] " htmlFor="query">
          <span className="label left"><CiSearch/></span>
          <input disabled={!enabled} name="query" className="input" placeholder="Enter a location" defaultValue={searchQuery} />
        </label>
          <button  disabled={!enabled} type="submit" className="btn ml-2">Search</button>
          </div>
      </form>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
        <div  
        className={clsx("w-full min-h-[300px] sm:w-[400px] md:mx-auto md:w-[90%] md:h-[400px] overflow-hidden rounded-xl", {
          "opacity-20 pointer-events-none": !enabled
        })}>
        <Map
      
          style={{ width: "100%", height: "100%"  }}
          defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
          defaultZoom={18}
          clickableIcons={false}
          mapTypeId="satellite"
          gestureHandling="greedy"
          disableDefaultUI={false}
          {...disabledOptions}

        >
          <MapControl position={ControlPosition.BOTTOM_CENTER}>
            <button
              onClick={clearPolyline}
              id="clear-polyline-button"
              className="bg-white  text-input h-12 w-auto flex items-center justify-center btn rounded shadow text-blue-100 mb-10"
              style={{ color: "black", }}
            >
            <FaTrash className=" text-input"/>
            Clear Points
            </button>
          </MapControl>
          <RouteOverlay polyline={polyline} setPolyline={setPolyline} onChange={onChange} />
          <GeocodingComponent query={searchQuery} />
        </Map>
        </div>
      </APIProvider>
       </div>
    </Card>
  );
}