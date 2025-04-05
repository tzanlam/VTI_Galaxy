package demo.modal.dto;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.AgeLimit;
import demo.modal.entity.Movie;
import lombok.Data;

@Data
public class MovieDto {
    private int id;
    private String name;
    private String description;
    private String genre;
    private String actor;
    private String director;
    private String duration;
    private String releaseDate;
    private String createdDate;
    private String modifiedDate;
    private String country; // Thêm trường country
    private String producer; // Thêm trường producer
    private double rating; // Thêm trường rating
    private AgeLimit ageLimit; // Thêm trường ageLimit
    private ActiveStatus status; // Thêm trường status

    public MovieDto(Movie movie) {
        this.id = movie.getId();
        this.name = movie.getName();
        this.description = movie.getDescription();
        this.genre = movie.getGenre();
        this.actor = movie.getActor();
        this.director = movie.getDirector();
        this.duration = movie.getDuration() != null ? movie.getDuration().toString() : null;
        this.releaseDate = movie.getReleaseDate() != null ? movie.getReleaseDate().toString() : null;
        this.createdDate = movie.getReleaseDate() != null ? movie.getReleaseDate().toString() : null;
        this.modifiedDate = movie.getReleaseDate() != null ? movie.getReleaseDate().toString() : null;
        this.country = movie.getCountry();
        this.producer = movie.getProducer();
        this.rating = movie.getRating();
        this.ageLimit = movie.getAgeLimit();
        this.status = movie.getStatus();
    }
}
