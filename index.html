import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, UserPlus, Award, Info, AlertTriangle, CheckCircle2, Calendar, MousePointer2, Settings2, ChevronDown, ChevronUp, Plus, Minus, Calculator } from 'lucide-react';

const App = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-1.5 rounded-full text-sm font-bold mb-6">
            <MousePointer2 className="w-4 h-4" />
            17期 インセンティブ・シミュレーター
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">報酬プラン比較ツール</h1>
          <p className="text-lg text-slate-500 italic">みなし残業代の控除額に基づいた詳細試算</p>
        </header>

        {/* 単価設定セクション */}
        <div className="mb-10">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
              <Settings2 className="w-6 h-6 text-blue-600" />
              インセンティブ単価の微調整
            </div>
            {showSettings ? <ChevronUp className="w-6 h-6"/> : <ChevronDown className="w-6 h-6"/>}
          </button>
          
          {showSettings && (
            <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
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
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 左カラム: 入力エリア */}
          <div className="lg:col-span-5 space-y-8">
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
          <div className="lg:col-span-7 space-y-8">
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
                    <div key={i} className={`flex justify-between text-xs font-bold ${item.value === 0 ? 'text-slate-200' : 'text-slate-600'}`}>
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
                    <div key={i} className={`flex justify-between text-xs font-bold ${item.value < 0 ? 'text-red-500' : 'text-slate-700'}`}>
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
