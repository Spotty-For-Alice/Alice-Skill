const command = require('nodemon/lib/config/command');
const service = require('../services/alice-skill.service');

describe('Unit tests: validate handling request and getting response message', () => {
    const aliceUserId = '1234567890';
    const command = 'Алиса, загрузи плейлист';

    afterEach(() => {
        service.clearUsers();
    });
    
    it('Get auth message', async () => {
        expect((await service.getMessageForReply(aliceUserId, 'Hello!')).includes('введите имя пользователя')).toBe(true);
    });

    it('Get message about succesfull dialog starting', async () => {
        await service.getMessageForReply(aliceUserId, 'Hello!');
        expect((await service.getMessageForReply(aliceUserId, 'testUsername')).includes('Отлично')).toBe(true);
    });

    it('Handling not command message', async () => {
        await service.getMessageForReply(aliceUserId, 'Hello!');
        await service.getMessageForReply(aliceUserId, 'testUsername');
        expect((await service.getMessageForReply(aliceUserId, 'lalala')).includes(command)).toBe(true);
    });

    it.skip('Write command to sync playlist', async () => {
        const playListName = 'testName';
        await service.getMessageForReply(aliceUserId, 'Hello!');
        await service.getMessageForReply(aliceUserId, 'testUsername');
        expect((await service.getMessageForReply(aliceUserId, command + ' ' + playListName)).includes('качаем треки')).toBe(true);
    });

    it.skip('Get correct yandex username', async () => {
        const yandexUsername = 'testUsername';
        await service.getMessageForReply(aliceUserId, 'Hello!');
        await service.getMessageForReply(aliceUserId, yandexUsername);

        expect(service.getYandexUsernameByAliceUserId(aliceUserId)).toEqual(yandexUsername);
    });
});