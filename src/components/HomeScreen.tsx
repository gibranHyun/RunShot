import React, { useState } from 'react';
import { Play, MapPin, Clock, Route, Zap, ChevronRight, Calendar, TrendingUp, Plus, Download, Heart, Activity, Timer, MessageSquare, Edit3, Users, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { SingleRunRecord, DailyRunSummary, SessionType } from '../App';

interface HomeScreenProps {
  runRecords: SingleRunRecord[];
  dailySummaries: DailyRunSummary[];
  onRecordSelect: (record: SingleRunRecord) => void;
  onWeeklyStatsClick: () => void;
  onMonthlyStatsClick: () => void;
  onAddRecord: () => void;
  onImportRecord: () => void;
}

export default function HomeScreen({ 
  runRecords, 
  dailySummaries,
  onRecordSelect, 
  onWeeklyStatsClick, 
  onMonthlyStatsClick,
  onAddRecord,
  onImportRecord
}: HomeScreenProps) {
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [latestRecordComment, setLatestRecordComment] = useState('');
  
  const latestSummary = dailySummaries[0];
  const latestRecord = latestSummary?.sessions[0]; // 가장 최근 세션
  const pastSummaries = dailySummaries.slice(1);
  const displayedSummaries = showAllRecords ? pastSummaries : pastSummaries.slice(0, 6);

  React.useEffect(() => {
    if (latestRecord?.comment) {
      setLatestRecordComment(latestRecord.comment);
    }
  }, [latestRecord]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
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

  // 이번 주 통계 계산 (최근 7일)
  const weeklyRecords = runRecords.filter(record => {
    const recordDate = new Date(record.date.replace(/\./g, '-'));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });

  // 이번 달 통계 계산 (12월)
  const monthlyRecords = runRecords.filter(record => {
    return record.date.startsWith('2024.12');
  });

  const weeklyStats = {
    totalDistance: weeklyRecords.reduce((sum, record) => sum + record.distance, 0),
    totalTime: Math.floor(weeklyRecords.reduce((sum, record) => sum + record.duration, 0) / 60),
    totalRuns: weeklyRecords.length,
    totalSessions: weeklyRecords.length // 세션 수
  };

  const monthlyStats = {
    totalDistance: monthlyRecords.reduce((sum, record) => sum + record.distance, 0),
    totalTime: Math.floor(monthlyRecords.reduce((sum, record) => sum + record.duration, 0) / 60),
    totalRuns: monthlyRecords.length,
    totalSessions: monthlyRecords.length,
    averageDistance: monthlyRecords.length > 0 ? (monthlyRecords.reduce((sum, record) => sum + record.distance, 0) / monthlyRecords.length) : 0,
    activeDays: dailySummaries.filter(summary => summary.date.startsWith('2024.12')).length
  };

  const handleCommentSave = () => {
    // TODO: 실제로는 서버에 코멘트 저장
    console.log('Saving comment:', latestRecordComment);
    setIsEditingComment(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">RunShot</h1>
            <p className="text-sm text-muted-foreground">내 러닝 기록</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              총 {runRecords.length}세션
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAddRecord}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              입력
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onImportRecord}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              불러오기
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Latest Day Summary */}
        {latestSummary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                오늘의 러닝 ({latestSummary.sessionCount}세션)
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">NEW</Badge>
                {latestSummary.sessionCount > 1 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Users className="w-3 h-3 mr-1" />
                    {latestSummary.sessionCount}회
                  </Badge>
                )}
              </div>
            </div>
            
            <Card className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg">
              {/* Day Summary Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{latestSummary.date}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      총 {latestSummary.totalDistance.toFixed(1)}km
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatDuration(latestSummary.totalDuration)}
                    </Badge>
                  </div>
                </div>
                
                {latestSummary.sessionCount > 1 && (
                  <div className="text-sm text-muted-foreground">
                    💪 오늘 {latestSummary.sessionCount}번 달렸어요! 총 {latestSummary.totalCalories}kcal 소모
                  </div>
                )}
              </div>

              {/* Individual Sessions */}
              <div className="space-y-3 p-4">
                {latestSummary.sessions.map((session, sessionIndex) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                      sessionIndex === 0 ? 'ring-2 ring-blue-200 bg-blue-50' : 'bg-gray-50 hover:bg-white'
                    }`}
                    onClick={() => onRecordSelect(session)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Session Image */}
                      <div className="w-16 h-12 bg-cover bg-center rounded relative flex-shrink-0">
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded"
                          style={{ 
                            backgroundImage: `url(${session.customImage || session.route})` 
                          }}
                        />
                      </div>

                      {/* Session Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getSessionTypeColor(session.sessionType)}`}>
                              {getSessionTypeLabel(session.sessionType)}
                              {session.sessionNumber && ` ${session.sessionNumber}`}
                            </Badge>
                            <span className="text-sm font-medium">{session.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">거리</span>
                            <div className="font-semibold text-blue-600">{session.distance}km</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">시간</span>
                            <div className="font-semibold text-green-600">{formatDuration(session.duration)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">페이스</span>
                            <div className="font-semibold text-orange-600">{session.averagePace}</div>
                          </div>
                          <div className="text-right">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              꾸미기
                            </Button>
                          </div>
                        </div>

                        {session.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Section for Latest Session */}
              {latestRecord && (
                <div className="p-4 border-t bg-gray-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">오늘의 한마디</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingComment(!isEditingComment);
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {isEditingComment ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Textarea
                        value={latestRecordComment}
                        onChange={(e) => setLatestRecordComment(e.target.value)}
                        placeholder="오늘의 러닝 후기를 남겨보세요..."
                        className="text-sm min-h-20 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditingComment(false)}
                        >
                          취소
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleCommentSave}
                          className="bg-blue-500 text-white"
                        >
                          저장
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {latestRecordComment || latestRecord.comment || "오늘의 러닝 후기를 남겨보세요"}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Past Records - Enhanced with Session Management */}
        {pastSummaries.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold">이전 기록</h2>
                <div className="text-sm text-muted-foreground">({runRecords.length - latestSummary?.sessionCount || 0}세션)</div>
              </div>
              {!showAllRecords && pastSummaries.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  {pastSummaries.length - 6}일 더
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {displayedSummaries.map((daySummary) => (
                <Card 
                  key={daySummary.date}
                  className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onRecordSelect(daySummary.sessions[0])} // 첫 번째 세션 선택
                >
                  {/* Card Image */}
                  <div className="relative">
                    <div 
                      className="aspect-[4/3] bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${daySummary.sessions[0].customImage || daySummary.sessions[0].route})` 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Total Distance Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-gray-700 text-xs font-bold">
                        {daySummary.totalDistance.toFixed(1)}km
                      </Badge>
                    </div>

                    {/* Session Count Badge */}
                    {daySummary.sessionCount > 1 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="text-xs bg-orange-500 text-white">
                          <Users className="w-3 h-3 mr-1" />
                          {daySummary.sessionCount}
                        </Badge>
                      </div>
                    )}

                    {/* Location Badge */}
                    {daySummary.sessions[0].location && (
                      <div className="absolute bottom-1 left-1">
                        <Badge className="text-xs bg-black/50 text-white border-0">
                          <MapPin className="w-3 h-3 mr-1" />
                          {daySummary.sessions[0].location.length > 6 ? daySummary.sessions[0].location.substring(0, 6) + '..' : daySummary.sessions[0].location}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Card Info */}
                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium">{daySummary.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(daySummary.totalDuration)}
                      </div>
                    </div>

                    {/* Session Summary */}
                    <div className="text-xs text-gray-600 line-clamp-1">
                      {daySummary.sessionCount > 1 ? (
                        <span>
                          {daySummary.sessions.map(s => getSessionTypeLabel(s.sessionType).split(' ')[0]).join(' + ')} 세션
                        </span>
                      ) : (
                        daySummary.sessions[0].title || `${daySummary.sessions[0].startTime} 러닝`
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">거리</span>
                        <span className="font-medium">{daySummary.totalDistance.toFixed(1)}km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">칼로리</span>
                        <span className="font-medium">{daySummary.totalCalories}kcal</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {daySummary.sessionCount > 1 ? `${daySummary.sessionCount}세션` : daySummary.sessions[0].averagePace}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-5 text-xs px-2 py-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordSelect(daySummary.sessions[0]);
                        }}
                      >
                        {daySummary.sessionCount > 1 ? '보기' : '꾸미기'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 더 보기 버튼 */}
            {!showAllRecords && pastSummaries.length > 6 && (
              <div className="text-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllRecords(true)}
                  className="w-full bg-white/70 hover:bg-white/90"
                >
                  더 보기 ({pastSummaries.length - 6}일)
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* 접기 버튼 */}
            {showAllRecords && pastSummaries.length > 6 && (
              <div className="text-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllRecords(false)}
                  className="w-full bg-white/70 hover:bg-white/90"
                >
                  접기
                  <ChevronRight className="w-4 h-4 ml-2 rotate-90" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {runRecords.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold mb-2">러닝 기록이 없습니다</h3>
            <p className="text-muted-foreground mb-6">첫 번째 러닝을 시작해보세요!</p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 text-white" onClick={onAddRecord}>
                <Plus className="w-4 h-4 mr-2" />
                기록 입력
              </Button>
              <Button variant="outline" onClick={onImportRecord}>
                <Download className="w-4 h-4 mr-2" />
                기록 불러오기
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Stats Summary - Clickable */}
        {runRecords.length > 0 && (
          <div className="space-y-4">
            {/* 이번 주 통계 - 클릭 가능 */}
            <Card 
              className="p-4 bg-white/60 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
              onClick={onWeeklyStatsClick}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  이번 주 통계
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {weeklyStats.totalSessions}세션
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyStats.totalDistance.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">총 거리 (km)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">
                    {weeklyStats.totalTime}
                  </div>
                  <div className="text-xs text-muted-foreground">총 시간 (시간)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">총 세션 (회)</div>
                </div>
              </div>
            </Card>

            {/* 이번 달 통계 - 클릭 가능 */}
            <Card 
              className="p-4 bg-white/60 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
              onClick={onMonthlyStatsClick}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  이번 달 통계
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {monthlyStats.activeDays}일 활동
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {monthlyStats.totalDistance.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">총 거리 (km)</div>
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {monthlyStats.totalSessions}
                  </div>
                  <div className="text-xs text-muted-foreground">총 세션 (회)</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-center">
                  <div className="text-lg font-bold text-emerald-600">
                    {monthlyStats.totalTime}h
                  </div>
                  <div className="text-xs text-muted-foreground">총 시간</div>
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-lg font-bold text-rose-600">
                    {monthlyStats.averageDistance.toFixed(1)}km
                  </div>
                  <div className="text-xs text-muted-foreground">평균 거리</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}