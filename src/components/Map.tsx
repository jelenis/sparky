import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback, use } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import Card from "./Card";
import { MapControl, ControlPosition, useMapsLibrary, } from '@vis.gl/react-google-maps';
import clsx from "clsx";
import { ServerRouter, useSearchParams } from "react-router-dom";
import FullScreenWrapper from "./FullScreenWrapper";


function RouteOverlay({ polyline, setPolyline }: {
  polyline: google.maps.Polyline | null;
  setPolyline: (polyline: google.maps.Polyline | null) => void;
}) {
  const map = useMap();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse path from URL
  const pathParam = searchParams.get("path");
  const pathFromUrl = pathParam ? JSON.parse(decodeURIComponent(pathParam)) : [];

  // mount and revalidate the distance from the path 
  const updateUrlWithPath = (pathArray: google.maps.LatLngLiteral[], distance: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (pathArray.length === 0) {
        next.delete("path");
        next.set("length", "0.00");
      } else {
        next.set("path", encodeURIComponent(JSON.stringify(pathArray)));
        next.set("length", distance.toFixed(2));
      }
      return next;
    });
  };

  const getPathArray = (path: google.maps.MVCArray<google.maps.LatLng>) => {
    return [...path.getArray()].map(latlng => ({ lat: latlng.lat(), lng: latlng.lng() }));
  }

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
  }, [map, pathFromUrl, setPolyline,]);

  // Separate effect for setting up event listeners
  // sets the search params and distance on path change
  // should not run if the map is disabled since it will over-write 
  // the path distance over the user input
  useEffect(() => {
    if (!polyline || !map) return;
    const path = polyline.getPath();

    const deletePathAndDistance = () => {
      updateUrlWithPath([], 0);
    };

    const updatePathAndDistance = () => {
      console.log("Path updated");
      const pathArray = getPathArray(path);
      const distance = google.maps.geometry.spherical.computeLength(path);
      updateUrlWithPath(pathArray, distance);
    };

    console.log("Setting up polyline listeners");
    const addListener = path.addListener("insert_at", updatePathAndDistance);
    const setListener = path.addListener("set_at", updatePathAndDistance);
    const removeListener = path.addListener("remove_at", deletePathAndDistance);

    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const path = polyline.getPath();
      path.push(e.latLng);
      updatePathAndDistance();
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
      google.maps.event.removeListener(addListener);
      google.maps.event.removeListener(setListener);
    };
  }, [map, polyline, setSearchParams, updateUrlWithPath, getPathArray]);


  return null;
}

function TextSearchComponent({ query }: { query: string }) {
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
      .then(res => res.json())
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

export default function MapComponent({ enabled, onToggle }:
  {
    enabled: boolean;
    onToggle: () => void;
  }) {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("Toronto, ON");
  const [isFull, setIsFull] = useState(false);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 43.6532, lng: -79.3832 });
  const [zoom, setZoom] = useState<number>(12);
  const map = useMap()

  const clearPolyline = useCallback(() => {
    if (polyline) {
      polyline.getPath().clear();
    }
  }, [polyline]);

  const handleAction = (formData: FormData) => {
    console.log(enabled);
    const queryValue = formData.get("query") as string;
    const trimmedQuery = queryValue.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
    }
  };



  const options = {
    draggable: enabled,
    zoomControl: enabled,
    scrollwheel: enabled,
    rotateControl: false,
    cameraControl: false,
    disableDoubleClickZoom: true,
    // full screen control is manually implemented
    // to work with mobile devices
    fullscreenControl: false,
  };

  // this fires only once when the map loads
  // since there is no map load event exposed, we
  // listen for tilesloaded which only fires once 
  useEffect(() => {
    const tilesLoadedListener = map?.addListener("tilesloaded", () => {
      tilesLoadedListener?.remove();
      map.setZoom(zoom);
    });

    return () => {
      tilesLoadedListener?.remove();
    }
  }, [map]);


  return (
    <Card style={{ width: "100%", height: "100%", }}>
      <div className="flex flex-col h-full">
        <form action={handleAction} className="mb-8 sm:flex justify-between" >
          <div className="mb-5 sm:mb-0">
            <label className="label mt-2 ">
              <input type="checkbox" name="checkbox" defaultChecked={enabled} className="toggle toggle-success" onChange={onToggle} />
              Use Map For Length
            </label>
          </div>
          <div className="flex justify-between">
            <label className="input label sm:max-w-60 max-w-3/4" htmlFor="query">
              <span className="label left"><CiSearch /></span>
              <input disabled={!enabled} name="query" className="input" placeholder="Toronto, ON" />
            </label>
            <button disabled={!enabled} type="submit" className="btn ml-2">Search</button>
          </div>
        </form>
        <div
          className={
            clsx("w-full min-h-[300px]  md:mx-auto md:w-[98%] md:h-[400px] overflow-hidden rounded-xl", 
              !enabled ? "opacity-20 pointer-events-none": "")
          }>

          <FullScreenWrapper isFull={isFull} 
          onExit={() => {
            // capture zoom level on exit
            setZoom(map?.getZoom() ?? zoom);
            setIsFull(false);
          }}>
            <Map

              style={{ width: "100%", height: "100%" }}
              center={center}
              clickableIcons={false}
              defaultZoom={zoom}
              mapTypeId="hybrid"
              gestureHandling="greedy"

              onCenterChanged={e => setCenter(e.detail.center)}
              // defaultBounds={bounds ? bounds : undefined}
              onZoomChanged={e => {

                // setZoom(e.detail.zoom);
                // console.log("zoom changed:", e.detail.bounds, "ignoreCount:", ignoreCount);

              }}

              {...options}
            >
              <MapControl position={ControlPosition.BOTTOM_CENTER}>
                <button
                  onClick={clearPolyline}
                  id="clear-polyline-button"
                  className=" btn-map text-gray-700 h-12 w-auto flex items-center justify-center btn rounded shadow mb-10"
                >
                  <FaTrash className=" text-input" />
                  Clear Points
                </button>
              </MapControl>
              <MapControl position={ControlPosition.TOP_RIGHT}>
                {!isFull && (
                  <button
                    type="button"
                    onClick={() => {
                      // capture zoom level on enter
                      setZoom(map?.getZoom() ?? zoom);
                      setIsFull(true)
                    }}
                    className="btn-map btn text-gray-700 absolute right-3 top-3 "
                  >
                    ⤢ {/* TODO replace with react icon */}
                  </button>
                )}
              </MapControl>
              {enabled && <RouteOverlay
                polyline={polyline}
                setPolyline={setPolyline}
              />}
              <TextSearchComponent query={searchQuery} />
            </Map>
          </FullScreenWrapper>
        </div>

      </div>
    </Card>
  );
}