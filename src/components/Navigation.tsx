import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, Map as MapIcon, Route, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { customBusRoutes } from "@/data/busData";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectRoute = (routeId: string, customName?: string) => {
    setOpen(false);
    const routePath = customName 
      ? `/map?route=${routeId}&from=${encodeURIComponent(customName.split(' - ')[0])}`
      : `/map?route=${routeId}`;
    navigate(routePath);
  };

  const getFilteredRoutes = () => {
    if (!searchQuery) return [];

    const lowercasedQuery = searchQuery.toLowerCase();
    const results = new Map<string, { id: string; name: string }>();

    customBusRoutes.forEach(route => {
      // Match route name, start point, or end point
      if (
        route.name.toLowerCase().includes(lowercasedQuery) ||
        route.startPoint.toLowerCase().includes(lowercasedQuery) ||
        route.endPoint.toLowerCase().includes(lowercasedQuery)
      ) {
        results.set(route.id, { id: route.id, name: route.name });
      }

      // Match intermediate stops
      route.intermediateStops.forEach(stop => {
        if (stop.toLowerCase().includes(lowercasedQuery)) {
          const dynamicRouteName = `${stop} - ${route.endPoint}`;
          results.set(`${route.id}-${stop}`, { id: route.id, name: dynamicRouteName });
        }
      });
    });

    return Array.from(results.values());
  };

  const navItems = [
    { to: "/", icon: Bus, label: "Home" },
    { to: "/map", icon: MapIcon, label: "Live Map" },
  ];

  return (
    <nav className="bg-card border-b border-border backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-button bg-clip-text text-transparent">
              ConnectVI
            </span>
          </Link>

          <div className="flex-1 flex justify-center px-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-md justify-start text-muted-foreground rounded-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find and track your bus...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Start typing to search for a route..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {searchQuery && (
                      <CommandGroup heading="Suggestions">
                        {getFilteredRoutes().map((route) => (
                          <CommandItem
                            key={route.name}
                            onSelect={() => handleSelectRoute(route.id, route.name)}
                          >
                            <Route className="mr-2 h-4 w-4" />
                            <span>{route.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    <CommandEmpty>No results found.</CommandEmpty>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "default" : "ghost"}
                size="sm"
                asChild
                className="transition-smooth hover:shadow-button"
              >
                <Link to={to} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;