import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        totalIncome: 0,
        totalDoctors: 0,
        pendingDoctors: 0,
        totalPatients: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        monthlyIncome: [],
        patientBreakdown: { regular: 0, newlyRegistered: 0, emergency: 0 },
        recentActivity: []
    });

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await api.get('/api/admin/dashboard');
                if (!isMounted) return;
                setData(res.data);
            } catch (err) {
                setError('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const monthlyIncomeData = (data.monthlyIncome || []).map(p => ({ name: p.month, income: Number(p.income || 0) }));
    const patientStatistics = [
        { name: 'Regular', value: data.patientBreakdown?.regular || 0 },
        { name: 'New', value: data.patientBreakdown?.newlyRegistered || 0 },
        { name: 'Emergency', value: data.patientBreakdown?.emergency || 0 }
    ];

    return (
        <div className="p-6">
            {loading && <div className="p-4">Loading dashboard…</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Income Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Income</p>
                            <h3 className="text-white text-2xl font-bold">${(Number(data.totalIncome||0)).toLocaleString()}</h3>
                            <p className="text-green-300 text-sm mt-2">&nbsp;</p>
                        </div>
                        <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">💰</span>
                        </div>
                    </div>
                </div>

                {/* Total Doctors Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Doctors</p>
                            <h3 className="text-white text-2xl font-bold">{data.totalDoctors}</h3>
                            <p className="text-indigo-200 text-sm mt-2">Pending: {data.pendingDoctors}</p>
                        </div>
                        <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">🩺</span>
                        </div>
                    </div>
                </div>

                {/* Total Patients Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Patients</p>
                            <h3 className="text-white text-2xl font-bold">{data.totalPatients}</h3>
                            <p className="text-purple-200 text-sm mt-2">&nbsp;</p>
                        </div>
                        <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">🧑‍🤝‍🧑</span>
                        </div>
                    </div>
                </div>

                {/* Total Products Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Products</p>
                            <h3 className="text-white text-2xl font-bold">{data.totalProducts}</h3>
                            <p className="text-emerald-200 text-sm mt-2">{data.lowStockProducts} low in stock</p>
                        </div>
                        <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">📦</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Income Chart */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Income</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={monthlyIncomeData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => ['$' + Number(value).toLocaleString(), 'Income']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#incomeGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Patient Statistics */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Patient Statistics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={patientStatistics}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {patientStatistics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value, name) => [value, name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {(data.recentActivity || []).map((a, idx) => (
                        <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <span className="text-xl">📝</span>
                            </div>
                            <div>
                                <p className="text-gray-800 font-medium">{a.title}</p>
                                <p className="text-gray-500 text-sm">{a.details}</p>
                            </div>
                            <p className="ml-auto text-gray-500 text-sm">{new Date(a.occurredAt).toLocaleString()}</p>
                        </div>
                    ))}
                    {!loading && (!data.recentActivity || data.recentActivity.length === 0) && (
                        <div className="text-gray-500">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;

