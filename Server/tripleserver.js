var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var session = require('express-session');

const marklogic = require('marklogic');
const my = require('./mymate-connection.js');
const db = marklogic.createDatabaseClient(my.connInfo);

var MarkLogicStore = require('connect-marklogic')(session);

app.use(session({
  store: new MarkLogicStore({client: db}),
  secret: 'enterprise nosql',
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = {
  origin: 'http://localhost:8070',
  optionsSuccessStatus: 200 
}

app.options('*', cors());

// Converts the input into N triples with proper IRIs,
// uses underscores instead of spaces.
function json2ntriples(triples) {
  var IRItriples = '';
  for (var i=0; i < triples.length; i++) {
    IRItriples += '<' + triples[i].subj.trim().replace(/ /g,"_") + '> <' + 
    triples[i].pred.trim().replace(/ /g,"_") + '> <' + 
    triples[i].obj.trim().replace(/ /g,"_") + '>.\n';
  }
//  console.log(IRItriples);
  return IRItriples
}


app.post('/savetriples', cors(), function (req, res) {
  db.graphs.write('ozpol', 'application/n-triples', json2ntriples(req.body)).result( 
    function(response) {
      if (response.defaultGraph) {
        console.log('Loaded into default graph'); 
      } else {
        console.log('Loaded into graph ' + response.graph); 
      };
    }, 
    function(error) { console.log(JSON.stringify(error, null, 2)); }
  );
  res.send('Saved.');
});
/*
app.get('/loadtriplesturtle', function (req, res) {
  db.graphs.read('ozpol', 'text/turtle' ).result(
    function(response) {
      var trips = '';
      for (const line of response.split('\n')) {
        console.log(line);
        trips += line;
      }
      res.send(trips);
    },
    function(error) { console.log(JSON.stringify(error)); }
  );
});
*/
app.get('/ozpoltriplesjson', cors(), function (req, res) {
  db.graphs.read('ozpol', 'application/json' ).result(
    function(response) {
      res.send(JSON.stringify(response).replace(/_/g," "));
    },
    function(error) { console.log(JSON.stringify(error)); }
  );
});

app.get('/topicform', cors(), function (req,res) {
  db.graphs.sparql(
    'application/sparql-results+json', 'ozpol',
    'SELECT DISTINCT ?o WHERE {?s ?p ?o}')
    .result(function (result) {
      var form ='<form method="post" action="http://localhost:3000/showmymate" target="mymate">\n<fieldset>';
      form += '<legend>Select topics that matter</legend>';
      for (var r in result.results.bindings) {
        if (!result.results.bindings[r].o.value == "") {
          form += '<div class="checkitem">';
          form += '<input type="checkbox" name="topic[]" id="i' + r + '" value="' + result.results.bindings[r].o.value + '">';
          form += result.results.bindings[r].o.value.replace(/_/g," ") + '</input>\n';
          form += '</div>'
        }
      }
      form += '</fieldset>\n';
      form += '<button type="submit">Show my mate</button>';
      form += '<button type="reset">Clear selection</button></form>'
      res.send(form);
    }, function (error) {
      console.log(JSON.stringify(error, null, 2));
    })
});

app.post('/showmymate', cors(), function (req, res) {
  console.log(req.body);
  var spaquery = 'SELECT (COUNT(?s) AS ?ns) ?s \nWHERE {';
  for (var s in req.body.topic) {
    spaquery += '{?s <supports> <' + req.body.topic[s] + '>}';
    if (s < req.body.topic.length-1) {
      spaquery += ' UNION ' 
    }
  }
  spaquery += '} \nGROUP BY ?s\n';
  spaquery += 'ORDER BY DESC (?ns)\n LIMIT 1';
  console.log(spaquery);
  db.graphs.sparql(
    'application/sparql-results+json', 'ozpol',
    spaquery)
    .result(function (result){
      console.log(JSON.stringify(result, null, 2));
      if (result.results.bindings[0]) {
        var mate = result.results.bindings[0].s.value.replace(/_/g," ");
        var matehtml = '<p>' + mate + '</p>\n';
        matehtml += '<div id="mateimg">';
        matehtml += '<a href="http://localhost:8070/xqy/showmate.xqy?mate=' + mate.replace(/ /g,"%20") + '">';
        matehtml += 'Show card</a></div>';
        res.send(matehtml);         
      } else {
        res.send("No mates found!")
      }
    }, function (error) {
      console.log(JSON.stringify(error, null, 2));
    })

});

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});
