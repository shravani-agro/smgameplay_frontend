content = """
/* ---------------- Admin: Game Rates ---------------- */
export async function getGameRates(marketId?: number) {
  const params: any = {};
  if (marketId !== undefined) params.market_id = marketId;
  const res = await client.get("/admin/game-rates", { params });
  return res.data;
}

export async function updateGameRates(payload: any) {
  const res = await client.post("/admin/game-rates", payload);
  return res.data;
}

/* ---------------- Admin: Rollback / Cancel ---------------- */
export async function cancelBet(id: number) {
  const res = await client.post(`/admin/bids/${id}/cancel`, {});
  return res.data;
}

export async function rollbackResult(id: number) {
  const res = await client.post(`/admin/results/${id}/rollback`, {});
  return res.data;
}

/* ---------------- Admin: Starline ---------------- */
export async function listStarlineMarkets(params: any = {}) {
  const res = await client.get("/admin/starline/markets", { params });
  return res.data;
}

export async function createStarlineMarket(data: any) {
  const res = await client.post("/admin/starline/markets", data);
  return res.data;
}

export async function updateStarlineMarket(marketId: number, data: any) {
  const res = await client.put(`/admin/starline/markets/${marketId}`, data);
  return res.data;
}

export async function softDeleteStarlineMarket(marketId: number) {
  const res = await client.delete(`/admin/starline/markets/${marketId}`);
  return res.data;
}

export async function reorderStarlineMarkets(markets: { id: number; sequence_number: number }[]) {
  const res = await client.post("/admin/starline/markets/reorder", { markets });
  return res.data;
}

export async function listStarlineBids(params: any = {}) {
  const res = await client.get("/admin/starline/bids", { params });
  return res.data;
}

export async function getStarlineBidsSummary(params: any = {}) {
  const res = await client.get("/admin/starline/bids/summary", { params });
  return res.data;
}

export async function listStarlineResults(params: any = {}) {
  const res = await client.get("/admin/starline/results", { params });
  return res.data;
}

export async function bulkDeclareStarlineResults(results: any[]) {
  const res = await client.post("/admin/starline/results/bulk-declare", { results });
  return res.data;
}
"""

with open('lib/admin.ts', 'a', encoding='utf-8') as f:
    f.write(content)
