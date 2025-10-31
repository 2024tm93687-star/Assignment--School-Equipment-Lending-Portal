# -------- Build stage --------
FROM maven:3.9.9-eclipse-temurin-11 AS build
WORKDIR /app

# Copy pom and sources
COPY pom.xml ./
COPY src ./src

# Build without tests
RUN mvn -DskipTests clean package

# -------- Runtime stage --------
FROM eclipse-temurin:11-jre
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Ensure the app binds to 0.0.0.0 (Spring Boot does by default)
ENTRYPOINT ["java","-jar","/app/app.jar"]


