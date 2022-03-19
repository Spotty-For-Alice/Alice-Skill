const command = require('nodemon/lib/config/command');
const request = require('supertest');
const app = require('../index');
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
});

describe('integration tests', () => {
    it('POST: handle request from yandex-dialog', () => {
        const userId = '1234567890';
        const messageText = 'Test message';
        return request(app)
            .post('/alice-skill')
            .send({
                body: {
                    session: { 
                        user: {user_id: userId }
                    },
                    request: { command: messageText }
                }
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                console.log(res.body.response);
                expect(res.body.response).not.toBeUndefined();
            });
    });
})