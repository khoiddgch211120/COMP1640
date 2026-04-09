# COMP1640 Backend - README

## 📋 Mục Lục
- [Giới thiệu](#giới-thiệu)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt Và Thiết Lập](#cài-đặt-và-thiết-lập)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Cấu Hình Cơ Sở Dữ Liệu](#cấu-hình-cơ-sở-dữ-liệu)
- [Xác Thực Và Phép Cấp](#xác-thực-và-phép-cấp)
- [WebSocket Notifications](#websocket-notifications)
- [Quản Lý File Upload](#quản-lý-file-upload)
- [Build & Deployment](#build--deployment)

---

## 🎯 Giới Thiệu

**COMP1640** là một ứng dụng web toàn diện được xây dựng với **Spring Boot 3.3.0** trên **Java 21**. 
Backend cung cấp các API RESTful cho việc quản lý ý tưởng, người dùng, bộ phận, kỳ học và các tính năng liên quan khác.

Dự án hỗ trợ:
- 💬 **WebSocket + STOMP** cho real-time notifications
- 🏢 **JPA/Hibernate** cho ORM
- 🔐 **JWT** cho xác thực
- 📁 **Cloudinary** cho lưu trữ file
- 📊 **CSV Export** cho xuất dữ liệu
- 🔌 **MySQL** làm cơ sở dữ liệu

---

## 🛠️ Công Nghệ Sử Dụng

### Core Framework
| Công Nghệ | Phiên Bản | Mô Tả |
|-----------|----------|-------|
| **Spring Boot** | 3.3.0 | Framework chính |
| **Java** | 21 | Ngôn ngữ lập trình |
| **Maven** | - | Build tool |

### Dependencies Chính

#### Framework & ORM
- **Spring Boot Web Starter** - REST API & Web support
- **Spring Data JPA** - Database persistence & ORM
- **Hibernate** - JPA implementation (MySQL Dialect)

#### Bảo Mật
- **Spring Security** - Authentication & Authorization
- **JWT (JJWT 0.11.5)** 
  - `jjwt-api` - JWT API
  - `jjwt-impl` - Implementation
  - `jjwt-jackson` - JSON serialization

#### Database
- **MySQL Connector/J** - MySQL driver cho Java

#### Real-time Communication
- **Spring WebSocket** - WebSocket support
- **STOMP** (Simple Text Oriented Messaging Protocol) - Message protocol

#### API Documentation
- **SpringDoc OpenAPI 2.5.0** - Swagger/OpenAPI support
- **URL**: `/swagger-ui/index.html`
- **Schema**: `/v3/api-docs`

#### File Upload & Cloud Storage
- **Cloudinary HTTP44 (1.36.0)** - Cloud image/file storage
- Hỗ trợ: PNG, JPG, PDF, Document, Video

#### Data Export
- **OpenCSV 5.9** - CSV file generation & parsing

#### Utilities
- **Lombok 1.18.30** - Code generation (Getters, Setters, Constructors)

#### Validation
- **Spring Boot Validation Starter** - Bean validation (JSR 380)

#### Testing
- **Spring Boot Test Starter** - Unit & Integration testing

---

## ⚙️ Yêu Cầu Hệ Thống

### Bắt Buộc
- **Java 21** hoặc cao hơn
- **Maven 3.6.0** hoặc cao hơn
- **MySQL 8.0** hoặc cao hơn
- **Node.js 16+** (nếu chạy cùng Frontend)

### Optional
- **Git** cho version control
- **Postman/Insomnia** cho API testing
- **IDE**: IntelliJ IDEA / VS Code + Extensions

---

## 📥 Cài Đặt Và Thiết Lập

### 1. Clone Repository (nếu chưa có)
```bash
git clone <repository-url>
cd backend/comp1640
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` hoặc thiết lập biến môi trường:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=comp1640
DB_USERNAME=root
DB_PASSWORD=Admin123@

# JWT Configuration
JWT_SECRET=comp1640-secret-key-1234567890-abcdef-xyz
JWT_EXPIRATION=86400000  # 24 hours in milliseconds

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=dfnyvfiuq
CLOUDINARY_API_KEY=722446538895148
CLOUDINARY_API_SECRET=E8RB0nF6TxAKQ3SWmZ5lKkbZvpg

# Server
SERVER_PORT=8080
```

**Lưu ý**: Các giá trị mặc định được cấu hình trong `application.properties`

### 3. Cập Nhật Dependencies
```bash
# Sử dụng Maven Wrapper (Windows)
mvnw clean install

# Hoặc sử dụng Maven system
mvn clean install
```

### 4. Tạo Cơ Sở Dữ Liệu
```sql
CREATE DATABASE comp1640;
USE comp1640;
```

Hibernate sẽ tự động tạo các bảng dựa trên configuration: `spring.jpa.hibernate.ddl-auto=update`

---

## 🚀 Chạy Ứng Dụng

### Sử dụng Maven
```bash
# Windows
mvnw spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run
```

### Sử dụng JAR
```bash
# Build
mvn clean package

# Run
java -jar target/comp1640-0.0.1-SNAPSHOT.jar
```

### Trong IDE (IntelliJ IDEA)
1. Open project từ `backend/comp1640`
2. Right-click → Run 'Comp1640Application'
3. Ứng dụng chạy tại `http://localhost:8080`

---

### ✅ Kiểm Tra Ứng Dụng

Khi ứng dụng khởi động thành công:

- **Server**: `http://localhost:8080`
- **Health Check**: `http://localhost:8080/actuator/health`
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`
- **WebSocket**: `ws://localhost:8080/ws/notifications`

---

## 📁 Cấu Trúc Dự Án

```
backend/comp1640/
├── src/
│   ├── main/
│   │   ├── java/com/example/comp1640/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── ...
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── UserController.java
│   │   │   │   ├── IdeaController.java
│   │   │   │   ├── DepartmentController.java
│   │   │   │   ├── AcademicYearController.java
│   │   │   │   └── ...
│   │   │   ├── service/             # Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── IdeaService.java
│   │   │   │   ├── NotificationService.java
│   │   │   │   ├── impl/
│   │   │   │   └── ...
│   │   │   ├── entity/              # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Idea.java
│   │   │   │   ├── Department.java
│   │   │   │   └── ...
│   │   │   ├── repository/          # Data Access
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── IdeaRepository.java
│   │   │   │   └── ...
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── request/
│   │   │   │   ├── response/
│   │   │   │   └── ...
│   │   │   ├── exception/           # Custom Exceptions
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── ...
│   │   │   ├── util/                # Utilities
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── FileUploadUtil.java
│   │   │   │   └── ...
│   │   │   ├── listener/            # Event Listeners
│   │   │   │   ├── WebSocketEventListener.java
│   │   │   │   └── ...
│   │   │   └── Comp1640Application.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── ...
│   └── test/
│       └── java/
│           ├── controller/
│           ├── service/
│           └── ...
├── target/                          # Build output
├── pom.xml                          # Maven configuration
├── HELP.md
├── WEBSOCKET_MIGRATION.md
└── README.md
```

---

## 📚 API Documentation

### Swagger UI
Truy cập `http://localhost:8080/swagger-ui/index.html` để xem tất cả các endpoints.

### Endpoints Chính

#### Authentication (Auth)
```
POST /api/auth/register       - Đăng ký người dùng
POST /api/auth/login          - Đăng nhập
POST /api/auth/refresh-token  - Làm mới token
GET  /api/auth/me             - Lấy thông tin người dùng hiện tại
```

#### Users (User Management)
```
GET    /api/users             - Danh sách người dùng
GET    /api/users/{id}        - Chi tiết người dùng
POST   /api/users             - Tạo người dùng
PUT    /api/users/{id}        - Cập nhật người dùng
DELETE /api/users/{id}        - Xóa người dùng
```

#### Ideas (Idea Management)
```
GET    /api/ideas             - Danh sách ý tưởng
GET    /api/ideas/{id}        - Chi tiết ý tưởng
POST   /api/ideas             - Tạo ý tưởng
PUT    /api/ideas/{id}        - Cập nhật ý tưởng
DELETE /api/ideas/{id}        - Xóa ý tưởng
GET    /api/ideas/{id}/comments - Danh sách bình luận
```

#### Departments
```
GET    /api/departments       - Danh sách bộ phận
POST   /api/departments       - Tạo bộ phận
PUT    /api/departments/{id}  - Cập nhật bộ phận
DELETE /api/departments/{id}  - Xóa bộ phận
```

#### Academic Years
```
GET    /api/academic-years    - Danh sách kỳ học
POST   /api/academic-years    - Tạo kỳ học
PUT    /api/academic-years/{id} - Cập nhật kỳ học
```

Tham khảo OpenAPI schema tại `/v3/api-docs` để xem full details.

---

## 🗄️ Cấu Hình Cơ Sở Dữ Liệu

### Cấu Hình trong `application.properties`

```properties
# Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/comp1640
spring.datasource.username=root
spring.datasource.password=Admin123@
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update         # Auto-create tables
spring.jpa.show-sql=true                     # Log SQL queries
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Defer datasource initialization
spring.jpa.defer-datasource-initialization=true
```

### DDL Auto Options
- `create` - Tạo lại bảng mỗi lần chạy (xóa dữ liệu cũ)
- `create-drop` - Tạo và xóa khi ứng dụng tắt
- `update` - Cập nhật schema (khuyến nghị cho development)
- `validate` - Chỉ validate (cho production)
- `none` - Không làm gì

### Environment-Specific Profiles

**Development** (`application-dev.properties`):
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Production** (`application-prod.properties`):
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

Chạy với profile:
```bash
java -jar app.jar --spring.profiles.active=prod
```

---

## 🔐 Xác Thực và Phép Cấp

### JWT (JSON Web Tokens)

#### Cấu Hình
```properties
jwt.secret=comp1640-secret-key-1234567890-abcdef-xyz
jwt.expiration=86400000  # 24 hours in milliseconds
```

#### Flow
1. **Đăng Ký** → `POST /api/auth/register`
2. **Đăng Nhập** → `POST /api/auth/login` → Nhận JWT token
3. **Sử Dụng Token** → Thêm vào header: `Authorization: Bearer <token>`
4. **Làm Mới** → `POST /api/auth/refresh-token` (khi token gần hết hạn)

#### JWT Structure
```
Header.Payload.Signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 123,
  "username": "user@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234671490
}
```

### Spring Security

**Endpoints Public** (không cần xác thực):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /swagger-ui/**`
- `GET /v3/api-docs`

**Endpoints Protected** (cần JWT token):
- Hầu hết các endpoints khác

**Role-Based Access Control**:
```java
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasRole('MANAGER')")
@PreAuthorize("hasRole('COORDINATOR')")
@PreAuthorize("hasRole('USER')")
```

---

## 💬 WebSocket Notifications

### Tổng Quan
Backend sử dụng **Spring WebSocket + STOMP** (thay vì Socket.IO) cho real-time notifications.

### Cấu Hình
- **URL**: `ws://localhost:8080/ws/notifications`
- **Protocol**: STOMP (Simple Text Oriented Messaging Protocol)
- **Heartbeat**: Được cấu hình trong `WebSocketConfig`

### Frontend Integration

#### Install Dependencies
```bash
npm install @stomp/stompjs
```

#### WebSocket Service
```javascript
import { Client } from '@stomp/stompjs';

let client = new Client({
  brokerURL: 'ws://localhost:8080/ws/notifications',
  connectHeaders: {
    userId: userId,
  },
  onConnect: (frame) => {
    console.log('Connected');
    
    // Subscribe to notifications
    client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
      console.log('Notification:', JSON.parse(message.body));
    });
  },
});

client.activate();
```

### Backend Event Publishing
```java
@Service
public class NotificationServiceImpl {
  @Autowired
  private SimpMessagingTemplate messagingTemplate;
  
  public void sendNotification(Long userId, Notification notification) {
    messagingTemplate.convertAndSendToUser(
      String.valueOf(userId),
      "/queue/notifications",
      notification
    );
  }
}
```

### Notification Topics
- `/user/{userId}/queue/notifications` - Thông báo cá nhân
- `/topic/ideas` - Cập nhật ý tưởng
- `/topic/comments` - Cập nhật bình luận

---

## 📁 Quản Lý File Upload

### Cấu Hình

```properties
# File Upload Size
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Upload Directory
file.upload-dir=./uploads

# Cloudinary (Cloud Storage)
cloudinary.cloud-name=dfnyvfiuq
cloudinary.api-key=722446538895148
cloudinary.api-secret=E8RB0nF6TxAKQ3SWmZ5lKkbZvpg
```

### Cloudinary Usage

**Upload File**:
```java
@Service
public class FileUploadService {
  @Autowired
  private Cloudinary cloudinary;
  
  public String uploadFile(MultipartFile file) throws IOException {
    Map uploadResult = cloudinary.uploader().upload(
      file.getBytes(),
      ObjectUtils.asMap("resource_type", "auto")
    );
    return (String) uploadResult.get("url");
  }
}
```

### Hỗ Trợ File Types
- **Images**: PNG, JPG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Video**: MP4, AVI, MOV

### Giới Hạn
- **Max File Size**: 10 MB
- **Max Request Size**: 10 MB

---

## 🔨 Build & Deployment

### Build JAR
```bash
mvn clean package
```

Output: `target/comp1640-0.0.1-SNAPSHOT.jar`

### Run JAR with Options
```bash
# Với profile production
java -jar target/comp1640-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --server.port=8080 \
  --spring.datasource.url=jdbc:mysql://prod-db:3306/comp1640

# Với environment variables
export DB_HOST=prod-db
export DB_USERNAME=prod_user
export JWT_SECRET=production-secret-key
java -jar target/comp1640-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

**Dockerfile** (có thể tạo nếu cần):
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/comp1640-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build & Run:
```bash
docker build -t comp1640-backend .
docker run -p 8080:8080 \
  -e DB_HOST=mysql \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  comp1640-backend
```

### Cloud Deployment (Azure, AWS, GCP)

**Environment Variables cần thiết**:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `SERVER_PORT` (default: 8080)

---

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test Configuration
- Framework: JUnit 5
- Mocking: Mockito (via Spring Test)

---

## 📝 Troubleshooting

### Database Connection Error
```
Error: com.mysql.cj.jdbc.exceptions.CommunicationsException
```
**Solution**: Kiểm tra MySQL đang chạy, host, port, username, password

### JWT Token Expired
**Response**: `401 Unauthorized`
**Solution**: Gọi `/api/auth/refresh-token` để lấy token mới

### File Upload Failed
**Response**: `413 Payload Too Large`
**Solution**: Kiểm tra `max-file-size` và `max-request-size` trong properties

### WebSocket Connection Failed
**Solution**:
1. Kiểm tra server port (mặc định `8080`)
2. Kiểm tra CORS configuration
3. Kiểm tra firewall settings

---

## 📚 Tài Liệu Tham Khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring WebSocket](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket)
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 📧 Support & Contact

Nếu có bất kỳ câu hỏi hay vấn đề, vui lòng contact team development.

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Active Development
