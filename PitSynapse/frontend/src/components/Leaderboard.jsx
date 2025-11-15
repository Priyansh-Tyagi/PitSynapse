import React, { useEffect, useState } from 'react'
import { fetchBaseline } from '../services/api'


export default function Leaderboard() {
const [data, setData] = useState(null)


useEffect(() => {
// try a quick call (year/gp are placeholders)
fetchBaseline(2024, 'Monaco')
.then(setData)
.catch(() => setData(null))
}, [])


return (
<div>
<h2 className="text-xl">Agent Baselines</h2>
<pre>{data ? JSON.stringify(data, null, 2) : 'No data yet'}</pre>
</div>
)
}