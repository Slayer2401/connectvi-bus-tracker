import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Clock, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { customBusRoutes, liveBuses } from "@/data/busData";

const Index = () => {
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
                Track your bus in real-time with precise GPS location updates every 5 seconds. 
                Never miss your ride again.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="lg" asChild className="shadow-glow">
                <Link to="/map">
                  Track My Bus
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/routes">
                  View Routes
                </Link>
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-bus-live">{activeBuses}</div>
                <div className="text-sm text-muted-foreground">Live Buses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalRoutes}</div>
                <div className="text-sm text-muted-foreground">Routes</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-stop-marker">5s</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Real-Time Transit Tracking
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced GPS technology meets intuitive design for the ultimate bus tracking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Live Updates</h3>
                <p className="text-muted-foreground">
                  Real-time GPS tracking with position updates every 5 seconds for accurate arrival predictions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8 text-center">
                <div className="bg-bus-live/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-bus-live" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Smart Routes</h3>
                <p className="text-muted-foreground">
                  Comprehensive route information with all stops, schedules, and operating hours.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8 text-center">
                <div className="bg-stop-marker/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-stop-marker" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Always Reliable</h3>
                <p className="text-muted-foreground">
                  Robust system designed for 99.9% uptime with redundant tracking capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Routes Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Available Routes
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from our comprehensive network of city bus routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {customBusRoutes.map((route) => (
              <Card key={route.id} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{route.name}</h3>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: route.color }}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {route.frequency}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {route.intermediateStops.length + 2} stops
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="default" size="lg" asChild>
              <Link to="/routes">
                View All Routes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              Start Tracking Your Bus Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of commuters who never miss their bus with our real-time tracking system.
            </p>
            <Button variant="hero" size="lg" asChild className="shadow-glow">
              <Link to="/map">
                Track Live Buses Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;