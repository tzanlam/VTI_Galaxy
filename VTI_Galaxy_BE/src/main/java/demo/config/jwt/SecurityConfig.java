package demo.config.jwt;

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
public class SecurityConfig {
    private final JwtAuthenticationPoint jwtAuthenticationPoint;
    private final JwtFilterRequest jwtFilterRequest;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    public SecurityConfig(JwtAuthenticationPoint jwtAuthenticationPoint, JwtFilterRequest jwtFilterRequest, CustomAccessDeniedHandler customAccessDeniedHandler) {
        this.jwtAuthenticationPoint = jwtAuthenticationPoint;
        this.jwtFilterRequest = jwtFilterRequest;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
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
                                "/",
                                "/index.html",
                                "/static/**",
                                "/vnpay-payment/**", // Bao gồm tất cả endpoint con của /vnpay-payment
                                "/error",
                                "getEmployees",
                                "/getAccountById",
                                "/getVouchers",
                                "/getVoucherById",
                                "/postVoucher",
                                "/postRoom",
                                "/postImg",
                                "/getMovieById",
                                "/getGalaxyById ",
                                "/getShowTimeByRoom",
                                "/getRooms",
                                "/registerUser",
                                "/postMovie",
                                "/login",
                                "/postImg",
                                "/postMovie",
                                "/getMovies",
                                "/getMovieById",
                                "/putStatusMovie",
                                "/postGalaxy",
                                "/getShowTimesByFilter",
                                "/getShowTime",
                                "/postShowTime",
                                "/postStartTime",
                                "/getStartTimes",
                                "/postSeat",
                                "/getSeat",
                                "/postRoom",
                                "/getRooms",
                                "/postSeatRoom",
                                "/getSeatRooms",
                                "/getSeatRoomById",
                                "/getSeatRoomStatus",
                                "/postOther",
                                "/getOthers",
                                "/getOtherByGalaxyId",
                                "/getBookings",
                                "/postBooking",
                                "/getSeatRoomById",
                                "/putSeatRoomStatus"
                                ).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilterRequest, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
