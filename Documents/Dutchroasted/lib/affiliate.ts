export function getAffiliateUrl(searchQuery: string) {
  // TODO: Replace Google Shopping search with real affiliate links when partnerships are ready.
  // Candidate networks:
  // - TradeTracker
  // - Daisycon
  // - Awin
  // - Bol Partnerprogramma
  // - Zalando/brand affiliate indien beschikbaar
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchQuery)}`;
}
