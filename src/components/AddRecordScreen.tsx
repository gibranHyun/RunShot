import React, { useState } from 'react';
import { ArrowLeft, Save, MapPin, Clock, Heart, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SingleRunRecord } from '../App';

interface AddRecordScreenProps {
  onBack: () => void;
  onSave: (record: Omit<SingleRunRecord, 'id'>) => void;
}

export default function AddRecordScreen({ onBack, onSave }: AddRecordScreenProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    distance: '',
    duration: '',
    averagePace: '',
    bestPace: '',
    averageHeartRate: '',
    averageCadence: '',
    location: '',
    title: '',
    comment: '',
    calories: '',
    elevation: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.date) newErrors.date = '날짜를 선택해주세요';
    if (!formData.startTime) newErrors.startTime = '시작 시간을 입력해주세요';
    if (!formData.endTime) newErrors.endTime = '종료 시간을 입력해주세요';
    if (!formData.distance || parseFloat(formData.distance) <= 0) {
      newErrors.distance = '올바른 거리를 입력해주세요';
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = '올바른 소요 시간을 입력해주세요';
    }
    if (!formData.averagePace) newErrors.averagePace = '평균 페이스를 입력해주세요';

    // 시간 검증
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = '종료 시간은 시작 시간보다 늦어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newRecord: Omit<SingleRunRecord, 'id'> = {
      date: formData.date.replace(/-/g, '.'),
      startTime: formData.startTime,
      endTime: formData.endTime,
      distance: parseFloat(formData.distance),
      duration: parseInt(formData.duration),
      averagePace: formData.averagePace,
      bestPace: formData.bestPace || undefined,
      averageHeartRate: formData.averageHeartRate ? parseInt(formData.averageHeartRate) : undefined,
      averageCadence: formData.averageCadence ? parseInt(formData.averageCadence) : undefined,
      location: formData.location || undefined,
      title: formData.title || undefined,
      comment: formData.comment || undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      elevation: formData.elevation ? parseInt(formData.elevation) : undefined,
      route: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop' // 기본 이미지
    };

    onSave(newRecord);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">러닝 기록 입력</h1>
              <p className="text-sm text-muted-foreground">새로운 러닝 기록을 추가해보세요</p>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* 기본 정보 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">러닝 날짜 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">장소</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="예: 한강공원"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">시작 시간 *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`pl-10 ${errors.startTime ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">종료 시간 *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={`pl-10 ${errors.endTime ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">러닝 제목</Label>
              <Input
                id="title"
                placeholder="예: 새벽 러닝 완주!"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 운동 데이터 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">운동 데이터</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">거리 (km) *</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  placeholder="5.2"
                  value={formData.distance}
                  onChange={(e) => handleInputChange('distance', e.target.value)}
                  className={errors.distance ? 'border-red-500' : ''}
                />
                {errors.distance && <p className="text-sm text-red-500">{errors.distance}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">소요 시간 (분) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="45"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="averagePace">평균 페이스 *</Label>
                <Input
                  id="averagePace"
                  placeholder="5분 38초"
                  value={formData.averagePace}
                  onChange={(e) => handleInputChange('averagePace', e.target.value)}
                  className={errors.averagePace ? 'border-red-500' : ''}
                />
                {errors.averagePace && <p className="text-sm text-red-500">{errors.averagePace}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bestPace">최고 페이스</Label>
                <Input
                  id="bestPace"
                  placeholder="4분 52초"
                  value={formData.bestPace}
                  onChange={(e) => handleInputChange('bestPace', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">칼로리 (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="485"
                  value={formData.calories}
                  onChange={(e) => handleInputChange('calories', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="elevation">고도 (m)</Label>
                <Input
                  id="elevation"
                  type="number"
                  placeholder="25"
                  value={formData.elevation}
                  onChange={(e) => handleInputChange('elevation', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 고급 데이터 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">고급 데이터</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="averageHeartRate">평균 심박수 (bpm)</Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                  <Input
                    id="averageHeartRate"
                    type="number"
                    placeholder="142"
                    value={formData.averageHeartRate}
                    onChange={(e) => handleInputChange('averageHeartRate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="averageCadence">평균 케이던스 (spm)</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <Input
                    id="averageCadence"
                    type="number"
                    placeholder="165"
                    value={formData.averageCadence}
                    onChange={(e) => handleInputChange('averageCadence', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 코멘트 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">러닝 후기</h2>
          
          <div className="space-y-2">
            <Label htmlFor="comment">오늘의 러닝은 어땠나요?</Label>
            <Textarea
              id="comment"
              placeholder="오늘 컨디션이 너무 좋았다! 목표했던 5km를 완주하고 개인 베스트도 갱신했다..."
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>
        </Card>

        {/* 도움말 */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-700">
            <h3 className="font-medium mb-2">💡 입력 도움말</h3>
            <ul className="space-y-1 text-xs">
              <li>• 거리는 소수점 첫째 자리까지 입력 가능합니다 (예: 5.2km)</li>
              <li>• 페이스는 "5분 38초" 형식으로 입력해주세요</li>
              <li>• 심박수와 케이던스는 운동 기록기 앱에서 확인할 수 있습니다</li>
              <li>• 모든 항목을 입력하지 않아도 기본 정보만으로 저장 가능합니다</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}