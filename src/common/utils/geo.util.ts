export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export class GeoUtils {
  private static readonly EARTH_RADIUS_KM = 6371;

  /**
   * Calculate distance between two points using Haversine formula
   */
  static calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);
    const lng1 = this.toRadians(point1.longitude);
    const lng2 = this.toRadians(point2.longitude);

    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.EARTH_RADIUS_KM * c;
  }

  /**
   * Calculate bounding box for a point and radius
   */
  static calculateBoundingBox(
    center: Coordinates,
    radiusKm: number,
  ): BoundingBox {
    const lat = this.toRadians(center.latitude);
    const lng = this.toRadians(center.longitude);
    const r = radiusKm / this.EARTH_RADIUS_KM;

    const maxLat = this.toDegrees(
      Math.asin(Math.sin(lat) * Math.cos(r) + Math.cos(lat) * Math.sin(r)),
    );
    const minLat = this.toDegrees(
      Math.asin(Math.sin(lat) * Math.cos(r) - Math.cos(lat) * Math.sin(r)),
    );
    const maxLng = this.toDegrees(
      lng +
        Math.atan2(
          Math.sin(r) * Math.cos(lat),
          Math.cos(r) - Math.sin(lat) * Math.sin(lat),
        ),
    );
    const minLng = this.toDegrees(
      lng -
        Math.atan2(
          Math.sin(r) * Math.cos(lat),
          Math.cos(r) - Math.sin(lat) * Math.sin(lat),
        ),
    );

    return {
      minLat,
      maxLat,
      minLng,
      maxLng,
    };
  }

  /**
   * Generate TypeORM query for finding locations within radius
   */
  static generateLocationQuery(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): string {
    return `
      ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${radiusKm * 1000}
      )
    `;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }
}
