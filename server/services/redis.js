const constants = require("../constants");

const redis = require("redis").createClient(constants.REDIS_PORT, "localhost");

const shutdown = async () => {
        await new Promise((resolve) => {
            redis.quit(() => {
                resolve();
            });
        });

        await new Promise((resolve) => setImmediate(resolve));
};

module.exports = {
    redis,
    shutdown
};