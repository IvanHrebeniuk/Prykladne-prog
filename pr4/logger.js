import { EventEmitter } from 'events';
import chalk from 'chalk';

// Власний логер на основі EventEmitter
const logger = new EventEmitter();

// Колір для кожного рівня повідомлення
const colors = {
  info: chalk.greenBright,
  warning: chalk.yellowBright,
  error: chalk.redBright,
};

// Прослуховуємо події типу "log"
logger.on('log', ({ level = 'info', message }) => {
  const color = colors[level] ?? chalk.white;
  // 'sv-SE' дає формат РРРР-ММ-ДД ГГ:ХХ:СС
  const time = new Date().toLocaleString('sv-SE');
  console.log(color(`[${time}] ${level.toUpperCase()}: ${message}`));
});

export default logger;
