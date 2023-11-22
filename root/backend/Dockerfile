FROM openjdk:17

WORKDIR /app

ENV DB_URL=localhost:3306/default
ENV DB_PASSWORD=default
ENV DB_USERNAME=defautlt
ENV SOCKETIO_HOST=localhost
ENV SOCKETIO_PORT=9092
ENV SECRET_KEY=default

COPY target/backend-1.0.0-SNAPSHOT.jar .

EXPOSE 8080
EXPOSE 9092

CMD ["java", "-jar", "backend-1.0.0-SNAPSHOT.jar"]
