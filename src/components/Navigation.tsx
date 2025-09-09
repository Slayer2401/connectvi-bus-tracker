import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, Map, Route } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Bus, label: "Home" },
    { to: "/routes", icon: Route, label: "Routes" },
    { to: "/map", icon: Map, label: "Live Map" },
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