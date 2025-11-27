import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import Card from "./Card";
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import clsx from "clsx";
import FullScreenWrapper from "./FullScreenWrapper";
import MapPolylineOverlay from "./MapPolylineOverlay";
import MapLocationSearch from "./MapLocationSearch";

interface MapComponentProps {
  enabled: boolean;
  onToggle: () => void;
}

/**
 * Interactive Google Maps component with polyline drawing and location search capabilities.
 * Supports fullscreen mode and URL-based state persistence.
 */
export default function MapComponent({ enabled, onToggle }: MapComponentProps) {
  // Component state
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("Toronto, ON");
  const [isFull, setIsFull] = useState(false);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 43.6532, lng: -79.3832 });
  const [zoom, setZoom] = useState<number>(12);
  const [isResizing, setIsResizing] = useState(true);
  const map = useMap();

  /**
   * Clears all points from the polyline
   */
  const clearPolyline =() => {
    if (polyline) {
      polyline.getPath().clear();
    }
  };

  /**
   * Handles location search form submission
   */
  const handleAction = (formData: FormData) => {
    const queryValue = formData.get("query") as string;
    const trimmedQuery = queryValue.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
    }
  };

  // Map configuration options based on enabled state
  const options = {
    draggable: enabled,
    zoomControl: enabled,
    scrollwheel: enabled,
    rotateControl: false,
    cameraControl: false,
    disableDoubleClickZoom: true,
    // Fullscreen control is manually implemented to work with mobile devices
    fullscreenControl: false,
  };

  /**
   * Handles initial map load and zoom setting.
   * Uses 'tilesloaded' event as a proxy for map readiness since there's no direct load event.
   */
  useEffect(() => {
    if (!map) return;

    const tilesLoadedListener = map.addListener("tilesloaded", () => {
      tilesLoadedListener?.remove();
      map.setZoom(zoom);
      setIsResizing(false);
    });

    return () => {
      tilesLoadedListener?.remove();
    };
  }, [map, zoom]);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <div className="flex flex-col h-full">
        {/* Search form and controls */}
        <form action={handleAction} className="mb-8 sm:flex justify-between">
          <div className="mb-5 sm:mb-0">
            <label className="label mt-2">
              <input 
                type="checkbox" 
                name="checkbox" 
                defaultChecked={enabled} 
                className="toggle toggle-success" 
                onChange={onToggle} 
              />
              Use Map For Length
            </label>
          </div>
          <div className="flex justify-between">
            <label className="input label sm:max-w-60 max-w-3/4" htmlFor="query">
              <span className="label left"><CiSearch /></span>
              <input 
                disabled={!enabled} 
                name="query" 
                className="input" 
                placeholder="Toronto, ON" 
              />
            </label>
            <button disabled={!enabled} type="submit" className="btn ml-2">
              Search
            </button>
          </div>
        </form>

        {/* Map container */}
        <div className={clsx(
          "w-full min-h-[300px] md:mx-auto md:w-[98%] md:h-[400px] overflow-hidden rounded-xl",
          !enabled && "opacity-20 pointer-events-none"
        )}>
          <FullScreenWrapper 
            isFull={isFull} 
            onExit={() => {
              // Capture zoom level on exit
              setZoom(map?.getZoom() ?? zoom);
              setIsResizing(true);
              setIsFull(false);
            }}
          >
            {/* Loading indicator */}
            {isResizing && (
              <div className="flex h-full justify-center items-center">
                <span className="text-4xl skeleton skeleton-text">
                  Loading Google Maps...
                </span>
              </div>
            )}

            {/* Google Map */}
            <Map
              style={{ 
                width: "100%", 
                height: "100%", 
                opacity: isResizing ? 0 : 1 
              }}
              center={center}
              clickableIcons={false}
              defaultZoom={zoom}
              mapTypeId="hybrid"
              gestureHandling="greedy"
              onCenterChanged={e => setCenter(e.detail.center)}
              {...options}
            >
              {/* Clear points button */}
              <MapControl position={ControlPosition.BOTTOM_CENTER}>
                <button
                  onClick={clearPolyline}
                  id="clear-polyline-button"
                  className="btn-map text-gray-700 h-12 w-auto flex items-center justify-center btn rounded shadow mb-10"
                >
                  <FaTrash className="text-input" />
                  Clear Points
                </button>
              </MapControl>

              {/* Fullscreen toggle button */}
              <MapControl position={ControlPosition.TOP_RIGHT}>
                {!isFull && (
                  <button
                    type="button"
                    onClick={() => {
                      // Capture zoom level on enter
                      setZoom(map?.getZoom() ?? zoom);
                      setIsResizing(true);
                      setIsFull(true);
                    }}
                    className="btn-map btn text-gray-700 absolute right-3 top-3"
                  >
                    ⤢ {/* TODO: replace with react icon */}
                  </button>
                )}
              </MapControl>

              {/* Map overlays */}
              {enabled && (
                <MapPolylineOverlay
                  polyline={polyline}
                  setPolyline={setPolyline}
                />
              )}
              <MapLocationSearch query={searchQuery} />
            </Map>
          </FullScreenWrapper>
        </div>
      </div>
    </Card>
  );
}