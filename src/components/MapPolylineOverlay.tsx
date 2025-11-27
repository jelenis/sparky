/**
 * Draws and manages a polyline overlay on the Google Map.
 * Updates the URL search parameters
 */

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useSearchParams } from "react-router-dom";

interface MapPolylineOverlayProps {
  polyline: google.maps.Polyline | null;
  setPolyline: (polyline: google.maps.Polyline | null) => void;
}

export default function MapPolylineOverlay({ polyline, setPolyline }: MapPolylineOverlayProps) {
  const map = useMap();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse path from URL
  const pathParam = searchParams.get("path");
  const pathFromUrl = pathParam ? JSON.parse(decodeURIComponent(pathParam)) : [];

  // mount and revalidate the distance from the path 
  const updateUrlWithPath = (pathArray: google.maps.LatLngLiteral[], distance: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      // if no path, remove param from the URL
      if (pathArray.length === 0) {
        next.delete("path");
        next.set("length", "0.00");
      } else {

        // otherwise set the path and distance
        next.set("path", encodeURIComponent(JSON.stringify(pathArray)));
        next.set("length", distance.toFixed(2));
      }
      return next;
    });
  };

  const getPathArray = (path: google.maps.MVCArray<google.maps.LatLng>) => {
    return [...path.getArray()].map(latlng => ({ lat: latlng.lat(), lng: latlng.lng() }));
  }

  // side effect to for other path changes
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

  // side effect for polyline path changes
  useEffect(() => {
    if (!polyline || !map) return;
    const path = polyline.getPath();

    const deletePathAndDistance = () => {
      // clear path and distance from url
      updateUrlWithPath([], 0);
    };

    const updatePathAndDistance = () => {
      console.log("Path updated");
      const pathArray = getPathArray(path);
      const distance = google.maps.geometry.spherical.computeLength(path);
      updateUrlWithPath(pathArray, distance);
    };

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
  }, [map, polyline]);

  return null;
}