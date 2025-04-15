package demo.services.impl;

import demo.modal.dto.ShowTimeDto;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Movie;
import demo.modal.entity.ShowTime;
import demo.modal.entity.StartTime;
import demo.services.impl.repository.GalaxyRepository;
import demo.services.impl.repository.MovieRepository;
import demo.services.impl.repository.ShowTimeRepository;
import demo.services.impl.repository.StartTimeRepository;
import demo.services.interfaceClass.ShowTimeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.convertToLocalDate;

@Service
public class ShowTimeServiceImpl implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final GalaxyRepository galaxyRepository;
    private final MovieRepository movieRepository;
    private final StartTimeRepository startTimeRepository;

    public ShowTimeServiceImpl(ShowTimeRepository showTimeRepository, GalaxyRepository galaxyRepository, MovieRepository movieRepository, StartTimeRepository startTimeRepository) {
        this.showTimeRepository = showTimeRepository;
        this.galaxyRepository = galaxyRepository;
        this.movieRepository = movieRepository;
        this.startTimeRepository = startTimeRepository;
    }

    @Override
    public List<ShowTimeDto> findAll() {
        return showTimeRepository.findAll().stream().map(ShowTimeDto::new).collect(Collectors.toList());
    }

    @Override
    public ShowTimeDto findByDateAndMovie(int galaxyId, int movieId, String date) {
        ShowTime showTime = showTimeRepository.findByDateAndMovie(galaxyId, movieId, convertToLocalDate(date)).orElseThrow();
        return new ShowTimeDto(showTime);
    }

    @Override
    public ShowTimeDto create(int galaxyId, int movieId, String date, List<Integer> startTimeId) {
        return populate(galaxyId, movieId, startTimeId);
    }

    @Override
    public ShowTimeDto updateShowTime(int id, int galaxyId, int movieId, String date, List<Integer> startTimeId) {
        ShowTime showTime = showTimeRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Show time with id " + id + " does not exist")
        );
        try {
            populate(galaxyId, movieId, startTimeId);
            showTimeRepository.save(showTime);
            return new ShowTimeDto(showTime);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private ShowTimeDto populate(int galaxyId, int movieId, List<Integer> startTimeId) {
        Galaxy galaxy = galaxyRepository.findById(galaxyId).orElseThrow(
                () -> new RuntimeException("Galaxy with id " + galaxyId + " does not exist")
        );
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new RuntimeException("Movie with id " + movieId + " does not exist")
        );
        List<StartTime> startTimes = new ArrayList<>();
        for (int i = 0; i <= startTimeId.size(); i++) {
            StartTime startTime = startTimeRepository.findById(Long.valueOf(startTimeId.get(i)).describeConstable().orElseThrow()).orElseThrow();
            startTimes.add(startTime);
        }
        try{
            ShowTime showTime = new ShowTime();
            showTime.setGalaxy(galaxy);
            showTime.setMovie(movie);
            if (showTime.getStartTimes() != null){
                showTime.setStartTimes(startTimes);
            }else{
                showTime.setStartTimes(new ArrayList<>());
            }
            showTimeRepository.save(showTime);
            return new ShowTimeDto(showTime);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
