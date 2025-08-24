package demo.config.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationPoint jwtAuthenticationPoint;
    private final JwtFilterRequest jwtFilterRequest;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://galaxy-6ab6e.web.app",
                "https://galaxy-6ab6e.firebaseapp.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(
                        exceptionHandling ->
                                exceptionHandling
                                        .authenticationEntryPoint(jwtAuthenticationPoint)
                                        .accessDeniedHandler(customAccessDeniedHandler))
                .sessionManagement(i->i.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a->a
                        .requestMatchers(
                                // Common / Static
                                "/",
                                "/index.html",
                                "/static/**",
                                "/error",

                                // Auth & Account
                                "/login",
                                "/registerUser",
                                "/getAccountById",

                                // Movies
                                "/getMovies",
                                "/getMovieById",
                                "/postMovie",
                                "/putStatusMovie",

                                // Galaxy
                                "/postGalaxy",
                                "/getGalaxyById",

                                // Rooms
                                "/getRooms",
                                "/getRoomById",
                                "/postRoom",
                                "/putRoom",
                                "/getShowTimeByRoom",

                                // Seats
                                "/getSeat",
                                "/postSeat",
                                "/getSeatRooms",
                                "/getSeatRoomById",
                                "/postSeatRoom",
                                "/getSeatRoomByTime/time/{time}/galaxyId/{galaxyId}/movieId/{movieId}",
                                "/getSeatRoomStatus",
                                "/putSeatRoomStatus",

                                // ShowTimes
                                "/getShowTimesByFilter",
                                "/getShowTime",
                                "/postShowTime",
                                "/postStartTime",
                                "/getStartTimes",

                                // Booking
                                "/getBookings",
                                "/postBooking",

                                // Voucher
                                "/getVouchers",
                                "/getVoucherById",
                                "/postVoucher",

                                // Payment
                                "/vnpay-payment/**",

                                // Others
                                "/postOther",
                                "/getOthers",
                                "/getOtherByGalaxyId",
                                "/postImg"
                                ).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilterRequest, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
