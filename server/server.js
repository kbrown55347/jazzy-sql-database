const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// require pg module
const pg = require('pg');
// create pool object constructor
const Pool = pg.Pool;
// create our pool object using above constructor
const pool = new Pool({
    database: 'jazzy_sql',
    host: 'Localhost'
});

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', (error) => {
    console.log('Error with postgres pool', error)
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

app.get('/artist', (req, res) => {
    const sqlText = `SELECT * FROM artist 
        ORDER BY birthdate DESC;`
    pool.query(sqlText)
        .then((dbRes) => {
            const artistsFromDb = dbRes.rows;
            res.send(artistsFromDb);
        }).catch((dbErr) => {
            console.error(dbErr);
        });
});

app.post('/artist', (req, res) => {
    const newArtist = req.body;
    const sqlText = (`
        INSERT INTO "artist"
            ("name", "birthdate")
        VALUES
            ($1, $2);
    `);
    const sqlValues = [
        newArtist.name,
        newArtist.birthdate
    ];
    console.log(sqlText);
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.error(dbErr);
    });
});

app.get('/song', (req, res) => {
    const sqlText = `SELECT * FROM song 
        ORDER BY title;`
    pool.query(sqlText)
        .then((dbRes) => {
            const songsFromDb = dbRes.rows;
            res.send(songsFromDb);
        }).catch((dbErr) => {
            console.log(dbErr);
        });
});

app.post('/song', (req, res) => {
    const newSong = req.body;
    const sqlText = (`
    INSERT INTO "song"
        ("title", "length", "released")
    VALUES
        ($1, $2, $3);
    `)
    const sqlValues = [
        newSong.title,
        newSong.length,
        newSong.released
    ];
    console.log(sqlText);
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.error(dbErr);
        });
});