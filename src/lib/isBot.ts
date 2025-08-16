export function isBot(userAgent?: string): boolean {
  if (!userAgent) return true;

  const botRegex = /(bot|crawl|spider|slurp|curl|wget|python|scrapy|postman|axios|robot|headless|monitor|pingdom|facebookexternalhit|bingpreview|preview)/i;

  return botRegex.test(userAgent);
}
