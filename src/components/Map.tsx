import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useMap } from "@vis.gl/react-google-maps";
import Card from "./Card";
import { MapControl, ControlPosition, useMapsLibrary, } from '@vis.gl/react-google-maps';
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
function RouteOverlay({ polyline, setPolyline, onChange, enabled }: {
  polyline: google.maps.Polyline | null;
  setPolyline: (polyline: google.maps.Polyline | null) => void;
  onChange: (distance: number) => void;
  enabled: boolean;
}) {
  const map = useMap();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse path from URL
  const pathParam = searchParams.get("path");
  const pathFromUrl = pathParam ? JSON.parse(decodeURIComponent(pathParam)) : [];
  // run once to create polyline, on map load
  useEffect(() => {
    if (!map) return;

    // Create editable polyline
    const pl = new google.maps.Polyline({
      map,
      path: pathFromUrl,
      editable: true,
      strokeColor: "#4285F4",
      strokeWeight: 4,
    });

    setPolyline(pl);

    return () => pl.setMap(null);
  }, [map, pathFromUrl]);

  // Separate effect for setting up event listeners
  // sets the search params and distance on path change
  // should not run if the map is disabled since it will over-write 
  // the path distance over the user input
  useEffect(() => {
    if (!polyline || !map || !enabled) return;
    const path = polyline.getPath();


    const deletePathAndDistance = () => {
      // Update URL
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete("path");
        next.set("length", "0.00");
        return next;
      });
    };


    const removeListener = path.addListener("remove_at", deletePathAndDistance);
    
    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const path = polyline.getPath();
      path.push(e.latLng);  
      // Update URL
      setSearchParams(prev => {
        console.log("Current prev:", prev.toString());
        const next = new URLSearchParams(prev);
        const pathArray = [...path.getArray()]
          .map(latlng => ({ lat: latlng.lat(), lng: latlng.lng() }));
        next.set("path", encodeURIComponent(JSON.stringify(pathArray)));
        next.set("length", google.maps.geometry.spherical.computeLength(path).toFixed(2));
        console.log("Updated next:", next.toString());
        return next;
      });
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
      google.maps.event.removeListener(removeListener);
    };
  }, [map, polyline, enabled, setSearchParams]);

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
        
      } else {
        
      }
    });
  }, [geocodingLib, map, query]);

  return null;
}

export default function MapComponent({enabled, onToggle, onChange, pathPoints}: 
  {
    enabled: boolean; 
    onToggle: () => void; 
    onChange: (distance: number) => void;
    pathPoints?: google.maps.LatLngLiteral[];
 
  }) {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  
  const pathFromUrl = pathPoints || [];
  
  const [searchQuery, setSearchQuery] = useState<string>("Toronto, ON");

  const clearPolyline = useCallback(() => {
    if (polyline) {
      polyline.getPath().clear();
    }
  }, [polyline]);

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
          
        
        <label className="input label md:max-w-60 sm:max-w-40" htmlFor="query">
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
              className="bg-white text-gray-700 h-12 w-auto flex items-center justify-center btn rounded shadow mb-10"
              style={{ color: "black", }}
            >
            <FaTrash className=" text-input"/>
            Clear Points
            </button>
          </MapControl>
          <RouteOverlay 
            polyline={polyline} 
            setPolyline={setPolyline} 
            onChange={onChange} 
            enabled={enabled}
          />
          <GeocodingComponent query={searchQuery} />
        </Map>
        </div>
      </APIProvider>
       </div>
    </Card>
  );
}