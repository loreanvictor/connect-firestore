module.exports.platform = {
  config : {
    nodes : {
      native : [
        'insert',
        'update',
        'get',
        'delete',
        'search/search',
        'search/resolve',
        'search/filter',
        'search/sort',
        'search/limit',
        'search/offset',
      ]
    },
    aliases: {
      '/db/insert': '/firestore/insert',
      '/db/update': '/firestore/update',
      '/db/get': '/firestore/get',
      '/db/delete': '/firestore/delete',

      '/db/search': '/firestore/search',
      '/db/search/resolve': '/firestore/search/resolve',
      '/db/search/filter': '/firestore/search/filter',
      '/db/search/sort': '/firestore/search/sort',
      '/db/search/limit': '/firestore/search/limit',
      '/db/search/offset': '/firestore/search/offset',
    }
  },
  hints: {
    setup:
`First, you need a Google Firestore database. Go to your Google Firebase console, and create one.
Then,
1) go to your project's settings (the gear icon near <span class="hl-blue">Project Overview</span>, click it and you see settings) <br>
2) go to <span class="hl-blue">Service accounts</span><br>
3) press the <span class="hl-blue">Generate new private key</span> button<br>
4) go to <span class="hl-blue">Vault</span> section of panel, and create a new key, for example named <span class="hl-teal">firestore.json</span><br>
5) copy the content of the private key you generated in the content field of the new key
6) add a sample config like this. the project field should be the same as <span class="hl-teal">project_id</span> field of your key. the keyfile field is the name of the key you created in your vault.`,
    sampleConfig: {
      project: "your-firestore-project-name",
      keyfile: "firestore.json"
    }
  }
}
