export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export * from './coordinates';
export * from './address';