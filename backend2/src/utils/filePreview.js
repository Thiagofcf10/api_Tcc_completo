function buildPreviewHeaders(origin) {
  const allowedOrigins = [
    'https://view.officeapps.live.com',
    'https://view.office.com',
    'https://docs.google.com'
  ];

  const requestOrigin = origin && typeof origin === 'string' ? origin : null;
  const frameAncestors = ['\'self\''];

  if (requestOrigin) frameAncestors.push(requestOrigin);
  allowedOrigins.forEach((candidate) => frameAncestors.push(candidate));

  return {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': `frame-ancestors ${frameAncestors.join(' ')}`
  };
}

module.exports = { buildPreviewHeaders };
