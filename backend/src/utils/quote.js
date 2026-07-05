const qualityFactors = { draft: 0.8, standard: 1.0, fine: 1.3 };
const BASE_FEE_CENTS = 200;
const MIN_PRICE_CENTS = 40000;

function calculateQuote({ volumeCm3, materialPricePerCm3, quality, infill }) {
  const qf = qualityFactors[quality] || 1.0;
  const infillFactor = 0.4 + (infill / 100) * 0.6;
  const materialCost = volumeCm3 * materialPricePerCm3;
  const total = (BASE_FEE_CENTS + materialCost) * qf * infillFactor;
  return Math.max(Math.round(total), MIN_PRICE_CENTS);
}

module.exports = { calculateQuote };
