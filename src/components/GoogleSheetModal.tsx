import { useState } from 'react';
import { X, Sheet, Copy, Check, ExternalLink, HelpCircle, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  getGoogleScriptUrl,
  saveGoogleScriptUrl,
  resetGoogleScriptUrl,
  getTargetSheetName,
  saveTargetSheetName,
  testGoogleSheetConnection,
  RECOMMENDED_GAS_CODE,
} from '../utils/googleSheets';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  initialError?: string;
}

export function GoogleSheetModal({ isOpen, onClose, onSaved, initialError }: GoogleSheetModalProps) {
  const [scriptUrl, setScriptUrl] = useState(getGoogleScriptUrl);
  const [sheetName, setSheetName] = useState(getTargetSheetName);
  const [copied, setCopied] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(RECOMMENDED_GAS_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveSettings = () => {
    saveGoogleScriptUrl(scriptUrl);
    saveTargetSheetName(sheetName);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
    if (onSaved) onSaved();
  };

  const handleReset = () => {
    resetGoogleScriptUrl();
    const defaultUrl = getGoogleScriptUrl();
    setScriptUrl(defaultUrl);
    setSheetName('Lost!-word class');
    saveTargetSheetName('Lost!-word class');
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
    if (onSaved) onSaved();
  };

  const handleRunTest = async () => {
    setTestState('testing');
    setTestMessage('구글 시트 연동을 테스트하는 중입니다...');
    const result = await testGoogleSheetConnection(scriptUrl, sheetName);
    if (result.success) {
      setTestState('success');
      setTestMessage(result.message || '구글 시트와 정상적으로 연결되었습니다!');
    } else {
      setTestState('error');
      setTestMessage(result.message || '연동 실패: 설정을 다시 확인해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">구글 시트 연동 설정 & 가이드</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Lost!-word class 시트 저장 설정</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left text-xs sm:text-sm">
          {/* Initial Error Notice if any */}
          {initialError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">시트 저장 중 오류가 발생했습니다:</p>
                <p className="text-[11px] mt-0.5 text-rose-700 font-mono">{initialError}</p>
              </div>
            </div>
          )}

          {/* Quick Problem Guide: Why "Sheet not found" occurs */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-1.5">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>'Sheet not found' 오류가 발생하는 원인 & 해결법</span>
            </div>
            <ul className="text-[11px] text-amber-950/85 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-amber-900">원인 1 (시트 탭 이름 불일치):</strong> 사용 중인 구글 시트의 맨 아래 탭 이름이 스크립트가 찾는 이름과 다를 때 발생합니다.
              </li>
              <li>
                <strong className="text-amber-900">원인 2 (새 시트 미연동):</strong> 새로 만든 <code className="bg-amber-100 px-1 py-0.2 rounded font-bold">Lost!-word class</code> 구글 시트에 Apps Script가 배포되지 않았을 때 발생합니다.
              </li>
            </ul>
          </div>

          {/* Solution 1: Adjust Sheet Tab Name */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60">
            <h4 className="font-black text-stone-900 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">1</span>
              <span>가장 쉬운 해결: 구글 시트 탭 이름 맞추기</span>
            </h4>
            <p className="text-[11px] text-stone-600 mb-2 leading-relaxed">
              사용 중인 구글 시트 하단 탭 이름을 더블클릭하여 아래 이름 중 하나로 변경해보세요:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {['Lost!-word class', 'Lost_-word_class', '시트1', 'Sheet1'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSheetName(name)}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                    sheetName === name
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-400'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Solution 2: Bulletproof Google Apps Script Code */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-black text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">2</span>
                <span>완벽한 해결: 자동 인식 스크립트 코드 복사</span>
              </h4>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료!' : '코드 복사'}</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-600 mb-2.5 leading-relaxed">
              이 스크립트는 시트 탭 이름이 <code className="bg-stone-200 px-1 py-0.5 rounded font-bold">Lost!-word class</code>이든 <code className="bg-stone-200 px-1 py-0.5 rounded font-bold">시트1</code>이든 상관없이 <strong>첫 번째 시트에 자동 저장</strong>하며, 첨부해주신 열(<code className="bg-stone-200 px-1 py-0.5 rounded font-bold">timestamp, play_count, correct_count, wrong_count</code>)과 각 문장별 탭 횟수를 완벽히 기록합니다!
            </p>

            <details className="bg-stone-900 text-stone-200 rounded-xl p-3 text-[11px] font-mono overflow-x-auto">
              <summary className="cursor-pointer text-emerald-400 font-bold select-none mb-1">
                ▶ Apps Script 소스 코드 미리보기 (클릭하여 펼치기)
              </summary>
              <pre className="mt-2 text-[10.5px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {RECOMMENDED_GAS_CODE}
              </pre>
            </details>

            {/* Step by step */}
            <div className="mt-3 bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1 text-stone-700">
              <div className="font-bold text-stone-900 text-xs mb-1">📌 적용 방법 (1분 소요):</div>
              <div>1. 본인의 구글 시트(<span className="font-semibold text-stone-900">Lost!-word class</span>) 열기</div>
              <div>2. 상단 메뉴 <span className="font-semibold text-stone-900">[확장 프로그램]</span> → <span className="font-semibold text-stone-900">[Apps Script]</span> 클릭</div>
              <div>3. 기존 내용을 지우고 위 복사한 코드를 붙여넣기 후 저장 (Ctrl+S)</div>
              <div>4. 우측 상단 <span className="font-semibold text-stone-900">[배포]</span> → <span className="font-semibold text-stone-900">[새 배포]</span> 클릭</div>
              <div>5. 유형: <span className="font-semibold text-stone-900">웹 앱</span>, 액세스 권한: <span className="font-bold text-emerald-600">모든 사용자 (Anyone)</span> 선택 후 배포</div>
              <div>6. 생성된 웹 앱 URL을 아래에 붙여넣기하면 끝!</div>
            </div>
          </div>

          {/* URL Input & Testing */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white">
            <h4 className="font-black text-stone-900 text-xs sm:text-sm mb-2">
              🔗 웹 앱 URL 설정 & 연결 테스트
            </h4>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Google Apps Script 웹 앱 URL
                </label>
                <input
                  type="url"
                  value={scriptUrl}
                  onChange={(e) => setScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  대상 시트 탭 이름 (기본값: Lost!-word class)
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Lost!-word class"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action buttons: Save, Test, Reset */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  설정 저장
                </button>

                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={testState === 'testing'}
                  className="py-2.5 px-3 bg-stone-800 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testState === 'testing' ? 'animate-spin' : ''}`} />
                  <span>연결 테스트</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-3 border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  기본값 복원
                </button>
              </div>

              {saveSuccessNotice && (
                <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg text-center animate-in fade-in">
                  ✓ 설정이 저장되었습니다.
                </div>
              )}

              {/* Test Result Message */}
              {testMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                    testState === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                      : testState === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  {testState === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : testState === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-stone-500 animate-spin shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1 break-all leading-relaxed">{testMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
