import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const monthlyIncomeData = [
    { name: 'Jan', income: 42000 },
    { name: 'Feb', income: 45000 },
    { name: 'Mar', income: 48000 },
    { name: 'Apr', income: 51000 },
    { name: 'May', income: 49000 },
    { name: 'Jun', income: 52680 }
];

const patientStatistics = [
    { name: 'Regular', value: 850 },
    { name: 'New', value: 280 },
    { name: 'Emergency', value: 127 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DashboardOverview = () => {
    return (
        <div className="p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Income Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Income</p>
                            <h3 className="text-white text-2xl font-bold">$52,680</h3>
                            <p className="text-green-300 text-sm mt-2">↑ 12% this month</p>
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
                            <h3 className="text-white text-2xl font-bold">48</h3>
                            <p className="text-indigo-200 text-sm mt-2">+3 new this month</p>
                        </div>
                        <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">👨‍⚕️</span>
                        </div>
                    </div>
                </div>

                {/* Total Patients Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Patients</p>
                            <h3 className="text-white text-2xl font-bold">1,257</h3>
                            <p className="text-purple-200 text-sm mt-2">+28 this week</p>
                        </div>
                        <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">🏥</span>
                        </div>
                    </div>
                </div>

                {/* Total Products Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white text-sm opacity-80">Total Products</p>
                            <h3 className="text-white text-2xl font-bold">384</h3>
                            <p className="text-emerald-200 text-sm mt-2">12 low in stock</p>
                        </div>
                        <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-3xl">💊</span>
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
                                    formatter={(value) => ['$' + value.toLocaleString(), 'Income']}
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
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <span className="text-xl">👨‍⚕️</span>
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">New Doctor Registered</p>
                            <p className="text-gray-500 text-sm">Dr. Sarah Johnson joined the platform</p>
                        </div>
                        <p className="ml-auto text-gray-500 text-sm">2 hours ago</p>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="bg-purple-100 p-3 rounded-full mr-4">
                            <span className="text-xl">📋</span>
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">New Appointment</p>
                            <p className="text-gray-500 text-sm">Patient consultation scheduled</p>
                        </div>
                        <p className="ml-auto text-gray-500 text-sm">4 hours ago</p>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <span className="text-xl">💊</span>
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">Product Stock Update</p>
                            <p className="text-gray-500 text-sm">Inventory updated for 5 products</p>
                        </div>
                        <p className="ml-auto text-gray-500 text-sm">6 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
