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

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const jsonClient = {
  jgetfunc: function(func, params) {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }

      func.apply(this, params)
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
  jsetfunc: function(func, params) {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }

      const ival = params.length - 1;
      const value = params[ival];
      params[ival] = JSON.stringify(value);

      func.apply(this, params)
      .then((res) => {
        console.log('Cached:', params[0], '=', value);
        
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  hjget: function(key, field) {
    return this.jgetfunc(hgetAsync, [key, field]);
  },
  hjset: function(key, field, value) {
    return this.jsetfunc(hsetAsync, [key, field, value]);
  },
  jget: function(key) {
    return this.jgetfunc(getAsync, [key]);
  },
  jset: function(key, value) {
    return this.jsetfunc(setAsync, [key, value]);
  }
};

module.exports = jsonClient;