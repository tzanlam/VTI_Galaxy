# Stage 1: Build ứng dụng bằng Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và src để build
COPY VTI_Galaxy_BE/pom.xml .
COPY VTI_Galaxy_BE/src ./src

# Build project (bỏ qua test cho nhanh)
RUN mvn clean package -DskipTests

# Stage 2: Chạy app với JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy file jar từ stage build
COPY --from=build /app/target/*.jar app.jar

# Render sẽ tự set biến môi trường $PORT
EXPOSE 8080

# Dùng shell để expand biến môi trường $PORT
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
