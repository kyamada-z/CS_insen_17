import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, Users, UserPlus, Award, Info, AlertTriangle, 
  CheckCircle2, Calendar, MousePointer2, Settings2, 
  ChevronDown, ChevronUp, Plus, Minus, Calculator, Save, Trash2, FolderOpen 
} from 'lucide-react';

// --- Firebase の初期化と設定 ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';

let app, auth, db;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

try {
  const firebaseConfig = JSON.parse(__firebase_config);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

// 標準システムプリセット
const DEFAULT_PRESETS = [
  {
    id: 'default-17th',
    name: '17期標準プラン (初期設定)',
    staffIncentiveRate: 50,
    hrRateNormal: 2,
    hrRateChallenge: 4,
    friendAmountNormal: 5000,
    friendAmountChallenge: 12500,
    turnoverNormalT1: 12000,
    turnoverNormalT2: 24000,
    turnoverChallengeT1: 30000,
    turnoverChallengeT2: 60000,
    isSystem: true
  },
  {
    id: 'referral-boost',
    name: '紹介特化プラン (紹介率UP)',
    staffIncentiveRate: 50,
    hrRateNormal: 3,
    hrRateChallenge: 6,
    friendAmountNormal: 8000,
    friendAmountChallenge: 15000,
    turnoverNormalT1: 12000,
    turnoverNormalT2: 24000,
    turnoverChallengeT1: 30000,
    turnoverChallengeT2: 60000,
    isSystem: true
  }
];

const App = () => {
  // --- 認証 & データベース状態 ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  // --- 成果目標の状態管理 ---
  const [staffCount, setStaffCount] = useState(100); 
  const [hrSalesYearly, setHrSalesYearly] = useState(12000000); 
  const [friendReferralsYearly, setFriendReferralsYearly] = useState(12); 
  
  // 退職率改善の達成回数 (四半期ごと、年間計4回)
  const [achievementsTier1, setAchievementsTier1] = useState(0); 
  const [achievementsTier2, setAchievementsTier2] = useState(0); 
  
  // チャレンジ型の給与調整設定
  const [deemedOvertimeDeduction, setDeemedOvertimeDeduction] = useState(38000); 

  // --- インセンティブ単価設定の状態管理 ---
  const [showSettings, setShowSettings] = useState(false);
  const [staffIncentiveRate, setStaffIncentiveRate] = useState(50); 
  const [hrRateNormal, setHrRateNormal] = useState(2); 
  const [hrRateChallenge, setHrRateChallenge] = useState(4); 
  const [friendAmountNormal, setFriendAmountNormal] = useState(5000); 
  const [friendAmountChallenge, setFriendAmountChallenge] = useState(12500); 

  const [turnoverNormalT1, setTurnoverNormalT1] = useState(12000);
  const [turnoverNormalT2, setTurnoverNormalT2] = useState(24000);
  const [turnoverChallengeT1, setTurnoverChallengeT1] = useState(30000);
  const [turnoverChallengeT2, setTurnoverChallengeT2] = useState(60000);

  // --- 1. 認証のセットアップ ---
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Auth failed:", e);
        setIsLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. 最後に選択されていた状態の自動復元 ---
  useEffect(() => {
    if (!user || !db) return;

    const fetchActiveState = async () => {
      try {
        const activeDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'activeState', 'lastActive');
        const docSnap = await getDoc(activeDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.staffCount !== undefined) setStaffCount(Number(data.staffCount));
          if (data.hrSalesYearly !== undefined) setHrSalesYearly(Number(data.hrSalesYearly));
          if (data.friendReferralsYearly !== undefined) setFriendReferralsYearly(Number(data.friendReferralsYearly));
          if (data.achievementsTier1 !== undefined) setAchievementsTier1(Number(data.achievementsTier1));
          if (data.achievementsTier2 !== undefined) setAchievementsTier2(Number(data.achievementsTier2));
          if (data.deemedOvertimeDeduction !== undefined) setDeemedOvertimeDeduction(Number(data.deemedOvertimeDeduction));
          
          if (data.staffIncentiveRate !== undefined) setStaffIncentiveRate(Number(data.staffIncentiveRate));
          if (data.hrRateNormal !== undefined) setHrRateNormal(Number(data.hrRateNormal));
          if (data.hrRateChallenge !== undefined) setHrRateChallenge(Number(data.hrRateChallenge));
          if (data.friendAmountNormal !== undefined) setFriendAmountNormal(Number(data.friendAmountNormal));
          if (data.friendAmountChallenge !== undefined) setFriendAmountChallenge(Number(data.friendAmountChallenge));
          
          if (data.turnoverNormalT1 !== undefined) setTurnoverNormalT1(Number(data.turnoverNormalT1));
          if (data.turnoverNormalT2 !== undefined) setTurnoverNormalT2(Number(data.turnoverNormalT2));
          if (data.turnoverChallengeT1 !== undefined) setTurnoverChallengeT1(Number(data.turnoverChallengeT1));
          if (data.turnoverChallengeT2 !== undefined) setTurnoverChallengeT2(Number(data.turnoverChallengeT2));
        }
      } catch (err) {
        console.error("Failed to restore active state:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveState();
  }, [user]);

  // --- 3. 登録済みパターンのリアルタイム購読 ---
  useEffect(() => {
    if (!user || !db) return;

    const presetsCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'presets');
    const unsubscribe = onSnapshot(presetsCollection, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPresets(list);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 4. 自動セーブ処理 (入力変化のDebounceセーブ) ---
  useEffect(() => {
    if (!user || !db || isLoading) return;

    const timer = setTimeout(async () => {
      try {
        const activeDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'activeState', 'lastActive');
        await setDoc(activeDocRef, {
          staffCount,
          hrSalesYearly,
          friendReferralsYearly,
          achievementsTier1,
          achievementsTier2,
          deemedOvertimeDeduction,
          staffIncentiveRate,
          hrRateNormal,
          hrRateChallenge,
          friendAmountNormal,
          friendAmountChallenge,
          turnoverNormalT1,
          turnoverNormalT2,
          turnoverChallengeT1,
          turnoverChallengeT2,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Auto save failed:", err);
      }
    }, 800); // 800msの操作待機後自動セーブ

    return () => clearTimeout(timer);
  }, [
    user, staffCount, hrSalesYearly, friendReferralsYearly, achievementsTier1, achievementsTier2, deemedOvertimeDeduction,
    staffIncentiveRate, hrRateNormal, hrRateChallenge, friendAmountNormal, friendAmountChallenge,
    turnoverNormalT1, turnoverNormalT2, turnoverChallengeT1, turnoverChallengeT2, isLoading
  ]);

  // 全プリセットの統合 (デフォルト + ユーザー定義)
  const allPresets = useMemo(() => {
    return [...DEFAULT_PRESETS, ...presets];
  }, [presets]);

  // 現在の設定と完全一致するパターンを検出 (ロバストな比較に変更)
  const activePresetId = useMemo(() => {
    const match = allPresets.find(p => 
      Number(p.staffIncentiveRate ?? 0) === Number(staffIncentiveRate ?? 0) &&
      Number(p.hrRateNormal ?? 0) === Number(hrRateNormal ?? 0) &&
      Number(p.hrRateChallenge ?? 0) === Number(hrRateChallenge ?? 0) &&
      Number(p.friendAmountNormal ?? 0) === Number(friendAmountNormal ?? 0) &&
      Number(p.friendAmountChallenge ?? 0) === Number(friendAmountChallenge ?? 0) &&
      Number(p.turnoverNormalT1 ?? 0) === Number(turnoverNormalT1 ?? 0) &&
      Number(p.turnoverNormalT2 ?? 0) === Number(turnoverNormalT2 ?? 0) &&
      Number(p.turnoverChallengeT1 ?? 0) === Number(turnoverChallengeT1 ?? 0) &&
      Number(p.turnoverChallengeT2 ?? 0) === Number(turnoverChallengeT2 ?? 0)
    );
    return match ? match.id : null;
  }, [
    allPresets, staffIncentiveRate, hrRateNormal, hrRateChallenge, 
    friendAmountNormal, friendAmountChallenge, turnoverNormalT1, 
    turnoverNormalT2, turnoverChallengeT1, turnoverChallengeT2
  ]);

  // パターンの新規保存
  const handleSavePreset = async (e) => {
    e.preventDefault();
    if (!user || !db || !newPresetName.trim()) return;
    setIsSavingPreset(true);
    try {
      const presetId = crypto.randomUUID();
      const presetDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'presets', presetId);
      await setDoc(presetDocRef, {
        name: newPresetName.trim(),
        staffIncentiveRate: Number(staffIncentiveRate),
        hrRateNormal: Number(hrRateNormal),
        hrRateChallenge: Number(hrRateChallenge),
        friendAmountNormal: Number(friendAmountNormal),
        friendAmountChallenge: Number(friendAmountChallenge),
        turnoverNormalT1: Number(turnoverNormalT1),
        turnoverNormalT2: Number(turnoverNormalT2),
        turnoverChallengeT1: Number(turnoverChallengeT1),
        turnoverChallengeT2: Number(turnoverChallengeT2),
        createdAt: new Date().toISOString()
      });
      setNewPresetName('');
    } catch (err) {
      console.error("Failed to save preset:", err);
    } finally {
      setIsSavingPreset(false);
    }
  };

  // パターンの適用 (数値キャストを強制)
  const handleApplyPreset = (preset) => {
    setStaffIncentiveRate(Number(preset.staffIncentiveRate ?? 50));
    setHrRateNormal(Number(preset.hrRateNormal ?? 2));
    setHrRateChallenge(Number(preset.hrRateChallenge ?? 4));
    setFriendAmountNormal(Number(preset.friendAmountNormal ?? 5000));
    setFriendAmountChallenge(Number(preset.friendAmountChallenge ?? 12500));
    setTurnoverNormalT1(Number(preset.turnoverNormalT1 ?? 12000));
    setTurnoverNormalT2(Number(preset.turnoverNormalT2 ?? 24000));
    setTurnoverChallengeT1(Number(preset.turnoverChallengeT1 ?? 30000));
    setTurnoverChallengeT2(Number(preset.turnoverChallengeT2 ?? 60000));
  };

  // パターンの削除
  const handleDeletePreset = async (e, presetId) => {
    e.stopPropagation(); // 適用処理の同時発火を防ぐ
    if (!user || !db) return;
    try {
      const presetDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'presets', presetId);
      await deleteDoc(presetDocRef);
    } catch (err) {
      console.error("Failed to delete preset:", err);
    }
  };

  // 達成回数のバリデーション（合計4回まで）
  const updateTier1 = (val) => {
    const next = Math.max(0, Math.min(4, val));
    if (next + achievementsTier2 > 4) {
      setAchievementsTier2(4 - next);
    }
    setAchievementsTier1(next);
  };

  const updateTier2 = (val) => {
    const next = Math.max(0, Math.min(4, val));
    if (next + achievementsTier1 > 4) {
      setAchievementsTier1(4 - next);
    }
    setAchievementsTier2(next);
  };

  // 計算ロジック
  const calculations = useMemo(() => {
    const months = 12;

    // チャレンジ型の実質的な月額給与変動額 (手当なし)
    const netSalaryAdjustment = -deemedOvertimeDeduction;

    // 1. 担当スタッフ数 (月額)
    const monthlyStaff = staffCount * staffIncentiveRate;
    
    // 2. 人材紹介
    const monthlyHrNormal = (hrSalesYearly / months) * (hrRateNormal / 100);
    const monthlyHrChallenge = (hrSalesYearly / months) * (hrRateChallenge / 100);
    
    // 3. 友人紹介
    const monthlyFriendNormal = (friendReferralsYearly / months) * friendAmountNormal;
    const monthlyFriendChallenge = (friendReferralsYearly / months) * friendAmountChallenge;
    
    // 4. 退職率改善 (年間の合計支給額を12で割る)
    const annualTurnoverNormal = (achievementsTier1 * turnoverNormalT1) + (achievementsTier2 * turnoverNormalT2);
    const annualTurnoverChallenge = (achievementsTier1 * turnoverChallengeT1) + (achievementsTier2 * turnoverChallengeT2);
    
    const monthlyTurnoverNormal = annualTurnoverNormal / months;
    const monthlyTurnoverChallenge = annualTurnoverChallenge / months;

    // --- 月額合計 ---
    const totalMonthlyNormal = monthlyStaff + monthlyHrNormal + monthlyFriendNormal + monthlyTurnoverNormal;
    const totalMonthlyChallenge = netSalaryAdjustment + monthlyStaff + monthlyHrChallenge + monthlyFriendChallenge + monthlyTurnoverChallenge;

    // --- 年額合計 ---
    const totalYearlyNormal = totalMonthlyNormal * months;
    const totalYearlyChallenge = totalMonthlyChallenge * months;

    return {
      netSalaryAdjustment,
      annualTurnoverNormal,
      annualTurnoverChallenge,
      monthly: {
        normal: {
          total: totalMonthlyNormal,
          breakdown: [
            { label: '給与ベース変動', value: 0 },
            { label: '担当スタッフ数', value: monthlyStaff },
            { label: '人材紹介', value: monthlyHrNormal },
            { label: '友人紹介', value: monthlyFriendNormal },
            { label: '退職率改善', value: monthlyTurnoverNormal },
          ]
        },
        challenge: {
          total: totalMonthlyChallenge,
          breakdown: [
            { label: '給与ベース変動 (控除)', value: netSalaryAdjustment },
            { label: '担当スタッフ数', value: monthlyStaff },
            { label: '人材紹介', value: monthlyHrChallenge },
            { label: '友人紹介', value: monthlyFriendChallenge },
            { label: '退職率改善', value: monthlyTurnoverChallenge },
          ]
        }
      },
      yearly: {
        normal: totalYearlyNormal,
        challenge: totalYearlyChallenge,
        diff: totalYearlyChallenge - totalYearlyNormal
      },
      monthlyDiff: totalMonthlyChallenge - totalMonthlyNormal
    };
  }, [
    staffCount, hrSalesYearly, friendReferralsYearly, achievementsTier1, achievementsTier2, deemedOvertimeDeduction,
    staffIncentiveRate, hrRateNormal, hrRateChallenge, friendAmountNormal, friendAmountChallenge,
    turnoverNormalT1, turnoverNormalT2, turnoverChallengeT1, turnoverChallengeT2
  ]);

  const formatYen = (val) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(val);

  // データベース読み込み中の待機画面
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <Calculator className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-xl font-black text-slate-700 animate-pulse tracking-widest">保存データを読み込み中...</p>
        <p className="text-sm text-slate-400 mt-2">安全な同期処理を行っています。少々お待ちください。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-1.5 rounded-full text-sm font-bold mb-6">
            <MousePointer2 className="w-4 h-4 animate-bounce" />
            17期 インセンティブ・シミュレーター
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">報酬プラン比較ツール</h1>
          <p className="text-lg text-slate-500 italic">設定値を自動保存・いつでも複数パターンでシミュレーション</p>
        </header>

        {/* パターン管理 ＆ 単価設定セクション */}
        <div className="mb-10 space-y-4 animate-in fade-in duration-500 delay-100">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
              <Settings2 className="w-6 h-6 text-blue-600" />
              <span>単価パターンの保存・微調整</span>
              {activePresetId && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                  選択中: {allPresets.find(p => p.id === activePresetId)?.name}
                </span>
              )}
            </div>
            {showSettings ? <ChevronUp className="w-6 h-6"/> : <ChevronDown className="w-6 h-6"/>}
          </button>
          
          {showSettings && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* --- パターンの保存 ＆ ロードエリア --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
                {/* 1. 現在の設定を保存するフォーム */}
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                  <h3 className="text-base font-black text-slate-700 flex items-center gap-2">
                    <Save className="w-5 h-5 text-blue-600" />
                    現在の単価設定を保存
                  </h3>
                  <form onSubmit={handleSavePreset} className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="例：17期通常案、紹介2倍キャンペーンなど" 
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      className="flex-1 p-3 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isSavingPreset}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      保存する
                    </button>
                  </form>
                  <p className="text-[11px] text-slate-400">※現在選択中のすべての「単価/歩合率」をクラウドに保存します（目標値は除く）</p>
                </div>

                {/* 2. 保存済みパターン一覧 (divラッパーによる干渉防止構造に変更) */}
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-700 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    登録済み単価パターン一覧
                  </h3>
                  <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-2">
                    {allPresets.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleApplyPreset(preset)}
                          role="button"
                          tabIndex={0}
                          className={`group pl-4 pr-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border shadow-sm cursor-pointer select-none ${
                            isActive 
                              ? 'bg-blue-600 border-blue-600 text-white font-black shadow-blue-100 shadow-md scale-105' 
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate max-w-[180px]">{preset.name}</span>
                          {!preset.isSystem ? (
                            <span 
                              onClick={(e) => handleDeletePreset(e, preset.id)}
                              className={`p-1 rounded-md transition-colors shrink-0 ${
                                isActive ? 'hover:bg-blue-700 text-blue-200 hover:text-white' : 'hover:bg-red-50 text-slate-300 hover:text-red-600'
                              }`}
                              title="パターンを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-normal group-hover:bg-slate-200 shrink-0">System</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* --- 単価微調整エリア --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="space-y-5 border-r pr-6">
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">基本設定</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">スタッフ1名:</span>
                    <input type="number" value={staffIncentiveRate} onChange={(e) => setStaffIncentiveRate(Number(e.target.value))} className="w-24 p-2 border rounded-lg text-right text-base font-bold shadow-sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">紹介料率(正):</span>
                    <div className="flex items-center gap-1">
                      <input type="number" value={hrRateNormal} onChange={(e) => setHrRateNormal(Number(e.target.value))} className="w-16 p-2 border rounded-lg text-right text-base font-bold shadow-sm" />
                      <span className="text-sm font-bold">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-bold">紹介料率(挑):</span>
                    <div className="flex items-center gap-1">
                      <input type="number" value={hrRateChallenge} onChange={(e) => setHrRateChallenge(Number(e.target.value))} className="w-16 p-2 border rounded-lg text-right text-base font-bold bg-blue-50 border-blue-100 shadow-sm" />
                      <span className="text-sm font-bold text-blue-600">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 border-r pr-6">
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">友人紹介(1件)</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">安定型:</span>
                    <input type="number" value={friendAmountNormal} onChange={(e) => setFriendAmountNormal(Number(e.target.value))} className="w-28 p-2 border rounded-lg text-right text-base font-bold shadow-sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-bold">チャレンジ:</span>
                    <input type="number" value={friendAmountChallenge} onChange={(e) => setFriendAmountChallenge(Number(e.target.value))} className="w-28 p-2 border rounded-lg text-right text-base font-bold bg-blue-50 border-blue-100 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-2 grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-tighter">退職率改善 (1回)</label>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">安定 T1:</span>
                        <input type="number" value={turnoverNormalT1} onChange={(e) => setTurnoverNormalT1(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-right text-sm shadow-sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-bold">挑戦 T1:</span>
                        <input type="number" value={turnoverChallengeT1} onChange={(e) => setTurnoverChallengeT1(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-right text-sm bg-blue-50 border-blue-100 font-bold text-blue-600 shadow-sm" />
                      </div>
                   </div>
                   <div className="space-y-4 pt-8">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">安定 T2:</span>
                        <input type="number" value={turnoverNormalT2} onChange={(e) => setTurnoverNormalT2(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-right text-sm shadow-sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-bold">挑戦 T2:</span>
                        <input type="number" value={turnoverChallengeT2} onChange={(e) => setTurnoverChallengeT2(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-right text-sm bg-blue-50 border-blue-100 font-bold text-blue-600 shadow-sm" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* メインの計算部 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 左カラム: 入力エリア */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in duration-500 delay-200">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 border-b pb-4 text-slate-800">
                <TrendingUp className="w-7 h-7 text-blue-600" />
                成果目標の設定
              </h2>

              <div className="space-y-8">
                <div className="bg-blue-50/20 p-6 rounded-2xl border border-slate-100 shadow-inner">
                  <label className="block text-lg font-bold text-slate-700 mb-4">月平均 担当スタッフ数 (名)</label>
                  <div className="flex items-center gap-6 mb-4">
                    <input 
                      type="number" 
                      value={staffCount} 
                      onChange={(e) => setStaffCount(Number(e.target.value))} 
                      className="w-28 p-4 border-2 border-white rounded-2xl text-center focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-2xl font-black text-blue-900"
                    />
                    <div className="flex-1">
                        <input 
                          type="range" min="0" max="300" step="1" 
                          value={staffCount} 
                          onChange={(e) => setStaffCount(Number(e.target.value))} 
                          className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                        />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                  <label className="block text-lg font-bold text-slate-700 mb-4 underline decoration-blue-200 decoration-4 underline-offset-8">【年間】人材紹介 手数料売上</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={hrSalesYearly} 
                      onChange={(e) => setHrSalesYearly(Number(e.target.value))} 
                      className="w-full p-4 pl-12 border-2 border-white rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-2xl font-black text-blue-900" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-2xl font-bold">¥</span>
                  </div>
                </div>

                <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                  <label className="block text-lg font-bold text-slate-700 mb-4 underline decoration-blue-200 decoration-4 underline-offset-8">【年間】友人紹介 開始数</label>
                  <div className="flex items-center gap-6">
                    <input 
                      type="number" 
                      value={friendReferralsYearly} 
                      onChange={(e) => setFriendReferralsYearly(Number(e.target.value))} 
                      className="w-28 p-4 border-2 border-white rounded-2xl text-center focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-2xl font-black text-blue-900" 
                    />
                    <input 
                      type="range" min="0" max="100" step="1" 
                      value={friendReferralsYearly} 
                      onChange={(e) => setFriendReferralsYearly(Number(e.target.value))} 
                      className="flex-1 h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>
                </div>

                {/* 退職率改善達成回数 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-lg font-bold mb-6 text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2 italic text-blue-700">
                        <Award className="w-6 h-6" /> 退職率改善 達成回数 (年間)
                    </span>
                    <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-blue-600 font-bold tracking-widest uppercase">Max 4回</span>
                  </label>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-base font-bold text-slate-600 tracking-tight">0.5~1.0% 改善</span>
                      <div className="flex items-center gap-5">
                        <button onClick={() => updateTier1(achievementsTier1 - 1)} className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"><Minus className="w-5 h-5 text-slate-400"/></button>
                        <span className="w-10 text-center text-2xl font-black text-blue-600 tracking-tighter">{achievementsTier1}</span>
                        <button onClick={() => updateTier1(achievementsTier1 + 1)} className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"><Plus className="w-5 h-5 text-slate-400"/></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-base font-bold text-slate-600 tracking-tight">1.0%以上 改善</span>
                      <div className="flex items-center gap-5">
                        <button onClick={() => updateTier2(achievementsTier2 - 1)} className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"><Minus className="w-5 h-5 text-slate-400"/></button>
                        <span className="w-10 text-center text-2xl font-black text-blue-600 tracking-tighter">{achievementsTier2}</span>
                        <button onClick={() => updateTier2(achievementsTier2 + 1)} className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"><Plus className="w-5 h-5 text-slate-400"/></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 給与調整セクション */}
                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 shadow-sm">
                    <label className="block text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      挑戦型：給与ベースの控除調整
                    </label>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-base font-bold text-slate-600 tracking-tight">みなし残業代の控除額</span>
                          <span className="text-xl font-black text-red-500">-{formatYen(deemedOvertimeDeduction)}</span>
                        </div>
                        <input 
                          type="range" min="35000" max="40000" step="500" 
                          value={deemedOvertimeDeduction} 
                          onChange={(e) => setDeemedOvertimeDeduction(Number(e.target.value))} 
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-400 shadow-inner" 
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
                            <span>3.5万円</span><span>4.0万円</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-5 border-t border-amber-200/50 font-black">
                        <span className="text-xs text-slate-500 tracking-widest uppercase">実質的な月次給与変動</span>
                        <span className="text-xl text-red-600">{formatYen(calculations.netSalaryAdjustment)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム: 比較結果 */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in duration-500 delay-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 安定型カード */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-l-slate-300 border border-slate-200 relative group transition-all hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Plan Normal</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg uppercase tracking-wider">安定型</span>
                </div>
                <div className="mb-8">
                  <span className="text-sm font-bold text-slate-400 block mb-2 tracking-tight uppercase">推定月額インセンティブ</span>
                  <div className="text-5xl font-black text-slate-700 tracking-tighter tabular-nums">
                    {formatYen(calculations.monthly.normal.total)}
                    <span className="text-base font-normal text-slate-400 ml-1">/月</span>
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-50 space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 font-black uppercase tracking-wider">
                    <span>推定年額インセン合計</span>
                    <span className="text-slate-800 text-base underline decoration-slate-200 underline-offset-4">{formatYen(calculations.yearly.normal)}/年</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {calculations.monthly.normal.breakdown.map((item, i) => (
                    <div key={i} className={`flex justify-between text-xs font-bold ${item.value === 0 ? 'text-slate-200' : 'text-slate-500'}`}>
                      <span>{item.label}</span>
                      <span className="tabular-nums">{formatYen(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* チャレンジ型カード */}
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border-l-8 border-l-blue-600 border border-slate-200 relative ring-4 ring-blue-500/5 transition-all hover:shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black text-blue-300 uppercase tracking-[0.2em]">Plan Challenge</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm uppercase tracking-wider">挑戦型</span>
                </div>
                <div className="mb-8">
                  <span className="text-sm font-bold text-blue-600 block mb-2 tracking-tight uppercase">推定月額インセンティブ</span>
                  <div className="text-5xl font-black text-blue-800 tracking-tighter tabular-nums">
                    {formatYen(calculations.monthly.challenge.total)}
                    <span className="text-base font-normal text-slate-400 ml-1">/月</span>
                  </div>
                </div>
                <div className="pt-5 border-t border-blue-50 space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-blue-600 font-black uppercase tracking-wider">
                    <span>推定年額インセン合計</span>
                    <span className="text-blue-900 text-base underline decoration-blue-200 underline-offset-4">{formatYen(calculations.yearly.challenge)}/年</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {calculations.monthly.challenge.breakdown.map((item, i) => (
                    <div key={i} className={`flex justify-between text-xs font-bold ${item.value < 0 ? 'text-red-500 font-bold' : 'text-slate-700'}`}>
                      <span>{item.label}</span>
                      <span className="tabular-nums font-black">{formatYen(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 年間差額の大見出し */}
            <div className={`p-10 rounded-[2.5rem] border-4 flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-700 ${
              calculations.yearly.diff > 0 ? 'bg-blue-600 text-white border-blue-400 shadow-2xl shadow-blue-200 scale-[1.03]' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex items-center gap-6">
                <div className={`p-5 rounded-[1.5rem] ${calculations.yearly.diff > 0 ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <Calendar className={`w-12 h-12 ${calculations.yearly.diff > 0 ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-2 ${calculations.yearly.diff > 0 ? 'text-blue-100' : 'text-slate-500'}`}>年間収益メリット</h3>
                  <div className="text-6xl font-black tabular-nums tracking-tighter leading-none">
                    {calculations.yearly.diff > 0 ? '+' : ''}{formatYen(calculations.yearly.diff)}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className={`text-xs font-black px-6 py-2 rounded-full inline-block uppercase tracking-widest mb-4 ${calculations.yearly.diff > 0 ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {calculations.yearly.diff > 0 ? '挑戦型がお得！' : '安定型が優勢'}
                </div>
                <div className={`text-sm font-bold tracking-tight ${calculations.yearly.diff > 0 ? 'text-blue-100' : 'text-slate-400'}`}>
                  月平均の差額：<span className="text-xl tabular-nums ml-1">{formatYen(calculations.monthlyDiff)}</span>
                </div>
              </div>
            </div>

            {/* ロジック詳細補足 */}
            <div className="grid grid-cols-1 gap-6">
                {/* 退職率改善のロジック詳細 */}
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform group-hover:scale-110">
                        <Calculator className="w-32 h-32 text-slate-900" />
                    </div>
                    <div className="flex gap-3 items-center text-slate-800 font-bold text-lg mb-6 border-b border-slate-100 pb-4 relative z-10">
                        <Award className="w-6 h-6 text-blue-600" />
                        退職率改善の計算ロジック詳細
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6">
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                四半期（3ヶ月）に1回判定・支給される報酬を、月次収支イメージに合わせるため<span className="font-black text-slate-800 border-b-2 border-blue-200">年間合計額の月額平均</span>として算出しています。
                            </p>
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 font-mono text-sm shadow-inner">
                                <p className="text-blue-700 font-black mb-2 tracking-widest uppercase">Formula</p>
                                <p className="text-slate-700 font-bold leading-relaxed">（達成回数 × 1回単価）÷ 12ヶ月</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">1回達成あたりの支給額設定</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-600 font-bold tracking-tight">① 0.5~1.0% 改善</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-400 text-xs">安定：{formatYen(turnoverNormalT1)}</span>
                                        <span className="text-blue-600 font-black text-base">{formatYen(turnoverChallengeT1)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-bold tracking-tight">② 1.0%以上 改善</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-400 text-xs">安定：{formatYen(turnoverNormalT2)}</span>
                                        <span className="text-blue-600 font-black text-base">{formatYen(turnoverChallengeT2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 給与調整ロジック */}
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                    <div className="flex gap-3 items-center text-slate-800 font-bold text-lg mb-4 border-b border-slate-100 pb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        挑戦型の給与リスク調整
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        挑戦型プランでは、固定給の一部（みなし残業代控除：<span className="text-red-500 font-black">{formatYen(deemedOvertimeDeduction)}</span>）をインセンティブ原資に回しています。この控除を、通常より高い還元率の成果報酬で上回ることが本プランの目的となります。
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
