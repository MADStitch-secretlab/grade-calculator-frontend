'use client';

import { SimulationResult as SimResult } from '@/lib/types';

interface SimulationResultProps {
  results: SimResult[];
  targetGpa: number;
  scaleMax: number;
}

export default function SimulationResult({ results, targetGpa, scaleMax }: SimulationResultProps) {
  // 평균 필요 평점 계산
  const averageRequired = results.reduce((sum, r) => sum + r.required_avg, 0) / results.length;

  // 난이도 계산 (0-100%)
  const difficulty = (averageRequired / scaleMax) * 100;

  // 난이도에 따른 색상 및 메시지
  const getDifficultyInfo = () => {
    if (difficulty < 70) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        message: '목표 달성 가능성이 높습니다!',
        emoji: '😊',
      };
    } else if (difficulty < 85) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        message: '노력이 필요하지만 달성 가능합니다.',
        emoji: '💪',
      };
    } else if (difficulty < 95) {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        message: '상당한 노력이 필요합니다.',
        emoji: '🔥',
      };
    } else {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        message: '매우 어려운 목표입니다. 최선을 다하세요!',
        emoji: '⚠️',
      };
    }
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          시뮬레이션 결과
        </h2>

        {/* 요약 정보 */}
        <div className={`${difficultyInfo.bgColor} rounded-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">목표 GPA</p>
              <p className="text-3xl font-bold text-gray-800">{targetGpa.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl mb-2">{difficultyInfo.emoji}</p>
              <p className={`text-sm font-medium ${difficultyInfo.color}`}>
                {difficultyInfo.message}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">평균 필요 평점</p>
              <p className="text-3xl font-bold text-gray-800">{averageRequired.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>목표 달성 난이도</span>
              <span>{difficulty.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  difficulty < 70
                    ? 'bg-green-500'
                    : difficulty < 85
                    ? 'bg-yellow-500'
                    : difficulty < 95
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(difficulty, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 학기별 결과 */}
        <h3 className="text-xl font-bold mb-4 text-gray-800">학기별 필요 평점</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => {
            const percentage = (result.required_avg / scaleMax) * 100;
            const isHigh = percentage > 90;

            return (
              <div
                key={result.term_id}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                  isHigh ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-700">
                    {result.term_id}
                  </span>
                  {isHigh && (
                    <span className="text-red-500 text-xl">⚠️</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-blue-600">
                    {result.required_avg.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.credits}학점 수강
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage > 90
                            ? 'bg-red-500'
                            : percentage > 80
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 조언 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">💡 조언</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• 각 학기마다 표시된 평점 이상을 받아야 목표 GPA를 달성할 수 있습니다.</li>
            <li>• 특정 학기에 더 높은 점수를 받으면 다른 학기의 부담이 줄어듭니다.</li>
            <li>• 경고 표시(⚠️)가 있는 학기는 특히 집중해야 합니다.</li>
            <li>• 목표 달성이 어려워 보인다면 계절학기를 고려해보세요.</li>
          </ul>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            결과 인쇄
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            새로 시작
          </button>
        </div>
      </div>
    </div>
  );
}
