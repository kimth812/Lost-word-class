import { useEffect, useState } from 'react';
import { RotateCcw, Home, Award, CheckCircle2, XCircle, Clock, Sparkles, BookOpen, Volume2, Sheet, RefreshCw, ChevronDown, ChevronUp, MousePointerClick, Settings, Wrench } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../types';
import { POS_CONFIG, WORD_FAMILIES } from '../data/wordFamilies';
import { playVictorySound, speakEnglishWord } from '../utils/audio';
import { saveGameResultsToGoogleSheet } from '../utils/googleSheets';
import { GoogleSheetModal } from './GoogleSheetModal';

interface ResultScreenProps {
  questions: Question[];
  score: number;
  timeSpentSeconds: number;
  studentName: string;
  totalGamesPlayed?: number;
  onRetryWrongOnly: () => void;
  onRestartNewGame: () => void;
  onGoHome: () => void;
  soundEnabled: boolean;
}

export function ResultScreen({
  questions,
  score,
  timeSpentSeconds,
  studentName,
  totalGamesPlayed = 1,
  onRetryWrongOnly,
  onRestartNewGame,
  onGoHome,
  soundEnabled,
}: ResultScreenProps) {
  const totalQuestions = questions.length;
  const correctQuestions = questions.filter((q) => q.isCorrect);
  const wrongQuestions = questions.filter((q) => !q.isCorrect);
  const accuracy = Math.round((correctQuestions.length / totalQuestions) * 100);

  // Format time
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const formattedTime = `${minutes > 0 ? `${minutes}분 ` : ''}${seconds}초`;

  // Determine Title / Badge
  let badgeTitle = '품사 마스터';
  let badgeDesc = '모든 품사 표지판을 완벽히 정복했습니다!';
  let badgeColor = 'from-amber-500 to-yellow-600';

  if (accuracy === 100) {
    badgeTitle = '🏆 1등급 품사 네비게이터';
    badgeDesc = '모든 단어의 어원과 품사를 완벽하게 길찾기 성공!';
    badgeColor = 'from-yellow-400 to-amber-600';
  } else if (accuracy >= 80) {
    badgeTitle = '🧭 숙련된 단어 탐험가';
    badgeDesc = '어원 패밀리의 흐름을 아주 잘 파악하고 있어요!';
    badgeColor = 'from-emerald-500 to-teal-600';
  } else if (accuracy >= 60) {
    badgeTitle = '🗺️ 품사 지도 수습생';
    badgeDesc = '틀린 단어 2~3개만 챙기면 곧 1등급입니다!';
    badgeColor = 'from-sky-500 to-blue-600';
  } else {
    badgeTitle = '🎒 열정적인 품사 여행자';
    badgeDesc = '오답 노트를 훑어보고 틀린 단어만 다시 풀어보세요!';
    badgeColor = 'from-purple-500 to-indigo-600';
  }

  const totalTaps = questions.reduce((sum, q) => sum + Math.max(1, q.tapCount ?? 1), 0);
  const averageTapFrequency = totalQuestions > 0 ? (totalTaps / totalQuestions).toFixed(1) : '0';

  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [syncTimestamp, setSyncTimestamp] = useState<string>('');
  const [showSentenceStats, setShowSentenceStats] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const performSync = async () => {
    setSyncState('saving');
    setSyncMessage('구글 시트에 각 문장별 탭 빈도 및 평균 저장 중...');
    try {
      const res = await saveGameResultsToGoogleSheet({
        studentName,
        questions,
        score,
        timeSpentSeconds,
        playCount: totalGamesPlayed || 1,
      });
      setSyncTimestamp(
        new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      if (res.success) {
        setSyncState('success');
        setSyncMessage(res.message || '구글 시트 저장 완료');
      } else {
        setSyncState('error');
        setSyncMessage(res.message || '저장 실패');
      }
    } catch (err) {
      setSyncState('error');
      setSyncMessage(err instanceof Error ? err.message : '전송 실패');
    }
  };

  useEffect(() => {
    performSync();
  }, []);

  // Fire confetti on high score
  useEffect(() => {
    if (accuracy >= 70) {
      if (soundEnabled) playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }
  }, [accuracy, soundEnabled]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="text-center pt-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs text-amber-900 font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>게임 종료! 탐험 완료</span>
        </div>
        <h2 className="text-3xl font-black text-stone-900">길찾기 결과</h2>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/90 shadow-lg text-center relative overflow-hidden mb-4">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Title Badge */}
        <div
          className={`inline-block px-4 py-1.5 rounded-full text-white text-xs font-black shadow-xs bg-linear-to-r ${badgeColor} mb-3`}
        >
          {badgeTitle}
        </div>

        {/* Total Score */}
        <div className="my-2">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider">총점</div>
          <div className="text-5xl font-black text-stone-900 tracking-tight font-mono">
            {score}
            <span className="text-2xl text-amber-600 font-sans font-bold ml-1">점</span>
          </div>
        </div>

        <p className="text-xs text-stone-600 font-medium px-4 mt-1">{badgeDesc}</p>

        {/* 4 Stats Grid: Includes Sentence Tap Average */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-stone-100 text-center">
          <div className="bg-stone-50 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px] font-semibold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>정답 수</span>
            </div>
            <div className="text-base font-black text-stone-800">
              {correctQuestions.length}{' '}
              <span className="text-xs text-stone-400 font-normal">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px] font-semibold mb-0.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>정답률</span>
            </div>
            <div className="text-base font-black text-amber-600 font-mono">{accuracy}%</div>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px] font-semibold mb-0.5">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>소요 시간</span>
            </div>
            <div className="text-base font-black text-stone-800 font-mono text-xs pt-1">{formattedTime}</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-amber-800 text-[11px] font-semibold mb-0.5">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-600" />
              <span>평균 탭 빈도</span>
            </div>
            <div className="text-base font-black text-amber-900 font-mono text-xs pt-1">
              {averageTapFrequency}
              <span className="text-[10px] text-amber-700 font-normal ml-0.5">회/문장</span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Sheets Sync Card: Sentence Tap Frequencies & Average Storage */}
      <div className="w-full bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm mb-5 text-left">
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <Sheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-stone-900">구글 시트 저장 현황</span>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-stone-100 rounded text-stone-600">
                  학습자: {studentName || '학생1'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                각 문장별 탭 빈도와 전체 평균이 구글 시트에 기록됩니다.
              </p>
            </div>
          </div>

          {/* Sync Status Badge & Settings Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {syncState === 'saving' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                <span>저장 중...</span>
              </span>
            )}
            {syncState === 'success' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>저장 완료</span>
              </span>
            )}
            {syncState === 'error' && (
              <button
                type="button"
                onClick={performSync}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                title="다시 시도"
              >
                <RefreshCw className="w-3 h-3 text-rose-600" />
                <span>재전송</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="구글 시트 연동 설정"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tap Stats Summary Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <div className="p-2.5 bg-stone-50 rounded-xl">
            <span className="text-[11px] text-stone-500 font-medium block">총 탭 횟수</span>
            <span className="text-base font-black text-stone-800 font-mono">{totalTaps}회</span>
          </div>
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[11px] text-emerald-800 font-medium block">문장당 평균 탭 빈도</span>
            <span className="text-base font-black text-emerald-900 font-mono">{averageTapFrequency}회</span>
          </div>
        </div>

        {/* Sync Status Message / Timestamp */}
        {syncMessage && (
          <div
            className={`mt-2.5 text-[11px] px-3 py-1.5 rounded-lg flex items-center justify-between ${
              syncState === 'success'
                ? 'bg-emerald-50/80 text-emerald-800'
                : syncState === 'error'
                ? 'bg-rose-50/80 text-rose-800'
                : 'bg-stone-50 text-stone-600'
            }`}
          >
            <span className="break-all">{syncMessage}</span>
            {syncTimestamp && <span className="text-[10px] opacity-75 shrink-0 ml-1">{syncTimestamp}</span>}
          </div>
        )}

        {/* 'Sheet not found' or Sync Error Troubleshooting Banner */}
        {syncState === 'error' && (
          <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs">
            <div className="flex items-start gap-2">
              <Wrench className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-amber-900 text-xs">
                  {syncMessage.includes('Sheet not found')
                    ? '구글 시트 탭 이름 또는 스크립트 연결 확인이 필요합니다'
                    : '구글 시트 연동 설정 안내'}
                </p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  첨부하신 <span className="font-bold text-stone-900">Lost!-word class 시트</span>에 바로 저장할 수 있는 스크립트 코드와 설정 방법을 확인해보세요!
                </p>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>구글 시트 연동 도우미 & 스크립트 복사 열기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Sentence-by-sentence Tap Frequency List */}
        <div className="mt-3 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowSentenceStats((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-stone-700 hover:text-stone-900 cursor-pointer py-1"
          >
            <span>각 문장별 탭 빈도 상세 목록 ({questions.length}문장)</span>
            {showSentenceStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSentenceStats && (
            <div className="mt-2 divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const sentence = q.wordItem.exampleSentence || q.wordItem.word;
                const taps = Math.max(1, q.tapCount ?? 1);
                const posMeta = POS_CONFIG[q.wordItem.partOfSpeech];

                return (
                  <div key={q.id || idx} className="py-2 text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 truncate">
                          {idx + 1}. {q.wordItem.word}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${posMeta.color.badge}`}>
                          {posMeta.shortCode}
                        </span>
                        {q.isCorrect ? (
                          <span className="text-[10px] text-emerald-600 font-bold">정답</span>
                        ) : (
                          <span className="text-[10px] text-rose-500 font-bold">오답</span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5 italic">"{sentence}"</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 font-black rounded font-mono text-xs">
                        {taps}회 탭
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="space-y-2.5 mb-6">
        {/* [틀린 단어만 다시] Button */}
        {wrongQuestions.length > 0 ? (
          <button
            id="btn-retry-wrong-only"
            type="button"
            onClick={onRetryWrongOnly}
            className="w-full py-4 px-5 rounded-2xl bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition-all cursor-pointer border-b-3 border-orange-800"
          >
            <RotateCcw className="w-5 h-5" />
            <span>틀린 단어만 다시 하기 ({wrongQuestions.length}개)</span>
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-800">
            🎉 축하합니다! 모든 문제를 맞혀 복습할 단어가 없습니다!
          </div>
        )}

        {/* [새 게임 시작] & [처음으로] */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-restart-new"
            type="button"
            onClick={onRestartNewGame}
            className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새 게임 시작</span>
          </button>

          <button
            id="btn-back-home"
            type="button"
            onClick={onGoHome}
            className="py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>처음으로</span>
          </button>
        </div>
      </div>

      {/* Incorrect Words Review (오답 노트 & 어원 족보 복습) */}
      {wrongQuestions.length > 0 && (
        <div className="w-full bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-1.5 text-stone-900 font-black text-sm">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>오답 단어 복습 노트 ({wrongQuestions.length})</span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">탭하여 발음 듣기</span>
          </div>

          <div className="divide-y divide-stone-100 mt-2">
            {wrongQuestions.map((q) => {
              const correctPos = POS_CONFIG[q.wordItem.partOfSpeech];
              const family = WORD_FAMILIES.find((f) => f.id === q.wordItem.rootId);

              return (
                <div key={q.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-stone-900">{q.wordItem.word}</span>
                        <button
                          type="button"
                          onClick={() => speakEnglishWord(q.wordItem.word)}
                          title="발음 듣기"
                          className="p-1 text-stone-400 hover:text-stone-700"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-600 font-medium mt-0.5">{q.wordItem.meaning}</p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${correctPos.color.badge}`}>
                        정답: {correctPos.krName}
                      </span>
                      {q.userAnswer && q.userAnswer !== 'skipped' && (
                        <div className="text-[10px] text-rose-500 font-medium mt-0.5">
                          내가 선택: {POS_CONFIG[q.userAnswer].krName}
                        </div>
                      )}
                      {q.userAnswer === 'skipped' && (
                        <div className="text-[10px] text-stone-400 font-medium mt-0.5">건너뜀 (PASS)</div>
                      )}
                    </div>
                  </div>

                  {/* Suffix Note */}
                  <div className="mt-1.5 text-[11px] text-stone-500 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    💡 {q.wordItem.suffixNote}
                  </div>

                  {/* 4-family sibling words */}
                  {family && (
                    <div className="mt-2 text-[10px] text-stone-600 flex flex-wrap gap-1">
                      <span className="font-semibold text-stone-400">뿌리({family.root}):</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700">명: {family.noun.word}</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700">동: {family.verb.word}</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700">형: {family.adjective.word}</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700">부: {family.adverb.word}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Google Sheet Integration Settings Modal */}
      <GoogleSheetModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => performSync()}
        initialError={syncState === 'error' ? syncMessage : undefined}
      />
    </div>
  );
}
