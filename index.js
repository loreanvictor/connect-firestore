module.exports.platform = {
  config : {
    nodes : {
      native : [
        'firestore',
        'timestamp',
        'insert',
        'set',
        'mergeSet',
        'update',
        'get',
        'getSnapshot',
        'delete',
        'search/search',
        'search/resolve',
        'search/filter',
        'search/sort',
        'search/limit',
        'search/offset',
        'search/startAfter',
        'search/startAfterId',
        'cache/invalidate/collection',
        'cache/invalidate/doc',
        'cache/expire/collection',
        'cache/expire/doc',
        'getInstance',
      ]
    },
    aliases: {
      '/db/firestore': '/firestore/firestore',
      '/db/insert': '/firestore/insert',
      '/db/set': '/firestore/set',
      '/db/mergeSet': '/firestore/mergeSet',
      '/db/server/timestamp': '/firestore/server/timestamp',
      '/db/update': '/firestore/update',
      '/db/get': '/firestore/get',
      '/db/getSnapshot': '/firestore/getSnapshot',
      '/db/delete': '/firestore/delete',

      '/db/search': '/firestore/search',
      '/db/search/resolve': '/firestore/search/resolve',
      '/db/search/filter': '/firestore/search/filter',
      '/db/search/sort': '/firestore/search/sort',
      '/db/search/limit': '/firestore/search/limit',
      '/db/search/offset': '/firestore/search/offset',
      '/db/search/startAfter': '/firestore/search/startAfter',
      '/db/search/startAfterId': '/firestore/search/startAfterId',

      '/db/cache/invalidate/collection': '/firestore/cache/invalidate/collection',
      '/db/cache/invalidate/doc': '/firestore/cache/invalidate/doc',
      '/db/cache/expire/collection': '/firestore/cache/expire/collection',
      '/db/cache/expire/doc': '/firestore/cache/expire/doc',
      '/db/getInstance': '/firestore/getInstance',
    }
  },
  hints: {
    setup:
`First, you need a Google Firestore database. Go to your Google Firebase console, and create one.
Then,<br><br>
1) go to your project's settings (the gear icon near <span class="hl-blue">Project Overview</span>, click it and you see settings) <br><br>
2) go to <span class="hl-blue">Service accounts</span><br><br>
3) press the <span class="hl-blue">Generate new private key</span> button<br><br>
4) go to <span class="hl-blue">Vault</span> section of panel, and create a new key, for example named <span class="hl-teal">firestore.json</span><br><br>
5) copy the content of the private key you generated in the content field of the new key
6) add a sample config like this. the project field should be the same as <span class="hl-teal">project_id</span> field of your key. the keyfile field is the name of the key you created in your vault.`,
    sampleConfig: {
      "project": "your-firestore-project-name",
      "keyfile": "firestore.json",
      "cache_enabled": false
    }
  }
}
