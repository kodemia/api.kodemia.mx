require('dotenv').config()
const fetch = require('node-fetch')

const token = process.env.AC_API_KEY
const host = process.env.AC_API_HOST
const pipelineUnificado = '19' // Unificado
const stageNuevo = '114' // Nuevo

function ACFetchOptions (HTTPMethod = 'GET') {
  return {
    method: HTTPMethod,
    headers: {
      Accept: 'application/json',
      'api-token': token
    }
  }
}

function fetchDeals (pipeline, stage, limit = 10) {
  return fetch(`${host}/api/3/deals?filters[stage]=${stage}&filters[group]=${pipeline}&filters[status]=0&limit=${limit}`, ACFetchOptions())
    .then(response => response.json())
    .then(json => {
      console.log('total number of deals: ', json.meta.total)
      return json.deals
    })
}

function deleteDealRequest (dealId) {
  return fetch(`${host}/api/3/deals/${dealId}`, ACFetchOptions('DELETE'))
    .then(response => response.json())
}

async function deleteDeals (deals) {
  const aDayInMilliseconds = 1000 * 60 * 60 * 24
  const deleteDealsPromises = deals.reduce((deleted, deal) => {
    const dealAgeInMilliseconds = new Date() - new Date(deal.cdate)
    const dealAgeInDays = Math.floor(dealAgeInMilliseconds / aDayInMilliseconds)
    if (dealAgeInDays <= 2) return deleted
    console.log(`Deal ${deal.id} will be deleted`)
    return [...deleted, deleteDealRequest(deal.id)]
  }, [])
  return Promise.all(deleteDealsPromises)
}

fetchDeals(pipelineUnificado, stageNuevo, 10)
  .then(deleteDeals)
  .then(deletedDeals => {
    console.table({
      deletedDealsCount: deletedDeals.length
    })
  })
  .catch(error => {
    console.error('FATAL: ', error)
  })
