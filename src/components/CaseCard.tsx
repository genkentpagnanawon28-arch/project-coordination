import { Calendar, Package, Globe, Trash2, DollarSign, CheckCircle } from 'lucide-react';
import { Case, Priority, PaymentStatus, ProjectStatus } from '../types/case';
import { supabase } from '../lib/supabase';

interface CaseCardProps {
  caseItem: Case;
  onUpdate: () => void;
  onViewDetails: (caseItem: Case) => void;
}

const priorityColors: Record<Priority, { bg: string; text: string; glow: string }> = {
  HIGH: { bg: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/50' },
  MID: { bg: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/50' },
  LOW: { bg: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-yellow-500/50' },
};

const paymentStatusColors: Record<PaymentStatus, { bg: string; text: string }> = {
  'paid': { bg: 'bg-green-100', text: 'text-green-700' },
  'half paid': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'to be discuss': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const projectStatusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  'not complete': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'on going': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'completed': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'published': { bg: 'bg-green-100', text: 'text-green-700' },
};

export default function CaseCard({ caseItem, onUpdate, onViewDetails }: CaseCardProps) {
  const priorityStyle = priorityColors[caseItem.priority];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${caseItem.case_name}"?`)) {
      const deleteAsync = async () => {
        const { error } = await supabase
          .from('cases')
          .delete()
          .eq('id', caseItem.id);

        if (error) {
          console.error('Error deleting case:', error);
          alert('Failed to delete case');
        } else {
          onUpdate();
        }
      };
      deleteAsync();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onViewDetails(caseItem)}
      className="bg-[#e0e5ec] rounded-3xl p-6 shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-200 relative cursor-pointer group"
    >
      <div className={`absolute top-4 right-4 w-4 h-4 rounded-full ${priorityStyle.bg} ${priorityStyle.glow} shadow-lg animate-pulse`} />

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{caseItem.case_name}</h3>
        <p className="text-gray-600">{caseItem.client_name}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Globe className="w-4 h-4" />
          <span>{caseItem.website_type}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{caseItem.package}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(caseItem.start_date)}
            {caseItem.end_date && ` - ${formatDate(caseItem.end_date)}`}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-300">
          <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${paymentStatusColors[caseItem.payment_status].bg} ${paymentStatusColors[caseItem.payment_status].text}`}>
            <DollarSign className="w-3 h-3 inline mr-1" />
            {caseItem.payment_status}
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${projectStatusColors[caseItem.project_status].bg} ${projectStatusColors[caseItem.project_status].text}`}>
            <CheckCircle className="w-3 h-3 inline mr-1" />
            {caseItem.project_status}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
        <div className={`px-4 py-2 rounded-xl ${priorityStyle.bg} ${priorityStyle.bg} bg-opacity-10`}>
          <span className={`text-sm font-semibold ${priorityStyle.text}`}>
            {caseItem.priority} Priority
          </span>
        </div>

        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset flex items-center justify-center transition-all duration-200 group"
        >
          <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
