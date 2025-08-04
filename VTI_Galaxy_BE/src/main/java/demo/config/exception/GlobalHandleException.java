//package demo.config.exception;
//
//import demo.modal.dto.ApiError;
//import demo.modal.dto.ErrorDetails;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.BindException;
//import org.springframework.validation.ObjectError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.web.context.request.WebRequest;
//import org.springframework.web.servlet.NoHandlerFoundException;
//
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalHandleException {
//
//    @ExceptionHandler(BindException.class)
//    public ResponseEntity<?> BindException(BindException ex, WebRequest request) {
//        ErrorDetails error = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false));
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//
//    // 400 - Bad Request
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ApiError> handleBadRequest(MethodArgumentNotValidException ex, HttpServletRequest request) {
//        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
//        ApiError error = new ApiError(400, "Bad Request", message, request.getRequestURI());
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    // 404 - Not Found
//    @ExceptionHandler(NoHandlerFoundException.class)
//    public ResponseEntity<ApiError> handleNotFound(NoHandlerFoundException ex, HttpServletRequest request) {
//        ApiError error = new ApiError(404, "Not Found", "API không tồn tại: " + ex.getRequestURL(), request.getRequestURI());
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    // 500 - Internal Server Error
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiError> handleException(Exception ex, HttpServletRequest request) {
//        ApiError error = new ApiError(500, "Internal Server Error", ex.getMessage(), request.getRequestURI());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//}
