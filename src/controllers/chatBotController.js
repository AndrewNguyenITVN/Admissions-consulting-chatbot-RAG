import request from "request";
import moment from "moment";
import chatBotService from "../services/chatBotService";
import homepageService from "../services/homepageService";

const dotenv = require("dotenv");

dotenv.config();

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {
    let verifyToken = process.env.VERIFY_TOKEN;
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === verifyToken) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}


let handleMessage = async (sender_psid, received_message) => {
    let response;

    // Đánh dấu tin nhắn là đã được xem
    await chatBotService.markMessageSeen(sender_psid);

    // Gửi trạng thái "đang nhập" để người dùng biết chatbot đang trả lời
    await chatBotService.sendTypingOn(sender_psid);

    // Nếu tin nhắn chứa văn bản
    if (received_message.text) {
        let userMessage = received_message.text;

        // Gọi OpenAI để lấy phản hồi từ AI
        let aiResponse = await chatBotService.generate_response(userMessage);

        response = { "text": aiResponse };
    } else {
        // Nếu người dùng gửi ảnh, chatbot vẫn xử lý như cũ
        response = { "text": "Tôi chỉ có thể hiểu tin nhắn văn bản!" };
    }

    // Gửi phản hồi đến người dùng
    callSendAPI(sender_psid, response);
};


let handlePostback = async (sender_psid, received_postback) => {
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload

    await chatBotService.markMessageSeen(sender_psid);
    switch (payload) {
        case "GET_STARTED":
        // case "RESTART_CONVERSATION":
        //     //get facebook username
        //     let username = await chatBotService.getFacebookUsername(sender_psid);
        //     user.name = username;
        //     //send welcome response to users

        //     await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
        //     break;
        case "GUIDE_BOT":
            await homepageService.sendGuideToUseBot(sender_psid);
            break;

        case "yes":
            response = { text: "Thank you!" };
            callSendAPI(sender_psid, response);
            break;
        case "no":
            response = { text: "Please try another image." };
            callSendAPI(sender_psid, response);
            break;
        default:
            console.log("Something wrong with switch case payload");
    }
    // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
};
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let setupProfile = async (req, res) => {
    let request_body = {
        "get_started": { "payload": "GET_STARTED" },
        "whitelisted_domains": ["https://my-chatbot-messenger.onrender.com"]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);
        if (!err) {
            console.log('set up profile successed')
        } else {
            console.error("Unable to set up profile:" + err);
        }
    });

    return res.send("Toi la chat bor tu van");
}

module.exports = {
    postWebhook,
    getWebhook,
    setupProfile
};