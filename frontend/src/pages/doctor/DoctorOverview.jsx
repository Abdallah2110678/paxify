import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useI18n from '../../hooks/useI18n';

const ICONS = {
  online: '\u{1F4BB}',
  offline: '\u{1F3E5}',
  total: '\u{1F4C5}',
  patient: '\u{1F464}'
};

const DoctorOverview = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!user?.id) return;
        const res = await api.get(`/api/appointments/doctor/${user.id}`);
        if (!isMounted) return;
        setAppointments(res.data || []);
      } catch (e) {
        setError(t('doctor.overview.loadError'));
      } finally {
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [user?.id, t]);

  const onlineCount = appointments.filter((a) => String(a.sessionType).toUpperCase() === 'ONLINE').length;
  const offlineCount = appointments.filter((a) => String(a.sessionType).toUpperCase() === 'IN_PERSON').length;

  return (
    <div className="p-6">
      {loading && <div className="p-2">{t('doctor.overview.loading')}</div>}
      {error && <div className="p-2 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('doctor.overview.online')}</p>
              <h3 className="text-white text-2xl font-bold">{onlineCount}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.online}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('doctor.overview.offline')}</p>
              <h3 className="text-white text-2xl font-bold">{offlineCount}</h3>
            </div>
            <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.offline}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">{t('doctor.overview.total')}</p>
              <h3 className="text-white text-2xl font-bold">{appointments.length}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">{ICONS.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('doctor.overview.upcoming')}</h3>
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id || appt.appointmentDateTime} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <span className="text-xl">{ICONS.patient}</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{appt.patient?.name || t('doctor.overview.anonPatient')}</p>
                <p className="text-gray-500 text-sm">
                  {(appt.sessionType || '').replace(/_/g, ' ')} - {appt.appointmentDateTime ? new Date(appt.appointmentDateTime).toLocaleString() : ''}
                </p>
              </div>
            </div>
          ))}
          {!loading && appointments.length === 0 && (
            <div className="text-gray-500">{t('doctor.overview.noAppointments')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;

