package demo.modal.dto;

import demo.modal.entity.Employee;
import lombok.Data;

@Data
public class EmployeeDto {
    private int id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;
    private String jobTitle;
    private String evaluate;
    private int numberOfWorkingHours;
    private String startDateWorking;
    private int salary;
    private String status;
    private int galaxyId;

    public EmployeeDto(Employee emp) {
        this.id = emp.getId();
        this.fullName = emp.getFullName();
        this.galaxyId = emp.getGalaxy().getId();
        this.email = emp.getEmail();
        this.phone = emp.getPhoneNumber();
        this.address = emp.getAddress();
        this.dateOfBirth = emp.getDateOfBirth() != null ? emp.getDateOfBirth().toString() : null;
        this.jobTitle = emp.getJobTitle();
        this.evaluate = emp.getEvaluate();
        this.numberOfWorkingHours = emp.getNumberOfWorkingHours();
        this.startDateWorking = emp.getStartDateWorking() != null ? emp.getStartDateWorking().toString() : null;
        this.salary = emp.getSalary();
        this.status = emp.getStatus() != null ? emp.getStatus().toString() : null;
    }
}
