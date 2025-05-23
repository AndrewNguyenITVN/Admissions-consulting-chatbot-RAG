import express from "express";
import homeControllers from "../controllers/HomeControllers";
import chatBotController from "../controllers/chatBotController";

let router = express.Router();
let initWebRoutes = (app) => {
    router.get("/", homeControllers.getHomePage)

    router.post("/setup-profile", chatBotController.setupProfile);

    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);

    return app.use('/', router);
}

module.exports = initWebRoutes;