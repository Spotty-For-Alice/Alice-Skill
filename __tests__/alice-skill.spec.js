const request = require('supertest');
const app = require('../index');
const skill = require('../routes/alise-skill');

describe('Test getting info from request', () => {
    const userId = '1234567890';
    const messageText = 'Test message';
    const req = {
        body: {
            session: { 
                user: {user_id: userId }
            },
            request: { command: messageText },
        }
    };

    it('Get alice-user id', () => {
        expect(skill.getAliceIdFromRequest(req)).toEqual(userId);
    });

    it('Get message text', () => {
        expect(skill.getMessageTextFromRequest(req)).toEqual(messageText);
    });

    it('Get empty string from invalid req', () => {
        expect(skill.getAliceIdFromRequest({})).toEqual('');
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
});