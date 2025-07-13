const amqp = require('amqplib');
const logger = require('./logger');

const rabbitMQConnection = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    if (connection) logger.info('======rabbitMQ connection stablish======');
    const channel = await connection.createChannel();
    return channel;
  } catch (err) {
    console.error('err', err);
  }
};

module.exports = rabbitMQConnection;
