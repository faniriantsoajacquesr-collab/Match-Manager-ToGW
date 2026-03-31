import React, { useState } from 'react';
import { supabase } from '../../../../backend/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // On cherche l'utilisateur dans la table 'users'
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (data) {
            localStorage.setItem('isAdmin', 'true');
            navigate('/'); // Redirection vers la page match
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-surface-container p-8 border-l-4 border-primary">
                <h2 className="font-headline text-3xl font-black text-white mb-6 italic uppercase">Admin Access</h2>
                {error && <p className="text-error text-xs mb-4 uppercase font-bold">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-label text-white/40 uppercase mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-white/10 p-3 text-white focus:border-primary outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-label text-white/40 uppercase mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black border border-white/10 p-3 text-white focus:border-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-primary p-4 font-headline font-bold text-on-primary uppercase hover:bg-primary-dim transition-colors"
                    >
                        Connect to Console
                    </button>
                </div>
            </form>
        </div>
    );
}