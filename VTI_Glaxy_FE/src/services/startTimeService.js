import axiosClient from "./axiosClient";

const startTimeService = {
  fetchStartTimeByMovieIdAndDate(movieId, date) {
    return axiosClient.get(`movieId/${movieId}/andDate/${date}`);
  },
createStartTime(times, showTimeId) {
  const params = new URLSearchParams()
  times.forEach(time => params.append('times', time))
  params.append('showTimeId', showTimeId)
  return axiosClient.post('/start-times', params)
},
};

export default startTimeService;
