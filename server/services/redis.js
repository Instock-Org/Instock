const constants = require("../constants");

const redis = require("redis").createClient(constants.REDIS_PORT, "localhost");

const shutdown = async () => {
        await new Promise((resolve) => {
            redis.quit(() => {
                resolve();
            });
        });
        // redis.quit() creates a thread to close the connection.
        // We wait until all threads have been run once to ensure the connection closes.
        await new Promise(resolve => setImmediate(resolve));
};

module.exports = {
    redis,
    shutdown
};