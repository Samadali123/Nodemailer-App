const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require("dotenv").config();
const OAuth2 = google.auth.OAuth2;

exports.mailsend = async(req, res) => {
    const createTransporter = async() => {
        const oauth2Client = new OAuth2(
            process.env.ClientId,
            process.env.ClientSecret,
            "https://developers.google.com/oauthplayground"
        );

        // Set a refresh token
        oauth2Client.setCredentials({
            refresh_token: process.env.RefreshToken
        });

        // Access token
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });

        // Creating a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.Email,
                clientId: process.env.ClientId, // Corrected here
                clientSecret: process.env.ClientSecret, // Corrected here
                refreshToken: process.env.RefreshToken,
                accessToken: accessToken // Use the access token here
            }
        });

        return transporter;
    }

    let emailOptions = {
        from: process.env.Email,
        to: req.body.to,
        subject: req.body.subject,
        html: `<h1 style="color: red; font-size:20px;">Your account is hacked.</h1>` // Fixed HTML syntax
    }

    try {
        const emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Email failed to send");
    }
};