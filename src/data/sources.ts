import { CANDIDATES } from "./candidates";
import type { Source, SourceMetrics } from "./types";

const qualifiedFrom = (sourceId: string) =>
  CANDIDATES.filter(
    (candidate) => candidate.listings.some((listing) => listing.sourceId === sourceId) && candidate.status === "Qualified",
  ).length;

const source = (
  id: string,
  name: string,
  type: Source["type"],
  url: string,
  priority: Source["priority"],
  accessNote: string,
  metrics: Partial<SourceMetrics> = {},
): Source => ({
  id,
  name,
  type,
  url,
  priority,
  accessNote,
  metrics: { qualifiedCandidates: qualifiedFrom(id), ...metrics },
});

export const SOURCES: Source[] = [
  source("craigslist", "Craigslist regional searches", "marketplace", "https://www.craigslist.org", "primary", "Search multiple regional centers; verify the vehicle detail page.", { listingsScanned: 7, activeListingsVerified: 7, uniqueCandidates: 6, promotedCandidates: 6, duplicateRate: 0, lastSuccessfulCheck: "2026-08-16" }),
  source("cars.com", "Cars.com", "marketplace", "https://www.cars.com", "primary", "Browser-rendered detail pages worked in the latest run.", { listingsScanned: 10, activeListingsVerified: 2, uniqueCandidates: 2, promotedCandidates: 2, duplicateRate: 0, lastSuccessfulCheck: "2026-08-16" }),
  source("pca-mart", "PCA Mart and regional PCA", "enthusiast-forum", "https://mart.pca.org", "primary", "Prioritize owner history and documentation; some content may require membership/login."),
  source("rennlist", "Rennlist classifieds", "enthusiast-forum", "https://rennlist.com/forums/market/", "primary", "Verify listing recency and direct seller details."),
  source("986forum", "986 Forum classifieds", "enthusiast-forum", "https://986forum.com/forums/", "primary", "Search forum classifieds and owner build/history threads."),
  source("facebook-marketplace", "Facebook Marketplace", "marketplace", "https://www.facebook.com/marketplace", "primary", "Use multiple geographic centers; login-gated cards are not verified inventory."),
  source("autotempest", "AutoTempest", "marketplace", "https://www.autotempest.com", "primary", "Use for discovery, then verify on the originating marketplace."),
  source("club-manual", "Club Manual", "marketplace", "https://clubmanual.com/vehicles/porsche/boxster", "primary", "Manual-only discovery source with accessible structured detail pages; verify originating dealer inventory.", { listingsScanned: 14, activeListingsVerified: 1, uniqueCandidates: 1, promotedCandidates: 1, lastSuccessfulCheck: "2026-08-17" }),
  source("autotrader", "Autotrader", "marketplace", "https://www.autotrader.com", "secondary", "Latest direct retrieval failed; retry with browser rendering.", { blockedChecks: 1 }),
  source("cargurus", "CarGurus", "marketplace", "https://www.cargurus.com", "secondary", "Direct retrieval was blocked; verify through an interactive detail page.", { blockedChecks: 1 }),
  source("carfax", "CARFAX Used Cars", "marketplace", "https://www.carfax.com/cars-for-sale", "secondary", "Direct retrieval was blocked; history summaries remain triage evidence.", { blockedChecks: 1 }),
  source("edmunds", "Edmunds", "marketplace", "https://www.edmunds.com/inventory/", "secondary", "Verify originating dealer inventory and fees."),
  source("truecar", "TrueCar", "marketplace", "https://www.truecar.com/used-cars-for-sale/", "secondary", "Verify originating dealer inventory and fees."),
  source("ebay-motors", "eBay Motors", "auction", "https://www.ebay.com/b/Porsche-Boxster-Cars/6001/bn_24017651", "secondary", "Separate active auctions, classified listings, and sold results."),
  source("hemmings", "Hemmings", "auction", "https://www.hemmings.com/classifieds/cars-for-sale/porsche/boxster", "secondary", "Useful for enthusiast cars and comparables; verify active status."),
  source("classic-com", "Classic.com", "auction", "https://www.classic.com/m/porsche/boxster/", "comparables", "Use primarily for market and sold-comparable context; verify active listings at origin."),
  source("bring-a-trailer", "Bring a Trailer", "auction", "https://bringatrailer.com/porsche/boxster/", "comparables", "Active auctions can be candidates; sold auctions are comparables."),
  source("cars-and-bids", "Cars & Bids", "auction", "https://carsandbids.com/search/porsche/boxster", "comparables", "Active auctions can be candidates; sold auctions are comparables."),
  source("porsche-finder", "Porsche Finder", "dealer-network", "https://finder.porsche.com/us/en-US/search/boxster", "secondary", "Usually newer inventory, but retain as a periodic zero-result check."),
  source("specialist-dealers", "Porsche specialists and consignors", "dealer-network", "", "primary", "Search regional independent Porsche/European shops, consignors, and dealer feeds."),
  source("search-engines", "Google and Bing targeted queries", "manual", "", "primary", "Use recent/date-bounded site, VIN, model-year, transmission, price, and location queries."),
  source("offerup", "OfferUp", "marketplace", "https://offerup.com", "secondary", "Promote only when a current detail page and credible vehicle identity are verifiable."),
  source("manual-entry", "Manual entry", "manual", "", "secondary", "Use for a user-provided listing or otherwise verified lead."),
];

export function getSourceById(id: string): Source | undefined {
  return SOURCES.find((item) => item.id === id);
}
