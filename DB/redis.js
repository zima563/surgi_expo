const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
    url: 'redis://localhost:6379' // Adjust this if your Redis server is on another host or has auth
});

redisClient.connect().then(() => {
    console.log("redis connectted");

}).catch(err => console.error('Redis connection error:', err));


module.exports = redisClient;