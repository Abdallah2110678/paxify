import { useEffect, useMemo, useState } from 'react';
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
import useI18n from '../../hooks/useI18n';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const ICONS = {
  income: '\u{1F4B0}',
  doctors: '\u{1F468}\u200D\u2695\uFE0F',
  patients: '\u{1F465}',
  products: '\u{1F4E6}'
};

const DashboardOverview = () => {
  const { t } = useI18n();
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
        setError(t('dashboard.loadError'));
      } finally {
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [t]);

  const monthlyIncomeData = useMemo(
    () => (data.monthlyIncome || []).map((p) => ({ name: p.month, income: Number(p.income || 0) })),
    [data.monthlyIncome]
  );

  const patientStatistics = useMemo(
    () => ([
      { name: t('dashboard.regular'), value: data.patientBreakdown?.regular || 0 },
      { name: t('dashboard.new'), value: data.patientBreakdown?.newlyRegistered || 0 },
      { name: t('dashboard.emergency'), value: data.patientBreakdown?.emergency || 0 }
    ]),
    [data.patientBreakdown, t]
  );

  const activityItems = data.recentActivity || [];

  return (
    <div className="p-6">
      {loading && <div className="p-4">{t('dashboard.loading')}</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('dashboard.totalIncome')}</p>
              <h3 className="text-white text-2xl font-bold">${Number(data.totalIncome || 0).toLocaleString()}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.income}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('dashboard.totalDoctors')}</p>
              <h3 className="text-white text-2xl font-bold">{data.totalDoctors}</h3>
              <p className="text-indigo-200 text-sm mt-2">
                {t('dashboard.pendingDoctors')}: {data.pendingDoctors}
              </p>
            </div>
            <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.doctors}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('dashboard.totalPatients')}</p>
              <h3 className="text-white text-2xl font-bold">{data.totalPatients}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.patients}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('dashboard.totalProducts')}</p>
              <h3 className="text-white text-2xl font-bold">{data.totalProducts}</h3>
              <p className="text-emerald-200 text-sm mt-2">
                {t('dashboard.lowInStock', { count: data.lowStockProducts })}
              </p>
            </div>
            <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.products}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl落 font-bold text-gray-800 mb-4">{t('dashboard.monthlyIncome')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyIncomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, t('dashboard.totalIncome')]} />
                <Area type="monotone" dataKey="income" stroke="#3B82F6" fillOpacity={1} fill="url(#incomeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.patientStats')}</h3>
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
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.recentActivity')}</h3>
        <div className="space-y-4">
          {activityItems.map((item, idx) => (
            <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <span className="text-xl">{'\u270D\uFE0F'}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.details}</p>
              </div>
              <p className="ml-auto text-gray-500 text-sm">
                {item.occurredAt ? new Date(item.occurredAt).toLocaleString() : ''}
              </p>
            </div>
          ))}
          {!loading && activityItems.length === 0 && (
            <div className="text-gray-500">{t('dashboard.emptyActivity')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

