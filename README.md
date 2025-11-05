# GPA Path - 프론트엔드

목표 GPA 달성을 위한 학기별 필요 평점 계산 서비스의 프론트엔드입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## 주요 기능

1. **PDF 성적표 업로드**: 드래그 앤 드롭 또는 파일 선택으로 PDF 업로드
2. **OCR 분석**: 백엔드 API를 통한 성적표 자동 분석
3. **목표 설정**: 원하는 GPA와 졸업 요구 학점 입력
4. **시뮬레이션**: 남은 학기별 필요 평점 계산
5. **결과 시각화**: 학기별 필요 평점을 직관적으로 표시

## 시작하기

### 1. 환경 설정

환경 변수 파일을 설정합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 백엔드 API URL을 설정합니다:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── PdfUploader.tsx     # PDF 업로드 컴포넌트
│   ├── TargetSettings.tsx  # 목표 설정 컴포넌트
│   └── SimulationResult.tsx # 결과 표시 컴포넌트
└── lib/
    ├── api.ts              # API 클라이언트
    └── types.ts            # TypeScript 타입 정의
```

## API 연동

프론트엔드는 다음 백엔드 API를 사용합니다:

- `POST /api/transcripts/upload`: PDF 업로드 및 OCR
- `POST /api/transcripts/convert-to-simulation`: 데이터 변환
- `POST /api/gpa/simulate`: GPA 시뮬레이션 실행
- `GET /api/gpa/health`: 헬스체크

자세한 내용은 [API_SPECIFICATION.md](./API_SPECIFICATION.md)를 참조하세요.

## 사용 흐름

1. **성적표 업로드**
   - 사용자가 PDF 성적표를 업로드
   - 백엔드에서 OCR 분석 후 학생 정보와 성적 추출

2. **목표 설정**
   - 현재 성적 정보 확인
   - 목표 GPA와 졸업 요구 학점 입력
   - 평점 스케일 선택 (4.0, 4.3, 4.5, 5.0)

3. **시뮬레이션 실행**
   - 백엔드 API로 시뮬레이션 요청
   - 남은 학기별 필요 평점 계산

4. **결과 확인**
   - 학기별 필요 평점을 카드 형태로 시각화
   - 난이도 분석 및 조언 제공
   - 결과 인쇄 또는 새로 시작

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

### 린트 검사

```bash
npm run lint
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|-----|------|-------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API URL | `http://localhost:5001` |

## 주의사항

1. **백엔드 서버**: 프론트엔드를 실행하기 전에 백엔드 서버가 실행 중이어야 합니다.
2. **CORS**: 개발 환경에서는 백엔드에서 CORS를 허용해야 합니다.
3. **파일 크기**: PDF 파일은 최대 10MB까지 업로드 가능합니다.
4. **브라우저**: 최신 브라우저(Chrome, Firefox, Safari, Edge)를 권장합니다.

## 트러블슈팅

### 백엔드 연결 실패

```
서버와의 연결에 실패했습니다.
```

**해결 방법**:
1. 백엔드 서버가 실행 중인지 확인
2. `.env.local`의 API URL이 올바른지 확인
3. 백엔드에서 CORS 설정 확인

### PDF 업로드 실패

```
PDF 파일만 업로드 가능합니다.
```

**해결 방법**:
1. 파일 형식이 PDF인지 확인
2. 파일 크기가 10MB 이하인지 확인

### 시뮬레이션 실패

```
목표 GPA를 달성할 수 없습니다.
```

**해결 방법**:
1. 목표 GPA를 낮추기
2. 졸업 요구 학점을 늘리기 (계절학기 추가)
3. 현재 성적 정보가 올바른지 확인

## 개발 가이드

### 새 컴포넌트 추가

1. `src/components/` 폴더에 파일 생성
2. 컴포넌트를 클라이언트 컴포넌트로 만들려면 `'use client'` 추가
3. 타입은 `src/lib/types.ts`에서 import

### API 함수 추가

1. `src/lib/api.ts`에 함수 추가
2. 타입은 `src/lib/types.ts`에 정의
3. 에러 처리 포함

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 관련 문서

- [서비스 PRD](./servicePRD.md)
- [API 명세서](./API_SPECIFICATION.md)
- [OCR 가이드](./OCR_GUIDE.md)
- [모델 PRD](./modelPRD.md)
# grade-calculator-frontend
