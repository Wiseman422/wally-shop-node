'use strict';
const config = require('config');

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.SendInBlue.apiKey;

const pug = require('pug');

module.exports = {
    async send(email) {
        const emailTemplate = pug.compileFile(`${process.cwd()}/src/email-templates/${email.templateFile}`);
        const emailBody = emailTemplate({
            subject: email.subject,
            name: email.name,
            preheader: email.preheader,
            data: email.data,
        });
        // if (process.env.EMAILING === 'TRUE') await this.sendEmails(email.recipient, email.subject, emailBody);
        await this.sendEmails(email.recipient, email.subject, emailBody);
        return emailBody;
    },

    async sendEmails(recipient, subject, emailBody) {
        const apiInstance = new SibApiV3Sdk.SMTPApi();
        const sendSmtpEmail = {
            sender: config.SendInBlue.sender,
            htmlContent: emailBody,
            subject: subject,
            to: [{email: recipient, name: 'Wally'}],
            replyTo: {email: 'support@thewallyshop.co'},
        };

        return await apiInstance.sendTransacEmail(sendSmtpEmail);
    },
};


