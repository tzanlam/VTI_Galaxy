package demo.config.mail;

import jakarta.mail.MessagingException;

public interface MailService {
    void sendMail(String from, String to, String subject, String text) throws MessagingException;
}
