FROM openjdk:21-jdk-slim
COPY target/comp1640-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-Xmx512m","-jar","/app.jar"]