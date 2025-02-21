# # Sử dụng base image với OpenJDK 21
# FROM openjdk:21-jdk-slim

# # Cài đặt các công cụ cần thiết (curl, git, bash, dos2unix, và Maven)
# RUN apt-get update && apt-get install -y \
#     curl \
#     git \
#     bash \
#     dos2unix \
#     maven \
#     && rm -rf /var/lib/apt/lists/*

# # Đặt thư mục làm việc trong container
# WORKDIR /app

# # Sao chép tệp pom.xml và thư mục mã nguồn
# COPY pom.xml ./
# COPY src ./src

# # Kiểm tra xem Maven đã được cài đặt chính xác
# RUN mvn -v

# # Cài đặt các phụ thuộc Maven
# RUN mvn clean install -DskipTests

# # Chạy ứng dụng Spring Boot
# CMD ["mvn", "spring-boot:run"]

# -----------------------------------------------------------------------------------------------------------------
# # Build jar trước khi đưa lên container: mvn clean package -DskipTests

# Sử dụng base image với OpenJDK 21
FROM openjdk:21-jdk-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép tệp .jar đã xây dựng vào container
COPY target/advancedRealEstate_BE-0.0.1-SNAPSHOT.jar advancedRealEstate_BE-0.0.1-SNAPSHOT.jar

# Chạy ứng dụng Spring Boot từ .jar
ENTRYPOINT ["java", "-jar", "advancedRealEstate_BE-0.0.1-SNAPSHOT.jar"]
