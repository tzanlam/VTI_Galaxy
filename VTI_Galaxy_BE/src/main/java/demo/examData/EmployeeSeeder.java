package demo.examData;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Employee;
import demo.modal.entity.Galaxy;
import demo.repository.EmployeeRepository;
import demo.repository.GalaxyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.util.List;

@Configuration
@Order(7)
public class EmployeeSeeder {

    @Bean
    CommandLineRunner seedEmployees(
            EmployeeRepository employeeRepo,
            GalaxyRepository galaxyRepo
    ) {
        return args -> {
            if (employeeRepo.count() == 0) {
                List<Galaxy> galaxies = galaxyRepo.findAll();

                if (galaxies.isEmpty()) {
                    System.out.println("⚠️ Chưa có Galaxy để tạo Employee.");
                    return;
                }

                for (int i = 0; i < 5; i++) {
                    Galaxy galaxy = galaxies.get(i % galaxies.size());

                    Employee emp = getEmployee(i, galaxy);

                    employeeRepo.save(emp);
                    System.out.println("Created 5 employee");
                }
            }
        };
    }

    private static Employee getEmployee(int i, Galaxy galaxy) {
        Employee emp = new Employee();
        emp.setFullName("Nhân viên " + (i + 1));
        emp.setEmail("employee" + (i + 1) + "@example.com");
        emp.setPhoneNumber("090000000" + i);
        emp.setAddress("Địa chỉ " + (i + 1));
        emp.setDateOfBirth(LocalDate.of(1995, 1, i + 1));
        emp.setJobTitle("Nhân viên bán vé");
        emp.setEvaluate("Làm việc chăm chỉ");
        emp.setGalaxy(galaxy);
        emp.setNumberOfWorkingHours(160);
        emp.setStartDateWorking(LocalDate.of(2023, 1, 10));
        emp.setSalary(8000000 + i * 500000);
        emp.setStatus(ActiveStatus.ACTIVE);
        return emp;
    }
}
