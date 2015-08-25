// Dakota Sanchez
// 24 August 2015

var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var pgConnection = 'postgres://node1:stringargs@localhost/node1';

var app = express(); // define our app using express

// configure app to use body-parser
// this allows us to grab POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();


// middleware (gets called after request comes in, but before the route handlers)
router.use('/', function(req, res, next) {
    console.log('Got a request!');
    next(); // go to route handler
});

router.get('/', function(req, res) {
    res.json( { message: 'a response!' });
});

router.route('/bears')
    .post(function(req, res) {
        var bear_name = req.body.name;
        var bear_type = req.body.type;
        pg.connect(pgConnection, function(err, client, done) {
            if(err) {
                res.json( { message: 'Error creating bear!' } );
                return console.error('error connecting to db', err);
            }
            client.query('INSERT INTO bears (bear_name, type) VALUES (\'' +
                    bear_name + '\', \'' + bear_type + '\')', function(err, result) {
                done();

                if(err) {
                    res.json( { message: 'Error creating bear!' } );
                    return console.error('error with query', err);
                } else {
                    res.json( { message: 'Bear created!' } );
                }
            });
        });
    })

    .get(function(req, res) {
        pg.connect(pgConnection, function(err, client, done) {
            if(err) {
                res.json( { message: 'Error retrieving bears!' } );
                return console.error('error connecting to db', err);
            }
            client.query('SELECT * FROM bears', function(err, result) {
                done();

                if(err) {
                    res.json( { message: 'Error retrieving bears!!' } );
                    return console.error('error with query', err);
                } else {
                    var json = JSON.stringify(result.rows);
                    res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
                    res.end(json);
                }
            });
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        pg.connect(pgConnection, function(err, client, done) {
            if(err) {
                res.json( { message: 'Error retrieving bear!' } );
                return console.error('error connecting to db', err);
            }
            client.query('SELECT * FROM bears WHERE bear_id = ' + req.params.bear_id, function(err, result) {
                done();

                if(err) {
                    res.json( { message: 'Error retrieving bear!!' } );
                    return console.error('error with query', err);
                } else {
                    if(result.rows.length > 0) {
                        var json = JSON.stringify(result.rows[0]);
                        res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
                        res.end(json);
                    } else {
                        res.json( { message: 'No bear with that id!' });
                    }
                }
            });
        });
    })

    .put(function(req, res) {
        pg.connect(pgConnection, function(err, client, done) {
            if(err) {
                res.json( { message: 'Error updating bear!' } );
                return console.error('error connecting to db', err);
            }
            client.query('UPDATE bears SET bear_name = \'' + req.body.name +
                    '\' WHERE bear_id = ' + req.params.bear_id, function(err, result) {
                done();

                if(err) {
                    res.json( { message: 'Error updating bear!!' } );
                    return console.error('error with query', err);
                } else {
                    res.json( { message: 'Bear updated!' } );
                }
            });
        });
    })

    .delete(function(req, res) {
        pg.connect(pgConnection, function(err, client, done) {
            if(err) {
                res.json( { message: 'Error deleting bear!'} );
                return console.error('error connecting to db', err);
            }
            client.query('DELETE FROM bears WHERE bear_id = ' + req.params.bear_id, function(err, result) {
                done();

                if(err) {
                    res.json( { message: 'Error deleting bear!!' } );
                    return console.error('error with query', err);
                } else {
                    res.json( { message: 'Bear deleted!' } );
                }
            });
        });
    });

app.use('/api', router);
app.listen(port);

// start server
console.log('Magic happens on port: ' + port);
