
// logic.js

import { loadJSON } from './dataLoader.js';

/** Utility function to tokenize and normalize user input */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_]+/gu, ' ') // Remove symbols except letters/numbers
    .split(/\s+/)
    .filter(Boolean);
}

/** Scoring function for keyword intersection */
function computeScore(userTokens, itemTokens) {
  const intersect = itemTokens.filter(k => userTokens.includes(k));
  return intersect.length > 0 ? intersect.length / itemTokens.length : 0;
}

/** Match engine: core function */
export async function matchResearch(userInput) {
  const [theories, methods, stats, sdgs] = await Promise.all([
    loadJSON('data/core_theories.json'),
    loadJSON('data/research_methods.json'),
    loadJSON('data/stats_tools.json'),
    loadJSON('data/sdgs.json')
  ]);

  const tokens = tokenize(userInput);

  const matchTheories = theories
    .map(th => {
      const keywordTokens = th.keywords.map(k => k.toLowerCase());
      const score = computeScore(tokens, keywordTokens);
      return score > 0 ? { id: th.id, name_th: th.name_th, matched_keywords: keywordTokens.filter(k => tokens.includes(k)), relevanceScore: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  const matchMethods = methods
    .map(m => {
      const varTokens = m.commonVariables.map(v => v.toLowerCase());
      const score = computeScore(tokens, varTokens);
      return score > 0 ? { id: m.id, name_th: m.name_th, matched_variables: varTokens.filter(k => tokens.includes(k)), relevanceScore: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  const matchStats = stats
    .map(s => {
      const keywordTokens = s.keywords.map(k => k.toLowerCase());
      const score = computeScore(tokens, keywordTokens);
      return score > 0 ? { id: s.id, name_th: s.name_th, level: s.level, relevanceScore: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  const matchSDGs = sdgs
    .map(g => {
      const keywordTokens = g.keywords.map(k => k.toLowerCase());
      const score = computeScore(tokens, keywordTokens);
      return score > 0 ? { id: g.id, goal_name: g.goal_name, rationale: g.rationale, relevanceScore: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    theories: matchTheories,
    methods: matchMethods,
    stats: matchStats,
    sdgs: matchSDGs
  };
}
