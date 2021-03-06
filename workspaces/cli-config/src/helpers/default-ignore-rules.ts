export const defaultIgnoreRules = [
  'OPTIONS *',
  'HEAD *',
  'GET (.*).htm',
  'GET (.*).html',
  'GET (.*).css',
  'GET (.*).js',
  'GET (.*).woff',
  'GET (.*).png',
  'GET (.*).jpg',
  'GET (.*).jpeg',
  'GET (.*).svg',
  'GET (.*).gif',
];

export const defaultIgnoreFile = `
# Default Ignore Rules
# Learn to configure your own at https://useoptic.com/docs
${defaultIgnoreRules.join('\n')}
`.trim();
