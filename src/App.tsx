import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import DecorationScreen from "./components/DecorationScreen";
import WeeklyDetailScreen from "./components/WeeklyDetailScreen";
import MonthlyCalendarScreen from "./components/MonthlyCalendarScreen";
import AddRecordScreen from "./components/AddRecordScreen";
import ImportRecordScreen from "./components/ImportRecordScreen";

export type SessionType =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "interval"
  | "recovery";

export type SingleRunRecord = {
  id: string;
  sessionId: string; // 새로운 필드: 세션 구분용
  sessionType: SessionType; // 새로운 필드: 세션 유형
  sessionNumber?: number; // 새로운 필드: 같은 유형 내에서의 순서 (예: 인터벌 1차, 2차)
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number; // in minutes
  averagePace: string;
  route?: string; // 지도 이미지 URL
  customImage?: string; // 사용자가 꾸민 이미지 URL
  title?: string; // 사용자가 설정한 타이틀
  location?: string;
  // 기존 필드들
  averageHeartRate?: number; // 평균 심박수
  averageCadence?: number; // 평균 케이던스 (spm)
  bestPace?: string; // 최고 페이스
  comment?: string; // 사용자 코멘트
  calories?: number; // 칼로리
  elevation?: number; // 고도
};

export type DailyRunSummary = {
  date: string;
  sessions: SingleRunRecord[];
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  sessionCount: number;
};

export type RunningData = {
  totalDistance: number;
  totalRuns: number;
  totalTime: number;
  averagePace: string;
  startDate: Date;
  endDate: Date;
};

type ScreenType =
  | "home"
  | "decoration"
  | "weeklyDetail"
  | "monthlyCalendar"
  | "addRecord"
  | "importRecord";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenType>("home");
  const [selectedRecord, setSelectedRecord] =
    useState<SingleRunRecord | null>(null);

  // 확장된 목데이터 - 세션별 기록 포함
  const mockRunRecords: SingleRunRecord[] = [
    // 12월 28일 - 하루에 2번 뛴 경우
    {
      id: "1",
      sessionId: "session-1",
      sessionType: "morning",
      date: "2024.12.28",
      startTime: "06:30",
      endTime: "07:15",
      distance: 5.2,
      duration: 45,
      averagePace: "5분 38초",
      bestPace: "4분 52초",
      averageHeartRate: 142,
      averageCadence: 165,
      route:
        "https://images.unsplash.com/photo-1586287011575-a23134f797f9?w=600&h=400&fit=crop",
      customImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      title: "새벽 러닝 완주! 🏃‍♂️",
      location: "한강공원",
      comment:
        "오늘 컨디션이 너무 좋았다! 목표했던 5km를 완주하고 개인 베스트도 갱신했다.",
      calories: 485,
      elevation: 25,
    },
    {
      id: "1-2",
      sessionId: "session-2",
      sessionType: "evening",
      date: "2024.12.28",
      startTime: "19:30",
      endTime: "20:00",
      distance: 3.2,
      duration: 30,
      averagePace: "6분 15초",
      bestPace: "5분 45초",
      averageHeartRate: 128,
      averageCadence: 152,
      route:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      title: "저녁 회복 러닝",
      location: "동네 한바퀴",
      comment:
        "아침에 달렸지만 저녁에도 가볍게! 몸이 좋은 것 같다.",
      calories: 285,
      elevation: 8,
    },
    // 12월 27일 - 인터벌 트레이닝 3세션
    {
      id: "2-1",
      sessionId: "session-3",
      sessionType: "interval",
      sessionNumber: 1,
      date: "2024.12.27",
      startTime: "07:00",
      endTime: "07:20",
      distance: 2.4,
      duration: 20,
      averagePace: "5분 10초",
      bestPace: "4분 35초",
      averageHeartRate: 168,
      averageCadence: 180,
      route:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=400&fit=crop",
      title: "인터벌 1세트",
      location: "잠실 트랙",
      comment: "400m x 6회 인터벌 트레이닝 1세트",
      calories: 220,
      elevation: 0,
    },
    {
      id: "2-2",
      sessionId: "session-4",
      sessionType: "recovery",
      date: "2024.12.27",
      startTime: "07:30",
      endTime: "07:50",
      distance: 2.0,
      duration: 20,
      averagePace: "7분 30초",
      bestPace: "6분 45초",
      averageHeartRate: 110,
      averageCadence: 140,
      route:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=400&fit=crop",
      title: "회복 조깅",
      location: "잠실 트랙",
      comment: "인터벌 후 쿨다운 조깅",
      calories: 140,
      elevation: 0,
    },
    {
      id: "2-3",
      sessionId: "session-5",
      sessionType: "interval",
      sessionNumber: 2,
      date: "2024.12.27",
      startTime: "18:00",
      endTime: "18:15",
      distance: 2.0,
      duration: 15,
      averagePace: "5분 00초",
      bestPace: "4분 28초",
      averageHeartRate: 172,
      averageCadence: 185,
      route:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=400&fit=crop",
      title: "인터벌 2세트",
      location: "잠실 트랙",
      comment: "200m x 8회 스피드 인터벌",
      calories: 180,
      elevation: 0,
    },
    // 기존 단일 세션들
    {
      id: "3",
      sessionId: "session-6",
      sessionType: "evening",
      date: "2024.12.26",
      startTime: "19:00",
      endTime: "19:40",
      distance: 4.1,
      duration: 40,
      averagePace: "6분 12초",
      bestPace: "5분 28초",
      averageHeartRate: 138,
      averageCadence: 158,
      route:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      customImage:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=400&fit=crop",
      title: "야간 러닝 도전",
      location: "올림픽공원",
      comment: "야간 러닝의 묘미를 다시 한번 느꼈다.",
      calories: 380,
      elevation: 15,
    },
    {
      id: "4",
      sessionId: "session-7",
      sessionType: "morning",
      date: "2024.12.24",
      startTime: "07:00",
      endTime: "08:30",
      distance: 10.5,
      duration: 90,
      averagePace: "5분 24초",
      bestPace: "4분 58초",
      averageHeartRate: 155,
      averageCadence: 172,
      route:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      title: "크리스마스 이브 장거리",
      location: "남산둘레길",
      comment:
        "크리스마스 이브에 10km 도전! 힘들었지만 뿌듯했다.",
      calories: 925,
      elevation: 180,
    },
    // 12월 23일 - 아침, 저녁 2세션
    {
      id: "5-1",
      sessionId: "session-8",
      sessionType: "morning",
      date: "2024.12.23",
      startTime: "06:00",
      endTime: "06:35",
      distance: 4.5,
      duration: 35,
      averagePace: "5분 55초",
      bestPace: "5분 20초",
      averageHeartRate: 145,
      averageCadence: 160,
      route:
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=400&fit=crop",
      title: "토요일 모닝런",
      location: "여의도공원",
      comment: "주말 아침의 상쾌함!",
      calories: 395,
      elevation: 20,
    },
    {
      id: "5-2",
      sessionId: "session-9",
      sessionType: "evening",
      date: "2024.12.23",
      startTime: "20:00",
      endTime: "20:45",
      distance: 6.2,
      duration: 45,
      averagePace: "6분 05초",
      bestPace: "5분 30초",
      averageHeartRate: 135,
      averageCadence: 158,
      route:
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=400&fit=crop",
      title: "주말 이브닝런",
      location: "한강공원",
      comment: "저녁 한강이 너무 예쁘다. 야경 러닝 최고!",
      calories: 545,
      elevation: 15,
    },
    {
      id: "6",
      sessionId: "session-10",
      sessionType: "afternoon",
      date: "2024.12.22",
      startTime: "16:30",
      endTime: "17:00",
      distance: 3.2,
      duration: 30,
      averagePace: "6분 45초",
      bestPace: "5분 55초",
      averageHeartRate: 125,
      averageCadence: 152,
      route:
        "https://images.unsplash.com/photo-1586287011575-a23134f797f9?w=600&h=400&fit=crop",
      title: "점심시간 짧은 러닝",
      location: "동네 한바퀴",
      comment: "시간이 없어서 짧게만 뛰었지만 그래도 상쾌했다.",
      calories: 285,
      elevation: 8,
    },
    {
      id: "7",
      sessionId: "session-11",
      sessionType: "morning",
      date: "2024.12.20",
      startTime: "06:45",
      endTime: "07:45",
      distance: 7.8,
      duration: 60,
      averagePace: "5분 18초",
      bestPace: "4분 45초",
      averageHeartRate: 148,
      averageCadence: 168,
      route:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      customImage:
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=400&fit=crop",
      title: "주말 모닝런 🌅",
      location: "여의도공원",
      comment:
        "주말 아침의 여유로운 러닝. 기분 좋은 하루의 시작!",
      calories: 685,
      elevation: 32,
    },
    {
      id: "8",
      sessionId: "session-12",
      sessionType: "evening",
      date: "2024.12.18",
      startTime: "18:30",
      endTime: "19:15",
      distance: 6.3,
      duration: 45,
      averagePace: "5분 45초",
      bestPace: "5분 12초",
      averageHeartRate: 140,
      averageCadence: 162,
      route:
        "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=600&h=400&fit=crop",
      title: "퇴근 후 러닝",
      location: "잠실종합운동장",
      comment:
        "힘든 하루 끝에 하는 러닝이 최고의 스트레스 해소다.",
      calories: 545,
      elevation: 22,
    },
    {
      id: "9",
      sessionId: "session-13",
      sessionType: "morning",
      date: "2024.12.16",
      startTime: "07:30",
      endTime: "08:00",
      distance: 4.5,
      duration: 30,
      averagePace: "6분 20초",
      bestPace: "5분 45초",
      averageHeartRate: 132,
      averageCadence: 155,
      route:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop",
      customImage:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      title: "월요일 활력충전",
      location: "반포한강공원",
      comment: "월요일 아침을 활기차게!",
      calories: 385,
      elevation: 18,
    },
    {
      id: "10",
      sessionId: "session-14",
      sessionType: "morning",
      date: "2024.12.14",
      startTime: "09:00",
      endTime: "10:20",
      distance: 12.1,
      duration: 80,
      averagePace: "5분 12초",
      bestPace: "4분 38초",
      averageHeartRate: 162,
      averageCadence: 178,
      route:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      title: "주말 장거리 챌린지",
      location: "북한산둘레길",
      comment:
        "개인 최장거리 달성! 12km를 완주했다는 것이 믿기지 않는다.",
      calories: 1125,
      elevation: 285,
    },
  ];

  // 날짜별로 세션들을 그룹핑하는 헬퍼 함수
  const groupRecordsByDate = (
    records: SingleRunRecord[],
  ): DailyRunSummary[] => {
    const grouped = records.reduce(
      (acc, record) => {
        if (!acc[record.date]) {
          acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
      },
      {} as { [key: string]: SingleRunRecord[] },
    );

    return Object.entries(grouped)
      .map(([date, sessions]) => ({
        date,
        sessions: sessions.sort((a, b) =>
          a.startTime.localeCompare(b.startTime),
        ),
        totalDistance: sessions.reduce(
          (sum, session) => sum + session.distance,
          0,
        ),
        totalDuration: sessions.reduce(
          (sum, session) => sum + session.duration,
          0,
        ),
        totalCalories: sessions.reduce(
          (sum, session) => sum + (session.calories || 0),
          0,
        ),
        sessionCount: sessions.length,
      }))
      .sort(
        (a, b) =>
          new Date(b.date.replace(/\./g, "-")).getTime() -
          new Date(a.date.replace(/\./g, "-")).getTime(),
      );
  };

  const dailySummaries = groupRecordsByDate(mockRunRecords);

  const handleRecordSelect = (record: SingleRunRecord) => {
    setSelectedRecord(record);

    // 선택된 기록을 기반으로 RunningData 생성 (꾸미기용)
    const runningData: RunningData = {
      totalDistance: record.distance,
      totalRuns: 1,
      totalTime: record.duration,
      averagePace: record.averagePace,
      startDate: new Date(record.date.replace(/\./g, "-")),
      endDate: new Date(record.date.replace(/\./g, "-")),
    };

    setCurrentScreen("decoration");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSelectedRecord(null);
  };

  const handleWeeklyStatsClick = () => {
    setCurrentScreen("weeklyDetail");
  };

  const handleMonthlyStatsClick = () => {
    setCurrentScreen("monthlyCalendar");
  };

  const handleAddRecord = () => {
    setCurrentScreen("addRecord");
  };

  const handleImportRecord = () => {
    setCurrentScreen("importRecord");
  };

  const mockRunningData: RunningData = selectedRecord
    ? {
        totalDistance: selectedRecord.distance,
        totalRuns: 1,
        totalTime: selectedRecord.duration,
        averagePace: selectedRecord.averagePace,
        startDate: new Date(
          selectedRecord.date.replace(/\./g, "-"),
        ),
        endDate: new Date(
          selectedRecord.date.replace(/\./g, "-"),
        ),
      }
    : {
        totalDistance: 0,
        totalRuns: 0,
        totalTime: 0,
        averagePace: "0분 0초",
        startDate: new Date(),
        endDate: new Date(),
      };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "home" && (
        <HomeScreen
          runRecords={mockRunRecords}
          dailySummaries={dailySummaries}
          onRecordSelect={handleRecordSelect}
          onWeeklyStatsClick={handleWeeklyStatsClick}
          onMonthlyStatsClick={handleMonthlyStatsClick}
          onAddRecord={handleAddRecord}
          onImportRecord={handleImportRecord}
        />
      )}
      {currentScreen === "decoration" && selectedRecord && (
        <DecorationScreen
          runningData={mockRunningData}
          onBack={handleBackToHome}
        />
      )}
      {currentScreen === "weeklyDetail" && (
        <WeeklyDetailScreen
          runRecords={mockRunRecords}
          dailySummaries={dailySummaries}
          onBack={handleBackToHome}
          onRecordSelect={handleRecordSelect}
        />
      )}
      {currentScreen === "monthlyCalendar" && (
        <MonthlyCalendarScreen
          runRecords={mockRunRecords}
          dailySummaries={dailySummaries}
          onBack={handleBackToHome}
          onRecordSelect={handleRecordSelect}
        />
      )}
      {currentScreen === "addRecord" && (
        <AddRecordScreen
          onBack={handleBackToHome}
          onSave={(record) => {
            // TODO: 실제로는 record를 저장하는 로직
            console.log("New record:", record);
            handleBackToHome();
          }}
        />
      )}
      {currentScreen === "importRecord" && (
        <ImportRecordScreen
          onBack={handleBackToHome}
          onImport={(records) => {
            // TODO: 실제로는 records를 저장하는 로직
            console.log("Imported records:", records);
            handleBackToHome();
          }}
        />
      )}
    </div>
  );
}