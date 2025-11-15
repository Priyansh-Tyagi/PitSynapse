export async function fetchBaseline(year, gp) {
try {
const res = await fetch(`http://localhost:8000/api/generate_baseline/${year}/${gp}`)
if (!res.ok) throw new Error('network')
return res.json()
} catch (e) {
return { error: 'Unable to fetch baseline (backend may be offline)' }
}
}