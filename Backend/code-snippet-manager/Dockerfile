# Stage 1: Build the application using Maven
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN sed -i -e 's/\r$//' mvnw
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/code-snippet-manager-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]