export type MainOption =
  | 'REGISTER_CLIENT'
  | 'LIST_CLIENTS'
  | 'LIST_ROOMS'
  | 'CREATE_RESERVATION'
  | 'LIST_RESERVATIONS'
  | 'EXIT';

async function getInquirer() {
  const mod = await import('inquirer');
  return mod.default;
}

export async function promptMainMenu(): Promise<MainOption> {
  const inquirer = await getInquirer();

  const { option } = await inquirer.prompt<{ option: MainOption }>([
    {
      type: 'list',
      name: 'option',
      message: 'Selecciona una opción:',
      choices: [
        { name: '1) Registrar cliente', value: 'REGISTER_CLIENT' },
        { name: '2) Listar clientes', value: 'LIST_CLIENTS' },
        { name: '3) Listar habitaciones', value: 'LIST_ROOMS' },
        { name: '4) Crear reservación', value: 'CREATE_RESERVATION' },
        { name: '5) Listar reservaciones', value: 'LIST_RESERVATIONS' },
        { name: '6) Salir', value: 'EXIT' }
      ]
    }
  ]);

  return option;
}
