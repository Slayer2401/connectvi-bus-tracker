import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Navigation } from "lucide-react";
import { busStops, customBusRoutes, liveBuses, Bus } from "@/data/busData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Custom icon for the live bus markers
const busIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1idXMiPjxwYXRoIGQ9Ik04IDhINEMyLjkgOCAyIDkgMiAxMHYxMGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWMTAwIDAgMCAwIDE4IDEwdi0yaC00WiIgLz48cGF0aCBkPSJNMTggMjBoNGExIDEgMCAwIDAgMS0xdi0zYTEgMSAwIDAgMC0xLTFoLTRaIiAvPjxjaXJjbGUgY3g9IjYiIGN5PSIxOCIgcj0iMiIgLz48Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSIyIiAvPjxwYXRoIGQ9Ik00IDEySDIwIiAvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  className: "bg-bus-live rounded-full p-1 shadow-lg"
});

const tileLayers = {
  default: {
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
  const [buses, setBuses] = useState<Bus[]>(liveBuses);
  const [mapType, setMapType] = useState<"default" | "satellite">("default");
  
  // Filter data based on route
  const selectedRoute = routeFilter 
    ? customBusRoutes.find(route => route.id === routeFilter)
    : null;
    
  const filteredBuses = routeFilter 
    ? buses.filter(bus => bus.routeId === routeFilter)
    : buses;
    
  const filteredStops = routeFilter && selectedRoute
    ? busStops.filter(stop => 
        stop.name === selectedRoute.startPoint || 
        stop.name === selectedRoute.endPoint || 
        selectedRoute.intermediateStops.includes(stop.name)
      )
    : busStops;

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
            {selectedRoute ? `${selectedRoute.name} - Live Map` : "Live Bus Tracking"}
          </h1>
          <p className="text-muted-foreground">
            Real-time bus positions updated every 5 seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Live Buses Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-bus-live">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Buses ({filteredBuses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredBuses.map((bus) => {
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
                        <span className="text-xs text-muted-foreground">
                          {bus.speed.toFixed(0)} km/h
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          Next: {nextStop?.name}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(bus.lastUpdate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
             <div className="mb-4">
              <ToggleGroup 
                type="single" 
                defaultValue="default"
                onValueChange={(value: "default" | "satellite") => {
                  if (value) setMapType(value);
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="default">Default</ToggleGroupItem>
                <ToggleGroupItem value="satellite">Satellite</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
              <div className="h-[600px] relative">
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url={currentTileLayer.url}
                    attribution={currentTileLayer.attribution}
                  />
                  
                  {/* Display Stops */}
                  {filteredStops.map(stop => (
                    <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                      <Popup>{stop.name}</Popup>
                    </Marker>
                  ))}

                  {/* Display Routes */}
                  {(selectedRoute ? [selectedRoute] : customBusRoutes).map(route => {
                    const positions = [
                      busStops.find(s => s.name === route.startPoint),
                      ...route.intermediateStops.map(stopName => busStops.find(s => s.name === stopName)),
                      busStops.find(s => s.name === route.endPoint)
                    ]
                    .filter(Boolean)
                    .map(stop => [stop!.lat, stop!.lng] as LatLngExpression);

                    return <Polyline key={route.id} positions={positions} color={route.color} />;
                  })}

                  {/* Display Live Buses */}
                  {filteredBuses.map(bus => (
                    <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
                      <Popup>
                        <strong>{getRouteInfo(bus.routeId)?.name}</strong><br/>
                        Speed: {bus.speed.toFixed(0)} km/h
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