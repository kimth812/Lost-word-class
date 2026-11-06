import { Question, SentenceTapStat, SheetSaveResult } from '../types';

export const DEFAULT_GOOGLE_SCRIPT_URL =
  import.meta.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) ||
  'https://script.google.com/macros/s/AKfycby2ESVezPBuAe2mS1SDepP1JlcBXwVJYnaL-MLG9vY-Tyx318UhRgURwXc-gl1MWtK3/exec';

export const STORAGE_KEY_STUDENT_NAME = 'lost_word_student_name';
export const STORAGE_KEY_CUSTOM_SCRIPT_URL = 'lost_word_custom_script_url';
export const STORAGE_KEY_TARGET_SHEET = 'lost_word_target_sheet_name';

export function getSavedStudentName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_STUDENT_NAME) || '학생1';
  } catch {
    return '학생1';
  }
}

export function saveStudentName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  } catch {
    // Ignore storage errors
  }
}

export function getGoogleScriptUrl(): string {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_SCRIPT_URL);
    if (custom && custom.trim()) return custom.trim();
  } catch {
    // Fallback
  }
  return DEFAULT_GOOGLE_SCRIPT_URL;
}

export function saveGoogleScriptUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCRIPT_URL, url.trim());
  } catch {
    // Ignore storage errors
  }
}

export function resetGoogleScriptUrl(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_SCRIPT_URL);
  } catch {
    // Ignore storage errors
  }
}

export function getTargetSheetName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_TARGET_SHEET) || 'Lost!-word class';
  } catch {
    return 'Lost!-word class';
  }
}

export function saveTargetSheetName(sheetName: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_TARGET_SHEET, sheetName.trim());
  } catch {
    // Ignore storage errors
  }
}

export interface SaveGamePayloadOptions {
  studentName: string;
  questions: Question[];
  score: number;
  timeSpentSeconds: number;
  playCount?: number;
}

export async function saveGameResultsToGoogleSheet({
  studentName,
  questions,
  score,
  timeSpentSeconds,
  playCount = 1,
}: SaveGamePayloadOptions): Promise<SheetSaveResult> {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl) {
    return {
      success: false,
      message: 'Google Apps Script URL이 설정되지 않았습니다.',
    };
  }

  const validName = studentName?.trim() || '학생1';
  const targetSheet = getTargetSheetName() || 'Lost!-word class';

  // 1. Calculate each sentence's tap count
  const sentenceStats: SentenceTapStat[] = questions.map((q) => {
    const sentenceText = q.wordItem.exampleSentence || q.wordItem.word;
    const tapCount = Math.max(1, q.tapCount ?? 1);

    return {
      sentence: sentenceText,
      sentenceMeaning: q.wordItem.exampleMeaning || q.wordItem.meaning,
      word: q.wordItem.word,
      partOfSpeech: q.wordItem.partOfSpeech,
      tapCount,
      isCorrect: !!q.isCorrect,
    };
  });

  // 2. Calculate average tap frequency
  const totalTaps = sentenceStats.reduce((sum, item) => sum + item.tapCount, 0);
  const averageTapFrequency =
    sentenceStats.length > 0 ? Number((totalTaps / sentenceStats.length).toFixed(2)) : 0;

  // 3. Calculate correct / wrong counts
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const wrongCount = questions.length - correctCount;
  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // 4. Map of sentence -> tap frequency
  const sentenceTapFrequencies: Record<string, number> = {};
  sentenceStats.forEach((s) => {
    sentenceTapFrequencies[s.sentence] = s.tapCount;
  });

  const payload = {
    // Required user name fields
    name: validName,
    userName: validName,
    user_name: validName,
    student_name: validName,

    // Required 4 columns from the user's Google Sheet:
    // timestamp, play_count, correct_count, wrong_count
    timestamp: new Date().toISOString(),
    formatted_timestamp: new Date().toLocaleString('ko-KR'),
    play_count: playCount,
    playCount: playCount,
    correct_count: correctCount,
    wrong_count: wrongCount,

    // Score & accuracy
    score,
    total_score: score,
    gameScore: score,
    game_score: score,
    accuracy,
    time_spent_seconds: timeSpentSeconds,

    // Sentence-by-sentence tap frequencies & average
    sentences: sentenceStats,
    sentence_stats: sentenceStats,
    sentence_tap_frequencies: sentenceTapFrequencies,
    average_taps: averageTapFrequency,
    tap_average: averageTapFrequency,
    average: averageTapFrequency,
    tap_frequency: averageTapFrequency,
    total_taps: totalTaps,

    // Target sheet identifiers
    sheet: targetSheet,
    sheetName: targetSheet,
    sheet_name: targetSheet,
    tab: targetSheet,
    tabName: targetSheet,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 0) {
      return {
        success: false,
        message: `전송 실패 (HTTP 상태 코드: ${response.status})`,
      };
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.success === false) {
        if (data.message === 'Sheet not found') {
          return {
            success: false,
            message: `Sheet not found: 구글 시트에서 '${targetSheet}' 탭을 찾을 수 없습니다. [연동 설정]에서 탭 이름을 맞추거나 새 스크립트를 연결해주세요.`,
          };
        }
        return {
          success: false,
          message: data.message || '구글 시트 저장 실패',
        };
      }
      return {
        success: true,
        message: data.message || '구글 시트에 성공적으로 저장되었습니다.',
      };
    } catch {
      if (text.includes('Sheet not found')) {
        return {
          success: false,
          message: `Sheet not found: 구글 시트에서 '${targetSheet}' 탭을 찾을 수 없습니다. [연동 설정]에서 탭 이름을 맞추거나 새 스크립트를 연결해주세요.`,
        };
      }
      if (text.includes('"success":false')) {
        return {
          success: false,
          message: '구글 시트에서 오류를 반환했습니다.',
        };
      }
      return {
        success: true,
        message: '구글 시트에 성공적으로 저장되었습니다.',
      };
    }
  } catch (error) {
    // Fallback: If CORS blocks reading the response in browser, try no-cors mode to ensure delivery
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        message: '구글 시트로 데이터가 전송되었습니다.',
      };
    } catch {
      return {
        success: false,
        message: error instanceof Error ? error.message : '네트워크 통신 오류',
      };
    }
  }
}

/**
 * Tests Google Apps Script endpoint connection
 */
export async function testGoogleSheetConnection(
  customUrl?: string,
  targetSheetName?: string
): Promise<SheetSaveResult> {
  const url = customUrl?.trim() || getGoogleScriptUrl();
  const sheetName = targetSheetName?.trim() || getTargetSheetName();

  const testPayload = {
    name: '연동테스트',
    play_count: 1,
    correct_count: 1,
    wrong_count: 0,
    score: 10,
    sheet: sheetName,
    sheetName: sheetName,
    tab: sheetName,
    timestamp: new Date().toISOString(),
    average_taps: 1.0,
    sentences: [
      {
        word: 'test',
        sentence: 'This is a test connection.',
        tapCount: 1,
        isCorrect: true,
        partOfSpeech: 'noun',
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testPayload),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (data.success === false) {
        if (data.message === 'Sheet not found') {
          return {
            success: false,
            message: `Sheet not found: 현재 구글 시트에 '${sheetName}' 탭이 없거나 스크립트가 다른 시트를 가리키고 있습니다.`,
          };
        }
        return {
          success: false,
          message: data.message || '저장 실패',
        };
      }
      return {
        success: true,
        message: data.message || `성공! 구글 시트에 정상 기록되었습니다.`,
      };
    } catch {
      if (text.includes('Sheet not found')) {
        return {
          success: false,
          message: `Sheet not found: 현재 구글 시트에 '${sheetName}' 탭이 없거나 스크립트가 다른 시트를 가리키고 있습니다.`,
        };
      }
      return {
        success: true,
        message: '구글 시트 연동 요청이 정상 전송되었습니다.',
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : '네트워크 오류',
    };
  }
}

/**
 * Bulletproof Apps Script code for the user to paste into their Google Sheet
 */
export const RECOMMENDED_GAS_CODE = `function doGet(e) {
  return ContentService.createTextOutput("LOST! word class API is running.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    // 1. 필수 값 검증 및 안전한 기본값 처리
    var name = data.name || data.userName || data.student_name || "학생1";
    var correctCount = Number(data.correct_count !== undefined ? data.correct_count : 0);
    var wrongCount = Number(data.wrong_count !== undefined ? data.wrong_count : 0);
    var playCount = Number(data.play_count !== undefined ? data.play_count : 1);
    var averageTaps = data.average_taps !== undefined ? data.average_taps : (data.average || 1);
    var score = data.score !== undefined ? data.score : (correctCount * 10);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 2. 시트 탭 자동 찾기 (Lost!-word class -> 요청받은 이름 -> 기본 첫 번째 시트)
    // * getSheets()[0]을 폴백으로 두어 'Sheet not found' 에러가 절대 발생하지 않습니다!
    var targetName = data.sheetName || data.sheet || "Lost!-word class";
    var sheet = ss.getSheetByName(targetName) || 
                ss.getSheetByName("Lost!-word class") || 
                ss.getSheetByName("Lost_-word_class") || 
                ss.getSheetByName("시트1") || 
                ss.getSheetByName("Sheet1") || 
                ss.getSheets()[0];
    
    if (!sheet) {
      sheet = ss.insertSheet("Lost!-word class");
    }
    
    // 3. 첨부해주신 4개 헤더 열(timestamp, play_count, correct_count, wrong_count) + 상세 열 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "timestamp", 
        "play_count", 
        "correct_count", 
        "wrong_count", 
        "name", 
        "score", 
        "average_taps", 
        "sentence_stats"
      ]);
    }
    
    // 4. 데이터 추가
    var now = new Date();
    var timestampStr = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    var sentenceStatsStr = JSON.stringify(data.sentences || []);
    
    sheet.appendRow([
      timestampStr,
      playCount,
      correctCount,
      wrongCount,
      name,
      score,
      averageTaps,
      sentenceStatsStr
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "성공적으로 저장되었습니다! (시트 탭: " + sheet.getName() + ")"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "오류 발생: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
