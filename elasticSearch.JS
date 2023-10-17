const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' }); // Adjust the Elasticsearch URL

module.exports = client;
