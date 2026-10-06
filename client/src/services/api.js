const API_BASE = '/api';

/**
 * Fetch reports with optional filter/sort parameters
 */
export async function getReports(filters = {}) {
  const params = new URLSearchParams();
  if (filters.issueType && filters.issueType !== 'All') params.append('issueType', filters.issueType);
  if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/reports${query}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reports: ${res.statusText}`);
  }
  return await res.json();
}

/**
 * Fetch single report by ID
 */
export async function getReportById(id) {
  const res = await fetch(`${API_BASE}/reports/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch report ${id}`);
  }
  return await res.json();
}

/**
 * Submit a new report
 */
export async function createReport(reportData, imageFile = null) {
  let response;

  if (imageFile) {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    for (const [key, val] of Object.entries(reportData)) {
      if (val !== undefined && val !== null) {
        formData.append(key, val);
      }
    }
    response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      body: formData
    });
  } else {
    response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to submit report (${response.status})`);
  }
  return await response.json();
}

/**
 * Update report status (Authority action)
 */
export async function updateReportStatus(id, status) {
  const res = await fetch(`${API_BASE}/reports/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to update report status');
  }
  return await res.json();
}

/**
 * Analyze an infrastructure image using AI Vision
 */
export async function analyzeImage(fileOrUrl, metadata = {}) {
  let response;

  if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
    const formData = new FormData();
    formData.append('image', fileOrUrl);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.hintType) formData.append('hintType', metadata.hintType);
    if (metadata.forceMock !== undefined) formData.append('forceMock', metadata.forceMock);

    response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });
  } else {
    // String URL or Base64
    response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: fileOrUrl,
        description: metadata.description || '',
        hintType: metadata.hintType || '',
        forceMock: metadata.forceMock
      })
    });
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `AI Analysis failed (${response.status})`);
  }
  return await response.json();
}

/**
 * Fetch dashboard statistics
 */
export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return await res.json();
}

/**
 * Fetch current AI configuration
 */
export async function getAiStatus() {
  const res = await fetch(`${API_BASE}/ai/status`);
  if (!res.ok) {
    throw new Error('Failed to fetch AI configuration');
  }
  return await res.json();
}

/**
 * Update AI configuration mode / key
 */
export async function updateAiConfig(config) {
  const res = await fetch(`${API_BASE}/ai/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) {
    throw new Error('Failed to update AI configuration');
  }
  return await res.json();
}

/**
 * Reset seed data
 */
export async function resetSeedData() {
  const res = await fetch(`${API_BASE}/reports/reset-seed`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to reset seed data');
  }
  return await res.json();
}
