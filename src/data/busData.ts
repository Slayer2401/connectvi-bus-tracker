export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface BusRoute {
  id: string;
  name: string;
  color: string;
  startPoint: string;
  endPoint: string;
  intermediateStops: string[];
  operatingHours: string;
  frequency: string; 
  timings: { from: string; to: string; departure: string; arrival: string }[];
}

export interface Bus {
  id: string;
  routeId: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  lastUpdate: string;
  nextStop: string;
}

export const busStops: BusStop[] = [
  { id: "stop-1", name: "Amravati Bus Stand", lat: 20.9367, lng: 77.7786, routes: ["route-1", "route-2"] },
  { id: "stop-2", name: "Rajkamal", lat: 20.9321, lng: 77.7523, routes: ["route-1", "route-2", "route-3"] },
  { id: "stop-3", name: "Rajapeth", lat: 20.9242, lng: 77.7596, routes: ["route-1"] },
  { id: "stop-4", name: "Nawathe", lat: 20.9125, lng: 77.7684, routes: ["route-1"] },
  { id: "stop-5", name: "Sai Nagar", lat: 20.9023, lng: 77.7781, routes: ["route-1", "route-2", "route-3"] },
  { id: "stop-6", name: "Old Town, Badnera Rly.", lat: 20.8845, lng: 77.7984, routes: ["route-1", "route-2", "route-3", "route-4"] },
  { id: "stop-7", name: "Amravati University", lat: 20.9287, lng: 77.7472, routes: ["route-2"] },
  { id: "stop-8", name: "Biyani Sqr", lat: 20.9315, lng: 77.7501, routes: ["route-2"] },
  { id: "stop-9", name: "Amt Bus Stand", lat: 20.9358, lng: 77.7769, routes: ["route-2"] },
  { id: "stop-10", name: "Navsari", lat: 20.9528, lng: 77.7483, routes: ["route-3"] },
  { id: "stop-11", name: "Panchawati", lat: 20.9451, lng: 77.7512, routes: ["route-3"] },
  { id: "stop-12", name: "Irwin Sq.", lat: 20.9389, lng: 77.7547, routes: ["route-3"] },
  { id: "stop-13", name: "PRMIT&R, Badnera", lat: 20.8901, lng: 77.7882, routes: ["route-4"] },
];

export const customBusRoutes: BusRoute[] = [
  {
    id: "route-1",
    name: "Amravati Bus Stand - Old Town, Badnera",
    color: "#3b82f6",
    startPoint: "Amravati Bus Stand",
    endPoint: "Old Town, Badnera Rly.",
    intermediateStops: ["Rajkamal", "Rajapeth", "Nawathe", "Sai Nagar"],
    operatingHours: "06:50 AM - 06:25 PM",
    frequency: "Varies",
    timings: [
      { from: "Amravati Bus Stand", to: "Old Town, Badnera", departure: "06:50 AM", arrival: "07:15 AM" },
      { from: "Amravati Bus Stand", to: "Old Town, Badnera", departure: "06:55 AM", arrival: "07:20 AM" },
      { from: "Amravati Bus Stand", to: "Old Town, Badnera", departure: "07:00 AM", arrival: "07:25 AM" },
      { from: "Amravati Bus Stand", to: "Old Town, Badnera", departure: "10:00 AM", arrival: "10:30 AM" },
      { from: "Amravati Bus Stand", to: "Old Town, Badnera", departure: "10:15 AM", arrival: "10:45 AM" },
      { from: "Old Town, Badnera", to: "Amravati Bus Stand", departure: "02:15 PM", arrival: "02:40 PM" },
      { from: "Old Town, Badnera", to: "Amravati Bus Stand", departure: "02:25 PM", arrival: "02:50 PM" },
      { from: "Old Town, Badnera", to: "Amravati Bus Stand", departure: "02:45 PM", arrival: "03:10 PM" },
      { from: "Old Town, Badnera", to: "Amravati Bus Stand", departure: "05:35 PM", arrival: "06:05 PM" },
      { from: "Old Town, Badnera", to: "Amravati Bus Stand", departure: "05:55 PM", arrival: "06:25 PM" },
    ]
  },
  {
    id: "route-2", 
    name: "Amravati University - Old Town, Badnera",
    color: "#22c55e",
    startPoint: "Amravati University",
    endPoint: "Old Town, Badnera",
    intermediateStops: ["Biyani Sqr", "Amt Bus Stand", "Rajkamal", "Sai Nagar"],
    operatingHours: "06:35 AM - 06:05 PM",
    frequency: "Varies",
    timings: [
      { from: "Amravati University", to: "Old Town, Badnera", departure: "06:35 AM", arrival: "07:20 AM" },
      { from: "Amravati University", to: "Old Town, Badnera", departure: "09:30 AM", arrival: "10:15 AM" },
      { from: "Amravati University", to: "Old Town, Badnera", departure: "09:45 AM", arrival: "10:30 AM" },
      { from: "Old Town, Badnera", to: "Amravati University", departure: "02:05 PM", arrival: "02:50 PM" },
      { from: "Old Town, Badnera", to: "Amravati University", departure: "02:35 PM", arrival: "03:20 PM" },
      { from: "Old Town, Badnera", to: "Amravati University", departure: "05:20 PM", arrival: "06:05 PM" },
    ]
  },
  {
    id: "route-3",
    name: "Navsari - Old Town Badnera",
    color: "#f59e0b",
    startPoint: "Navsari",
    endPoint: "Old Town Badnera",
    intermediateStops: ["Panchawati", "Irwin Sq.", "Rajkamal", "Sai Nagar"],
    operatingHours: "06:30 AM - 06:25 PM",
    frequency: "Varies",
    timings: [
      { from: "Navsari", to: "Old Town, Badnera", departure: "06:30 AM", arrival: "07:05 AM" },
      { from: "Navsari", to: "Old Town, Badnera", departure: "06:55 AM", arrival: "07:30 AM" },
      { from: "Navsari", to: "Old Town, Badnera", departure: "09:45 AM", arrival: "10:20 AM" },
      { from: "Navsari", to: "Old Town, Badnera", departure: "10:00 AM", arrival: "10:35 AM" },
      { from: "Old Town, Badnera", to: "Navsari", departure: "02:05 PM", arrival: "02:40 PM" },
      { from: "Old Town, Badnera", to: "Navsari", departure: "02:15 PM", arrival: "02:50 PM" },
      { from: "Old Town, Badnera", to: "Navsari", departure: "05:35 PM", arrival: "06:10 PM" },
      { from: "Old Town, Badnera", to: "Navsari", departure: "05:50 PM", arrival: "06:25 PM" },
    ]
  },
  {
    id: "route-4",
    name: "College Bus Service",
    color: "#ef4444",
    startPoint: "PRMIT&R, Badnera",
    endPoint: "Old Town Badnera",
    intermediateStops: [],
    operatingHours: "07:00 AM - 03:00 PM",
    frequency: "Varies (Free of Cost)",
    timings: [
      { from: "PRMIT&R, Badnera", to: "Old Town Badnera", departure: "07:00 AM", arrival: "07:30 AM" },
      { from: "PRMIT&R, Badnera", to: "Old Town Badnera", departure: "10:30 AM", arrival: "11:00 AM" },
      { from: "Old Town Badnera", to: "PRMIT&R, Badnera", departure: "02:30 PM", arrival: "03:00 PM" },
    ]
  }
];

export const liveBuses: Bus[] = [
  {
    id: "bus-1",
    routeId: "route-1",
    lat: 20.9367,
    lng: 77.7786,
    heading: 45,
    speed: 25,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-2"
  },
  {
    id: "bus-2", 
    routeId: "route-2",
    lat: 20.9287,
    lng: 77.7472,
    heading: 180,
    speed: 15,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-8"
  },
  {
    id: "bus-3",
    routeId: "route-3", 
    lat: 20.9528,
    lng: 77.7483,
    heading: 270,
    speed: 30,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-11"
  },
  {
    id: "bus-4",
    routeId: "route-4",
    lat: 20.8901,
    lng: 77.7882,
    heading: 90,
    speed: 20,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-6"
  }
];