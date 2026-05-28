/**
 * 开放平台 API 客户端
 * 封装 captcha key 管理、OAuth client 管理等接口
 */
import { apiFetch } from './auth';

/* ============================================================
 * Captcha API Key 管理
 * ============================================================ */
export const captchaKeysAPI = {
  list: () => apiFetch('/api/captcha/keys'),
  create: (data) => apiFetch('/api/captcha/keys', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/captcha/keys/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/captcha/keys/${id}`, { method: 'DELETE' }),
};

/* ============================================================
 * OAuth Client 管理
 * ============================================================ */
export const oauthClientsAPI = {
  list: () => apiFetch('/api/oauth/clients'),
  get: (clientId) => apiFetch(`/api/oauth/clients/${clientId}`),
  create: (data) => apiFetch('/api/oauth/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (clientId, data) => apiFetch(`/api/oauth/clients/${clientId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (clientId) => apiFetch(`/api/oauth/clients/${clientId}`, { method: 'DELETE' }),
};

/* ============================================================
 * OAuth 公开信息
 * ============================================================ */
export const oauthAPI = {
  scopes: () => apiFetch('/api/oauth/scopes'),
  status: () => apiFetch('/api/health'),
};

/* ============================================================
 * Captcha 公开信息
 * ============================================================ */
export const captchaAPI = {
  status: () => apiFetch('/api/captcha/status'),
  types: () => apiFetch('/api/v1/captcha/types'),
};

/* ============================================================
 * Content API Key 管理
 * ============================================================ */
export const contentKeysAPI = {
  list: () => apiFetch('/api/content/keys'),
  create: (data) => apiFetch('/api/content/keys', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/content/keys/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/content/keys/${id}`, { method: 'DELETE' }),
};

/* ============================================================
 * Key Split — API Key 代理与统计
 * ============================================================ */
export const keySplitAPI = {
  listChannels: () => apiFetch('/api/key-split/channels'),
  createChannel: (data) => apiFetch('/api/key-split/channels', { method: 'POST', body: JSON.stringify(data) }),
  updateChannel: (id, data) => apiFetch(`/api/key-split/channels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChannel: (id) => apiFetch(`/api/key-split/channels/${id}`, { method: 'DELETE' }),
  testChannel: (id) => apiFetch(`/api/key-split/channels/${id}/test`, { method: 'POST' }),
  listKeys: () => apiFetch('/api/key-split/keys'),
  createKey: (data) => apiFetch('/api/key-split/keys', { method: 'POST', body: JSON.stringify(data) }),
  updateKey: (id, data) => apiFetch(`/api/key-split/keys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteKey: (id) => apiFetch(`/api/key-split/keys/${id}`, { method: 'DELETE' }),
  resetQuota: (id) => apiFetch(`/api/key-split/keys/${id}/reset`, { method: 'POST' }),
  getStats: (days = 7) => apiFetch(`/api/key-split/usage/stats?days=${days}`),
  getLogs: (page = 1, limit = 50) => apiFetch(`/api/key-split/usage/logs?page=${page}&limit=${limit}`),
  getDashboard: () => apiFetch('/api/key-split/stats'),
};
