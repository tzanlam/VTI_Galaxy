package demo.modal.request;

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
    private String imageURL;
    private String trailerURL;
    private String country;
    private String producer;
    private int rating;
    private String ageLimit;

    public void setMovie(Movie movie) {
        movie.setName(name);
        movie.setDescription(description);
        movie.setGenre(genre);
        movie.setActor(actor);
        movie.setDirector(director);
        movie.setDuration(convertToLocalTime(duration));
        movie.setReleaseDate(convertToLocalDate(releaseDate));
        movie.setImageURL(imageURL);
        movie.setTrailerURL(trailerURL);
        movie.setCountry(country);
        movie.setProducer(producer);
        movie.setRating(rating);
        movie.setAgeLimit(convertStringToEnum(AgeLimit.class, ageLimit));
    }
}