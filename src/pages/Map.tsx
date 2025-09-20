import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Navigation } from "lucide-react";
import { busStops, customBusRoutes, liveBuses, Bus } from "@/data/busData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom icon for the live bus markers
const busIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1idXMiPjxwYXRoIGQ9Ik04IDhINEMyLjkgOCAyIDkgMiAxMHYxMGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWMTAwIDAgMCAwIDE4IDEwdi0yaC00WiIgLz48cGFhdGggZD0iTTE4IDIwaDRhMSAxIDAgMCAwIDEtMXYtM2ExIDEgMCAwIDAtMS0xaC00WiIgLz48Y2lyY2xlIGN4PSI2IiBjeT0iMTgiIHI9IjIiIC8+PGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMiIgLz48cGFhdGggZD0iTSA0IDEySDIwIiAvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  className: "bg-bus-live rounded-full p-1 shadow-lg"
});

const tileLayers = {
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};


const Map = () => {
  const [searchParams] = useSearchParams();
  const routeFilter = searchParams.get("route");
  const fromStop = searchParams.get("from");
  const toStop = searchParams.get("to");
  const { t } = useTranslation();
  const [buses, setBuses] = useState<Bus[]>(liveBuses);
  const [mapType, setMapType] = useState<"light" | "dark" | "satellite">("light");
  
  const selectedRoutes = routeFilter 
    ? customBusRoutes.filter(route => route.id === routeFilter)
    : (fromStop && toStop)
    ? customBusRoutes.filter(route => {
        const routeStops = [route.startPoint, ...route.intermediateStops, route.endPoint];
        return routeStops.includes(fromStop) && routeStops.includes(toStop);
    })
    : customBusRoutes;
    
  const filteredBuses = selectedRoutes.length < customBusRoutes.length
    ? buses.filter(bus => selectedRoutes.some(route => route.id === bus.routeId))
    : buses;
    
  const getRouteInfo = (routeId: string) => {
    return customBusRoutes.find(route => route.id === routeId);
  };
  
  // Simulate live bus updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => ({
        ...bus,
        lat: bus.lat + (Math.random() - 0.5) * 0.001,
        lng: bus.lng + (Math.random() - 0.5) * 0.001,
        speed: Math.max(5, Math.min(35, bus.speed + (Math.random() - 0.5) * 10)),
        lastUpdate: new Date().toISOString()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mapCenter: LatLngExpression = [20.92, 77.77];
  const currentTileLayer = tileLayers[mapType];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-button bg-clip-text text-transparent">
            {fromStop && toStop ? `Routes from ${fromStop} to ${toStop}` : "Live Bus Tracking"}
          </h1>
          <p className="text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-bus-live">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Buses ({filteredBuses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[250px] overflow-y-auto">
                {filteredBuses.length > 0 ? filteredBuses.map((bus) => {
                  const route = getRouteInfo(bus.routeId);
                  const nextStop = busStops.find(stop => stop.id === bus.nextStop);
                  return (
                    <div key={bus.id} className="p-3 bg-muted rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          style={{ backgroundColor: route?.color }}
                          className="text-white"
                        >
                          {route?.name}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {t("next_stop")}: {nextStop?.name}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(bus.lastUpdate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                }) : <p className="text-muted-foreground text-sm">No live buses found.</p>}
              </CardContent>
            </Card>

            {selectedRoutes.length === 1 && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {t("bus_schedule")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[250px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("from")}</TableHead>
                        <TableHead>{t("departure")}</TableHead>
                        <TableHead>{t("arrival")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRoutes[0].timings.map((timing, index) => (
                        <TableRow key={index}>
                          <TableCell>{timing.from}</TableCell>
                          <TableCell>{timing.departure}</TableCell>
                          <TableCell>{timing.arrival}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
             <div className="mb-4">
              <ToggleGroup 
                type="single" 
                defaultValue="light"
                onValueChange={(value: "light" | "dark" | "satellite") => {
                  if (value) setMapType(value);
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="light">{t("light")}</ToggleGroupItem>
                <ToggleGroupItem value="dark">{t("dark")}</ToggleGroupItem>
                <ToggleGroupItem value="satellite">{t("satellite")}</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
              <div className="h-[600px] relative">
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    key={mapType} // Add key to force re-render on map type change
                    url={currentTileLayer.url}
                    attribution={currentTileLayer.attribution}
                  />
                  
                  {/* Display All Stops */}
                  {busStops.map(stop => (
                    <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                      <Popup>{stop.name}</Popup>
                    </Marker>
                  ))}

                  {/* Display Routes */}
                  {selectedRoutes.map(route => {
                    const allStops = [route.startPoint, ...route.intermediateStops, route.endPoint];
                    const startIndex = fromStop ? allStops.indexOf(fromStop) : 0;
                    
                    const routeSegment = startIndex !== -1 ? allStops.slice(startIndex) : allStops;
                    
                    const positions = routeSegment
                      .map(stopName => busStops.find(s => s.name === stopName))
                      .filter(Boolean)
                      .map(stop => [stop!.lat, stop!.lng] as LatLngExpression);

                    return <Polyline key={route.id} positions={positions} color={route.color} />;
                  })}

                  {/* Display Live Buses */}
                  {filteredBuses.map(bus => (
                    <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
                      <Popup>
                        <strong>{getRouteInfo(bus.routeId)?.name}</strong>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;