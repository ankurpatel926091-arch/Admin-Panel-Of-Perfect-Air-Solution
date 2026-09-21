import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if already loading
    if (isLoading) return;

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "rgb(215 242 255 / 58%)" }}>
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden p-8 border border-neutral-200 transition-all">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-1 text-brand-blue">
            Admin Login
          </h1>
          <p className="text-neutral-500 mt-2">Sign in to manage your content</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
              placeholder="admin@perfectairsolution.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              
              
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors pr-12 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none disabled:opacity-50 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-black py-3 rounded-md font-medium hover:bg-brand-blue-dark transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          <a href="/" className="hover:text-brand-blue transition-colors font-medium">
            &larr; Return to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;