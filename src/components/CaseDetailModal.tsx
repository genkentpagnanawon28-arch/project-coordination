import { useState } from 'react';
import { X, Calendar, Package, Globe, User, Zap, DollarSign, CheckCircle } from 'lucide-react';
import { Case, Priority, PaymentStatus, ProjectStatus } from '../types/case';
import { supabase } from '../lib/supabase';

interface CaseDetailModalProps {
  caseItem: Case;
  onClose: () => void;
  onUpdate?: () => void;
}

const priorityColors: Record<Priority, { bg: string; text: string; label: string }> = {
  HIGH: { bg: 'bg-red-500', text: 'text-red-600', label: 'High Priority - Urgent' },
  MID: { bg: 'bg-blue-500', text: 'text-blue-600', label: 'Mid Priority - Important' },
  LOW: { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Low Priority - Standard' },
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  'paid': 'bg-green-500',
  'half paid': 'bg-yellow-500',
  'to be discuss': 'bg-gray-500',
};

const projectStatusColors: Record<ProjectStatus, string> = {
  'not complete': 'bg-gray-500',
  'on going': 'bg-blue-500',
  'completed': 'bg-yellow-500',
  'published': 'bg-green-500',
};

export default function CaseDetailModal({ caseItem, onClose, onUpdate }: CaseDetailModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(caseItem.payment_status);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(caseItem.project_status);
  const [websiteLink, setWebsiteLink] = useState(caseItem.website_link || '');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const priorityStyle = priorityColors[caseItem.priority];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (!caseItem.end_date) return null;
    const now = new Date();
    const end = new Date(caseItem.end_date);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();

  const handleStatusUpdate = async (newPaymentStatus?: PaymentStatus, newProjectStatus?: ProjectStatus) => {
    setUpdating(true);

    const updatePayment = newPaymentStatus || paymentStatus;
    const updateProject = newProjectStatus || projectStatus;

    const { error } = await supabase
      .from('cases')
      .update({
        payment_status: updatePayment,
        project_status: updateProject,
        website_link: websiteLink || null,
      })
      .eq('id', caseItem.id);

    if (error) {
      console.error('Error updating case:', error);
      alert('Failed to update case');
    } else {
      setPaymentStatus(updatePayment);
      setProjectStatus(updateProject);
      onUpdate?.();
    }
    setUpdating(false);
  };

  const handleProjectStatusChange = (newStatus: ProjectStatus) => {
    if (newStatus === 'published' && paymentStatus !== 'paid' && projectStatus !== 'completed') {
      setShowLinkModal(true);
      setProjectStatus(newStatus);
    } else if (newStatus === 'published') {
      setShowLinkModal(true);
      setProjectStatus(newStatus);
    } else {
      setProjectStatus(newStatus);
      handleStatusUpdate(paymentStatus, newStatus);
    }
  };

  const handlePublishWithLink = async () => {
    if (!linkInput.trim()) {
      alert('Please enter the website link or automation link');
      return;
    }

    setWebsiteLink(linkInput);
    setShowLinkModal(false);

    setUpdating(true);
    const { error } = await supabase
      .from('cases')
      .update({
        project_status: projectStatus,
        website_link: linkInput,
      })
      .eq('id', caseItem.id);

    if (error) {
      console.error('Error updating case:', error);
      alert('Failed to publish case');
    } else {
      onUpdate?.();
      setLinkInput('');
    }
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#e0e5ec] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-neumorphic">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 text-shadow-3d mb-2">
              {caseItem.case_name}
            </h2>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${priorityStyle.bg} bg-opacity-10 mb-4`}>
              <div className={`w-3 h-3 rounded-full ${priorityStyle.bg} animate-pulse`} />
              <span className={`text-sm font-semibold ${priorityStyle.text}`}>
                {priorityStyle.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-[#e0e5ec] shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset flex items-center justify-center transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm font-semibold">CLIENT</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{caseItem.client_name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 text-sm font-semibold">WEBSITE TYPE</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{caseItem.website_type}</p>
            </div>

            <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 text-sm font-semibold">PACKAGE</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{caseItem.package}</p>
            </div>
          </div>

          <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm font-semibold">TIMELINE</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <p className="text-lg font-bold text-gray-800">{formatDate(caseItem.start_date)}</p>
              </div>
              {caseItem.end_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-lg font-bold text-gray-800">{formatDate(caseItem.end_date)}</p>
                  {daysRemaining !== null && (
                    <p className={`text-sm mt-2 ${daysRemaining <= 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : daysRemaining === 0
                          ? 'Due today'
                          : `${Math.abs(daysRemaining)} days overdue`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm font-semibold">PRIORITY LEVEL</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${priorityStyle.bg}`} />
              <p className="text-lg font-bold text-gray-800">{caseItem.priority}</p>
            </div>
          </div>

          <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm font-semibold">PAYMENT STATUS</span>
            </div>
            <select
              value={paymentStatus}
              onChange={(e) => {
                const newStatus = e.target.value as PaymentStatus;
                setPaymentStatus(newStatus);
                handleStatusUpdate(newStatus, projectStatus);
              }}
              disabled={updating}
              className="w-full px-4 py-2 bg-[#e0e5ec] rounded-xl shadow-inset border-2 border-gray-300 focus:outline-none text-gray-800 font-semibold"
            >
              <option value="paid">Paid</option>
              <option value="half paid">Half Paid</option>
              <option value="to be discuss">To Be Discuss</option>
            </select>
          </div>

          <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm font-semibold">PROJECT STATUS</span>
            </div>
            <select
              value={projectStatus}
              onChange={(e) => handleProjectStatusChange(e.target.value as ProjectStatus)}
              disabled={updating}
              className="w-full px-4 py-2 bg-[#e0e5ec] rounded-xl shadow-inset border-2 border-gray-300 focus:outline-none text-gray-800 font-semibold"
            >
              <option value="not complete">Not Complete</option>
              <option value="on going">On Going</option>
              <option value="completed">Completed</option>
              <option value="published">Published</option>
            </select>
          </div>

          {websiteLink && (
            <div className="p-6 bg-[#e0e5ec] rounded-2xl shadow-inset">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 text-sm font-semibold">WEBSITE LINK</span>
              </div>
              <a
                href={websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all font-medium"
              >
                {websiteLink}
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Created: {new Date(caseItem.created_at).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#e0e5ec] rounded-3xl p-8 max-w-md w-full shadow-neumorphic">
            <h3 className="text-2xl font-bold text-gray-800 text-shadow-3d mb-4">
              Publish Project
            </h3>
            <p className="text-gray-600 mb-6">
              Please enter the website link or automation link for this published project.
            </p>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="w-full px-6 py-3 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800 placeholder-gray-500 mb-6"
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkInput('');
                  setProjectStatus(caseItem.project_status);
                }}
                disabled={updating}
                className="flex-1 py-3 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishWithLink}
                disabled={updating}
                className="flex-1 py-3 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-800 font-semibold disabled:opacity-50"
              >
                {updating ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
