import { Client } from '../models/Client';
import { Room } from '../models/Room';

async function getInquirer() {
  const mod = await import('inquirer');
  return mod.default;
}

export async function promptNewClient(): Promise<Omit<Client, 'id'>> {
  const inquirer = await getInquirer();

  const ans = await inquirer.prompt<{ name: string; email: string; phone: string }>([
    { type: 'input', name: 'name', message: 'Nombre:' },
    { type: 'input', name: 'email', message: 'Email:' },
    { type: 'input', name: 'phone', message: 'Teléfono:' }
  ]);

  return ans;
}

export async function promptSelectClient(clients: Client[]): Promise<string> {
  const inquirer = await getInquirer();

  const { clientId } = await inquirer.prompt<{ clientId: string }>([
    {
      type: 'list',
      name: 'clientId',
      message: 'Selecciona cliente:',
      choices: clients.map(c => ({ name: `${c.id} — ${c.name} (${c.email})`, value: c.id }))
    }
  ]);

  return clientId;
}

export async function promptSelectRoom(rooms: Room[]): Promise<string> {
  const inquirer = await getInquirer();

  const { roomId } = await inquirer.prompt<{ roomId: string }>([
    {
      type: 'list',
      name: 'roomId',
      message: 'Selecciona habitación:',
      choices: rooms.map(r => ({
        name: `${r.id} — ${r.type} ($${r.pricePerNight}/noche)`,
        value: r.id
      }))
    }
  ]);

  return roomId;
}

export async function promptDates(): Promise<{ checkInStr: string; checkOutStr: string }> {
  const inquirer = await getInquirer();

  const ans = await inquirer.prompt<{ checkInStr: string; checkOutStr: string }>([
    { type: 'input', name: 'checkInStr', message: 'Check-in (YYYY-MM-DD):' },
    { type: 'input', name: 'checkOutStr', message: 'Check-out (YYYY-MM-DD):' }
  ]);

  return ans;
}
