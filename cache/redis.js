const platform = require('connect-platform');
const { promisify } = require("util");

const config = platform.config.get('firestore', { "cache_enabled": false });

function emptyPromise() {
  return Promise.resolve(0);
}

let Async = {
  hget: emptyPromise(),
  hset: emptyPromise(),

  get: emptyPromise(),
  set: emptyPromise(),
  expire: emptyPromise(),
  
  del: emptyPromise()
};

if (config.cache_enabled) {
  console.info("Firestore caching through redis is enabled.");

  const instance = require('connect-platform-redis/instance');

  const client = instance.client;

  Async = {
    hget: promisify(client.hget).bind(client),
    hset: promisify(client.hset).bind(client),

    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    expire: promisify(client.expire).bind(client),
    
    del: promisify(client.del).bind(client)
  };
}

const jsonClient = {
  CONSTANTS: {
    NONE_EXISTING: 'non_existing'
  },
  jgetfunc: function(func, params) {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }
      
      func.apply(this, params)
      .then((res) => {
        if(res != null) {
          let returnVal = this.CONSTANTS.NONE_EXISTING;
          if(res !== this.CONSTANTS.NONE_EXISTING) {
            returnVal = JSON.parse(res);
          }

          resolve(returnVal);
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
      const ival = params.length - 1;
      const value = params[ival];

      if(! config.cache_enabled) {
        resolve(value);
        return ;
      }

      if(value !== this.CONSTANTS.NONE_EXISTING)
        params[ival] = JSON.stringify(value);

      func.apply(this, params)
      .then((res) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  hjget: function(key, field) {
    return this.jgetfunc(Async.hget, [key, field]);
  },
  hjset: function(key, field, value) {
    return this.jsetfunc(Async.hset, [key, field, value]);
  },
  jget: function(key) {
    return this.jgetfunc(Async.get, [key]);
  },
  jset: function(key, value) {
    return this.jsetfunc(Async.set, [key, value]);
  },
  del: function(key) {
    return new Promise((resolve, reject) => {
      if(! config.cache_enabled) {
        resolve(null);
        return ;
      }

      Async.del(key)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  markMissing: function(key) {
    return this.jset(key, this.CONSTANTS.NONE_EXISTING);
  },
  expire: function(key, ttl) {
    return Async.expire(key, ttl);
  }
};

module.exports = jsonClient;