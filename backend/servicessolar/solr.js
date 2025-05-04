const solr = require('solr-client');

// Configure Solr client
const solrClient = solr.createClient({
  host: process.env.SOLR_HOST || 'localhost',
  port: process.env.SOLR_PORT || 8983,
  core: 'booking_logs',
  protocol: 'http'
});

// Search function
async function searchLogs(queryParams) {
  const { q = ':', sortBy = 'startDate', order = 'desc' } = queryParams;
  
  const solrQuery = solrClient.createQuery()
    .q(q)
    .sort({ [sortBy]: order === 'asc' ? 'asc' : 'desc' })
    .start(0)
    .rows(100);

  const results = await solrClient.search(solrQuery);
  return results.response.docs;
}

module.exports = { searchLogs };