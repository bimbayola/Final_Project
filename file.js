const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({
  socket: {
    host: 'redis-server',
    port: 6379
  }
});
redisClient.connect();

app.get('/tasks', async (req, res) => {
    const tasks = await redisClient.lRange('tasks', 0, -1);
    res.send({ tasks });
});

app.post('/tasks', async (req, res) => {
    const { task } = req.body;
    await redisClient.rPush('tasks', task);
    res.send('Task added');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
