import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Bus, Map as MapIcon, Route, Search, Languages, LogIn, LogOut } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { customBusRoutes } from "@/data/busData";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navigation = ({ isLoggedIn, onLogout }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
      if (
        route.name.toLowerCase().includes(lowercasedQuery) ||
        route.startPoint.toLowerCase().includes(lowercasedQuery) ||
        route.endPoint.toLowerCase().includes(lowercasedQuery)
      ) {
        results.set(route.id, { id: route.id, name: route.name });
      }
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
    { to: "/", icon: Bus, label: t("home") },
    { to: "/map", icon: MapIcon, label: t("live_map") },
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
                  {t("find_bus")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("find_bus")}
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
                    <CommandEmpty>{searchQuery ? "No results found." : "Start typing to search for a route."}</CommandEmpty>
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

            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("hi")}>हिन्दी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;