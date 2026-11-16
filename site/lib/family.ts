export type FamilyApp = {
  key: string;
  name: string;
  url: string;
  tagline: string;
};

export const familyApps: FamilyApp[] = [
  { key: "fuel", name: "Fuel Gauge", url: "https://fuelgauge.app", tagline: "Know if you'll make it to reset" },
  { key: "spare", name: "Spare", url: "https://spareformac.com", tagline: "See what's using your Mac" },
  { key: "disk", name: "Disk Forecast", url: "https://diskforecast.com", tagline: "Know before your Mac runs out of space" },
  { key: "oil", name: "Midnight Oil", url: "https://midnightoil.app", tagline: "Keep your Mac awake" },
  { key: "wifi", name: "WiFi or ISP", url: "https://wifiorisp.com", tagline: "Is slow internet your Wi-Fi or your ISP?" },
  { key: "green", name: "Green Room", url: "https://greenroomformac.com", tagline: "Check your camera, mic, and speakers" },
  { key: "hand", name: "On Hand", url: "https://onhandformac.com", tagline: "Copy it once. Find it again." },
  { key: "coat", name: "Coat Check", url: "https://coatcheckformac.com", tagline: "Reach the menu bar icons the notch hides" },
];
