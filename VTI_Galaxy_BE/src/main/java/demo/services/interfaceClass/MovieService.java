package demo.services.interfaceClass;

import demo.modal.dto.MovieDto;
import demo.modal.request.MovieRequest;

import java.util.List;

public interface MovieService {
    // get
    List<MovieDto> getAllMovies();
    MovieDto getMovieById(int id);

    // post
    MovieDto addMovie(MovieRequest request);

    // put
    MovieDto updateMovie(MovieRequest request, int id);

    // closed
    MovieDto updateStatusMovie(int id);

    // set delete
    MovieDto deleteMovie(int id);
}
