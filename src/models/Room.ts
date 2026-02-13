export type RoomType = 'SIMPLE' | 'DOBLE' | 'SUITE';

export interface Room {
  id: string;
  type: RoomType;
  pricePerNight: number;
}
