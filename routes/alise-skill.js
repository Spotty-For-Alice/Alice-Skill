const express = require('express');
const aliceSkillService = require('../services/alice-skill.service')

var router = express.Router();

router.post('/', (req, res) => {
    const aliceId = getAliceIdFromRequest(req);
    const msgText = getMessageTextFromRequest(req);

    res.json({
        version: req.body["version"],
        session: req.body["session"],
        response: {
            text: aliceSkillService.getMessageForReply(aliceId, msgText),
            end_session: false
        }
    });
});

const getAliceIdFromRequest = (req) => {
    var aliceId = '';
    try {
        aliceId = req.body["session"]["user"]["user_id"];
    } catch(err) {
        console.log(err);
    }
    return aliceId;
}

const getMessageTextFromRequest = (req) => {
    var text = '';
    try {
        text = req.body["request"]["command"];
    } catch(err) {
        console.log(err);
    }
    return text;
}

module.exports = {router, getAliceIdFromRequest, getMessageTextFromRequest};
