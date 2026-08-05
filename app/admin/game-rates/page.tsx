"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Spinner,
  ErrorMsg,
  PageHeader,
  Badge
} from "@/components/ui";
import { getGameRates, updateGameRates } from "@/lib/admin";
import { parseApiError } from "@/lib/error-parser";

const REGULAR_BET_TYPES = [
  { key: "single_ank", label: "Single Digit" },
  { key: "jodi", label: "Jodi" },
  { key: "single_patti", label: "Single Pana" },
  { key: "double_patti", label: "Double Pana" },
  { key: "triple_patti", label: "Triple Pana" },
  { key: "half_sangam", label: "Half Sangam" },
  { key: "full_sangam", label: "Full Sangam" },
];

const STARLINE_BET_TYPES = [
  { key: "single_ank", label: "Single Digit" },
  { key: "single_patti", label: "Single Pana" },
  { key: "double_patti", label: "Double Pana" },
  { key: "triple_patti", label: "Triple Pana" },
];

export default function GameRatesPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for edits
  const [formRates, setFormRates] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGameRates();
      setRates(data);
      const initial: Record<string, string> = {};
      data.forEach((r: any) => {
        initial[r.bet_type] = r.rate.toString();
      });
      setFormRates(initial);
    } catch (e: any) {
      setError(parseApiError(e, "Failed to load game rates"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRateChange = (betType: string, value: string) => {
    setFormRates(prev => ({ ...prev, [betType]: value }));
  };

  const saveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMsg(null);
    try {
      const payloadRates = Object.entries(formRates).map(([betType, rate]) => ({
        bet_type: betType,
        rate: parseFloat(rate) || 0
      }));
      await updateGameRates({ rates: payloadRates });
      setMsg("Game rates updated successfully.");
      load();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update game rates");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Game Rates"
        description="Configure global payout multipliers (e.g. 1 : 9.0)"
        actions={
          <Button onClick={saveRates} disabled={isSaving || loading} className="w-full sm:w-auto">
            {isSaving ? "Saving..." : "Save All Rates"}
          </Button>
        }
      />

      <ErrorMsg msg={error} />
      {msg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="p-4"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Regular Markets" subtitle="Applies to all regular games">
             <div className="space-y-4">
               {REGULAR_BET_TYPES.map((bt) => (
                 <div key={bt.key} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-ink-950">
                    <div>
                      <div className="font-medium text-slate-200">{bt.label}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">Key: {bt.key}</div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-semibold text-slate-400">1 ₹ :</span>
                       <Input 
                         type="number"
                         step="0.01"
                         value={formRates[bt.key] || ""}
                         onChange={(e) => handleRateChange(bt.key, e.target.value)}
                         placeholder="e.g. 9.5"
                         className="w-24 text-right"
                       />
                    </div>
                 </div>
               ))}
             </div>
          </Card>

          <Card title="Starline Markets" subtitle="Applies to all starline games">
             <div className="space-y-4">
               {STARLINE_BET_TYPES.map((bt) => {
                 const starlineKey = `starline_${bt.key}`;
                 return (
                 <div key={bt.key} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-ink-950">
                    <div>
                      <div className="font-medium text-slate-200">{bt.label} <Badge color="violet">Starline</Badge></div>
                      <div className="text-xs text-slate-500 font-mono mt-1">Key: {starlineKey}</div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-semibold text-slate-400">1 ₹ :</span>
                       <Input 
                         type="number"
                         step="0.01"
                         value={formRates[starlineKey] || ""}
                         onChange={(e) => handleRateChange(starlineKey, e.target.value)}
                         placeholder="e.g. 10.0"
                         className="w-24 text-right"
                       />
                    </div>
                 </div>
               )})}
             </div>
          </Card>
        </div>
      )}
    </div>
  );
}
