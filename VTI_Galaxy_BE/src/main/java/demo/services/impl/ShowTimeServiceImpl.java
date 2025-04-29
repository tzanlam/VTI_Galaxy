package demo.services.impl;

import demo.modal.dto.ShowTimeDto;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Movie;
import demo.modal.entity.ShowTime;
import demo.repository.GalaxyRepository;
import demo.repository.MovieRepository;
import demo.repository.ShowTimeRepository;
import demo.services.interfaceClass.ShowTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.convertToLocalDate;
import static demo.support.MethodSupport.convertToLocalTime;

@Service
public class ShowTimeServiceImpl implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final GalaxyRepository galaxyRepository;
    private final MovieRepository movieRepository;

    public ShowTimeServiceImpl(ShowTimeRepository showTimeRepository, GalaxyRepository galaxyRepository,
                               MovieRepository movieRepository) {
        this.showTimeRepository = showTimeRepository;
        this.galaxyRepository = galaxyRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public List<ShowTimeDto> findAll() {
        return showTimeRepository.findAll().stream().map(ShowTimeDto::new).collect(Collectors.toList());
    }

    @Override
    public ShowTimeDto findById(int id) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu với id " + id));
        return new ShowTimeDto(showTime);
    }

    @Override
    public ShowTimeDto findByDateAndMovie(int galaxyId, int movieId, String date) {
        ShowTime showTime = showTimeRepository.findByDateAndMovie(galaxyId, movieId, convertToLocalDate(date))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu"));
        return new ShowTimeDto(showTime);
    }

    @Override
    public List<ShowTimeDto> findByFilter(Integer galaxyId, Integer movieId, String date) {
        LocalDate localDate = date != null ? convertToLocalDate(date) : null;
        List<ShowTime> showTimes = showTimeRepository.findByFilter(galaxyId, movieId, localDate);
        return showTimes.stream().map(ShowTimeDto::new).collect(Collectors.toList());
    }

    @Override
    public ShowTimeDto create(int galaxyId, int movieId, String date, List<String> startTimeIds) {
        ShowTime showTime = populate(galaxyId, movieId, date, startTimeIds);
        showTimeRepository.save(showTime);
        return new ShowTimeDto(showTime);
    }

    @Override
    public ShowTimeDto updateShowTime(int id, int galaxyId, int movieId, String date, List<String> startTimes) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu với id " + id));
        ShowTime updated = populate(galaxyId, movieId, date, startTimes);
        showTime.setGalaxy(updated.getGalaxy());
        showTime.setMovie(updated.getMovie());
        showTime.setDate(convertToLocalDate(date));
        showTime.setStartTimes(updated.getStartTimes());
        showTimeRepository.save(showTime);
        return new ShowTimeDto(showTime);
    }

    @Override
    public void delete(int id) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu với id " + id));
        showTimeRepository.delete(showTime);
    }

    private ShowTime populate(int galaxyId, int movieId, String date, List<String> startTimes) {
        ShowTime showTime = new ShowTime();
        Galaxy galaxy = galaxyRepository.findById(galaxyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với id " + galaxyId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với id " + movieId));
        if (showTime.getStartTimes() == null) startTimes = new ArrayList<>();
        for (String st : startTimes){
            showTime.getStartTimes().add(convertToLocalTime(st));
        }
        showTime.setGalaxy(galaxy);
        showTime.setMovie(movie);
        showTime.setDate(convertToLocalDate(date));
        ShowTime savedShowTime = showTimeRepository.save(showTime);
        return showTimeRepository.save(savedShowTime);
    }
}