import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fetchConfirmedTransfers,
  getCheckpointTimestamp,
} from '../lib/tron/monitor.ts'

const WALLET = 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8'

test('uses an overlapping monitor checkpoint', () => {
  const timestamp = Date.parse('2026-08-31T12:00:00.000Z')
  assert.equal(getCheckpointTimestamp('2026-08-31T12:00:00.000Z'), timestamp - 600_000)
  assert.equal(getCheckpointTimestamp('invalid'), null)
})

test('paginates confirmed inbound transfers with the TronGrid fingerprint', async () => {
  const originalFetch = globalThis.fetch
  const requestedUrls: string[] = []
  let page = 0

  globalThis.fetch = async input => {
    requestedUrls.push(String(input))
    page += 1
    return new Response(JSON.stringify(page === 1
      ? { data: [{ transaction_id: 'a'.repeat(64) }], meta: { fingerprint: 'next-page' } }
      : { data: [{ transaction_id: 'b'.repeat(64) }], meta: {} }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    const transfers = await fetchConfirmedTransfers(WALLET, 123_456)
    assert.equal(transfers.length, 2)
    assert.equal(requestedUrls.length, 2)

    const first = new URL(requestedUrls[0])
    const second = new URL(requestedUrls[1])
    assert.equal(first.searchParams.get('limit'), '200')
    assert.equal(first.searchParams.get('only_confirmed'), 'true')
    assert.equal(first.searchParams.get('only_to'), 'true')
    assert.equal(first.searchParams.get('min_timestamp'), '123456')
    assert.equal(first.searchParams.get('fingerprint'), null)
    assert.equal(second.searchParams.get('fingerprint'), 'next-page')
    assert.equal(second.searchParams.get('min_timestamp'), '123456')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('fails closed when a scan exceeds the pagination safety ceiling', async () => {
  const originalFetch = globalThis.fetch
  let page = 0

  globalThis.fetch = async () => {
    page += 1
    return new Response(JSON.stringify({
      data: [],
      meta: { fingerprint: `page-${page}` },
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    await assert.rejects(
      fetchConfirmedTransfers(WALLET, null),
      /exceeded 2000 confirmed transfers/
    )
    assert.equal(page, 10)
  } finally {
    globalThis.fetch = originalFetch
  }
})
