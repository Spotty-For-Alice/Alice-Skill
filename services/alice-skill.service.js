require('dotenv').config();
const axios = require('axios');

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
        
        const reqUrl = process.env.REQUEST_HANDLER_URL + '/rest/playlists/transfer-playlist';
        let replyMessage = "Уже качаем треки";

        try {
            const resp = await axios.post(reqUrl, {
                musicProvider: 'SPOTIFY',
                yandexId: aliceId,
                username: yandexUsername,
                name: playlistName
            }); 
            console.log(reqUrl + ': ' + resp.status);
        } catch(err) {
            console.log(reqUrl + ': ' + err);
            replyMessage = 'Что-то пошло не так, проверьте авторизацию в выбранных сервисах';
        }

        return replyMessage;

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

