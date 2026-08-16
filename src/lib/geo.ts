/**
 * Distance/drive-time helpers. Coordinates are approximate town-center
 * geocodes (not exact listing addresses, which are never published), so
 * distance is an estimate and drive time is a documented assumption
 * (45 mph blended average for regional/highway trips), not a fact.
 */

export const HOME_BASE = {
  label: "Congers, NY 10920",
  lat: 41.1281,
  lng: -73.9315,
};

const EARTH_RADIUS_MILES = 3958.8;
const ASSUMED_AVERAGE_SPEED_MPH = 45;

export function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_MILES * c;
}

export function distanceFromHome(coordinates: { lat: number; lng: number }): number {
  return Math.round(haversineMiles(HOME_BASE, coordinates));
}

export function estimateDriveTimeMinutes(distanceMiles: number): number {
  return Math.round((distanceMiles / ASSUMED_AVERAGE_SPEED_MPH) * 60);
}

/** Search bands from the Boxster Search standing criteria, in miles. */
export const SEARCH_BANDS = [75, 150, 250, 400] as const;
