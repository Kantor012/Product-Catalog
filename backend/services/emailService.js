import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import config from '../config/index.js';

const mailerSend = new MailerSend({
    apiKey: config.mailerSendApiKey,
});

const sendVerificationEmail = async (userEmail, verificationToken) => {
    if (!config.mailerSendApiKey || !config.mailerSendSenderEmail) {
        console.error('Brak klucza API MailerSend lub e-maila nadawcy w pliku .env');
        return;
    }
    const sentFrom = new Sender(config.mailerSendSenderEmail, 'Katalog Produktów');
    const recipients = [
        new Recipient(userEmail, 'Nowy Użytkownik'),
    ];
    const verificationLink = `${config.baseUrl}/verify/${verificationToken}`;
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject('Potwierdź swoje konto')
        .setHtml(
            `<p>Dziękujemy za rejestrację! Kliknij w poniższy link, aby aktywować swoje konto:</p>
             <a href="${verificationLink}">${verificationLink}</a>`
        )
        .setText(
            `Witaj, aby potwierdzić swoje konto, skopiuj i wklej ten link do przeglądarki: ${verificationLink}`
        );

    try {
        await mailerSend.email.send(emailParams);
        console.log(`E-mail weryfikacyjny pomyślnie wysłany do ${userEmail}`);
    } catch (error) {
        console.error('Błąd podczas wysyłania e-maila przez MailerSend:', error.body);
    }
};

export { sendVerificationEmail };