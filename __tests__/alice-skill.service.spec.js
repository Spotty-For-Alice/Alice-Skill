const command = require('nodemon/lib/config/command');
const service = require('../services/alice-skill.service');

describe('Unit tests: validate handling request and getting response message', () => {
    const aliceUserId = '1234567890';
    const command = 'Алиса, загрузи плейлист';

    afterEach(() => {
        service.clearUsers();
    });
    
    it('Get auth message', () => {
        expect(service.getMessageForReply(aliceUserId, 'Hello!').includes('введите имя пользователя')).toBe(true);
    });

    it('Get message about succesfull dialog starting', () => {
        service.getMessageForReply(aliceUserId, 'Hello!');
        expect(service.getMessageForReply(aliceUserId, 'testUsername').includes('Отлично')).toBe(true);
    });

    it('Handling not command message', () => {
        service.getMessageForReply(aliceUserId, 'Hello!');
        service.getMessageForReply(aliceUserId, 'testUsername');
        expect(service.getMessageForReply(aliceUserId, 'lalala').includes(command)).toBe(true);
    });

    it('Write command to sync playlist', () => {
        const playListName = 'testName';
        service.getMessageForReply(aliceUserId, 'Hello!');
        service.getMessageForReply(aliceUserId, 'testUsername');
        expect(service.getMessageForReply(aliceUserId, command + ' ' + playListName).includes('качаем треки')).toBe(true);
    });

    it('Get correct yandex username', () => {
        const yandexUsername = 'testUsername';
        service.getMessageForReply(aliceUserId, 'Hello!');
        service.getMessageForReply(aliceUserId, yandexUsername);

        expect(service.getYandexUsernameByAliceUserId(aliceUserId)).toEqual(yandexUsername);
    });
});