const express = require('express');
const axios = require('axios');
const app = express();
const BASE_URL = 'https://2144-194-50-15-255.ngrok.io';

app.use( express.json() );

app.post( '/yandex', ( req, res ) => {
    console.log(JSON.stringify(req.body));
    const yandexId = req.body["session"]["user"]["user_id"];
    console.log(yandexId);
    
    const msg = req.body["request"]["command"];
    playlistName = msg.indexOf('плейлист') != -1
        ? msg.substring(msg.indexOf('плейлист') + String('плейлист').length + 1)
        : '';

    console.log(playlistName);
    axios.post(BASE_URL + '/rest/playlists/transfer-playlist', {
        musicProvider: 'SPOTIFY',
        yandexId: yandexId,
        name: playlistName
    }).then(response => {
        console.log(response);
    }).catch(error => {
        //TODO: error message
        console.log(error.response?.status);
    });

    res.json({
        version: req.body["version"],
        session: req.body["session"],
        response: {
            text: "Качаем треки",
            end_session: false
        }
    });
} );

app.listen( 3000, () => console.log( 'Node.js server started on port 3000.' ) );