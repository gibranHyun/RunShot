import React, { useState, useEffect } from 'react';
import { Play, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface DateSelectionScreenProps {
  onSubmit: (startDate: Date, endDate: Date) => void;
}

export default function DateSelectionScreen({ onSubmit }: DateSelectionScreenProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');

  // 기본값으로 지난 7일 설정
  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    setEndDate(today);
    setStartDate(weekAgo);
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    setError('');
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setEndDate(date);
    setError('');
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError('날짜를 선택해주세요.');
      return;
    }

    if (startDate > endDate) {
      setError('시작일은 종료일보다 빠를 수 없습니다.');
      return;
    }

    onSubmit(startDate, endDate);
  };

  const handleQuickStart = () => {
    if (startDate && endDate) {
      onSubmit(startDate, endDate);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      {/* 심플한 헤더 */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🏃‍♂️</div>
        <h1 className="text-4xl font-bold text-blue-600 mb-3">RunShot</h1>
        <p className="text-lg text-muted-foreground">내 러닝, 한 컷에 담다</p>
      </div>

      {/* 메인 카드 */}
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-6">
          {/* 빠른 시작 */}
          <div className="text-center space-y-4">
            <Button
              onClick={handleQuickStart}
              disabled={!startDate || !endDate}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl transition-all duration-200 shadow-lg"
              size="lg"
            >
              <Play className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg font-semibold">바로 시작하기</div>
                <div className="text-sm opacity-90">최근 7일 기록으로</div>
              </div>
            </Button>
            
            <div className="text-xs text-muted-foreground">
              또는 기간을 직접 선택해보세요
            </div>
          </div>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">커스텀 기간</span>
            </div>
          </div>

          {/* 날짜 선택 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  시작일
                </label>
                <input
                  type="date"
                  max={today}
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={handleStartDateChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  종료일
                </label>
                <input
                  type="date"
                  max={today}
                  min={startDate ? startDate.toISOString().split('T')[0] : undefined}
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={handleEndDateChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* 커스텀 시작 버튼 */}
            <Button
              onClick={handleSubmit}
              disabled={!startDate || !endDate}
              variant="outline"
              className="w-full h-12 rounded-lg transition-all duration-200"
              size="lg"
            >
              선택한 기간으로 시작
            </Button>
          </div>

          {/* 기간 표시 */}
          {startDate && endDate && !error && (
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm text-blue-700">
                <span className="font-medium">
                  {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}일간
                </span>의 러닝 기록을 분석합니다
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 하단 정보 */}
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>삼성 헬스의 러닝 기록을 불러와서 멋진 이미지로 만들어보세요</p>
      </div>
    </div>
  );
}