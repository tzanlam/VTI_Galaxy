package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.AgeLimit;
import demo.modal.entity.Movie;
import lombok.Data;

import static demo.support.MethodSupport.*;

@Data
public class MovieRequest {
    private String name;
    private String description;
    private String genre;
    private String actor;
    private String director;
    private String duration;
    private String releaseDate;
    private String country;
    private String producer;
    private int rating; // Thêm trường rating (dùng Double để hỗ trợ null)
    private String  ageLimit; // Thêm trường ageLimit

    public void setMovie(Movie movie) {
        movie.setName(name);
        movie.setDescription(description);
        movie.setGenre(genre);
        movie.setActor(actor);
        movie.setDirector(director);
        movie.setDuration(convertToLocalTime(duration));
        movie.setReleaseDate(convertToLocalDate(releaseDate));
        movie.setCountry(country);
        movie.setProducer(producer);
        movie.setRating(rating);
        movie.setAgeLimit(convertStringToEnum(AgeLimit.class, ageLimit));
        movie.setStatus( ActiveStatus.INACTIVE);
    }
}
