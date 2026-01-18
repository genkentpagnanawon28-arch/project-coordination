import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreateCaseInput, WebsiteType, Package, Priority, PaymentStatus, ProjectStatus } from '../types/case';

interface CreateCaseModalProps {
  onClose: () => void;
  onCaseCreated: () => void;
}

const websiteTypes: WebsiteType[] = [
  'Portfolio Website',
  'Store Website',
  'Corporate Website',
  'Landing Page',
  'SaaS Platform',
  'Custom Web App',
];

const packages: Package[] = [
  'Beginner Package',
  'Elite Package',
  'Business Package',
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'LOW', label: 'LOW - Standard Priority', color: 'bg-yellow-500' },
  { value: 'MID', label: 'MID - Important, Needs Attention', color: 'bg-blue-500' },
  { value: 'HIGH', label: 'HIGH - Urgent/Top Priority', color: 'bg-red-500' },
];

const paymentStatuses: PaymentStatus[] = ['paid', 'half paid', 'to be discuss'];

const projectStatuses: ProjectStatus[] = ['not complete', 'on going', 'completed', 'published'];

export default function CreateCaseModal({ onClose, onCaseCreated }: CreateCaseModalProps) {
  const [formData, setFormData] = useState<CreateCaseInput>({
    client_name: '',
    case_name: '',
    website_type: 'Portfolio Website',
    package: 'Beginner Package',
    priority: 'LOW',
    payment_status: 'to be discuss',
    project_status: 'not complete',
    website_link: null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: submitError } = await supabase
      .from('cases')
      .insert([formData]);

    if (submitError) {
      setError(submitError.message);
      setLoading(false);
    } else {
      onCaseCreated();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#e0e5ec] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-neumorphic">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-shadow-3d">Create New Case</h2>
            {formData.case_name && (
              <p className="text-lg text-gray-600 mt-1">{formData.case_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-[#e0e5ec] shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset flex items-center justify-center transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unique Case Name
            </label>
            <input
              type="text"
              name="case_name"
              value={formData.case_name}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
              placeholder="Enter unique case name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website Preference
            </label>
            <select
              name="website_type"
              value={formData.website_type}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
            >
              {websiteTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Package Selection
            </label>
            <select
              name="package"
              value={formData.package}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
            >
              {packages.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority Pin
            </label>
            <div className="space-y-3">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${priority.color}`} />
                    <span className="text-gray-700">{priority.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Status
            </label>
            <select
              name="project_status"
              value={formData.project_status}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ''}
                onChange={handleChange}
                className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-2xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-800 font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
