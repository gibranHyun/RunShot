import React, { useState } from 'react';
import { ArrowLeft, Download, Smartphone, Upload, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SingleRunRecord } from '../App';

interface ImportRecordScreenProps {
  onBack: () => void;
  onImport: (records: SingleRunRecord[]) => void;
}

export default function ImportRecordScreen({ onBack, onImport }: ImportRecordScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableRecords, setAvailableRecords] = useState<SingleRunRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  const handleSamsungHealthConnect = async () => {
    setIsConnecting(true);
    
    // 삼성 헬스 연동 시뮬레이션
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      
      // 목 데이터 - 삼성 헬스에서 가져온 것처럼 표시
      const mockImportedRecords: SingleRunRecord[] = [
        {
          id: 'imported-1',
          date: '2024.12.25',
          startTime: '07:00',
          endTime: '07:45',
          distance: 6.2,
          duration: 45,
          averagePace: '5분 22초',
          bestPace: '4분 58초',
          averageHeartRate: 148,
          averageCadence: 172,
          route: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=400&fit=crop',
          title: '크리스마스 모닝런',
          location: '한강공원',
          comment: '삼성 헬스에서 자동으로 가져온 기록입니다.',
          calories: 545,
          elevation: 28
        },
        {
          id: 'imported-2',
          date: '2024.12.23',
          startTime: '18:30',
          endTime: '19:20',
          distance: 8.5,
          duration: 50,
          averagePace: '5분 52초',
          bestPace: '5분 12초',
          averageHeartRate: 152,
          averageCadence: 165,
          route: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=400&fit=crop',
          title: '주말 장거리 러닝',
          location: '올림픽공원',
          comment: '삼성 헬스 자동 기록',
          calories: 725,
          elevation: 42
        },
        {
          id: 'imported-3',
          date: '2024.12.21',
          startTime: '06:45',
          endTime: '07:15',
          distance: 4.8,
          duration: 30,
          averagePace: '6분 15초',
          bestPace: '5분 45초',
          averageHeartRate: 135,
          averageCadence: 158,
          route: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
          title: '새벽 러닝',
          location: '뚝섬한강공원',
          comment: '삼성 헬스 자동 기록',
          calories: 415,
          elevation: 18
        }
      ];
      
      setAvailableRecords(mockImportedRecords);
    }, 2000);
  };

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRecords(
      selectedRecords.length === availableRecords.length 
        ? [] 
        : availableRecords.map(record => record.id)
    );
  };

  const handleImport = () => {
    const recordsToImport = availableRecords.filter(record => 
      selectedRecords.includes(record.id)
    );
    onImport(recordsToImport);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">기록 불러오기</h1>
              <p className="text-sm text-muted-foreground">외부 앱에서 러닝 기록을 가져오세요</p>
            </div>
          </div>
          
          {availableRecords.length > 0 && selectedRecords.length > 0 && (
            <Button 
              onClick={handleImport}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {selectedRecords.length}개 가져오기
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 연동 가능한 앱들 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">연동 가능한 앱</h2>
          
          {/* 삼성 헬스 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold">삼성 헬스</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  삼성 헬스 앱의 러닝 기록을 자동으로 가져옵니다
                </p>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      연결됨
                    </Badge>
                  ) : (
                    <Badge variant="outline">연결 필요</Badge>
                  )}
                </div>
              </div>
              
              <div>
                {!isConnected ? (
                  <Button 
                    onClick={handleSamsungHealthConnect}
                    disabled={isConnecting}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        연결 중...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        연결하기
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{availableRecords.length}</div>
                    <div className="text-xs text-muted-foreground">개 기록 발견</div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 다른 앱들 (비활성화) */}
          <Card className="p-6 bg-gray-50 border-gray-200 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-gray-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-600">Strava</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  곧 지원 예정입니다
                </p>
                <Badge variant="outline" className="border-gray-300 text-gray-500">
                  개발 중
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-200 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-gray-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-600">Nike Run Club</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  곧 지원 예정입니다
                </p>
                <Badge variant="outline" className="border-gray-300 text-gray-500">
                  개발 중
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* 불러온 기록들 */}
        {availableRecords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                삼성 헬스에서 발견된 기록 ({availableRecords.length}개)
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedRecords.length === availableRecords.length ? '전체 해제' : '전체 선택'}
              </Button>
            </div>
            
            <div className="space-y-3">
              {availableRecords.map((record) => (
                <Card 
                  key={record.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedRecords.includes(record.id)
                      ? 'bg-indigo-50 border-indigo-200 shadow-md'
                      : 'bg-white/80 hover:bg-white/90'
                  }`}
                  onClick={() => toggleRecordSelection(record.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* 체크박스 */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedRecords.includes(record.id)
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedRecords.includes(record.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* 기록 이미지 */}
                    <div className="w-16 h-12 bg-cover bg-center rounded-lg relative flex-shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center rounded-lg"
                        style={{ 
                          backgroundImage: `url(${record.route})` 
                        }}
                      />
                    </div>

                    {/* 기록 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{record.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {record.date} {record.startTime}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">거리: </span>
                          <span className="font-medium text-indigo-600">{record.distance}km</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">시간: </span>
                          <span className="font-medium text-green-600">{formatDuration(record.duration)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">페이스: </span>
                          <span className="font-medium text-orange-600">{record.averagePace}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">칼로리: </span>
                          <span className="font-medium text-purple-600">{record.calories}kcal</span>
                        </div>
                      </div>
                      
                      {record.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          📍 {record.location}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedRecords.length > 0 && (
              <Card className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold text-indigo-700">
                    {selectedRecords.length}개 기록 선택됨
                  </div>
                  <div className="text-sm text-muted-foreground">
                    선택된 기록들이 RunShot으로 가져와집니다
                  </div>
                  <Button 
                    onClick={handleImport}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white mt-4"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {selectedRecords.length}개 기록 가져오기
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 도움말 */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-700">
            <h3 className="font-medium mb-2">📱 기록 불러오기 안내</h3>
            <ul className="space-y-1 text-xs">
              <li>• 삼성 헬스 앱의 러닝 기록을 자동으로 분석하여 가져옵니다</li>
              <li>• 거리, 시간, 페이스, 심박수, 케이던스 등 상세 데이터를 포함합니다</li>
              <li>• 원하는 기록만 선택해서 가져올 수 있습니다</li>
              <li>• 가져온 기록은 RunShot에서 꾸미기 기능을 사용할 수 있습니다</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}