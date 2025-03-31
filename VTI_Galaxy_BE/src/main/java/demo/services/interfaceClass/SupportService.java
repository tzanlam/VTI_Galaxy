package demo.services.interfaceClass;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface SupportService {
    boolean checkCode(int accountId, String code);
    String upload(MultipartFile file) throws IOException;
}
