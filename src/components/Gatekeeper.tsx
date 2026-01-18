import { useState } from 'react';
import { Lock } from 'lucide-react';

interface GatekeeperProps {
  onAuthenticate: () => void;
}

const AGENCY_PASSCODE = 'MoshiTech2024';

export default function Gatekeeper({ onAuthenticate }: GatekeeperProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === AGENCY_PASSCODE) {
      onAuthenticate();
      setError('');
    } else {
      setError('Invalid passcode. Please try again.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
      <div className="w-full max-w-md p-8">
        <div className="bg-[#e0e5ec] rounded-3xl p-12 shadow-neumorphic">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#e0e5ec] shadow-neumorphic flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-shadow-3d">
              MoshiTech
            </h1>
            <p className="text-gray-600">Enter Agency Passcode</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-6 py-4 bg-[#e0e5ec] rounded-2xl shadow-inset focus:outline-none text-gray-800 placeholder-gray-500"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#e0e5ec] rounded-2xl shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-inset transition-all duration-200 text-gray-800 font-semibold"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
