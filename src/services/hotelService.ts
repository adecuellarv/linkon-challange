import { Client } from '../models/Client';
import { Room } from '../models/Room';
import { Reservation } from '../models/Reservation';
import { isValidEmail } from '../utils/validation';
import { nightsBetween, rangesOverlap } from '../utils/dates';

export class HotelService {
  private clients: Client[] = [];
  private reservations: Reservation[] = [];

  constructor(private readonly rooms: Room[]) {}

  listClients(): Client[] {
    return [...this.clients];
  }

  listRooms(): Room[] {
    return [...this.rooms];
  }

  listReservations(): Reservation[] {
    return [...this.reservations].sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime());
  }

  registerClient(input: Omit<Client, 'id'>): Client {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.trim();

    if (!name) throw new Error('El nombre es obligatorio.');
    if (!isValidEmail(email)) throw new Error('Email inválido.');
    if (!phone) throw new Error('El teléfono es obligatorio.');

    const emailExists = this.clients.some(c => c.email.toLowerCase() === email);
    if (emailExists) throw new Error('Ya existe un cliente con ese email.');

    const client: Client = {
      id: `C${this.clients.length + 1}`,
      name,
      email,
      phone
    };

    this.clients.push(client);
    return client;
  }

  createReservation(params: {
    clientId: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
  }): Reservation {
    const { clientId, roomId, checkIn, checkOut } = params;

    const client = this.clients.find(c => c.id === clientId);
    if (!client) throw new Error('El cliente no existe.');

    const room = this.rooms.find(r => r.id === roomId);
    if (!room) throw new Error('La habitación no existe.');

    if (checkOut <= checkIn) throw new Error('checkOut debe ser mayor que checkIn.');

    const nights = nightsBetween(checkIn, checkOut);
    if (nights <= 0) throw new Error('Fechas inválidas.');
    if (nights > 30) throw new Error('Máximo 30 noches.');

    const overlaps = this.reservations.some(r =>
      r.roomId === roomId && rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut)
    );
    if (overlaps) throw new Error('No se permiten empalmes de fechas para la misma habitación.');

    const total = nights * room.pricePerNight;

    const reservation: Reservation = {
      id: `B${this.reservations.length + 1}`,
      clientId,
      roomId,
      checkIn,
      checkOut,
      total
    };

    this.reservations.push(reservation);
    return reservation;
  }
}
