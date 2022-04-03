const request = require('supertest');
const app = require('../index');

afterAll(() => {
  app.server.close();
});

describe('validate sync playlist tests', () => {
  
  it('write username and sync playlist', async () => {
    const aliceUserId = '1234567890';

    await request(app.server)
      .post('/alice-skill')
      .send({
        session: { 
          user: {user_id: aliceUserId }
        },
        request: { command: 'hello there' }
      })

    await request(app.server)
      .post('/alice-skill')
      .send({
        session: { 
          user: {user_id: aliceUserId }
        },
        request: { command: 'username' }
      })

    return request(app.server)
      .post('/alice-skill')
      .send({
          session: { 
            user: {user_id: aliceUserId }
          },
          request: { command: 'Алиса, загрузи плейлист TestName' }          
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log(res.body?.response?.text);
        // TODO: add assert on normal result
        expect(res.body.response).not.toBeUndefined();
      });
  });
});