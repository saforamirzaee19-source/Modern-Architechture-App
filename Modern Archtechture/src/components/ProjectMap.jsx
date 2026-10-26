import { useEffect, useRef } from "react";
import L from "leaflet";

// Small leaflet map used by the dashboard and "Find Site" page.
const icon = (active) =>
  L.divIcon({
    className: "site-marker-wrap",
    html: `<span class="site-marker${active ? " active" : ""}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

export default function ProjectMap({
  projects,
  height = 380,
  satellite = false,
  selectedId,
  onSelect,
}) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const markers = useRef(new Map());

  useEffect(() => {
    map.current = L.map(el.current, { scrollWheelZoom: false }).setView(
      [34.545, 69.17],
      12,
    );
    layer.current = L.layerGroup().addTo(map.current);
    return () => map.current.remove();
  }, []);

  useEffect(() => {
    const m = map.current;
    m.eachLayer((l) => l instanceof L.TileLayer && m.removeLayer(l));
    const url = satellite
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(url, {
      maxZoom: 19,
      attribution: satellite ? "Tiles © Esri" : "© OpenStreetMap",
    }).addTo(m);
  }, [satellite]);

  useEffect(() => {
    layer.current.clearLayers();
    markers.current.clear();
    projects.forEach((p) => {
      const mk = L.marker([p.lat, p.lng], { icon: icon(p.id === selectedId) })
        .bindPopup(`<strong>${p.name}</strong><br/>${p.kind}<br/>${p.area}`)
        .on("click", () => onSelect?.(p.id));
      mk.addTo(layer.current);
      markers.current.set(p.id, mk);
    });
    if (projects.length)
      map.current.fitBounds(
        L.latLngBounds(projects.map((p) => [p.lat, p.lng])),
        { padding: [40, 40], maxZoom: 14 },
      );
  }, [projects, selectedId]);

  useEffect(() => {
    const mk = markers.current.get(selectedId);
    if (mk) {
      map.current.flyTo(mk.getLatLng(), 14, { duration: 0.6 });
      mk.openPopup();
    }
  }, [selectedId]);

  useEffect(() => {
    setTimeout(() => map.current?.invalidateSize(), 0);
  }, [height]);

  return (
    <div
      ref={el}
      className="project-map"
      style={{ height }}
      aria-label="Map of project sites"
    />
  );
}
