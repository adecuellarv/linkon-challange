export interface Reservation {
  id: string;
  clientId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  total: number;
}
