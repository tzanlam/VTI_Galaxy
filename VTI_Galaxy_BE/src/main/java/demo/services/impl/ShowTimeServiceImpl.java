package demo.services.impl;

import demo.modal.dto.ShowTimeDto;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Movie;
import demo.modal.entity.ShowTime;
import demo.modal.entity.StartTime;
import demo.repository.GalaxyRepository;
import demo.repository.MovieRepository;
import demo.repository.ShowTimeRepository;
import demo.repository.StartTimeRepository;
import demo.services.interfaceClass.ShowTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public ShowTimeServiceImpl(ShowTimeRepository showTimeRepository, GalaxyRepository galaxyRepository,
                               MovieRepository movieRepository, StartTimeRepository startTimeRepository) {
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
    public ShowTimeDto create(int galaxyId, int movieId, String date, List<Integer> startTimeIds) {
        ShowTime showTime = populate(galaxyId, movieId, date, startTimeIds);
        showTimeRepository.save(showTime);
        showTime = showTimeRepository.findById(showTime.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu sau khi lưu"));
        return new ShowTimeDto(showTime);
    }

    @Override
    public ShowTimeDto updateShowTime(int id, int galaxyId, int movieId, String date, List<Integer> startTimeIds) {
        ShowTime showTime = showTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu với id " + id));
        ShowTime updated = populate(galaxyId, movieId, date, startTimeIds);
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

    private ShowTime populate(int galaxyId, int movieId, String date, List<Integer> startTimeIds) {
        Galaxy galaxy = galaxyRepository.findById(galaxyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với id " + galaxyId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với id " + movieId));
        List<StartTime> startTimes = new ArrayList<>();
        for (Integer id : startTimeIds) {
            StartTime startTime = startTimeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thời gian bắt đầu với id " + id));
            startTimes.add(startTime);
        }
        ShowTime showTime = new ShowTime();
        showTime.setGalaxy(galaxy);
        showTime.setMovie(movie);
        showTime.setDate(convertToLocalDate(date));

        // Lưu ShowTime trước để có ID
        ShowTime savedShowTime = showTimeRepository.save(showTime);

        // Cập nhật và lưu StartTime
        startTimes.forEach(st -> {
            st.setShowTime(savedShowTime);
            startTimeRepository.save(st);
        });
        savedShowTime.setStartTimes(startTimes);

        return showTimeRepository.save(savedShowTime);
    }
}