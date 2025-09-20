import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Bus, Map as MapIcon, Languages, LogIn, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navigation = ({ isLoggedIn, onLogout }: NavigationProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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