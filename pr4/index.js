import express from 'express';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import logger from './logger.js';

const app = express();
const emitter = new EventEmitter();
const PORT = 3000;

// Слухач подій: кожен запит виводиться синім кольором
emitter.on('newRequest', (url) => {
  console.log(chalk.blue(`[Event] New request received: ${url}`));
});

// Головна сторінка
app.get('/', (req, res) => {
  emitter.emit('newRequest', req.url);
  logger.emit('log', { level: 'info', message: 'GET / accessed' });
  res.send('Chalk + EventEmitter + Express = 💪');
});

// Сторінка інформації
app.get('/info', (req, res) => {
  emitter.emit('newRequest', req.url);
  console.log(chalk.green('Info endpoint accessed!'));
  logger.emit('log', { level: 'info', message: 'GET /info accessed' });
  res.send('Information page logged in green color!');
});

// Маршрут для демонстрації помилки
app.get('/error', (req, res, next) => {
  emitter.emit('newRequest', req.url);
  next(new Error('Demo error'));
});

// Невідомий маршрут -> warning
app.use((req, res) => {
  logger.emit('log', { level: 'warning', message: `Unknown route requested: ${req.url}` });
  res.status(404).send('404 - Page not found');
});

// Обробник помилок -> error
app.use((err, req, res, next) => {
  logger.emit('log', { level: 'error', message: `Internal server error: ${err.message}` });
  res.status(500).send('500 - Internal server error');
});

app.listen(PORT, () => {
  console.log(chalk.yellowBright(`🚀 Server running at http://localhost:${PORT}`));
  logger.emit('log', { level: 'info', message: 'Server started successfully' });
});
