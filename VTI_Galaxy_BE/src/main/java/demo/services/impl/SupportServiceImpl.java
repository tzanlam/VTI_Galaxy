package demo.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import demo.modal.entity.Account;
import demo.repository.AccountRepository;
import demo.services.interfaceClass.SupportService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class SupportServiceImpl implements SupportService {
    private final AccountRepository accountRepository;
    private final Cloudinary cloudinary;

    public SupportServiceImpl(AccountRepository accountRepository, Cloudinary cloudinary) {
        this.accountRepository = accountRepository;
        this.cloudinary = cloudinary;
    }

    @Override
    public boolean checkCode(int accountId, String code) {
        Account account = accountRepository.findById(accountId).orElseThrow(
                () -> new RuntimeException("Account not found")
        );
        try{
            if (account.getConfirmCode().equals(code)) {
                account.setConfirmCode(null);
                return true;
            }
            return false;
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong");
        }
    }

    @Override
    public String upload(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("url").toString();
    }
}
