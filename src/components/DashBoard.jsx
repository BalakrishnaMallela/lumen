import React, { useMemo, useState } from 'react';

export default function Dashboard() {
  const initialProducts = [
    { id: 1, name: '4G SIM Pack', category: 'SIM', price: 99, monthlySales: [120, 130, 140, 160, 180, 200], stock: 1200 },
    { id: 2, name: '5G SIM Pack', category: 'SIM', price: 199, monthlySales: [30, 50, 80, 110, 150, 190], stock: 800 },
    { id: 3, name: 'Fiber Broadband 100Mbps', category: 'Broadband', price: 799, monthlySales: [45, 50, 60, 65, 70, 82], stock: 420 },
    { id: 4, name: 'Fiber Broadband 300Mbps', category: 'Broadband', price: 1299, monthlySales: [12, 20, 30, 45, 60, 70], stock: 200 },
    { id: 5, name: 'Prepaid Data Topup 1GB', category: 'Topup', price: 49, monthlySales: [400, 380, 360, 420, 450, 500], stock: 5000 },
    { id: 6, name: 'IoT Device Plan', category: 'IoT', price: 499, monthlySales: [5, 8, 9, 10, 15, 18], stock: 150 },
  ];

  const [products] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [months] = useState(['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']);

  const totals = useMemo(() => {
    const totalRevenue = products.reduce((s, p) => s + p.price * p.monthlySales.reduce((a, b) => a + b, 0), 0);
    const totalUnits = products.reduce((s, p) => s + p.monthlySales.reduce((a, b) => a + b, 0), 0);
    const lastIdx = products[0].monthlySales.length - 1;
    const prevIdx = lastIdx - 1;
    const lastRevenue = products.reduce((s, p) => s + p.price * p.monthlySales[lastIdx], 0);
    const prevRevenue = products.reduce((s, p) => s + p.price * p.monthlySales[prevIdx], 0);
    const growthRate = prevRevenue === 0 ? 0 : ((lastRevenue - prevRevenue) / prevRevenue) * 100;
    return { totalRevenue, totalUnits, growthRate, lastRevenue, prevRevenue };
  }, [products]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filtered = useMemo(() => {
    return products.filter(p =>
      (category === 'All' || p.category === category) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.stock.toString().includes(query))
    );
  }, [products, query, category]);

  function Sparkline({ data }) {
    const w = 160, h = 40, pad = 4;
    const max = Math.max(...data);
    const points = data.map((v, i) => {
      const x = pad + (i * (w - 2 * pad) / (data.length - 1));
      const y = pad + (1 - (v / max)) * (h - 2 * pad);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg className="w-40 h-10" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="2" />
      </svg>
    );
  }

  const lastMonthSales = products.map(p => ({ name: p.name, value: p.monthlySales[p.monthlySales.length - 1] }));

  return (
    <div className="bg-[#121212] text-[#e0e0e0] font-sans leading-relaxed min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <div className="text-3xl font-bold text-white tracking-wide drop-shadow-md">Fictitious Telecom — Operations Dashboard</div>
            <div className="text-sm text-gray-400">Key metrics, product performance and pricing</div>
          </div>
          <div>
            <input
              className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200 min-w-[220px] transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
              placeholder="Search product..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Top metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="text-gray-400 text-sm">Total Revenue (last 6 months)</div>
            <div className="text-2xl font-bold text-white mt-2">₹ {totals.totalRevenue.toLocaleString()}</div>
            <div className="text-gray-400 text-sm mt-4">Units sold (all products)</div>
            <div className="mt-2 font-bold text-lg">{totals.totalUnits.toLocaleString()}</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="text-gray-400 text-sm">Revenue last month</div>
            <div className="text-2xl font-bold text-white mt-2">₹ {totals.lastRevenue.toLocaleString()}</div>
            <div className="text-gray-400 text-sm mt-4">Previous month</div>
            <div className="mt-2">{totals.prevRevenue.toLocaleString()}</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center shadow-lg transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="text-gray-400 text-sm">Growth Rate</div>
            <div className="text-2xl font-bold text-white mt-2">{totals.growthRate.toFixed(2)}%</div>
            <div className="text-gray-400 text-sm mt-4">Month-on-month</div>
          </div>

          {/* Sales trend chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl col-span-1 md:col-span-1 lg:col-span-1">
            <div className="text-gray-400 text-sm">Monthly units sold (sample line)</div>
            <div className="mt-2">
              {(() => {
                const len = products[0].monthlySales.length;
                const agg = Array.from({ length: len }, (_, i) => products.reduce((s, p) => s + p.monthlySales[i], 0));
                const max = Math.max(...agg);
                return (
                  <svg className="w-full h-32" viewBox={`0 0 ${agg.length * 60} 120`} preserveAspectRatio="none">
                    <polyline
                      points={agg.map((v, i) => `${i * 60 + 20},${120 - (v / max) * 90 - 10}`).join(' ')}
                      fill="none" stroke="#06b6d4" strokeWidth="3"
                    />
                    {agg.map((v, i) => (
                      <text key={i} x={i * 60 + 12} y={116} fontSize="11" fill="#94a3b8">{months[i]}</text>
                    ))}
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-gray-400 text-sm">Products & Pricing</div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-700 bg-gray-900 text-gray-200 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors"
                onClick={() => { setQuery(''); setCategory('All'); }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-blue-700 to-blue-500 text-white uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 text-left font-semibold rounded-tl-xl">Product</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Price (₹)</th>
                  <th className="px-4 py-3 text-left font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold rounded-tr-xl">Monthly trend</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-white">{p.name}</td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3">₹ {p.price}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 w-40">
                      <Sparkline data={p.monthlySales} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
          <div className="text-gray-400 text-sm">Last month — sales per product (units)</div>
          <div className="flex items-end h-32 gap-3 mt-2">
            {lastMonthSales.map((s, idx) => {
              const max = Math.max(...lastMonthSales.map(x => x.value));
              const h = Math.max(6, Math.round((s.value / max) * 100));
              return (
                <div key={s.name} className="flex-1">
                  <div
                    className="bg-gradient-to-t from-blue-700 to-blue-500 w-full rounded-t-lg flex justify-center items-start text-white text-xs font-semibold"
                    style={{ height: `${h}%` }}
                    title={`${s.name}: ${s.value}`}
                  >
                    <span className="mt-1">{s.value}</span>
                  </div>
                  <div className="text-xs mt-2 text-center text-gray-400">{s.name.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-gray-400 text-sm">Insights & Actions</div>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors"
                onClick={() => alert('Exporting CSV (mock)...')}
              >
                Export CSV
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors"
                onClick={() => alert('Triggering price optimization (mock)...')}
              >
                Optimize Prices
              </button>
            </div>
          </div>
          <ul className="mt-4 list-disc list-inside text-gray-200 leading-7">
            <li>Top selling product by units: <strong className="font-bold">{products.reduce((a, b) => a.monthlySales.reduce((x, y) => x + y, 0) > b.monthlySales.reduce((x, y) => x + y, 0) ? a : b).name}</strong></li>
            <li>Recommend promotional campaign for <strong className="font-bold">5G SIM Pack</strong> to accelerate adoption — consider temporary discount or bundle with <em>IoT Device Plan</em>.</li>
            <li>Consider restocking: products with stock &lt; 500: {products.filter(p => p.stock < 500).map(p => p.name).join(', ') || 'None'}</li>
            <li>Monitor churn signals: sudden dips in monthly sales per product should trigger retention campaign.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}