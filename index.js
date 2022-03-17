const aliceSkillRouter = require('./routes/alise-skill');
const express = require('express');

const app = express();
app.use(express.json());

app.use('/alice-skill', aliceSkillRouter);

app.listen( 3000, () => console.log( 'Node.js server started on port 3000.' ) );