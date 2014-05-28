http = require('https');
pg = require('pg');
pgConString = "postgres://@localhost/connect_dev";

pg.connect(pgConString, function(err, client) {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
  	console.log(msg);
  	var key = msg.payload;
    r = http.request({host:'localhost',path:'/dbpoll/' + key, port:8443, rejectUnauthorized:false});
	r.end();
  });
  var query = client.query("LISTEN hc_trigger_log");
});

/*
  Notify trigger


DROP FUNCTION IF EXISTS salesforce.notify_trigger() cascade;
CREATE FUNCTION salesforce.notify_trigger() RETURNS trigger AS $$
DECLARE
 BEGIN
   RAISE NOTICE 'Calling _pg_notify';
   RAISE NOTICE 'Table %', TG_TABLE_NAME;
   PERFORM pg_notify('hc_trigger_log', '8ed72b6abdbaea7e57d376ab3907bddf231ca898b84cb9c7c0f567b656a2e6e5');
   RETURN new;
 END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER watched_table_trigger AFTER INSERT ON salesforce._trigger_log FOR EACH ROW EXECUTE PROCEDURE salesforce.notify_trigger();


*/

