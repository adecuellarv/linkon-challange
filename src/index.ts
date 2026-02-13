import inquirer from 'inquirer';

async function main() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'nombre',
      message: '¿Cuál es tu nombre?',
    },
    {
      type: 'list',
      name: 'lenguaje',
      message: '¿Qué lenguaje prefieres?',
      choices: ['JavaScript', 'Python', 'C++', 'Go'],
    },
  ]);

  console.log('Respuestas:', answers);
}

main();
