import {
  UploadResponse,
  ConvertToSimulationRequest,
  ConvertToSimulationResponse,
  SimulationInput,
  SimulationResponse,
  HealthResponse,
} from './types';

// API Base URL (환경변수로 관리 가능)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/**
 * PDF 성적표 업로드 및 OCR 분석
 * @param file PDF 파일
 * @returns OCR 결과
 */
export async function uploadTranscript(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/transcripts/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'PDF 업로드에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * OCR 결과를 시뮬레이션 입력 형식으로 변환
 * @param request 변환 요청 데이터
 * @returns 시뮬레이션 입력 데이터
 */
export async function convertToSimulation(
  request: ConvertToSimulationRequest
): Promise<ConvertToSimulationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transcripts/convert-to-simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '데이터 변환에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Convert error:', error);
    throw error;
  }
}

/**
 * GPA 시뮬레이션 실행
 * @param input 시뮬레이션 입력 데이터
 * @returns 학기별 필요 평점
 */
export async function runSimulation(
  input: SimulationInput
): Promise<SimulationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gpa/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(data.message || '목표 GPA를 달성할 수 없습니다.');
      }
      throw new Error(data.message || '시뮬레이션 실행에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Simulation error:', error);
    throw error;
  }
}

/**
 * 헬스체크
 * @returns 서비스 상태
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gpa/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    return {
      service: 'GPA Simulator',
      status: 'unhealthy',
    };
  }
}

/**
 * 전체 플로우 실행 (업로드 → 변환 → 시뮬레이션)
 * @param file PDF 파일
 * @param targetGpa 목표 GPA
 * @param targetTotalCredits 목표 총 학점
 * @param scaleMax 최대 평점 (기본값: 4.5)
 * @returns 시뮬레이션 결과
 */
export async function runFullSimulation(
  file: File,
  targetGpa: number,
  targetTotalCredits: number,
  scaleMax: number = 4.5
): Promise<SimulationResponse> {
  // 1. PDF 업로드 및 OCR
  const uploadResult = await uploadTranscript(file);

  if (!uploadResult.success || !uploadResult.data) {
    throw new Error('성적표 분석에 실패했습니다.');
  }

  // 2. 시뮬레이션 입력 형식으로 변환
  const convertResult = await convertToSimulation({
    transcriptData: uploadResult.data,
    targetGpa,
    targetTotalCredits,
    scaleMax,
  });

  if (!convertResult.success || !convertResult.data) {
    throw new Error('데이터 변환에 실패했습니다.');
  }

  // 3. 시뮬레이션 실행
  const simulationResult = await runSimulation(convertResult.data);

  return simulationResult;
}
