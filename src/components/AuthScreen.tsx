import React, { useState } from 'react';
import { useFirebase } from './FirebaseContext';
import { ShieldCheck, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onSuccess?: () => void;
  message?: string;
}

export default function AuthScreen({ onSuccess, message }: AuthScreenProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, logOut } = useFirebase();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConsoleTips, setShowConsoleTips] = useState<boolean>(false);

  const handleToggleMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!email || !password || (isSignUp && !displayName)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
        // After successful registration, log out from the auto-login session so they must sign in
        await logOut();
        setIsSignUp(false);
        setSuccessMessage('Patient account created successfully! Please sign in with your secure credentials to book your appointment.');
        setPassword('');
      } else {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'An error occurred during authentication.';
      
      // Enhance typical Firebase error messages to be user-friendly & developer-helpful
      if (errorMsg.includes('auth/invalid-credential')) {
        errorMsg = 'Incorrect email address or password. Please try again.';
      } else if (errorMsg.includes('auth/email-already-in-use')) {
        errorMsg = 'This email address is already registered. Try logging in instead!';
      } else if (errorMsg.includes('auth/weak-password')) {
        errorMsg = 'The password is too weak. Please use at least 6 characters.';
      } else if (errorMsg.includes('auth/operation-not-allowed')) {
        errorMsg = 'Email/Password Authentication is not enabled in this Firebase project yet.';
        setShowConsoleTips(true);
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'Failed to authenticate with Google.';
      if (errorMsg.includes('auth/operation-not-allowed')) {
        errorMsg = 'Google Authentication is not enabled in this Firebase project yet.';
        setShowConsoleTips(true);
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden my-8">
      {/* Aesthetic ambient glow background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-950">
            {isSignUp ? 'Create Patient Account' : 'Patient Clinical Portal'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {message || (isSignUp 
              ? 'Register to book appointments and track your clinical records securely.' 
              : 'Sign in to access your consultations, medical receipts, and history.')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Authentication Notice</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-900">Registration Successful</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Developer Console Tips */}
        {showConsoleTips && (
          <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Firebase Configuration Tip</span>
            </div>
            <p className="leading-relaxed">
              To resolve this error, please log in to your <strong>Firebase Console</strong> at <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-blue-900">console.firebase.google.com</a>, navigate to <strong>Authentication &gt; Sign-in method</strong>, and enable <strong>Email/Password</strong> or <strong>Google</strong> providers.
            </p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John Watson"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="e.g. johnwatson@wecare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Security Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-blue-600/10 text-sm mt-2 flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              isSignUp ? 'Sign Up & Register' : 'Sign In to Portal'
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-150"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">or continue with</span>
          <div className="flex-grow border-t border-slate-150"></div>
        </div>

        {/* Social Authentication */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {/* Flat Google vector icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.14-.14 2.87-1.12.75-2.6 1.21-4.47 1.21-3.47 0-6.4-2.35-7.44-5.5a11.91 11.91 0 010-3.38c1.04-3.15 3.97-5.5 7.44-5.5 1.98 0 3.77.68 5.17 2.03l3.87-3.87C20.9 1.13 16.73 0 12 0 7.31 0 3.25 2.68 1.14 6.56a12.02 12.02 0 000 10.88C3.25 21.32 7.31 24 12 24c3.15 0 5.8-1.04 7.74-2.85l-3.87-3.87c-1.08.72-2.45 1.15-3.87 1.15z"/>
            <path fill="#EA4335" d="M12 24c3.15 0 5.8-1.04 7.74-2.85l-3.87-3.87c-1.08.72-2.45 1.15-3.87 1.15-3.47 0-6.4-2.35-7.44-5.5L.71 17.56C2.81 21.32 6.87 24 12 24z"/>
            <path fill="#FBBC05" d="M4.56 12.89a11.91 11.91 0 010-3.38L.71 6.56a12.02 12.02 0 000 10.88l3.85-3.55z"/>
            <path fill="#34A853" d="M12 4.78c1.98 0 3.77.68 5.17 2.03l3.87-3.87C20.9 1.13 16.73 0 12 0 7.31 0 3.25 2.68 1.14 6.56L4.56 10.1c1.04-3.15 3.97-5.5 7.44-5.5z"/>
          </svg>
          Google Patient Login
        </button>

        {/* Mode Toggle Link */}
        <div className="text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => handleToggleMode(false)} className="text-blue-600 font-bold hover:underline cursor-pointer" type="button">
                Sign In instead
              </button>
            </p>
          ) : (
            <p>
              New patient at WeCare?{' '}
              <button onClick={() => handleToggleMode(true)} className="text-blue-600 font-bold hover:underline cursor-pointer" type="button">
                Create an account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
