const nextVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  ...nextVitals,
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];
