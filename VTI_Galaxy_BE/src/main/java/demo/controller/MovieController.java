package demo.controller;

import demo.modal.request.MovieRequest;
import demo.services.interfaceClass.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/getMovies")
    public ResponseEntity<?> getMovies() {
        try{
            return ResponseEntity.ok(movieService.getAllMovies());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getMovieById")
    public ResponseEntity<?> getMovieById(@RequestParam("movieId") int id) {
        try{
            return ResponseEntity.ok(movieService.getMovieById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postMovie")
    public ResponseEntity<?> postMovie(@RequestBody MovieRequest request) {
        try{
            return ResponseEntity.ok(movieService.addMovie(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putMovie")
    public ResponseEntity<?> putMovie(@RequestBody MovieRequest request, @RequestParam("movieId") int id) {
        try{
            return ResponseEntity.ok(movieService.updateMovie(request, id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putStatusMovie")
    public ResponseEntity<?> putStatusMovie(@RequestParam("movieId") int id) {
        try{
            return ResponseEntity.ok(movieService.updateStatusMovie(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteMovie")
    public ResponseEntity<?> deleteMovie(@RequestParam("movieId") int id) {
        try{
            return ResponseEntity.ok(movieService.deleteMovie(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
