var multipaas  = require('config-multipaas');
var autoconfig = function (config_overrides){
  var config   = multipaas(config_overrides).add({
    table_name  : process.env.POSTGRESQL_DATABASE || process.env.TABLE_NAME || process.env.OPENSHIFT_APP_NAME || 'parks',
    collection_name : process.env.MONGODB_DATABASE || process.env.COLLECTION_NAME || process.env.OPENSHIFT_APP_NAME || 'parks',
    db_svc_name : process.env.DATABASE_SERVICE_NAME || "mongodb",
    mongo_options : process.env.MONGODB_OPTIONS || ""
  })

  var db_config   = config.get('MONGODB_DB_URL'),
      collection  = config.get('collection_name'),
      options     = config.get('mongo_options');

  //normalize db connection string
  if(db_config[db_config.length - 1] !== "/"){
    db_config += '/';
  }
  if(options != null && options.length > 1) {
    options = "?"+options;
  }
  config.add({db_config: db_config+collection+options});
  return config;
}
exports = module.exports = autoconfig();
