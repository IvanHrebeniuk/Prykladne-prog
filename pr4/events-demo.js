import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Підписка на подію
emitter.on('userLoggedIn', (username) => {
  console.log(`User ${username} has logged in.`);
});

// Генерація події
emitter.emit('userLoggedIn', 'student01');
