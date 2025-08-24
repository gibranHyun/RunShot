import React from 'react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SingleRunRecord, DailyRunSummary } from '../App';

interface MonthlyCalendarScreenProps {
  runRecords: SingleRunRecord[];
  dailySummaries: DailyRunSummary[];
  onBack: () => void;
  onRecordSelect: (record: SingleRunRecord) => void;
}

export default function MonthlyCalendarScreen({ runRecords, dailySummaries, onBack, onRecordSelect }: MonthlyCalendarScreenProps) {
  // 이번 달 기록들 (12월)
  const monthlyRecords = runRecords.filter(record => record.date.startsWith('2024.12'));
  const monthlySummaries = dailySummaries.filter(summary => summary.date.startsWith('2024.12'));
  
  // 달력 생성 (2024년 12월)
  const year = 2024;
  const month = 12;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  // 날짜별 요약 매핑
  const summaryByDate: { [key: number]: DailyRunSummary } = {};
  monthlySummaries.forEach(summary => {
    const day = parseInt(summary.date.split('.')[2]);
    summaryByDate[day] = summary;
  });

  // 거리별 스타일 결정 (일일 총 거리 기준)
  const getDistanceStyle = (totalDistance: number, sessionCount: number) => {
    if (totalDistance === 0) return { bg: '', icon: '', intensity: '', sessions: 0 };
    
    const baseStyle = {
      sessions: sessionCount,
    };
    
    if (totalDistance < 3) return { ...baseStyle, bg: 'bg-green-100', icon: '🚶‍♂️', intensity: 'text-green-600' };
    if (totalDistance < 5) return { ...baseStyle, bg: 'bg-blue-100', icon: '🏃‍♂️', intensity: 'text-blue-600' };
    if (totalDistance < 8) return { ...baseStyle, bg: 'bg-orange-100', icon: '💨', intensity: 'text-orange-600' };
    if (totalDistance < 12) return { ...baseStyle, bg: 'bg-purple-100', icon: '⚡', intensity: 'text-purple-600' };
    return { ...baseStyle, bg: 'bg-red-100', icon: '🔥', intensity: 'text-red-600' };
  };

  const monthlyStats = {
    totalDistance: monthlyRecords.reduce((sum, record) => sum + record.distance, 0),
    totalSessions: monthlyRecords.length,
    totalTime: monthlyRecords.reduce((sum, record) => sum + record.duration, 0),
    activeDays: monthlySummaries.length,
    averageDistance: monthlyRecords.length > 0 ? monthlyRecords.reduce((sum, record) => sum + record.distance, 0) / monthlyRecords.length : 0,
    averageSessionsPerDay: monthlySummaries.length > 0 ? monthlyRecords.length / monthlySummaries.length : 0,
    maxDayDistance: Math.max(...monthlySummaries.map(s => s.totalDistance), 0),
    maxDaySessions: Math.max(...monthlySummaries.map(s => s.sessionCount), 0)
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">12월 러닝 달력</h1>
            <p className="text-sm text-muted-foreground">이번 달 러닝 기록 한눈에 보기 ({monthlyStats.totalSessions}세션)</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Monthly Summary */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              2024년 12월 통계
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-purple-600">{monthlyStats.totalDistance.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">총 거리 (km)</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-indigo-600">{monthlyStats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">총 세션 (회)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-emerald-600">{Math.floor(monthlyStats.totalTime / 60)}h</div>
              <div className="text-xs text-muted-foreground">총 시간</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-rose-600">{monthlyStats.averageDistance.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground">평균 거리</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-orange-600">{monthlyStats.activeDays}</div>
              <div className="text-xs text-muted-foreground">활동일</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-blue-600">{monthlyStats.averageSessionsPerDay.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">일평균 세션</div>
            </div>
          </div>
        </Card>

        {/* Enhanced Distance Legend */}
        <Card className="p-4 bg-white/60 backdrop-blur-sm">
          <h3 className="text-sm font-medium mb-3">거리별 표시 & 세션 정보</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center">🚶‍♂️</div>
                <span>~3km</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">🏃‍♂️</div>
                <span>3-5km</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-orange-100 flex items-center justify-center">💨</div>
                <span>5-8km</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-purple-100 flex items-center justify-center">⚡</div>
                <span>8-12km</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-red-100 flex items-center justify-center">🔥</div>
                <span>12km+</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              💡 여러 세션이 있는 날은 오른쪽 상단에 세션 수가 표시됩니다
            </div>
          </div>
        </Card>

        {/* Enhanced Calendar Grid */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startingDayOfWeek }, (_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const daySummary = summaryByDate[day];
              const totalDistance = daySummary?.totalDistance || 0;
              const sessionCount = daySummary?.sessionCount || 0;
              const style = getDistanceStyle(totalDistance, sessionCount);
              const hasSessions = sessionCount > 0;
              const isToday = day === new Date().getDate() && month === new Date().getMonth() + 1;

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-1 cursor-pointer transition-all hover:shadow-md relative ${
                    hasSessions ? `${style.bg} border-gray-300 hover:scale-105` : 'border-gray-200 hover:bg-gray-50'
                  } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => {
                    if (hasSessions && daySummary?.sessions[0]) {
                      onRecordSelect(daySummary.sessions[0]);
                    }
                  }}
                >
                  {/* 날짜 */}
                  <div className="text-sm font-medium text-center">
                    {day}
                  </div>
                  
                  {/* 러닝 기록 표시 */}
                  {hasSessions && daySummary && (
                    <>
                      {/* 거리별 아이콘 */}
                      <div className="text-center text-xs mb-1">
                        {style.icon}
                      </div>
                      
                      {/* 총 거리 */}
                      <div className={`text-xs font-bold text-center ${style.intensity}`}>
                        {totalDistance.toFixed(1)}km
                      </div>
                      
                      {/* 세션 수 표시 (여러 번 뛴 경우) */}
                      {sessionCount > 1 && (
                        <Badge className="absolute top-0 right-0 text-xs bg-orange-500 text-white w-4 h-4 p-0 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                          {sessionCount}
                        </Badge>
                      )}
                      
                      {/* 세션별 미니 인디케이터 */}
                      {sessionCount > 1 && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                          <div className="flex gap-0.5">
                            {daySummary.sessions.slice(0, 4).map((_, idx) => (
                              <div 
                                key={idx}
                                className={`w-1 h-1 rounded-full ${style.intensity.includes('green') ? 'bg-green-500' :
                                  style.intensity.includes('blue') ? 'bg-blue-500' :
                                  style.intensity.includes('orange') ? 'bg-orange-500' :
                                  style.intensity.includes('purple') ? 'bg-purple-500' : 'bg-red-500'
                                }`}
                              />
                            ))}
                            {sessionCount > 4 && (
                              <div className="text-xs">+</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 호버 툴팁 */}
                      <div className="absolute inset-0 bg-black/80 text-white text-xs p-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity z-10 flex flex-col justify-center">
                        <div className="text-center space-y-1">
                          <div className="font-bold">{sessionCount > 1 ? `${sessionCount}세션` : '1세션'}</div>
                          <div>{totalDistance.toFixed(1)}km</div>
                          {daySummary.sessions[0].comment && (
                            <div className="text-xs truncate">"{daySummary.sessions[0].comment.substring(0, 15)}..."</div>
                          )}
                          {sessionCount > 1 && (
                            <div className="text-xs opacity-75">
                              {Math.floor(daySummary.totalDuration / 60)}h {daySummary.totalDuration % 60}m
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* 오늘 표시 */}
                  {isToday && !hasSessions && (
                    <div className="absolute bottom-1 right-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="p-4 bg-white/60 backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-3">최근 활동 (세션별)</h3>
          {monthlyRecords.slice(0, 4).map(record => {
            const recordSummary = summaryByDate[parseInt(record.date.split('.')[2])];
            return (
              <div 
                key={record.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 cursor-pointer transition-colors mb-2 last:mb-0"
                onClick={() => onRecordSelect(record)}
              >
                <div className="text-center min-w-12">
                  <div className="font-bold text-purple-600">{record.date.split('.')[2]}</div>
                  <div className="text-xs text-muted-foreground">12월</div>
                </div>
                
                <div className="w-12 h-8 bg-cover bg-center rounded relative flex-shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center rounded"
                    style={{ 
                      backgroundImage: `url(${record.customImage || record.route})` 
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{record.title}</span>
                    <Badge className="text-xs bg-gray-100 text-gray-600">
                      {record.sessionType}
                      {record.sessionNumber && ` ${record.sessionNumber}`}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{record.distance}km</span>
                    <span>{record.startTime}-{record.endTime}</span>
                    {record.location && (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span>{record.location}</span>
                      </>
                    )}
                  </div>
                  {record.comment && (
                    <div className="text-xs text-gray-600 mt-1 italic line-clamp-1">
                      "{record.comment}"
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${getDistanceStyle(record.distance, 1).intensity}`}>
                    {getDistanceStyle(record.distance, 1).icon}
                  </div>
                  {recordSummary && recordSummary.sessionCount > 1 && (
                    <div className="text-xs text-muted-foreground">
                      {recordSummary.sessionCount}세션 중
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Enhanced Monthly Goal */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium">🎯 12월 목표</h3>
            
            <div className="space-y-3">
              {/* 거리 목표 */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>월간 거리 목표</span>
                  <span className="font-medium">{monthlyStats.totalDistance.toFixed(1)} / 60km</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((monthlyStats.totalDistance / 60) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 세션 목표 */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>월간 세션 목표</span>
                  <span className="font-medium">{monthlyStats.totalSessions} / 20세션</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((monthlyStats.totalSessions / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="text-muted-foreground">
                  {monthlyStats.totalDistance >= 60 ? '🎉 거리 목표 달성!' : `${(60 - monthlyStats.totalDistance).toFixed(1)}km 남음`}
                </div>
                <div className="text-muted-foreground">
                  {monthlyStats.totalSessions >= 20 ? '🎉 세션 목표 달성!' : `${20 - monthlyStats.totalSessions}세션 남음`}
                </div>
              </div>
            </div>

            {/* 추가 성취 정보 */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-200 text-sm">
              <div className="text-center">
                <div className="font-semibold text-purple-600">최고 기록</div>
                <div className="text-muted-foreground">{monthlyStats.maxDayDistance.toFixed(1)}km (하루)</div>
                <div className="text-muted-foreground">{monthlyStats.maxDaySessions}세션 (하루)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-pink-600">연속성</div>
                <div className="text-muted-foreground">{monthlyStats.activeDays}일 활동</div>
                <div className="text-muted-foreground">{((monthlyStats.activeDays / 31) * 100).toFixed(0)}% 달성률</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}