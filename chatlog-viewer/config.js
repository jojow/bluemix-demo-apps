// Cloud Foundry environment variables
var port = process.env.VCAP_APP_PORT || process.env.PORT || 3001;
var services = JSON.parse(process.env.VCAP_SERVICES);
var mongoAddress = services.mongolab[0].credentials.uri;
var mongoAccess = require('url').parse(mongoAddress);

module.exports = {
  mongodb: {
    server: mongoAccess.hostname,
    port: mongoAccess.port,

    //autoReconnect: automatically reconnect if connection is lost
    autoReconnect: true,
    //poolSize: size of connection pool (number of connections to use)
    poolSize: 4,
    //set admin to true if you want to turn on admin features
    //if admin is true, the auth list below will be ignored
    //if admin is true, you will need to enter an admin username/password below (if it is needed)
    admin: false,


    // >>>>  If you are using regular accounts, fill out auth details in the section below
    // >>>>  If you have admin auth, leave this section empty and skip to the next section
    auth: [
      /*
       * Add the the name, the username, and the password of the databases you want to connect to
       * Add as many databases as you want!
       */
      {
        database: mongoAccess.pathname.substring(1, mongoAccess.pathname.length),
        username: mongoAccess.auth.split(':')[0],
        password: mongoAccess.auth.split(':')[1]
      }
    ],


    //  >>>>  If you are using an admin mongodb account, or no admin account exists, fill out section below
    //  >>>>  Using an admin account allows you to view and edit all databases, and view stats

    //leave username and password empty if no admin account exists
    //adminUsername: mongoAccess.username,
    //adminPassword: mongoAccess.password,
    //whitelist: hide all databases except the ones in this list  (empty list for no whitelist)
    whitelist: [],
    //blacklist: hide databases listed in the blacklist (empty list for no blacklist)
    blacklist: ['system.indexes', 'system.users']
  },
  site: {
    //baseUrl: the URL that mongo express will be located at
    //Remember to add the forward slash at the end!
    baseUrl: '/',
    port: port,
    cookieSecret: 'cookiesecret',
    sessionSecret: 'sessionsecret'
  },
  options: {
    //documentsPerPage: how many documents you want to see at once in collection view
    documentsPerPage: 10,
    //editorTheme: Name of the theme you want to use for displaying documents
    //See http://codemirror.net/demo/theme.html for all examples
    editorTheme: "rubyblue",

    //The options below aren't being used yet

    //cmdType: the type of command line you want mongo express to run
    //values: eval, subprocess
    //  eval - uses db.eval. commands block, so only use this if you have to
    //  subprocess - spawns a mongo command line as a subprocess and pipes output to mongo express
    cmdType: 'eval',
    //subprocessTimeout: number of seconds of non-interaction before a subprocess is shut down
    subprocessTimeout: 300
  }
};
