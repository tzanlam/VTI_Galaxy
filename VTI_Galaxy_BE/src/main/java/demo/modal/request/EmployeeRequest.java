package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Employee;
import lombok.Data;

import static demo.support.MethodSupport.convertToLocalDate;

@Data
public class EmployeeRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;
    private String jobTitle;
    private String evaluate;
    private int numberOfWorkingHours;
    private String startDateWorking;
    private int galaxyId;
    private int wage;


    public Employee setEmployee(){
        Employee employee = new Employee();
        employee.setFullName(fullName);
        employee.setEmail(email);
        employee.setPhoneNumber(phone);
        employee.setAddress(address);
        employee.setDateOfBirth(convertToLocalDate(dateOfBirth));
        employee.setJobTitle(jobTitle);
        employee.setEvaluate("");
        employee.setNumberOfWorkingHours(0);
        employee.setStartDateWorking(convertToLocalDate(startDateWorking));
        employee.setWage(wage);
        employee.setStatus(ActiveStatus.ACTIVE);
        return employee;
    }

    public void updateEmployee(Employee employee){
        employee.setFullName(fullName);
        employee.setEmail(email);
        employee.setPhoneNumber(phone);
        employee.setAddress(address);
        employee.setNumberOfWorkingHours(numberOfWorkingHours);
        employee.setStartDateWorking(convertToLocalDate(startDateWorking));
        employee.setWage(wage);
    }
}
