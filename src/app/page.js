'use client'

import { useState } from 'react'
import { wrapFetchWithPayment } from 'x402-fetch'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const PRIVATE_KEY = process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY

const account = privateKeyToAccount(PRIVATE_KEY)
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
})

const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient)

export default function HomePage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetchWithPayment('/api/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data.result)
      } else {
        const err = await res.json()
        setError(err.error || 'Unknown error')
      }
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Protected API Tester</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter input..."
          className="border px-3 py-2 w-full mb-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Processing...' : 'Submit and Pay'}
        </button>
      </form>

      {result && <div className="p-4 bg-green-100 border-green-400">{result}</div>}
      {error && <div className="p-4 bg-red-100 border-red-400">{error}</div>}
    </main>
  )
}
