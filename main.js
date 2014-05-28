
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res) {
  body = "";
  for (var i = 0; i < tables.length; i++) {
    body += '<a href="' + tables[i] + "/" + '">' + tables[i] + "/</a><br />";
  }
  res.send("<h2>Schemas</h2>" + body);
});

app.get('/:schema', function(req, res) {
  var schema = req.params.schema;
  q = "select tablename from pg_tables where schemaname = '" + schema + "'";
  db.query(q, function(err, result) {
    if (err) {
      return res.send(err);
    }
    lines = [];
    for (var i = 0; i < result.rows.length; i++) {
      var table = result.rows[i].tablename;
      lines.push('<a href="' + table + '/">' + table + "</a><br />");
    }
    res.send("<h2>Tables</h2>" + lines.join("\n") + "<div><br /><br /><br /><a href=\"POST\">POST</a></div>");
  });
});

app.get('/:schema/:table/', function(req, res) {
  var schema = req.params.schema;
  var table = req.params.table;
  var limit = 100;
  q = 'select * from "' + schema + '"."' + table + '" ';
  where = '';
  for (k in req.query) {
    if (where == '') {
      where = " WHERE ";
    }
    where += k + "=" + req.query[k]
  }
  q += where + " LIMIT " + limit;
  console.log("QUERY: " + q);
  body = "<div><a href=\"../..\">Schemas</a> | <a href=\".\">Tables</a> | <a href=\"./new\">New</a></div>";
  db.query(q, function(err, result) {
    if (err) {
      return res.send(err);
    }
    res.send(body + JSON.stringify(result.rows));
    return;
    lines = ["<table>\n"];
    for (var i = 0; i < result.rows.length; i++) {
      line = ["<tr>"];
      for (k in result.rows[i]) {
        line.push("<td>" + result.rows[i][k] + "</td>\n");
      }
      line.push("</tr>");
      lines.push(line.join(""));
    }
    res.send(lines.join("\n"));
  });
});

app.get('/:schema/:table/new', function(req, res) {
  table_schema(db, req.params.schema, req.params.table, function(err, cols) {
    var body = "<form method=\"post\">";
    var fields = [];
    for (var i in cols) {
      col = cols[i];
      console.log("Col: " + col);
      fields.push("<label>" + col.name + "</label><input type=\"text\" name=\"" + col.name + "\" />");
    }
    body += "<div>" + fields.join("</div><div>") + "</div></form>";
    res.send(body);
  });
});

app.get('/:schema/POST', function(req, res) {
  var body = "<h2>Save a new document</h2>";
  body += "<form method=\"post\"><div><label>Table name</label><input type=\"text\" name=\"table\" /></div>";
  body += "<div><textarea cols=\"80\" rows=\"20\" name=\"document\" placeholder=\"json\" ></textarea>" +
          "</div>";
  body += "<div><input type=\"submit\" value=\"Save\" /></div></form>";
  res.send(body);
});

app.post('/:schema/POST', function(req, res) {
  console.log(req.body);
  save_document(req.body.table, JSON.parse(req.body.document), function(err, record) {
    res.send("OK");
  });
});




//var server = app.listen(3000, function() {
//    console.log('Listening on port %d', server.address().port);
//});

function testit(db) {
  var user1 = {"email":"scottp@heroku.com"};
  var user2 = {"email":"john@heroku.com"};

  define_table(db, "public", "users", user1, function (err, result) {
    save_document(db, "public", "users", user1, function(err, result) {});
    save_document(db, "public", "users", user2, function(err, result) {});
  });

  doc = {"age":44, birthday:"1969-12-26", "name":"Dan Persinger", "address":
    {
      "city":"lake forest",
      "state":"CH",
      "street": {
        "name":"Mission",
        "suffix":"Street",
        "number":55,
        "user_id":1
      }
    }
  };

  define_table(db, "public", "table2", doc, function(err, result) {
    if (err) {
      console.log("Got an error: " + err);
    } else {
      console.log("Table created: " + JSON.stringify(result.columns));
      save_document(db, "public", "table2", doc, function(err, result) {
        if (err) {
          console.log("Save error: " + err);
        } else {
          console.log("Saved record");
        }
      });
    }
  });
}

