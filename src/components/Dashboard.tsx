import { useState, useEffect } from 'react';
import { Plus, Clock, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Case } from '../types/case';
import CaseCard from './CaseCard';
import CreateCaseModal from './CreateCaseModal';
import CaseDetailModal from './CaseDetailModal';

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    const filtered = cases.filter(
      (c) =>
        c.case_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCases(sortByPriority(filtered));
  }, [searchQuery, cases]);

  const fetchCases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
    } else {
      setCases(sortByPriority(data || []));
      setFilteredCases(sortByPriority(data || []));
    }
    setLoading(false);
  };

  const sortByPriority = (casesArray: Case[]): Case[] => {
    const priorityOrder = { HIGH: 0, MID: 1, LOW: 2 };
    return [...casesArray].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };

  const handleCaseCreated = () => {
    fetchCases();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold text-gray-800 text-shadow-3d">
            MoshiTech
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 w-80 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-8 bg-[#e0e5ec] rounded-3xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 flex items-center justify-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#e0e5ec] shadow-neumorphic group-hover:shadow-neumorphic-hover flex items-center justify-center transition-all duration-200">
              <Plus className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-800">Create New Case</span>
          </button>

          <button
            onClick={() => setSearchQuery('')}
            className="p-8 bg-[#e0e5ec] rounded-3xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 flex items-center justify-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#e0e5ec] shadow-neumorphic group-hover:shadow-neumorphic-hover flex items-center justify-center transition-all duration-200">
              <Clock className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-800">View Recent Cases</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery ? 'No cases found matching your search.' : 'No cases yet. Create your first case!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                onUpdate={fetchCases}
                onViewDetails={setSelectedCase}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateCaseModal
          onClose={() => setIsModalOpen(false)}
          onCaseCreated={handleCaseCreated}
        />
      )}

      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdate={fetchCases}
        />
      )}
    </div>
  );
}
