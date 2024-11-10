const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Paw-It-Forward',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

