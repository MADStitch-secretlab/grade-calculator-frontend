'use client';

import { useState } from 'react';
import PdfUploader from '@/components/PdfUploader';
import TargetSettings from '@/components/TargetSettings';
import SimulationResult from '@/components/SimulationResult';
import { TranscriptData, SimulationResult as SimResult } from '@/lib/types';
import { convertToSimulation, runSimulation } from '@/lib/api';

type Step = 'upload' | 'settings' | 'result';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimResult[] | null>(null);
  const [targetGpa, setTargetGpa] = useState<number>(0);
  const [scaleMax, setScaleMax] = useState<number>(4.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (data: TranscriptData) => {
    setTranscriptData(data);
    setCurrentStep('settings');
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleTargetSubmit = async (
    gpa: number,
    credits: number,
    scale: number
  ) => {
    if (!transcriptData) return;

    setIsLoading(true);
    setError(null);
    setTargetGpa(gpa);
    setScaleMax(scale);

    try {
      // 1. 데이터 변환
      const convertResponse = await convertToSimulation({
        transcriptData,
        targetGpa: gpa,
        targetTotalCredits: credits,
        scaleMax: scale,
      });

      if (!convertResponse.success || !convertResponse.data) {
        throw new Error('데이터 변환에 실패했습니다.');
      }

      // 2. 시뮬레이션 실행
      const simulationResponse = await runSimulation(convertResponse.data);

      if (!simulationResponse.success || !simulationResponse.data) {
        throw new Error(
          simulationResponse.message || '시뮬레이션 실행에 실패했습니다.'
        );
      }

      setSimulationResult(simulationResponse.data);
      setCurrentStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            GPA Path
          </h1>
          <p className="text-lg text-gray-600">
            목표 GPA 달성을 위한 학기별 필요 평점 계산기
          </p>
        </header>

        {/* 진행 단계 표시 */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {currentStep === 'upload' ? '1' : '✓'}
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">
                성적표 업로드
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStep !== 'upload' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            </div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'settings'
                    ? 'bg-blue-600 text-white'
                    : currentStep === 'result'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {currentStep === 'result' ? '✓' : '2'}
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">
                목표 설정
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStep === 'result' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            </div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'result'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">
                결과 확인
              </span>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg
                className="w-6 h-6 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-bold">오류</p>
                <p>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg font-medium text-gray-800">
                시뮬레이션 실행 중...
              </p>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main>
          {currentStep === 'upload' && (
            <PdfUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          )}

          {currentStep === 'settings' && transcriptData && (
            <TargetSettings
              transcriptData={transcriptData}
              onSubmit={handleTargetSubmit}
            />
          )}

          {currentStep === 'result' && simulationResult && (
            <SimulationResult
              results={simulationResult}
              targetGpa={targetGpa}
              scaleMax={scaleMax}
            />
          )}
        </main>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>GPA Path - 학생들의 목표 달성을 돕는 서비스</p>
          <p className="mt-2">
            ⚠️ 이 서비스는 참고용이며, 실제 성적 관리는 본인의 책임입니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
