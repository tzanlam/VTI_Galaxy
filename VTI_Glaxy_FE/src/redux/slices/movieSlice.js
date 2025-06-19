// src/redux/slices/movieSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import movieService from "../../services/movieService";

export const fetchMovies = createAsyncThunk(
  "movie/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await movieService.fetchMovies();
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  "movie/fetchMovieById",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.fetchMovieById(movieId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const postMovie = createAsyncThunk(
  "movie/postMovie",
  async (movieRequest, { rejectWithValue }) => {
    try {
      const response = await movieService.createMovie(movieRequest);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movie/updateMovie",
  async ({ movieId, movieRequest }, { rejectWithValue }) => {
    try {
      const response = await movieService.updateMovie(movieId, movieRequest);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movie/deleteMovie",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.deleteMovie(movieId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    movie: null,
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMovieState: (state) => {
      state.movie = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.movie = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postMovie.fulfilled, (state, action) => {
        state.movie = action.payload;
        state.movies.push(action.payload);
        state.loading = false;
      })
      .addCase(postMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.movie = action.payload;
        const index = state.movies.findIndex(
          (movie) => movie.id === action.payload.id
        );
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(
          (movie) => movie.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMovieState } = movieSlice.actions;

export default movieSlice.reducer;
