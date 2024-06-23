var express = require('express');
var router = express.Router();
const sendmailcontroller = require("../controllers/sendmail")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


router.post('/sendmail', sendmailcontroller.mailsend)








module.exports = router;