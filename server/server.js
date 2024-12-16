const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// WebSocket Чат
io.on('connection', (socket) => {
    console.log('Пользователь подключен');

    socket.on('chat message', (msg) => {
        console.log('Сообщение:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

// SSE: Серверные обновления
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    setInterval(() => {
        res.write(`data: Новое обновление: ${new Date().toLocaleTimeString()}\n\n`);
    }, 5000);
});

// Статические файлы
app.use(express.static('../client'));

// Запуск сервера
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
