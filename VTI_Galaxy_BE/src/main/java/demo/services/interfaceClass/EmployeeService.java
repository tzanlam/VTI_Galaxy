package demo.services.interfaceClass;

import demo.modal.dto.EmployeeDto;
import demo.modal.request.EmployeeRequest;

import java.util.List;

public interface EmployeeService {
    // get
    List<EmployeeDto> getAllEmployees();
    EmployeeDto getEmployeeById(int id);
    List<EmployeeDto> getByGalaxyId(int galaxyId);

    // post
    EmployeeDto createEmployee(EmployeeRequest request);


    // update
    EmployeeDto updateEmployee(EmployeeRequest request, int id);

    // delete
    EmployeeDto deleteEmployee(int id);
}
