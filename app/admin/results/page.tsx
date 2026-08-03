"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  ErrorMsg,
  PageHeader,
  EmptyState,
} from "@/components/ui";
import { listMarkets, listResults, previewResult, bulkDeclareResults } from "@/lib/admin";

const statusColor: Record<string, any> = {
  upcoming: "slate",
  open: "green",
  closed: "amber",
  result_declared: "blue",
};

export default function ResultsPage() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [declaredResults, setDeclaredResults] = useState<any[]>([]);
  const [marketId, setMarketId] = useState<number | null>(null);
  const [resultDate, setResultDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [openResult, setOpenResult] = useState("");
  const [closeResult, setCloseResult] = useState("");
  const [sessionLabel, setSessionLabel] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const loadMarkets = useCallback(async () => {
    try {
      const data = await listMarkets({});
      setMarkets(data.filter((m: any) => m.is_active && m.status !== "result_declared"));
    } catch {
      setMarkets([]);
    }
  }, []);

  const loadResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      setDeclaredResults(await listResults());
    } catch {
      setDeclaredResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    loadMarkets();
    loadResults();
  }, [loadMarkets, loadResults]);

  async function loadPreview() {
    if (!marketId) return;
    setLoading(true);
    setError(null);
    try {
      setPreview(await previewResult(marketId));
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to load preview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPreview(null);
    if (marketId) loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketId]);

  async function declare() {
    if (!marketId || !openResult) return;
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const payload: any = { market_id: marketId, open_result: openResult };
      if (resultDate) payload.result_date = resultDate;
      if (closeResult) payload.close_result = closeResult;
      if (sessionLabel) payload.session_label = sessionLabel;
      const res = await bulkDeclareResults([payload]);
      const first = res.results?.[0];
      if (first?.status === "error") {
        setError(first.detail || "Failed to declare result");
      } else {
        setMsg(first?.status === "updated" ? "Result updated successfully." : "Result declared successfully.");
        setMarketId(null);
        setOpenResult("");
        setCloseResult("");
        setSessionLabel("");
        setPreview(null);
        loadResults();
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to declare result");
    } finally {
      setLoading(false);
    }
  }

  const selectedMarket = markets.find((m: any) => m.id === marketId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Declare Results"
        description="View scraped results and declare or override market results"
      />

      {msg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          {msg}
        </div>
      )}
      <ErrorMsg msg={error} />

      <Card title="Upload Result" subtitle="Select any active market to upload results">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Market</label>
            <Select
              value={marketId ?? ""}
              onChange={(e) => {
                setMarketId(e.target.value ? Number(e.target.value) : null);
                setSessionLabel("");
                setOpenResult("");
                setCloseResult("");
              }}
            >
              <option value="">-- Select Market --</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.market_type === "starline" ? "Starline" : "Regular"}
                </option>
              ))}
            </Select>
          </div>

          {!selectedMarket || selectedMarket.market_type === "regular" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Result Date</label>
                <Input
                  type="date"
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-400">Result Number</label>
                <div className="flex gap-2">
                   <Input
                     placeholder="e.g. 123-45-678"
                     value={openResult}
                     onChange={(e) => {
                       // Format automatically based on input length?
                       setOpenResult(e.target.value);
                     }}
                     className="flex-1"
                   />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Date</label>
                <Input
                  type="date"
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Time Slot</label>
                <Select
                  value={sessionLabel}
                  onChange={(e) => setSessionLabel(e.target.value)}
                >
                  <option value="">-- Select Slot --</option>
                  {selectedMarket.schedules?.map((s: any) => (
                    <option key={s.id || s.session_label} value={s.session_label}>
                      {s.session_label} ({s.result_time?.slice(0, 5)})
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Result Value</label>
                <Input
                  placeholder="e.g. 178-6"
                  value={openResult}
                  onChange={(e) => setOpenResult(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={declare} disabled={!marketId || !openResult || loading}>
            {loading ? "Processing..." : "Upload Result"}
          </Button>
        </div>
      </Card>

      {loading && !preview && <Spinner />}
      {preview && (
        <Card title={`Preview — Market #${preview.market_id}`}>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-slate-500">Pending bets</div>
              <div className="text-lg font-semibold text-slate-100">{preview.total_pending_bets}</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-slate-500">Total stakes</div>
              <div className="text-lg font-semibold text-slate-100">{preview.total_stakes}</div>
            </div>
          </div>
          {preview.bets?.length ? (
            <div className="table-wrap">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2.5">Bet ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Number</th>
                    <th>Amount</th>
                    <th>Potential Win</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.bets.map((b: any) => (
                    <tr key={b.id} className="border-t border-white/5">
                      <td className="py-3 text-slate-500">{b.id}</td>
                      <td className="text-slate-100">{b.user_id}</td>
                      <td>{b.bet_type}</td>
                      <td>{b.selected_number}</td>
                      <td>{b.amount}</td>
                      <td>{b.potential_win}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No pending bets for this market" />
          )}
        </Card>
      )}

      <Card
        title="Recent Results"
        subtitle="Manage and view all declared results"
      >
        {loadingResults ? (
          <Spinner />
        ) : declaredResults.length === 0 ? (
          <EmptyState title="No results declared yet" />
        ) : (
          <div className="table-wrap">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <Select className="w-16 h-8 text-xs py-1 px-2">
                   <option>10</option>
                   <option>25</option>
                   <option>50</option>
                </Select>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                 <span>Search:</span>
                 <Input className="h-8 w-40 text-xs px-2" placeholder="Search..." />
              </div>
            </div>
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/10">
                  <th className="py-2.5 px-2">Date</th>
                  <th className="px-2">Market</th>
                  <th className="px-2">Time/Slot</th>
                  <th className="px-2">Result</th>
                  <th className="px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {declaredResults.map((r: any) => {
                  const dateStr = r.result_date 
                     ? new Date(r.result_date).toLocaleDateString('en-GB') // DD/MM/YYYY
                     : r.declared_at ? new Date(r.declared_at).toLocaleDateString('en-GB') : "—";
                  
                  return (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 text-slate-300">{dateStr}</td>
                      <td className="px-2 text-slate-100">{r.market_name}</td>
                      <td className="px-2 text-slate-400">
                         {r.market_type === 'starline' ? r.session_label : 'Regular'}
                      </td>
                      <td className="px-2 font-mono text-emerald-400 font-semibold">
                         {r.total_result || r.open_result || "—"}
                      </td>
                      <td className="px-2">
                         <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
