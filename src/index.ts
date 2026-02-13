import { rooms } from './data/rooms';
import { HotelService } from './services/hotelService';
import { promptMainMenu } from './ui/menu';
import {
  promptNewClient,
  promptSelectClient,
  promptSelectRoom,
  promptDates
} from './ui/prompts';
import { parseISODate } from './utils/dates';

async function main() {
  const service = new HotelService(rooms);

  console.log('################# Sistema de Reservaciones de Hote LinkON ################# \n');

  while (true) {
    const option = await promptMainMenu();

    try {
      if (option === 'REGISTER_CLIENT') {
        const input = await promptNewClient();
        const client = service.registerClient(input);
        console.log(`\nCliente creado: ${client.id} — ${client.name}\n`);
      }

      if (option === 'LIST_CLIENTS') {
        const clients = service.listClients();

        if (!clients.length) {
          console.log('\nNo hay clientes registrados.\n');
        } else {
          console.table(
            clients.map(c => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone
            }))
          );
          console.log('');
        }
      }

      if (option === 'LIST_ROOMS') {
        const roomsList = service.listRooms();

        console.table(
          roomsList.map(r => ({
            id: r.id,
            type: r.type,
            pricePerNight: r.pricePerNight
          }))
        );
        console.log('');
      }

      if (option === 'CREATE_RESERVATION') {
        const clients = service.listClients();

        if (!clients.length) {
          console.log('\nPrimero debes registrar un cliente.\n');
          continue;
        }

        const clientId = await promptSelectClient(clients);
        const roomId = await promptSelectRoom(service.listRooms());

        const { checkInStr, checkOutStr } = await promptDates();

        const checkIn = parseISODate(checkInStr);
        const checkOut = parseISODate(checkOutStr);

        if (!checkIn || !checkOut) {
          console.log('\nFormato inválido. Usa YYYY-MM-DD\n');
          continue;
        }

        const reservation = service.createReservation({
          clientId,
          roomId,
          checkIn,
          checkOut
        });

        console.log(
          `\nReservación creada: ${reservation.id} — Total: $${reservation.total}\n`
        );
      }

      if (option === 'LIST_RESERVATIONS') {
        const reservations = service.listReservations();

        if (!reservations.length) {
          console.log('\nNo hay reservaciones.\n');
        } else {
          console.table(
            reservations.map(r => ({
              id: r.id,
              clientId: r.clientId,
              roomId: r.roomId,
              checkIn: r.checkIn.toISOString().slice(0, 10),
              checkOut: r.checkOut.toISOString().slice(0, 10),
              total: r.total
            }))
          );
          console.log('');
        }
      }

      if (option === 'EXIT') {
        console.log('\nHasta luego!\n');
        process.exit(0);
      }
    } catch (error: any) {
      console.log(`\n${error?.message || 'Ocurrió un error inesperado.'}\n`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
