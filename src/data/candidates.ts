/**
 * Seed data transcribed from the Porsche Boxster Candidate Ledger
 * (2026-08-16 initial capture). Every field traces to that note; anything
 * the ledger did not state is left as an "unknown" evidence fact rather than
 * invented. See docs/DATA_IMPORT.md for how later search runs should update
 * this file (or, once automated, the store it seeds).
 */
import { buildCandidate } from "./build";
import type { Candidate } from "./types";

const CRAIGSLIST = "craigslist";

const bx001 = buildCandidate({
  id: "BX-001",
  title: "2002 Porsche Boxster",
  year: 2002,
  generation: "986",
  location: "Island Park, NY",
  coordinates: { lat: 40.5946, lng: -73.6543 },
  askPrice: 15000,
  mileage: 46019,
  transmission: "manual",
  specification: "Speed Yellow; upgraded glass-window top with defroster",
  imageUrl: "https://images.craigslist.org/00Z0Z_bKeutPtav8L_0pO0jm_600x450.jpg",
  sellerType: "private",
  status: "Qualified",
  factOverrides: {
    title: { status: "claimed", detail: "Seller reports a clean title.", sourceId: CRAIGSLIST },
    top: {
      status: "claimed",
      detail: "Listing describes an upgraded glass-window top with defroster; installation quality and condition unverified.",
      sourceId: CRAIGSLIST,
    },
  },
  risks: [
    {
      id: "BX-001-R1",
      title: "Asking price at ceiling with no verification evidence",
      severity: "medium",
      evidence:
        "Ask ($15,000) sits at the top of the $10,000–$15,000 target band while VIN, records, and mechanical evidence remain unverified.",
      resolution:
        "Obtain VIN, service records, and IMS/clutch/cooling evidence; weigh negotiating given the documentation gap.",
    },
  ],
  sellerQuestions: [
    { id: "BX-001-Q1", question: "Can you share the VIN?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-001-Q2", question: "Do you have service invoices or ownership history to share?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-001-Q3", question: "Any documentation of IMS bearing, clutch, or cooling system service?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-001-Q4", question: "Any accident or paintwork history to disclose?", status: "queued", provenance: "Derived from ledger unknowns" },
  ],
  strength: "Best initial combination of proximity, mileage, manual transmission, model year, and distinctive specification.",
  initialRecommendation: "Pursue verification; asking price is at the ceiling and needs strong records/PPI support.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/island-park-2002-speed-yellow-porsche/vQT4zs9YShYYj6ekz3DJR7",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx002 = buildCandidate({
  id: "BX-002",
  title: "1997 Porsche Boxster",
  year: 1997,
  generation: "986",
  location: "Waterford / Clifton Park, NY",
  coordinates: { lat: 42.777, lng: -73.6893 },
  askPrice: 14995,
  mileage: 56000,
  transmission: "manual",
  specification: "Guards Red",
  imageUrl: "https://images.craigslist.org/00N0N_lay8A1MY6rI_0t20t2_600x450.jpg",
  sellerType: "private",
  status: "Qualified",
  factOverrides: {
    "ownership-history": {
      status: "claimed",
      detail: "Seller claims to be the second owner; car was mostly kept in Florida and not driven in snow.",
      sourceId: CRAIGSLIST,
    },
    records: {
      status: "claimed",
      detail:
        "Seller claims documented tires, brakes, suspension, fluids, starter, shifter linkage, water pump, and a tune-up; invoices not yet reviewed.",
      sourceId: CRAIGSLIST,
    },
    "brakes-tires": {
      status: "claimed",
      detail: "Seller claims documented tire and brake service.",
      sourceId: CRAIGSLIST,
    },
    suspension: {
      status: "claimed",
      detail: "Seller claims documented suspension work.",
      sourceId: CRAIGSLIST,
    },
    "water-pump": {
      status: "claimed",
      detail: "Seller claims the water pump has been serviced or replaced.",
      sourceId: CRAIGSLIST,
    },
  },
  risks: [
    {
      id: "BX-002-R1",
      title: "Extensive maintenance claims unverified",
      severity: "medium",
      evidence:
        "Seller claims documented tires, brakes, suspension, fluids, starter, shifter linkage, water pump, and a tune-up, but no invoices have been reviewed.",
      resolution: "Request and review dated invoices before assigning a high score.",
    },
  ],
  sellerQuestions: [
    { id: "BX-002-Q1", question: "Can you share the VIN and title/history?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-002-Q2", question: "Can you share copies of the maintenance invoices referenced in the listing?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-002-Q3", question: "Any documentation of clutch or IMS bearing service, and what is the top's condition?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-002-Q4", question: "Any accident or paintwork history to disclose?", status: "queued", provenance: "Derived from ledger unknowns" },
  ],
  strength: "Potentially the best maintenance narrative if invoices substantiate it.",
  initialRecommendation:
    "Verify records before assigning a high score; preliminary negotiation posture was $12,500–$13,500 after inspection.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/waterford-1997-porsche-boxster/fS895eYoADwtWHJTu4qNin",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx003 = buildCandidate({
  id: "BX-003",
  title: "1997 Porsche Boxster",
  year: 1997,
  generation: "986",
  location: "Feasterville-Trevose, PA",
  coordinates: { lat: 40.1195, lng: -74.9663 },
  askPrice: 12800,
  mileage: 85569,
  transmission: "conflicting",
  imageUrl: "https://images.craigslist.org/00X0X_a8j8sHWR0Lc_0CI0pI_600x450.jpg",
  sellerType: "dealer",
  status: "Profiling",
  factOverrides: {
    title: { status: "claimed", detail: "Dealer reports a clean title.", sourceId: CRAIGSLIST },
  },
  extraFacts: [
    {
      id: "transmission-conflict",
      label: "Transmission type",
      status: "contradicted",
      detail:
        "Listing headline states 5-speed manual while structured listing data states automatic. Not yet resolved.",
      sourceId: CRAIGSLIST,
    },
  ],
  risks: [
    {
      id: "BX-003-R1",
      title: "Transmission type contradicts within the listing itself",
      severity: "blocking",
      evidence:
        "Listing headline states 5-speed manual while the listing's structured data states automatic.",
      resolution: "Confirm actual transmission via VIN decode or direct listing verification before further evaluation.",
      linkedQuestionId: "BX-003-Q1",
    },
    {
      id: "BX-003-R2",
      title: "Dealer fees and out-the-door price undisclosed",
      severity: "medium",
      evidence: "No complete out-the-door price provided; dealer fees may add meaningfully to the $12,800 ask.",
      resolution: "Request a complete fee breakdown and out-the-door price.",
    },
  ],
  sellerQuestions: [
    { id: "BX-003-Q1", question: "Please confirm the actual transmission type — the listing headline and details disagree.", status: "queued", provenance: "Derived from ledger blocking contradiction" },
    { id: "BX-003-Q2", question: "Can you share the VIN and title/ownership history?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-003-Q3", question: "Do you have service records available?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-003-Q4", question: "What is the complete out-the-door price including all dealer fees?", status: "queued", provenance: "Derived from ledger unknowns" },
  ],
  strength: "Potentially reasonable entry price.",
  initialRecommendation: "Do not travel until contradictions are resolved.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/feasterville-trevose-1997-porsche/2vCdBhzBLVtRbX5fh46pwo",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx004 = buildCandidate({
  id: "BX-004",
  title: "2002 Porsche Boxster",
  year: 2002,
  generation: "986",
  location: "Marshall, VA",
  coordinates: { lat: 38.8532, lng: -77.8522 },
  askPrice: 12500,
  mileage: 62300,
  transmission: "automatic",
  imageUrl: "https://images.craigslist.org/00B0B_dIcSnreq9Dm_0CI0t2_600x450.jpg",
  sellerType: "unknown",
  status: "Watchlist",
  factOverrides: {
    title: { status: "claimed", detail: "Seller reports a clean title.", sourceId: CRAIGSLIST },
    "storage-history": { status: "claimed", detail: "Seller claims the car is garage-kept.", sourceId: CRAIGSLIST },
  },
  risks: [
    {
      id: "BX-004-R1",
      title: "Thin listing with almost no verifiable ownership/maintenance evidence",
      severity: "high",
      evidence: "Listing provides minimal description; nearly all ownership and maintenance evidence is absent.",
      resolution: "Request full history, records, and photos; treat as an automatic-only alternative pending verification.",
    },
  ],
  sellerQuestions: [
    { id: "BX-004-Q1", question: "Can you share the VIN and title/ownership history?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-004-Q2", question: "Do you have any service records or photos of the exterior and undercarriage?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-004-Q3", question: "Any accident history or IMS/RMS documentation available?", status: "queued", provenance: "Derived from ledger unknowns" },
  ],
  strength: "Attractive price/mileage if an automatic is acceptable.",
  initialRecommendation: "Keep only as an automatic alternative pending substantial verification.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/marshall-porsche-boxster-2002-for-sale/88dKLrE4AZqeyNhDMHj5pe",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx005 = buildCandidate({
  id: "BX-005",
  title: "2003 Porsche Boxster",
  year: 2003,
  generation: "986",
  location: "Wake Forest, NC",
  coordinates: { lat: 35.9799, lng: -78.5097 },
  askPrice: 13900,
  mileage: 60000,
  transmission: "manual",
  imageUrl: "https://images.craigslist.org/00l0l_9Tas2xUgKNd_0dp0t2_600x450.jpg",
  sellerType: "unknown",
  status: "Watchlist",
  factOverrides: {
    title: { status: "claimed", detail: "Seller reports a clean title.", sourceId: CRAIGSLIST },
    top: {
      status: "claimed",
      detail: "Seller claims a new convertible top with a glass rear window.",
      sourceId: CRAIGSLIST,
    },
  },
  risks: [
    {
      id: "BX-005-R1",
      title: "Long-distance candidate with unverified service/ownership history",
      severity: "medium",
      evidence: "Distant candidate (see Distance/logistics) with unknown service and ownership evidence.",
      resolution: "Obtain service records and ownership history; arrange a local Porsche-specialist PPI before travel.",
    },
  ],
  sellerQuestions: [
    { id: "BX-005-Q1", question: "Can you share the VIN and title/ownership history?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-005-Q2", question: "Do you have service records available?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-005-Q3", question: "Who installed the new convertible top, and when?", status: "queued", provenance: "Derived from ledger unknowns" },
    { id: "BX-005-Q4", question: "Is a local Porsche-specialist PPI feasible before travel?", status: "queued", provenance: "Derived from ledger unknowns" },
  ],
  strength: "Appealing model year, mileage, transmission, and top update.",
  initialRecommendation: "Require records and a local Porsche-specialist PPI before travel.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/wake-forest-2003-porsche-boxster/25cA2DBsxyRqUHyH2kFHLg",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx006 = buildCandidate({
  id: "BX-006",
  title: "2001 Porsche Boxster",
  year: 2001,
  generation: "986",
  location: "Philadelphia, PA",
  coordinates: { lat: 39.9526, lng: -75.1652 },
  askPrice: 8000,
  mileage: 216000,
  transmission: "manual",
  specification: "Removable hardtop included",
  imageUrl: "https://images.craigslist.org/00F0F_2b6uOVZIAe9_0CI0t2_600x450.jpg",
  sellerType: "private",
  status: "Profiling",
  vin: "WP0CA29801U620629",
  factOverrides: {
    title: { status: "claimed", detail: "Seller reports a clean Pennsylvania title.", sourceId: CRAIGSLIST, date: "2026-08-16" },
    records: { status: "claimed", detail: "Seller says detailed maintenance records and engine-swap documents are in hand.", sourceId: CRAIGSLIST, date: "2026-08-16" },
    top: { status: "claimed", detail: "Seller says the convertible mechanism did not work the last time it was tried years ago; removable hardtop included.", sourceId: CRAIGSLIST, date: "2026-08-16" },
    "ownership-history": { status: "claimed", detail: "Seller reports six years of ownership.", sourceId: CRAIGSLIST, date: "2026-08-16" },
  },
  extraFacts: [{ id: "replacement-engine", label: "Replacement engine", status: "claimed", detail: "Seller says an IMS failure at 155,000 chassis miles led to an engine and transmission replacement around 2012; approximately 63,000 miles claimed on the replacement engine.", sourceId: CRAIGSLIST, date: "2026-08-16" }],
  risks: [
    { id: "BX-006-R1", title: "216,000-mile chassis and unverified drivetrain replacement", severity: "high", evidence: "Seller narrative only; documents have not been reviewed.", resolution: "Review invoices, engine serial/provenance, current mileage evidence, and complete maintenance file." },
    { id: "BX-006-R2", title: "Convertible top inoperative when last tested", severity: "medium", evidence: "Seller disclosed the top did not work years ago.", resolution: "Diagnose top mechanism, drains, water intrusion, and repair cost during PPI." },
  ],
  sellerQuestions: [
    { id: "BX-006-Q1", question: "Can you share the engine and transmission replacement invoices and engine provenance?", status: "queued", provenance: "Derived from search-run risks" },
    { id: "BX-006-Q2", question: "Can you share the complete maintenance file and evidence of current replacement-engine mileage?", status: "queued", provenance: "Derived from search-run risks" },
    { id: "BX-006-Q3", question: "What happens when the convertible top is operated, and has the car had any water intrusion?", status: "queued", provenance: "Derived from search-run risks" },
  ],
  strength: "Lowest entry price, known VIN, claimed replacement-engine documentation, and included hardtop.",
  initialRecommendation: "Review replacement-engine and transmission documentation before considering a specialist PPI.",
  sourceId: CRAIGSLIST,
  url: "https://www.craigslist.org/view/d/philadelphia-2001-porsche-boxster-clean/7Q7gVHR6Y2qWJFXFHEt2vd",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-18T19:55:00-04:00",
  createdAt: "2026-08-16",
});

const bx007 = buildCandidate({
  id: "BX-007",
  title: "1998 Porsche Boxster Base",
  year: 1998,
  generation: "986",
  location: "Kingsville, MD",
  coordinates: { lat: 39.4487, lng: -76.4177 },
  askPrice: 11995,
  mileage: 97623,
  transmission: "manual",
  specification: "Pastel Yellow; gray/silver interior",
  sellerType: "dealer",
  status: "Profiling",
  vin: "WP0CA2982WU621658",
  factOverrides: {
    title: { status: "claimed", detail: "Cars.com AutoCheck summary reports a clean title.", sourceId: "cars.com", date: "2026-08-16" },
    "accident-history": { status: "claimed", detail: "Cars.com AutoCheck summary reports an accident.", sourceId: "cars.com", date: "2026-08-16" },
    "ownership-history": { status: "claimed", detail: "Cars.com AutoCheck summary reports multiple owners.", sourceId: "cars.com", date: "2026-08-16" },
  },
  risks: [
    { id: "BX-007-R1", title: "Accident reported", severity: "high", evidence: "Cars.com AutoCheck summary reports an accident; details unavailable without report review.", resolution: "Review full history report, repair invoices, paint/body inspection, and PPI." },
    { id: "BX-007-R2", title: "Fees and service history undisclosed", severity: "medium", evidence: "Cars.com warns fees may apply; no meaningful maintenance evidence shown.", resolution: "Obtain itemized out-the-door price and service records." },
  ],
  sellerQuestions: [
    { id: "BX-007-Q1", question: "Can you provide the full accident-history report and repair details?", status: "queued", provenance: "Derived from search-run risks" },
    { id: "BX-007-Q2", question: "Can you share service records and the complete itemized out-the-door price?", status: "queued", provenance: "Derived from search-run risks" },
  ],
  strength: "In-band manual with known VIN and marketplace history summary.",
  initialRecommendation: "Require accident details, records, and complete out-the-door price before travel.",
  sourceId: "cars.com",
  url: "https://www.cars.com/vehicledetail/f78ee18b-8c40-4270-917b-b78b93dc73d2/",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-16T16:40:00-04:00",
  createdAt: "2026-08-16",
});

const bx008 = buildCandidate({
  id: "BX-008",
  title: "1998 Porsche Boxster Base",
  year: 1998,
  generation: "986",
  location: "Shrewsbury, MA",
  coordinates: { lat: 42.2959, lng: -71.7128 },
  askPrice: 14999,
  mileage: 97269,
  transmission: "manual",
  specification: "Zenith Blue Metallic",
  sellerType: "dealer",
  status: "Qualified",
  vin: "WP0CA2988WU624919",
  factOverrides: {
    title: { status: "claimed", detail: "Cars.com AutoCheck summary reports a clean title.", sourceId: "cars.com", date: "2026-08-16" },
    "accident-history": { status: "claimed", detail: "Cars.com AutoCheck summary reports zero accidents.", sourceId: "cars.com", date: "2026-08-16" },
    "ownership-history": { status: "claimed", detail: "Cars.com AutoCheck summary reports one owner.", sourceId: "cars.com", date: "2026-08-16" },
  },
  extraFacts: [{ id: "price-history", label: "Price history", status: "claimed", detail: "Cars.com reports the current ask is $4,001 below the original listed price.", sourceId: "cars.com", date: "2026-08-16" }],
  risks: [
    { id: "BX-008-R1", title: "Maintenance evidence absent", severity: "medium", evidence: "Dealer notes contain no usable service history, IMS, clutch, cooling, or top evidence.", resolution: "Obtain service records and complete Porsche-specialist PPI." },
    { id: "BX-008-R2", title: "Dealer fees undisclosed", severity: "medium", evidence: "Cars.com warns fees may apply and no price breakdown is available.", resolution: "Obtain complete itemized out-the-door price." },
  ],
  sellerQuestions: [
    { id: "BX-008-Q1", question: "Can you share all service records and the complete AutoCheck report?", status: "queued", provenance: "Derived from search-run risks" },
    { id: "BX-008-Q2", question: "What is the complete itemized out-the-door price?", status: "queued", provenance: "Derived from search-run risks" },
    { id: "BX-008-Q3", question: "What is known about IMS, clutch, cooling-system, and convertible-top service?", status: "queued", provenance: "Derived from search-run risks" },
  ],
  strength: "Manual within 150 miles, known VIN, and marketplace summary reporting one owner, zero accidents, and clean title.",
  initialRecommendation: "Best new candidate; verify records, history report, top, mechanical service, and fees before travel.",
  sourceId: "cars.com",
  url: "https://www.cars.com/vehicledetail/87e3f481-3969-46b3-aad2-7875b0bc85d7/",
  firstSeen: "2026-08-16",
  lastVerifiedAt: "2026-08-16T16:43:00-04:00",
  createdAt: "2026-08-16",
});

const bx009 = buildCandidate({
  id: "BX-009",
  title: "2001 Porsche Boxster Base",
  year: 2001,
  generation: "986",
  location: "Washington, NJ",
  coordinates: { lat: 40.7587, lng: -74.9791 },
  askPrice: 12995,
  mileage: 54008,
  transmission: "manual",
  sellerType: "dealer",
  status: "Profiling",
  vin: "WP0CA29801U622316",
  factOverrides: {
    vin: { status: "inferred", detail: "VIN appears in Club Manual's structured page data; confirm against the vehicle and dealer record.", sourceId: "club-manual", date: "2026-08-17" },
    "out-the-door-price": { status: "unknown", detail: "Dealer fees and complete out-the-door price are not displayed.", sourceId: "club-manual", date: "2026-08-17" },
  },
  extraFacts: [
    { id: "listing-availability", label: "Listing availability", status: "confirmed", detail: "Club Manual structured data reports InStock at $12,995 with 54,008 miles and manual transmission.", sourceId: "club-manual", date: "2026-08-17" },
  ],
  risks: [
    { id: "BX-009-R1", title: "Mechanical and ownership evidence absent", severity: "medium", evidence: "The accessible listing confirms basic inventory facts but provides no service, title, accident, IMS, clutch, cooling, or top history.", resolution: "Verify source inventory, VIN, history report, service records, and Porsche-specialist PPI before travel." },
    { id: "BX-009-R2", title: "Dealer fees undisclosed", severity: "medium", evidence: "Only asking price is displayed; complete acquisition price is unknown.", resolution: "Obtain an itemized out-the-door price before travel." },
  ],
  sellerQuestions: [
    { id: "BX-009-Q1", question: "Can you confirm the VIN and provide the title/history report?", status: "queued", provenance: "Derived from listing evidence gaps" },
    { id: "BX-009-Q2", question: "Can you provide service records, including IMS, clutch, cooling-system, and top work?", status: "queued", provenance: "Derived from listing evidence gaps" },
    { id: "BX-009-Q3", question: "What is the complete itemized out-the-door price?", status: "queued", provenance: "Derived from dealer-fee risk" },
  ],
  strength: "Close-to-home, in-band 2001 manual with low displayed mileage and an active structured inventory record.",
  initialRecommendation: "Best new local lead; verify the originating inventory, VIN, history, records, and dealer fees before travel.",
  sourceId: "club-manual",
  url: "https://clubmanual.com/listing/2001-porsche-boxster-manual-e0fe09c4-ac5f-4a6f-9884-f41324063903",
  firstSeen: "2026-08-17",
  lastVerifiedAt: "2026-08-18T19:55:30-04:00",
  createdAt: "2026-08-17",
});

export const CANDIDATES: Candidate[] = [bx001, bx002, bx003, bx004, bx005, bx006, bx007, bx008, bx009];

export function getCandidateById(id: string): Candidate | undefined {
  return CANDIDATES.find((c) => c.id === id);
}
