const fs = require('fs');
const path = require('path');

// Allow runtime override for hackathon demo switching
let currentMode = process.env.AI_MODE || (process.env.GEMINI_API_KEY ? 'live' : 'mock');
let runtimeApiKey = process.env.GEMINI_API_KEY || '';

const VALID_ISSUE_TYPES = [
  'Pothole',
  'Damaged Road',
  'Broken Streetlight',
  'Overflowing Drain',
  'Other Infrastructure Issue'
];

const VALID_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Get current AI configuration status
 */
function getAiConfig() {
  return {
    mode: currentMode,
    hasApiKey: Boolean(runtimeApiKey || process.env.GEMINI_API_KEY),
    provider: 'Google Gemini Vision',
    model: 'gemini-1.5-flash',
    supportedIssueTypes: VALID_ISSUE_TYPES,
    supportedSeverities: VALID_SEVERITIES
  };
}

/**
 * Update AI mode at runtime
 */
function setAiConfig({ mode, apiKey }) {
  if (mode && (mode === 'live' || mode === 'mock')) {
    currentMode = mode;
  }
  if (typeof apiKey === 'string') {
    runtimeApiKey = apiKey.trim();
    if (runtimeApiKey && !mode) {
      currentMode = 'live';
    }
  }
  return getAiConfig();
}

/**
 * Intelligent Mock Analyzer
 * Returns realistic structured analysis based on image content clues, filename, or user description
 */
function analyzeMock({ imageBuffer, filename, description, hintType }) {
  const textHint = `${filename || ''} ${description || ''}`.toLowerCase();

  let issueType = 'Other Infrastructure Issue';
  let severity = 'Medium';
  let confidence = 0.91;
  let explanation = '';
  let recommendedAction = '';

  if (hintType && VALID_ISSUE_TYPES.includes(hintType)) {
    issueType = hintType;
  } else if (textHint.includes('pothole') || textHint.includes('crater') || textHint.includes('hole')) {
    issueType = 'Pothole';
  } else if (textHint.includes('drain') || textHint.includes('flood') || textHint.includes('clog') || textHint.includes('water') || textHint.includes('sewer')) {
    issueType = 'Overflowing Drain';
  } else if (textHint.includes('light') || textHint.includes('lamp') || textHint.includes('pole') || textHint.includes('dark') || textHint.includes('fixture')) {
    issueType = 'Broken Streetlight';
  } else if (textHint.includes('crack') || textHint.includes('asphalt') || textHint.includes('subsidence') || textHint.includes('road')) {
    issueType = 'Damaged Road';
  } else {
    // Deterministic selection based on length or random if no clue
    const options = ['Pothole', 'Damaged Road', 'Broken Streetlight', 'Overflowing Drain'];
    const idx = Math.abs(textHint.length % options.length);
    issueType = options[idx];
  }

  // Determine severity and explanation based on issueType and keywords
  if (issueType === 'Pothole') {
    if (textHint.includes('huge') || textHint.includes('deep') || textHint.includes('danger') || textHint.includes('swerve') || textHint.includes('school')) {
      severity = 'Critical';
      confidence = 0.95;
      explanation = 'Severe deep asphalt depression exceeding 10cm depth located in primary vehicular transit lane. High risk of vehicle blowout or wheel detachment.';
      recommendedAction = 'Dispatch emergency road maintenance crew for immediate cold-patch repair and lane cone demarcation within 4 hours.';
    } else {
      severity = 'High';
      confidence = 0.92;
      explanation = 'Substantial road surface breach with exposed aggregate base. Poses significant suspension wear and collision avoidance risk for motorists and cyclists.';
      recommendedAction = 'Schedule priority asphalt milling and leveling within 24 to 48 hours.';
    }
  } else if (issueType === 'Damaged Road') {
    if (textHint.includes('severe') || textHint.includes('truck') || textHint.includes('heavy') || textHint.includes('collapse')) {
      severity = 'High';
      confidence = 0.93;
      explanation = 'Extensive alligator fatigue cracking with localized subgrade deflection. Accelerated weathering likely to cause pavement unraveling.';
      recommendedAction = 'Mobilize municipal paving contractor for full-depth road reclamation and binder overlay.';
    } else {
      severity = 'Medium';
      confidence = 0.89;
      explanation = 'Longitudinal and transverse shrinkage cracks observed along roadway edge. Surface water intrusion detected.';
      recommendedAction = 'Apply hot-pour rubberized bitumen crack sealant to prevent freeze-thaw sub-base erosion.';
    }
  } else if (issueType === 'Broken Streetlight') {
    if (textHint.includes('pole') || textHint.includes('wire') || textHint.includes('exposed') || textHint.includes('knocked')) {
      severity = 'High';
      confidence = 0.94;
      explanation = 'Damaged street lighting fixture with dislodged luminaire assembly. Electrical casing exposed near public sidewalk.';
      recommendedAction = 'Dispatch municipal utility electrical unit to isolate circuit, replace luminaire head and test grounding.';
    } else {
      severity = 'Medium';
      confidence = 0.88;
      explanation = 'Non-operational municipal street luminaire resulting in inadequate photometric coverage along pedestrian corridor.';
      recommendedAction = 'Schedule maintenance technician to service photo-control sensor and replace LED driver module.';
    }
  } else if (issueType === 'Overflowing Drain') {
    if (textHint.includes('storm') || textHint.includes('flood') || textHint.includes('store') || textHint.includes('deep')) {
      severity = 'High';
      confidence = 0.93;
      explanation = 'Clogged storm grate causing active hydrostatic backpressure and surface ponding across vehicular lane and pedestrian walkway.';
      recommendedAction = 'Deploy high-velocity sewer jetting and vacuum truck to clear stormwater culvert inlet immediately.';
    } else {
      severity = 'Medium';
      confidence = 0.87;
      explanation = 'Partial debris siltation restricting catch basin intake capacity. Standing runoff accumulating near curb line.';
      recommendedAction = 'Assign public works crew to manual grate clearing and sediment trap cleanout.';
    }
  } else {
    severity = 'Medium';
    confidence = 0.86;
    explanation = 'Public infrastructure irregularity identified requiring municipal civil inspection to verify safety compliance.';
    recommendedAction = 'Assign civil field technician to conduct on-site physical evaluation and asset logging.';
  }

  return {
    issueType,
    severity,
    confidence,
    explanation,
    recommendedAction,
    aiModel: 'CivicLens Vision Engine (Mock Mode)'
  };
}

/**
 * Real AI Vision Analyzer using Google Gemini API
 */
async function analyzeLive({ imageBuffer, mimeType, description }) {
  const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please supply an API key or use Mock Mode.');
  }

  const base64Data = imageBuffer.toString('base64');
  const actualMime = mimeType || 'image/jpeg';

  const systemPrompt = `You are CivicLens AI, a specialized municipal civil engineering AI vision system.
Your mission is to analyze citizen-submitted photos of public infrastructure problems and classify them for city dispatch.

You MUST classify the issue into one of these EXACT issueTypes:
- Pothole
- Damaged Road
- Broken Streetlight
- Overflowing Drain
- Other Infrastructure Issue

You MUST estimate severity as one of these EXACT severities:
- Low (cosmetic wear, minor hairline crack, non-disruptive)
- Medium (noticeable defect, moderate delay, needs repair within 1-2 weeks)
- High (impedes traffic, risks vehicle damage, water stagnation, pedestrian hazard)
- Critical (imminent accident risk, deep crater, collapse, exposed wires, rapid flooding)

Return ONLY a valid JSON object with this exact structure:
{
  "issueType": "Pothole",
  "severity": "High",
  "confidence": 0.93,
  "explanation": "Clear 1-2 sentence civil engineering rationale detailing what damage is visible and why this severity was assigned.",
  "recommendedAction": "Concrete municipal maintenance dispatch action."
}

Do not include any markdown backticks, explanations, or text outside the JSON object.`;

  const userPrompt = `Analyze this civic infrastructure image.
Citizen notes: "${description || 'None provided'}"
Return the JSON analysis.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: userPrompt },
          {
            inline_data: {
              mime_type: actualMime,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', response.status, errorText);
    throw new Error(`AI Vision API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('AI Vision API returned an empty response.');
  }

  // Clean markdown fencing if present
  let cleanJson = rawText.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
  }

  const parsed = JSON.parse(cleanJson);

  // Validate fields and normalize
  const issueType = VALID_ISSUE_TYPES.includes(parsed.issueType) ? parsed.issueType : 'Other Infrastructure Issue';
  const severity = VALID_SEVERITIES.includes(parsed.severity) ? parsed.severity : 'Medium';
  const confidence = typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 0.5), 0.99) : 0.91;

  return {
    issueType,
    severity,
    confidence: Number(confidence.toFixed(2)),
    explanation: parsed.explanation || 'Infrastructure anomaly detected requiring field evaluation.',
    recommendedAction: parsed.recommendedAction || 'Dispatch local municipal inspection unit.',
    aiModel: 'Google Gemini 1.5 Flash (Live)'
  };
}

/**
 * Unified analyze function
 */
async function analyzeImage({ imageBuffer, mimeType, filename, description, hintType, forceMock = false }) {
  const shouldMock = forceMock || currentMode === 'mock' || (!runtimeApiKey && !process.env.GEMINI_API_KEY);

  if (shouldMock) {
    // Artificial small delay for realistic AI analysis feel if mock
    await new Promise(resolve => setTimeout(resolve, 600));
    return analyzeMock({ imageBuffer, filename, description, hintType });
  }

  try {
    return await analyzeLive({ imageBuffer, mimeType, description });
  } catch (error) {
    console.warn('Live AI Vision failed, falling back gracefully to Mock AI:', error.message);
    const mockResult = analyzeMock({ imageBuffer, filename, description, hintType });
    mockResult.aiModel = 'CivicLens Vision Engine (Fallback Mock)';
    mockResult.warning = `Live API notice: ${error.message}`;
    return mockResult;
  }
}

module.exports = {
  analyzeImage,
  getAiConfig,
  setAiConfig,
  VALID_ISSUE_TYPES,
  VALID_SEVERITIES
};
