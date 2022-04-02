const axios = require('axios');

const BASE_URL = 'https://2144-194-50-15-255.ngrok.io';
const POTENTIAL_USERNAME = '#';
const PLAYLIST_WORD_RU = 'плейлист';

var aliceIdToYandexEmailMap = new Map();

const getMessageForReply = async (aliceId, msgText) => {
    const yandexUsername = getYandexUsernameByAliceUserId(aliceId);
    
    if (yandexUsername == undefined) {
        aliceIdToYandexEmailMap.set(aliceId, POTENTIAL_USERNAME);
        
        return "Пожалуйста, введите имя пользователя в системе Yandex для авторизации в нашем музыкальном сервисе";

    } else if (yandexUsername === POTENTIAL_USERNAME) {
        aliceIdToYandexEmailMap.set(aliceId, msgText);
        
        return "Отлично, можно начинать!";
    }

    const pos = msgText.toLowerCase().indexOf(PLAYLIST_WORD_RU);
    const isCommandToSyncPlaylist = pos !== -1;

    if (isCommandToSyncPlaylist) {
        const playlistName = msgText.substring(pos + String(PLAYLIST_WORD_RU).length + 1);
        console.log('Название плейлиста: ' + playlistName);
        
        const reqUrl = BASE_URL + '/rest/playlists/transfer-playlist';
        const resp = await axios.post(reqUrl, {
            musicProvider: 'SPOTIFY',
            yandexId: aliceId,
            username: yandexUsername,
            name: playlistName
        }); 
        
        if (resp?.status === 200) {
            console.log(reqUrl + ': ' + response);
        } else {
            console.log(reqUrl + ': ' + resp?.status);
        }

        return "Уже качаем треки";

    }

    return "Скажите команду \"Алиса, загрузи плейлист..,\" и дальше название плейлиста";
};

const getYandexUsernameByAliceUserId = function(aliceUserId) {
    return aliceIdToYandexEmailMap.get(aliceUserId);
};

/* TestVisible */
const clearUsers = () => {
    aliceIdToYandexEmailMap = new Map();
}

module.exports = { getMessageForReply, getYandexUsernameByAliceUserId, clearUsers };

