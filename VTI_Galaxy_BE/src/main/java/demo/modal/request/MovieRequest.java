package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Movie;
import lombok.Data;

import static demo.support.MethodSupport.convertToLocalDate;
import static demo.support.MethodSupport.convertToLocalTime;

@Data
public class MovieRequest {
    private String name;
    private String description;
    private String genre;
    private String actor;
    private String director;
    private String duration;
    private String releaseDate;

    public void setMovie(Movie movie) {
        movie.setName(name);
        movie.setDescription(description);
        movie.setGenre(genre);
        movie.setActor(actor);
        movie.setDirector(director);
        movie.setDuration(convertToLocalTime(duration));
        movie.setReleaseDate(convertToLocalDate(releaseDate));
        movie.setStatus(ActiveStatus.INACTIVE);
    }
}
