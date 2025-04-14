import axiosClient from "./axiosClient";

const movieService = {
  fetchMovies() {
    return axiosClient.get("/getMovies");
  },
  fetchMovieById(movieId) {
    return axiosClient.get(`/getMovieById?movieId=${movieId}`);
  },
  createMovie(movieRequest) {
    return axiosClient.post("/postMovie", movieRequest);
  },
  updateMovie(movieId, movieRequest) {
    return axiosClient.put(`/putMovie?movieId=${movieId}`, movieRequest);
  },
  deleteMovie(movieId) {
    return axiosClient.put(`/deleteMovie?movieId=${movieId}`);
  },
};

export default movieService;