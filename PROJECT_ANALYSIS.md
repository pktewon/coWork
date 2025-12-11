# Example2 프로젝트 분석 문서

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | example2 |
| **그룹** | com.springsecurity |
| **버전** | 0.0.1-SNAPSHOT |
| **Java 버전** | 17 |
| **Spring Boot 버전** | 3.5.8 |
| **설명** | Spring Security + JWT 기반 인증/인가 REST API 프로젝트 |

---

## 🛠️ 기술 스택 (build.gradle)

### 핵심 의존성

| 라이브러리 | 용도 |
|------------|------|
| `spring-boot-starter-web` | REST API 웹 애플리케이션 |
| `spring-boot-starter-security` | Spring Security 인증/인가 |
| `spring-boot-starter-data-jpa` | JPA 데이터 접근 |
| `spring-boot-starter-mustache` | Mustache 템플릿 엔진 (현재 미사용) |
| `jjwt-api:0.11.5` | JWT 토큰 생성 및 검증 |
| `h2` | 인메모리 데이터베이스 |
| `lombok` | 보일러플레이트 코드 감소 |
| `spring-boot-devtools` | 개발 시 자동 리로드 |

---

## 📁 프로젝트 구조

```
src/
├── main/
│   ├── java/com/springsecurity/example2/
│   │   ├── Example2Application.java          # 메인 애플리케이션
│   │   ├── config/                           # 설정 클래스
│   │   │   ├── SecurityConfig.java           # Spring Security 설정
│   │   │   ├── JwtUtil.java                  # JWT 유틸리티
│   │   │   ├── JwtFilter.java                # JWT 인증 필터
│   │   │   ├── PrincipalDetails.java         # UserDetails 구현체
│   │   │   └── PrincipalDetailsService.java  # UserDetailsService 구현체
│   │   ├── controller/                       # REST 컨트롤러
│   │   │   ├── MainController.java           # 사용자/관리자 API
│   │   │   └── MemberController.java         # 회원가입/로그인 API
│   │   ├── dto/                              # 데이터 전송 객체
│   │   │   ├── JoinDTO.java                  # 회원가입 요청 DTO
│   │   │   └── LoginDTO.java                 # 로그인 요청 DTO
│   │   ├── entity/                           # JPA 엔티티
│   │   │   ├── User.java                     # 사용자 엔티티
│   │   │   └── UserRole.java                 # 사용자 권한 Enum
│   │   ├── repository/                       # 데이터 접근 계층
│   │   │   └── UserRepository.java           # 사용자 Repository
│   │   └── service/                          # 비즈니스 로직
│   │       └── JoinService.java              # 회원가입/로그인 서비스
│   └── resources/
│       ├── application.properties            # 애플리케이션 설정
│       ├── static/                           # 정적 리소스 (비어있음)
│       └── templates/                        # 템플릿 (비어있음)
└── test/
    └── java/                                 # 테스트 코드
```

---

## 🔐 보안 아키텍처

### 인증 흐름

```
[클라이언트] → POST /api/login → [MemberController] → [JoinService]
                                                            ↓
                                                    비밀번호 검증
                                                            ↓
                                                    JWT 토큰 생성
                                                            ↓
[클라이언트] ← JWT 토큰 반환 ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### 인가 흐름

```
[클라이언트] → Authorization: Bearer {token} → [JwtFilter]
                                                    ↓
                                            토큰 유효성 검증
                                                    ↓
                                            SecurityContext 설정
                                                    ↓
                                            [Controller] 접근 허용
```

### SecurityConfig 설정 요약

| 설정 | 값 | 설명 |
|------|-----|------|
| CSRF | 비활성화 | REST API이므로 불필요 |
| Form Login | 비활성화 | JSON 기반 인증 사용 |
| HTTP Basic | 비활성화 | JWT 인증 사용 |
| Session | STATELESS | 세션 미사용 (JWT 기반) |
| H2 Console | 허용 | 개발용 DB 콘솔 접근 |

### 권한 설정

| 경로 | 권한 |
|------|------|
| `/api/login` | 모두 허용 |
| `/api/join` | 모두 허용 |
| `/h2-console/**` | 모두 허용 |
| `/api/admin/**` | ADMIN 역할만 |
| 그 외 모든 경로 | 인증 필요 |

---

## 📦 주요 컴포넌트 상세

### 1. Entity 계층

#### User.java
```java
@Entity
@Table(name="UserMember")
public class User {
    Long id;           // PK (자동 생성)
    String loginId;    // 로그인 ID (unique, not null)
    String password;   // 암호화된 비밀번호
    String nickname;   // 닉네임
    UserRole role;     // 권한 (USER, ADMIN)
}
```

#### UserRole.java
```java
public enum UserRole {
    USER, ADMIN
}
```

### 2. Repository 계층

#### UserRepository.java
| 메서드 | 설명 |
|--------|------|
| `existsByLoginId(String)` | 로그인 ID 중복 확인 |
| `existsByNickname(String)` | 닉네임 중복 확인 |
| `findByLoginId(String)` | 로그인 ID로 사용자 조회 |

### 3. Service 계층

#### JoinService.java
| 메서드 | 설명 |
|--------|------|
| `joinProcess(JoinDTO)` | 회원가입 처리 (비밀번호 암호화, 중복 검증) |
| `login(String, String)` | 로그인 처리 (비밀번호 검증, JWT 발급) |

### 4. Controller 계층

#### MemberController.java (`/api`)
| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/join` | POST | 회원가입 |
| `/login` | POST | 로그인 (JWT 발급) |

#### MainController.java (`/api`)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|------------|--------|------|------|
| `/user-info` | GET | 인증 필요 | 현재 로그인 사용자 정보 |
| `/admin/data` | GET | ADMIN | 관리자 전용 데이터 |

### 5. Security 컴포넌트

#### JwtUtil.java
| 메서드 | 설명 |
|--------|------|
| `createToken(loginId, role)` | JWT 토큰 생성 |
| `getLoginId(token)` | 토큰에서 로그인 ID 추출 |
| `validateToken(token)` | 토큰 유효성 검증 |

#### JwtFilter.java
- `OncePerRequestFilter` 상속
- 모든 요청에서 Authorization 헤더 검사
- 유효한 JWT인 경우 SecurityContext에 인증 정보 설정

#### PrincipalDetails.java
- `UserDetails` 인터페이스 구현
- User 엔티티를 Spring Security 인증 객체로 래핑
- 권한 정보에 `ROLE_` 접두어 자동 추가

#### PrincipalDetailsService.java
- `UserDetailsService` 인터페이스 구현
- 로그인 ID로 사용자 조회 후 `PrincipalDetails` 반환

---

## ⚙️ 설정 파일 (application.properties)

### 서버 설정
| 속성 | 값 |
|------|-----|
| `server.port` | 8080 |
| `server.servlet.encoding.charset` | UTF-8 |

### H2 데이터베이스
| 속성 | 값 |
|------|-----|
| `spring.datasource.url` | jdbc:h2:mem:testdb |
| `spring.h2.console.enabled` | true |
| `spring.h2.console.path` | /h2-console |

### JPA 설정
| 속성 | 값 |
|------|-----|
| `spring.jpa.hibernate.ddl-auto` | update |
| `spring.jpa.show-sql` | true |

### JWT 설정
| 속성 | 값 | 설명 |
|------|-----|------|
| `jwt.secret` | (32자 이상 시크릿 키) | HS256 서명용 |
| `jwt.expiration` | 3600000 | 1시간 (밀리초) |

---

## 🚀 API 사용 예시

### 1. 회원가입
```bash
POST /api/join
Content-Type: application/json

{
    "loginId": "user1",
    "password": "password123",
    "nickname": "홍길동",
    "role": "USER"
}
```

### 2. 로그인
```bash
POST /api/login
Content-Type: application/json

{
    "loginId": "user1",
    "password": "password123"
}

# 응답: JWT 토큰 문자열
```

### 3. 인증된 요청
```bash
GET /api/user-info
Authorization: Bearer {JWT_TOKEN}

# 응답: "현재 로그인한 유저: user1, 닉네임: 홍길동"
```

### 4. 관리자 전용 요청
```bash
GET /api/admin/data
Authorization: Bearer {ADMIN_JWT_TOKEN}

# 응답: "관리자만 볼 수 있는 데이터입니다."
```

---

## 📌 향후 개발 시 고려사항

### 보안 개선
- [ ] JWT Refresh Token 구현
- [ ] 비밀번호 정책 강화 (길이, 복잡도)
- [ ] 로그인 시도 횟수 제한
- [ ] JWT 블랙리스트 (로그아웃 처리)

### 기능 확장
- [ ] 회원 정보 수정 API
- [ ] 비밀번호 변경 API
- [ ] 회원 탈퇴 API
- [ ] 이메일 인증

### 예외 처리
- [ ] 전역 예외 핸들러 (`@ControllerAdvice`)
- [ ] 커스텀 예외 클래스 정의
- [ ] 일관된 에러 응답 형식

### 데이터베이스
- [ ] 운영 환경용 DB 설정 (MySQL, PostgreSQL 등)
- [ ] 프로파일별 설정 분리 (dev, prod)

### 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] Security 테스트

### 문서화
- [ ] Swagger/OpenAPI 적용
- [ ] API 문서 자동화

---

## 🔗 참고 URL

| 리소스 | URL |
|--------|-----|
| 애플리케이션 | http://localhost:8080 |
| H2 Console | http://localhost:8080/h2-console |

---

*문서 생성일: 2024년*
