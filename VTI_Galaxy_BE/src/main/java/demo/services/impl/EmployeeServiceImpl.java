package demo.services.impl;

import demo.modal.constant.ActiveStatus;
import demo.modal.dto.EmployeeDto;
import demo.modal.entity.Employee;
import demo.modal.entity.Galaxy;
import demo.modal.request.EmployeeRequest;
import demo.repository.EmployeeRepository;
import demo.repository.GalaxyRepository;
import demo.services.interfaceClass.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final GalaxyRepository galaxyRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, GalaxyRepository galaxyRepository) {
        this.employeeRepository = employeeRepository;
        this.galaxyRepository = galaxyRepository;
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(EmployeeDto::new).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto getEmployeeById(int id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Employee with id " + id + " not found")
        );
        return new EmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getByGalaxyId(int galaxyId) {
        List<Employee> employee = employeeRepository.findByGalaxyId(galaxyId).orElseThrow(
                () -> new RuntimeException("Galaxy with id " + galaxyId + " not found")
        );
        return employee.stream().map(EmployeeDto::new).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto createEmployee(EmployeeRequest request) {
        Galaxy galaxy = galaxyRepository.findById(request.getGalaxyId()).orElseThrow(
                () -> new RuntimeException("Galaxy with id " + request.getGalaxyId() + " not found")
        );
        try{
            Employee employee = request.setEmployee();
            employee.setGalaxy(galaxy);
            employeeRepository.save(employee);
            return new EmployeeDto(employee);
        }catch (Exception e){
            throw new RuntimeException("Employee creation failed");
        }
    }

    @Override
    public EmployeeDto updateEmployee(EmployeeRequest request, int id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Employee with id " + id + " not found")
        );
        try{
            request.updateEmployee(employee);
            employeeRepository.save(employee);
            return new EmployeeDto(employee);
        }catch (Exception e){
            throw new RuntimeException("Employee update failed");
        }
    }

    @Override
    public EmployeeDto deleteEmployee(int id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Employee with id " + id + " not found")
        );
        employee.setStatus(ActiveStatus.DELETED);
        employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }
}
