const aliceSkillRouter = require('./routes/alise-skill');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Webhook worked'));
app.use('/alice-skill', aliceSkillRouter.router);

app.listen(3000);

module.exports = app;