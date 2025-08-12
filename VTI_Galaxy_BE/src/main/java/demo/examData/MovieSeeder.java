package demo.examData;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.AgeLimit;
import demo.modal.entity.Movie;
import demo.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
@Order(2)
public class MovieSeeder {
    @Bean
    CommandLineRunner seedMovies(MovieRepository movieRepo) {
        return args -> {
            if (movieRepo.count() == 0) {
                Movie m1 = createMovie("Avengers: Endgame", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490668/file_yfbnby.jpg", "USA", "Marvel Studios", "Anthony Russo, Joe Russo", "Robert Downey Jr., Chris Evans", "Action", 9);
                Movie m2 = createMovie("Inception", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490719/file_hqvdhs.jpg", "USA", "Warner Bros.", "Christopher Nolan", "Leonardo DiCaprio, Joseph Gordon-Levitt", "Sci-Fi", 9);
                Movie m3 = createMovie("Interstellar", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490743/file_qgnymz.jpg", "USA", "Paramount Pictures", "Christopher Nolan", "Matthew McConaughey, Anne Hathaway", "Sci-Fi", 9);
                Movie m4 = createMovie("The Dark Knight", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490765/file_vfxz4d.jpg", "USA", "Warner Bros.", "Christopher Nolan", "Christian Bale, Heath Ledger", "Action", 10);
                Movie m5 = createMovie("Parasite", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490798/file_hc8ap3.jpg","Hàn Quốc", "Barunson E&A", "Bong Joon-ho", "Song Kang-ho, Lee Sun-kyun", "Drama", 9);
                Movie m6 = createMovie("Joker", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490822/file_idirad.webp","USA", "Warner Bros.", "Todd Phillips", "Joaquin Phoenix, Robert De Niro", "Drama", 8);
                Movie m7 = createMovie("Spider-Man: No Way Home", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490841/file_whjwex.webp", "USA", "Marvel Studios", "Jon Watts", "Tom Holland, Zendaya", "Action", 8);
                Movie m8 = createMovie("The Matrix","http://res.cloudinary.com/dphnbm561/image/upload/v1754490868/file_yshlri.webp", "USA", "Warner Bros.", "Lana Wachowski, Lilly Wachowski", "Keanu Reeves, Laurence Fishburne", "Sci-Fi", 9);
                Movie m9 = createMovie("Gladiator", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490887/file_vho2ak.jpg","USA", "DreamWorks", "Ridley Scott", "Russell Crowe, Joaquin Phoenix", "Action", 9);
                Movie m10 = createMovie("The Shawshank Redemption", "http://res.cloudinary.com/dphnbm561/image/upload/v1754490906/file_bd54ig.jpg","USA", "Castle Rock Entertainment", "Frank Darabont", "Tim Robbins, Morgan Freeman", "Drama", 10);

                movieRepo.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10));
                System.out.println("Seeded 10 Movies");
            }
        };
    }

    private Movie createMovie(String name,String imageUrl, String country, String producer, String director, String actor, String genre, int rating) {
        Movie m = new Movie();
        m.setName(name);
        m.setImageURL(imageUrl);
        m.setCountry(country);
        m.setProducer(producer);
        m.setDescription("Mô tả " + name);
        m.setDirector(director);
        m.setActor(actor);
        m.setGenre(genre);
        m.setDuration(LocalTime.of(2, 30));
        m.setReleaseDate(LocalDate.of(2020, 1, 1));
        m.setImageURL("#");
        m.setTrailerURL("#");
        m.setTrailerURL(null);
        m.setRating(rating);
        m.setAgeLimit(AgeLimit.T18);
        m.setStatus(ActiveStatus.ACTIVE);
        return m;
    }
}
