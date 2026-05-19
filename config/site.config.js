const niche = process.env.NICHE || 'indiagrowth';

let config;
try {
  config = require(`./niches/${niche}.config.js`);
} catch {
  config = require('./niches/indiagrowth.config.js');
}

module.exports = config;
