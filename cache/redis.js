const platform = require('connect-platform');
const instance = require('connect-platform-redis/instance');
const { promisify } = require("util");

const config = platform.config.get('firestore', { "cache_enabled": false });

if (config.cache_enabled) {
  console.info("Firestore caching through redis is enabled.");
}

const client = instance.client;

const hgetAsync = promisify(client.hget).bind(client);
const hsetAsync = promisify(client.hset).bind(client);

const jsonClient = {
  hjget: (key, field) => {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }

      hgetAsync(key, field)
      .then((res) => {
        if(res != null) {
          const jsonObject = JSON.parse(res);
          
          console.log('From cache:', jsonObject);

          resolve(jsonObject);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  hjset: (key, field, value) => {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }

      const jsonString = JSON.stringify(value);

      hsetAsync(key, field, jsonString)
      .then((res) => {
        console.log('Cached:', key, '=', value);
        
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
};

module.exports = jsonClient;