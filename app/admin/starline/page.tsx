"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Modal,
  Spinner,
  ErrorMsg,
  PageHeader,
  EmptyState,
  TimePicker,
} from "@/components/ui";
import { parseApiError } from "@/lib/error-parser";
import {
  listStarlineMarkets,
  softDeleteStarlineMarket,
  createStarlineMarket,
  updateStarlineMarket,
  listStarlineResults,
  bulkDeclareStarlineResults,
} from "@/lib/admin";

export default function StarlinePage() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Market Management State
  const [edit, setEdit] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  
  // Results Management State
  const [declaredResults, setDeclaredResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [marketId, setMarketId] = useState<number | null>(null);
  const [resultDate, setResultDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [openResult, setOpenResult] = useState("");
  const [sessionLabel, setSessionLabel] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [isDeclaring, setIsDeclaring] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    market_type: "starline",
    game_days: "Mon-Sun",
    sequence_number: 0,
    holiday_status: false,
    schedules: [] as { result_time: string; session_label: string }[],
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listStarlineMarkets({});
      setMarkets(data.sort((a: any, b: any) => (a.sequence_number || 0) - (b.sequence_number || 0)));
    } catch (e: any) {
      setError(parseApiError(e, "Failed to load starline markets"));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      const data = await listStarlineResults();
      setDeclaredResults(data);
    } catch {
      setDeclaredResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadResults();
  }, [load, loadResults]);

  /* ---- MARKET MANAGEMENT ---- */
  function openCreate() {
    setFormData({
      name: "",
      market_type: "starline",
      game_days: "Mon-Sun",
      sequence_number: 0,
      holiday_status: false,
      schedules: [],
    });
    setEdit({ isNew: true });
  }

  function openEdit(m: any) {
    setFormData({
      name: m.name || "",
      market_type: "starline",
      game_days: m.game_days || "Mon-Sun",
      sequence_number: m.sequence_number || 0,
      holiday_status: m.holiday_status || false,
      schedules: m.schedules || [],
    });
    setEdit(m);
  }

  async function saveMarket(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {
        name: "Starline Market",
        market_type: "starline",
        game_days: formData.game_days,
        sequence_number: Number(formData.sequence_number),
        holiday_status: formData.holiday_status,
        schedules: formData.schedules,
      };

      if (edit.isNew) {
        await createStarlineMarket({ ...payload, market_type: "starline" });
      } else {
        await updateStarlineMarket(edit.id, payload);
      }
      setEdit(null);
      load();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error saving starline market");
    }
  }

  async function confirmRemove() {
    if (!confirmDelete) return;
    try {
      await softDeleteStarlineMarket(confirmDelete.id);
      setConfirmDelete(null);
      load();
    } catch (e: any) {
      setError(parseApiError(e, "Failed to delete market"));
    }
  }

  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const _markets = [...markets];
      const draggedItemContent = _markets.splice(dragItem.current, 1)[0];
      _markets.splice(dragOverItem.current, 0, draggedItemContent);
      setMarkets(_markets);
      setOrderChanged(true);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const saveOrder = async () => {
    setIsReordering(true);
    try {
      const payload = markets.map((m, idx) => ({ id: m.id, sequence_number: idx + 1 }));
      const { reorderStarlineMarkets } = await import("@/lib/admin");
      await reorderStarlineMarkets(payload);
      setOrderChanged(false);
      load();
    } catch (err: any) {
      alert("Failed to save reordered markets.");
    } finally {
      setIsReordering(false);
    }
  };

  function addSchedule() {
    setFormData({
      ...formData,
      schedules: [...formData.schedules, { result_time: "", session_label: "" }],
    });
  }

  function removeSchedule(idx: number) {
    const newSchedules = [...formData.schedules];
    newSchedules.splice(idx, 1);
    setFormData({ ...formData, schedules: newSchedules });
  }

  function updateSchedule(idx: number, field: string, val: string) {
    const newSchedules = [...formData.schedules];
    (newSchedules[idx] as any)[field] = val;
    setFormData({ ...formData, schedules: newSchedules });
  }

  const toggleHoliday = async (market: any) => {
    try {
      const newStatus = !market.holiday_status;
      await updateStarlineMarket(market.id, { holiday_status: newStatus });
      setMarkets(markets.map(m => m.id === market.id ? { ...m, holiday_status: newStatus } : m));
    } catch (err: any) {
      alert("Failed to update holiday status");
    }
  };

  /* ---- RESULTS MANAGEMENT ---- */
  async function declareResult() {
    if (!marketId || !openResult || !sessionLabel) return;
    setIsDeclaring(true);
    setError(null);
    setMsg(null);
    try {
      const payload: any = { 
        market_id: marketId, 
        open_result: openResult,
        result_date: resultDate,
        session_label: sessionLabel
      };
      const res = await bulkDeclareStarlineResults([payload]);
      const first = res.results?.[0];
      if (first?.status === "error") {
        setError(first.detail || "Failed to declare result");
      } else {
        setMsg(first?.status === "updated" ? "Result updated successfully." : "Result declared successfully.");
        setOpenResult("");
        setSessionLabel("");
        loadResults();
      }
    } catch (e: any) {
      setError(parseApiError(e, "Failed to declare result"));
    } finally {
      setIsDeclaring(false);
    }
  }

  const selectedMarket = markets.find((m: any) => m.id === marketId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Starline Markets"
        description="Manage Starline multi-result markets, time slots, and results"
        actions={
          markets.length === 0 ? (
            <Button onClick={openCreate} className="gap-2">
              <span>+</span> Create Starline Market
            </Button>
          ) : null
        }
      />
      <ErrorMsg msg={error} />
      {msg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Markets */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title={`Active Markets (${markets.length})`} 
            bodyClassName="p-0"
            actions={
              orderChanged ? (
                <Button size="sm" onClick={saveOrder} disabled={isReordering}>
                  {isReordering ? "Saving..." : "Save Order"}
                </Button>
              ) : null
            }
          >
            {loading ? (
              <div className="p-4"><Spinner /></div>
            ) : (
              <div className="table-wrap">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2.5 px-4 w-8"></th>
                      <th className="py-2.5 px-4">Name</th>
                      <th>Time Slots</th>
                      <th>Holiday</th>
                      <th className="text-right px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m, index) => (
                      <tr 
                        key={m.id} 
                        className="border-t border-white/5 hover:bg-white/[0.02]"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <td className="px-4 text-slate-500 cursor-move w-8">
                          <svg className="w-4 h-4 opacity-50 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-100">
                          {m.name} {m.holiday_status && <Badge color="amber" className="ml-2">Holiday</Badge>}
                        </td>
                        <td className="text-slate-400">
                          {m.schedules?.length || 0} Slots
                        </td>
                        <td>
                          <input 
                            type="checkbox"
                            className="w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
                            checked={!!m.holiday_status} 
                            onChange={() => toggleHoliday(m)} 
                          />
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit / Slots</Button>
                            <Button size="sm" variant="danger" onClick={() => setConfirmDelete(m)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {markets.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">No starline markets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Recent Starline Results">
            {loadingResults ? (
              <Spinner />
            ) : declaredResults.length === 0 ? (
              <EmptyState title="No results declared yet" />
            ) : (
              <div className="table-wrap">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/10">
                      <th className="py-2.5 px-2">Date</th>
                      <th className="px-2">Market</th>
                      <th className="px-2">Time Slot</th>
                      <th className="px-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declaredResults.map((r: any) => {
                      const dateStr = r.result_date 
                         ? format(new Date(r.result_date), "dd/MM/yyyy")
                         : r.declared_at ? format(new Date(r.declared_at), "dd/MM/yyyy") : "—";
                      
                      return (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-3 px-2 text-slate-300">{dateStr}</td>
                          <td className="px-2 text-slate-100">{r.market_name}</td>
                          <td className="px-2 text-slate-400">{r.session_label}</td>
                          <td className="px-2 font-mono text-emerald-400 font-semibold">
                             {r.total_result || r.open_result || "—"}
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

        {/* Right Column: Upload Result */}
        <div className="space-y-6">
          <Card title="Upload Result" subtitle="Declare result for a time slot">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Market</label>
                <Select
                  value={marketId ?? ""}
                  onChange={(e) => {
                    setMarketId(e.target.value ? Number(e.target.value) : null);
                    setSessionLabel("");
                    setOpenResult("");
                  }}
                >
                  <option value="">-- Select Market --</option>
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </div>

              {selectedMarket && (
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
                    <label className="mb-1 block text-xs font-medium text-slate-400">Result Value (e.g. 178-6)</label>
                    <Input
                      placeholder="e.g. 178-6"
                      value={openResult}
                      onChange={(e) => setOpenResult(e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button onClick={declareResult} disabled={!marketId || !openResult || !sessionLabel || isDeclaring} className="w-full">
                {isDeclaring ? "Processing..." : "Upload Result"}
              </Button>
            </div>
          </Card>
        </div>

      </div>

      {/* Edit Market Modal */}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.isNew ? "Create Starline Market" : `Edit Market Settings`}>
        {edit && (
          <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
            <form onSubmit={saveMarket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Game Days</label>
                  <Select value={formData.game_days} onChange={(e) => setFormData({ ...formData, game_days: e.target.value })}>
                     <option value="Mon-Sun">Mon-Sun (Everyday)</option>
                     <option value="Mon-Sat">Mon-Sat</option>
                     <option value="Mon-Fri">Mon-Fri</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Sequence Number</label>
                  <Input type="number" value={formData.sequence_number} onChange={(e) => setFormData({ ...formData, sequence_number: parseInt(e.target.value) || 0 })} placeholder="0" />
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="text-sm font-medium text-violet-300">
                  Configure the multiple Time Slots (e.g. 11:00 AM, 11:15 AM) where results are declared.
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-200">Time Slots</div>
                  <Button size="sm" type="button" onClick={addSchedule}>+ Add Slot</Button>
                </div>
                {formData.schedules.length === 0 && (
                  <div className="text-xs text-slate-400 italic">No time slots added. You can add them now or later.</div>
                )}
                {formData.schedules.map((sch, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={sch.session_label} onChange={(e) => updateSchedule(i, "session_label", e.target.value)} placeholder="Label (e.g. 10 AM)" className="flex-1" />
                    <TimePicker value={sch.result_time} onChange={(val) => updateSchedule(i, "result_time", val)} className="w-36" />
                    <Button variant="danger" type="button" size="sm" onClick={() => removeSchedule(i)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Holiday Status</label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3">
                     <span className="text-sm text-slate-300">{formData.holiday_status ? 'Active Holiday' : 'Normal'}</span>
                     <div className="ml-auto">
                        <Button 
                           type="button"
                           size="sm"
                           variant={formData.holiday_status ? "danger" : "outline"} 
                           onClick={() => setFormData({ ...formData, holiday_status: !formData.holiday_status })}
                        >
                           {formData.holiday_status ? 'Turn Off' : 'Turn On'}
                        </Button>
                     </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full">Save Market</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Market"
        description={confirmDelete?.name}
      >
        <p className="text-sm text-slate-300">
          This will soft-delete the market. Are you sure you want to continue?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmRemove}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
