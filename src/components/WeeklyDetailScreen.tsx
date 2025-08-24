import React from 'react';
import { ArrowLeft, MapPin, Clock, Heart, Activity, Timer, Play, Users, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SingleRunRecord, DailyRunSummary, SessionType } from '../App';

interface WeeklyDetailScreenProps {
  runRecords: SingleRunRecord[];
  dailySummaries: DailyRunSummary[];
  onBack: () => void;
  onRecordSelect: (record: SingleRunRecord) => void;
}

export default function WeeklyDetailScreen({ runRecords, dailySummaries, onBack, onRecordSelect }: WeeklyDetailScreenProps) {
  // 이번 주 기록들 필터링 (최근 7일)
  const weeklyRecords = runRecords.filter(record => {
    const recordDate = new Date(record.date.replace(/\./g, '-'));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });

  // 이번 주 일별 요약
  const weeklySummaries = dailySummaries.filter(summary => {
    const summaryDate = new Date(summary.date.replace(/\./g, '-'));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return summaryDate >= weekAgo;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const weeklyStats = {
    totalDistance: weeklyRecords.reduce((sum, record) => sum + record.distance, 0),
    totalTime: weeklyRecords.reduce((sum, record) => sum + record.duration, 0),
    totalSessions: weeklyRecords.length,
    totalDays: weeklySummaries.length,
    averageDistance: weeklyRecords.length > 0 ? weeklyRecords.reduce((sum, record) => sum + record.distance, 0) / weeklyRecords.length : 0,
    averagePace: weeklyRecords.length > 0 ? weeklyRecords[0].averagePace : '0분 0초', // 단순화
    totalCalories: weeklyRecords.reduce((sum, record) => sum + (record.calories || 0), 0),
    sessionsPerDay: weeklyRecords.length > 0 ? weeklyRecords.length / weeklySummaries.length : 0
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString.replace(/\./g, '-'));
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const getSessionTypeLabel = (type: SessionType) => {
    const labels = {
      morning: '🌅 새벽',
      afternoon: '☀️ 점심',
      evening: '🌆 저녁',
      night: '🌙 야간',
      interval: '⚡ 인터벌',
      recovery: '💚 회복'
    };
    return labels[type] || type;
  };

  const getSessionTypeColor = (type: SessionType) => {
    const colors = {
      morning: 'bg-orange-100 text-orange-700 border-orange-200',
      afternoon: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      evening: 'bg-purple-100 text-purple-700 border-purple-200',
      night: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      interval: 'bg-red-100 text-red-700 border-red-200',
      recovery: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">이번 주 러닝 기록</h1>
            <p className="text-sm text-muted-foreground">최근 7일간의 상세 기록 ({weeklyStats.totalSessions}세션)</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Weekly Summary Stats */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">주간 통계 요약</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-blue-600">{weeklyStats.totalDistance.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">총 거리 (km)</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-green-600">{weeklyStats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">총 세션 (회)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-purple-600">{Math.floor(weeklyStats.totalTime / 60)}h {weeklyStats.totalTime % 60}m</div>
              <div className="text-xs text-muted-foreground">총 시간</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-orange-600">{weeklyStats.averageDistance.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground">평균 거리</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-red-600">{weeklyStats.totalCalories}</div>
              <div className="text-xs text-muted-foreground">총 칼로리</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-bold text-indigo-600">{weeklyStats.totalDays}</div>
              <div className="text-xs text-muted-foreground">활동 일수</div>
            </div>
          </div>
        </Card>

        {/* Weekly Records by Day */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            일별 세션 기록 ({weeklySummaries.length}일)
          </h2>
          
          {weeklySummaries.length === 0 ? (
            <Card className="p-8 text-center bg-white/60">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-medium mb-2">이번 주 러닝 기록이 없습니다</h3>
              <p className="text-muted-foreground">새로운 러닝을 시작해보세요!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {weeklySummaries.map((daySummary) => (
                <Card 
                  key={daySummary.date}
                  className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-md"
                >
                  {/* Day Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{daySummary.date.split('.')[2]}</div>
                          <div className="text-sm text-muted-foreground">{getDayOfWeek(daySummary.date)}</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {daySummary.sessionCount > 1 ? `${daySummary.sessionCount}세션 러닝` : '단일 세션'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            총 {daySummary.totalDistance.toFixed(1)}km • {formatDuration(daySummary.totalDuration)} • {daySummary.totalCalories}kcal
                          </div>
                        </div>
                      </div>
                      
                      {daySummary.sessionCount > 1 && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          <Users className="w-3 h-3 mr-1" />
                          {daySummary.sessionCount}회
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Individual Sessions */}
                  <div className="p-4 space-y-3">
                    {daySummary.sessions.map((session, sessionIndex) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                          sessionIndex === 0 && daySummary.sessionCount > 1 ? 'ring-1 ring-blue-300 bg-blue-50/50' : 'bg-gray-50 hover:bg-white'
                        }`}
                        onClick={() => onRecordSelect(session)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Session Image */}
                          <div className="w-20 h-16 bg-cover bg-center rounded-lg relative flex-shrink-0">
                            <div 
                              className="absolute inset-0 bg-cover bg-center rounded-lg"
                              style={{ 
                                backgroundImage: `url(${session.customImage || session.route})` 
                              }}
                            />
                            {session.location && (
                              <div className="absolute bottom-1 left-1">
                                <Badge className="text-xs bg-black/60 text-white border-0 px-1 py-0">
                                  <MapPin className="w-2 h-2 mr-1" />
                                  {session.location.substring(0, 4)}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Session Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${getSessionTypeColor(session.sessionType)}`}>
                                  {getSessionTypeLabel(session.sessionType)}
                                  {session.sessionNumber && ` ${session.sessionNumber}`}
                                </Badge>
                                <h3 className="font-medium text-gray-900">
                                  {session.title || `${session.startTime} 세션`}
                                </h3>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>

                            {/* Session Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">거리 / 시간</div>
                                <div className="font-semibold text-blue-600">
                                  {session.distance}km / {formatDuration(session.duration)}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">평균 페이스</div>
                                <div className="font-semibold text-green-600">{session.averagePace}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">칼로리</div>
                                <div className="font-semibold text-orange-600">{session.calories || 0}kcal</div>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                              {session.averageHeartRate && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Heart className="w-3 h-3 text-red-500" />
                                  <span className="text-muted-foreground">심박:</span>
                                  <span className="font-medium text-red-600">{session.averageHeartRate}bpm</span>
                                </div>
                              )}
                              
                              {session.averageCadence && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Activity className="w-3 h-3 text-blue-500" />
                                  <span className="text-muted-foreground">케이던스:</span>
                                  <span className="font-medium text-blue-600">{session.averageCadence}spm</span>
                                </div>
                              )}
                              
                              {session.bestPace && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Timer className="w-3 h-3 text-purple-500" />
                                  <span className="text-muted-foreground">최고:</span>
                                  <span className="font-medium text-purple-600">{session.bestPace}</span>
                                </div>
                              )}
                            </div>

                            {/* Session Comment */}
                            {session.comment && (
                              <div className="pt-2 border-t border-gray-100">
                                <p className="text-sm text-gray-600 line-clamp-2 italic">
                                  "{session.comment}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRecordSelect(session);
                              }}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              꾸미기
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Goal Challenge */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-medium">💪 이번 주 도전</h3>
            <p className="text-sm text-muted-foreground">
              현재까지 {weeklyStats.totalDistance.toFixed(1)}km • {weeklyStats.totalSessions}세션 완료!
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">거리 목표: 20km</div>
                <div className="text-muted-foreground">
                  {weeklyStats.totalDistance >= 20 ? '✅ 달성!' : `${(20 - weeklyStats.totalDistance).toFixed(1)}km 남음`}
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">세션 목표: 5회</div>
                <div className="text-muted-foreground">
                  {weeklyStats.totalSessions >= 5 ? '✅ 달성!' : `${5 - weeklyStats.totalSessions}세션 남음`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}