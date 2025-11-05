// OCR 결과 타입
export interface TranscriptData {
  university: string;
  student_name: string;
  student_id: string;
  major: string;
  double_major: string | null;
  minor: string | null;
  subjects: Subject[];
  total_credits: number;
  gpa: number;
}

export interface Subject {
  name: string;
  credits: number;
  grade: string;
  type: string;
  semester: string;
}

// OCR 업로드 응답 타입
export interface UploadResponse {
  success: boolean;
  data?: {
    university: string;
    student_name: string;
    student_id: string;
    major: string;
    double_major: string | null;
    minor: string | null;
    subjects: Subject[];
    total_credits: number;
    gpa: number;
    db_save_result?: {
      success: boolean;
      transcriptId: string;
      saved: number;
      errors: number;
    };
  };
  performance?: {
    buffer_time: number;
    file_create_time: number;
    upload_time: number;
    gpt_analysis_time: number;
    json_parse_time: number;
    total_time: number;
  };
  error?: string;
  raw_result?: string;
}

// 시뮬레이션 입력 타입
export interface SimulationInput {
  scale_max: number;
  G_t: number;
  C_tot: number;
  history: HistoryItem[];
  terms: TermItem[];
}

export interface HistoryItem {
  term_id: string;
  credits: number;
  achieved_avg: number;
}

export interface TermItem {
  id: string;
  type: 'regular' | 'summer';
  planned_credits: number;
  max_credits?: number;
}

// 변환 요청 타입
export interface ConvertToSimulationRequest {
  transcriptData: TranscriptData;
  targetGpa: number;
  targetTotalCredits: number;
  scaleMax?: number;
  futureTerms?: TermItem[];
}

// 변환 응답 타입
export interface ConvertToSimulationResponse {
  success: boolean;
  data?: SimulationInput;
  error?: string;
}

// 시뮬레이션 결과 타입
export interface SimulationResult {
  term_id: string;
  credits: number;
  required_avg: number;
}

// 시뮬레이션 응답 타입
export interface SimulationResponse {
  success: boolean;
  data?: SimulationResult[];
  message?: string;
  error?: string;
  detail?: string;
}

// 헬스체크 응답 타입
export interface HealthResponse {
  service: string;
  status: 'healthy' | 'unhealthy';
}

// 에러 응답 타입
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  detail?: string;
}
