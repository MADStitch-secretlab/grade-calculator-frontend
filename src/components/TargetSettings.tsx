'use client';

import { useState } from 'react';
import { TranscriptData } from '@/lib/types';

interface TargetSettingsProps {
  transcriptData: TranscriptData;
  onSubmit: (targetGpa: number, targetCredits: number, scaleMax: number) => void;
}

export default function TargetSettings({ transcriptData, onSubmit }: TargetSettingsProps) {
  const [targetGpa, setTargetGpa] = useState<string>('');
  const [targetCredits, setTargetCredits] = useState<string>('');
  const [scaleMax, setScaleMax] = useState<string>('4.5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gpa = parseFloat(targetGpa);
    const credits = parseFloat(targetCredits);
    const scale = parseFloat(scaleMax);

    if (isNaN(gpa) || isNaN(credits) || isNaN(scale)) {
      alert('모든 값을 올바르게 입력해주세요.');
      return;
    }

    if (gpa <= 0 || gpa > 5) {
      alert('목표 GPA는 0.1에서 5.0 사이여야 합니다.');
      return;
    }

    if (credits <= transcriptData.total_credits) {
      alert(`목표 학점은 현재 학점(${transcriptData.total_credits})보다 커야 합니다.`);
      return;
    }

    if (scale <= 0) {
      alert('평점 최대값은 0보다 커야 합니다.');
      return;
    }

    onSubmit(gpa, credits, scale);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">현재 성적 정보</h2>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">학생명</p>
            <p className="text-lg font-medium">{transcriptData.student_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">학번</p>
            <p className="text-lg font-medium">{transcriptData.student_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">전공</p>
            <p className="text-lg font-medium">{transcriptData.major}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">현재 GPA</p>
            <p className="text-lg font-medium text-blue-600">{transcriptData.gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">이수 학점</p>
            <p className="text-lg font-medium">{transcriptData.total_credits}학점</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">이수 과목</p>
            <p className="text-lg font-medium">{transcriptData.subjects.length}과목</p>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-2xl font-bold mb-6 text-gray-800">목표 설정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="targetGpa" className="block text-sm font-medium text-gray-700 mb-2">
              목표 GPA
            </label>
            <input
              id="targetGpa"
              type="number"
              step="0.01"
              min="0.1"
              max="5.0"
              value={targetGpa}
              onChange={(e) => setTargetGpa(e.target.value)}
              placeholder="예: 4.2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              현재 GPA: {transcriptData.gpa.toFixed(2)} / 목표: 0.1 ~ 5.0
            </p>
          </div>

          <div>
            <label htmlFor="targetCredits" className="block text-sm font-medium text-gray-700 mb-2">
              졸업 요구 학점
            </label>
            <input
              id="targetCredits"
              type="number"
              step="1"
              min={transcriptData.total_credits + 1}
              value={targetCredits}
              onChange={(e) => setTargetCredits(e.target.value)}
              placeholder="예: 130"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              현재 이수: {transcriptData.total_credits}학점 / 남은 학점: {targetCredits ? Math.max(0, parseInt(targetCredits) - transcriptData.total_credits) : '?'}학점
            </p>
          </div>

          <div>
            <label htmlFor="scaleMax" className="block text-sm font-medium text-gray-700 mb-2">
              평점 최대값
            </label>
            <select
              id="scaleMax"
              value={scaleMax}
              onChange={(e) => setScaleMax(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="4.0">4.0 (일반)</option>
              <option value="4.3">4.3 (일부 대학)</option>
              <option value="4.5">4.5 (일반)</option>
              <option value="5.0">5.0 (일부 대학)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              학교의 평점 체계를 선택하세요
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            시뮬레이션 실행
          </button>
        </form>
      </div>
    </div>
  );
}
