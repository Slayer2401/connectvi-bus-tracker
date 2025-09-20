import { Button } from "@/components/ui/button";
import { Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { customBusRoutes, liveBuses } from "@/data/busData";
import { useTranslation } from "react-i18next";
import RouteFinder from "@/components/RouteFinder"; // Import the new component

const Index = () => {
  const { t } = useTranslation();
  const activeBuses = liveBuses.length;
  const totalRoutes = customBusRoutes.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Bus className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-button bg-clip-text text-transparent">
                ConnectVI
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("tagline")}
              </p>
            </div>
            
            <RouteFinder /> {/* Add the new component here */}

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-bus-live">{activeBuses}</div>
                <div className="text-sm text-muted-foreground">{t("live_buses")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalRoutes}</div>
                <div className="text-sm text-muted-foreground">{t("routes")}</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-stop-marker">5s</div>
                <div className="text-sm text-muted-foreground">{t("updates")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;