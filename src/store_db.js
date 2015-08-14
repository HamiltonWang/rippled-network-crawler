'use strict';
var DB = require('./lib/database');
var modelsFactory = require('./lib/models.js');
var Promise = require('bluebird');

function saveDB(crawlJson, dbUrl, logsql) {
  var log = logsql ? console.log : false;
  var sql = DB.initSql(dbUrl, log);
  var models = modelsFactory(sql);
  return models.Crawl.create({start_at: crawlJson.start,
                                end_at: crawlJson.end,
                                entry_ipp: crawlJson.entry,
                                data: JSON.stringify(crawlJson.data),
                                exceptions: JSON.stringify(crawlJson.errors)});
}

module.exports = function(crawl, dbUrl, logsql) {
  return new Promise(function(resolve, reject) {
    saveDB(crawl, dbUrl, logsql)
    .then(function() { // does this ever happen???
      console.log('Stored data crawled at: ' + crawl.start);
      resolve(crawl.data);
    })
    .catch(function(err) {
      console.error(err);    // this is a serious error
      process.exit(1);
    });
  });
};