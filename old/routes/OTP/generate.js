const { Router } = require("express");
const { generate } = require("../../controllers/Gen/otpController");
const { body, validationResult } = require("express-validator");

const router = Router({ strict: true });

router.post('/', (req, res) => {
    (async () => {
        //****hitting the controller */
        await generate(req, res);
      })();
})

module.exports = router;