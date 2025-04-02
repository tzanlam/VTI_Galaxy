package demo.services.impl;

import demo.modal.constant.ActiveStatus;
import demo.modal.dto.MovieDto;
import demo.modal.entity.Movie;
import demo.modal.request.MovieRequest;
import demo.repository.MovieRepository;
import demo.services.interfaceClass.MovieService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll().stream().map(MovieDto::new).collect(Collectors.toList());
    }

    @Override
    public MovieDto getMovieById(int id) {
        Movie movie = movieRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Movie not found")
        );
        return new MovieDto(movie);
    }

    @Override
    public MovieDto addMovie(MovieRequest request) {
        try {
            Movie movie = new Movie();
            request.setMovie(movie);
            return new MovieDto(movieRepository.save(movie));
        } catch (Exception e) {
            throw new RuntimeException("Create movie failed");
        }
    }

    @Override
    public MovieDto updateMovie(MovieRequest request, int id) {
        Movie movie = movieRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Movie not found")
        );
        try{
            request.setMovie(movie);
            return new MovieDto(movieRepository.save(movie));
        }catch (Exception e){
            throw new RuntimeException("Update movie failed");
        }
    }

    @Override
    public MovieDto updateStatusMovie(int id) {
        Movie movie = movieRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Movie not found")
        );
        try{
            if (movie.getStatus().equals(ActiveStatus.ACTIVE)){
                movie.setStatus(ActiveStatus.INACTIVE);
            }else {
                movie.setStatus(ActiveStatus.ACTIVE);
            }
            return new MovieDto(movieRepository.save(movie));
        }catch (Exception e){
            throw new RuntimeException("Change status movie failed");
        }
    }

    @Override
    public MovieDto deleteMovie(int id) {
        Movie movie = movieRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Movie not found")
        );
        try {
            movie.setStatus(ActiveStatus.DELETED);
            return new MovieDto(movieRepository.save(movie));
        }catch (Exception e){
            throw new RuntimeException("Delete movie failed");
        }
    }
}
