# Stage 1: Build app bằng Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy file pom.xml và cài dependency trước để cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy toàn bộ source và build jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run app bằng JDK
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy file jar đã build từ stage 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
