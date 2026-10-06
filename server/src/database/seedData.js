const seedReports = [
  {
    id: "REP-1042",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    issueType: "Pothole",
    severity: "Critical",
    confidence: 0.96,
    explanation: "Substantial asphalt cavity (>45cm diameter, 12cm depth) located in active vehicular lane. Poses severe blowout and vehicle suspension hazard.",
    recommendedAction: "Dispatch emergency road crew for asphalt cold-patching and barricade placement within 4 hours.",
    location: "402 Oak Ridge Parkway, Northbound Lane",
    description: "Deep pothole spanning almost the entire right lane right after the bend. Multiple vehicles swerved dangerously into oncoming traffic.",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "REP-1041",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    issueType: "Damaged Road",
    severity: "High",
    confidence: 0.92,
    explanation: "Severe alligator cracking with base subsidence across 15 meters. Water seepage accelerating structural subgrade deterioration.",
    recommendedAction: "Schedule resurfacing and sub-base milling in next municipal maintenance cycle.",
    location: "Industrial Corridor Sector 4, Heavy Truck Route",
    description: "Road surface is breaking apart due to heavy container truck traffic. Large chunks of loose gravel are flying into windshields.",
    status: "In Progress",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "REP-1040",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    issueType: "Overflowing Drain",
    severity: "High",
    confidence: 0.94,
    explanation: "Severe stormwater drain blockage with stagnant urban runoff overflowing onto sidewalk and roadway. Biological & road flooding risk.",
    recommendedAction: "Deploy hydro-vac truck to clear debris and clear downstream culvert obstruction.",
    location: "Corner of Elm St & 5th Avenue, Commercial District",
    description: "Storm drain completely backed up after morning rain. Water pooling 6 inches deep and seeping into pedestrian walkways.",
    status: "Under Review",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: "REP-1039",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    issueType: "Broken Streetlight",
    severity: "Medium",
    confidence: 0.89,
    explanation: "Luminaire fixture detached and wiring exposed on municipal lamppost #44. Dark blind spot created at high-pedestrian intersection.",
    recommendedAction: "Send electrical maintenance team to test circuit, replace LED luminaire and secure pole housing.",
    location: "North Highland Ave, Lamppost #44 near Bus Stop",
    description: "Streetlight has been flickering and completely shut off. The entire bus stop corner is pitch black at night.",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(), // 28 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: "REP-1038",
    image: "https://images.unsplash.com/photo-1584463699047-9759ff8e7b1a?auto=format&fit=crop&w=800&q=80",
    issueType: "Other Infrastructure Issue",
    severity: "Critical",
    confidence: 0.95,
    explanation: "Dislodged stormwater manhole casting with open aperture (>60cm). Imminent catastrophic fall and vehicle axle entrapment risk.",
    recommendedAction: "Deploy immediate emergency hazard barricades and reset heavy cast-iron collar.",
    location: "Central Avenue & 8th Street Intersection",
    description: "Heavy iron manhole cover shifted off position after garbage truck drove over it. Huge hole exposed in the road!",
    status: "In Progress",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "REP-1037",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    issueType: "Damaged Road",
    severity: "Low",
    confidence: 0.88,
    explanation: "Minor surface wear and longitudinal hairline cracking along curb boundary. No immediate structural failure detected.",
    recommendedAction: "Log for preventative crack-sealing emulsion during scheduled quarterly road maintenance.",
    location: "Meadowbrook Residential Loop, West Section",
    description: "Noticeable hair cracks starting to form near the curb gutter.",
    status: "Resolved",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "REP-1036",
    image: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
    issueType: "Pothole",
    severity: "High",
    confidence: 0.93,
    explanation: "Pothole approximately 30cm across situated directly in school bus drop-off zone. Moderate tire damage potential.",
    recommendedAction: "Hot-mix asphalt patch applied and leveled with steam roller.",
    location: "Lincoln Elementary School Entrance, School Lane",
    description: "Pothole directly in the student drop-off queue. School buses bouncing hard over it.",
    status: "Resolved",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

module.exports = seedReports;
