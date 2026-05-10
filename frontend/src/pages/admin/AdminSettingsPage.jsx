import { useAdminAuthStore } from '../../store/adminAuthStore';

export default function AdminSettingsPage() {
  const { user } = useAdminAuthStore();

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <h2 className="text-2xl font-bold text-white">Admin Profile Settings</h2>
      <div className="ds-card p-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/45 mb-1">First Name</p>
            <p className="text-white font-semibold">{user?.firstName || '-'}</p>
          </div>
          <div>
            <p className="text-white/45 mb-1">Last Name</p>
            <p className="text-white font-semibold">{user?.lastName || '-'}</p>
          </div>
          <div>
            <p className="text-white/45 mb-1">Email</p>
            <p className="text-white font-semibold">{user?.email || '-'}</p>
          </div>
          <div>
            <p className="text-white/45 mb-1">Role</p>
            <p className="text-white font-semibold capitalize">{user?.role || 'admin'}</p>
          </div>
          <div>
            <p className="text-white/45 mb-1">Policy</p>
            <p className="text-white font-semibold">Single admin account only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
