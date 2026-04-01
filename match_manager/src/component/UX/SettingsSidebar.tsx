import { useState, useEffect } from 'react';
import { supabase } from '../../../../backend/supabase';

export const SettingsSidebar = ({ isOpen, onClose, settings }: { isOpen: boolean, onClose: () => void, settings: any }) => {
    const [slug, setSlug] = useState(settings?.slug || "");
    const [api, setApi] = useState(settings?.api || "");
    const [msg, setMsg] = useState({ text: '', type: '' });

    // Synchroniser l'état local avec les props quand settings est chargé
    useEffect(() => {
        if (settings) {
            setSlug(settings.slug || "");
            setApi(settings.api || "");
        }
    }, [settings]);

    const saveSettings = async () => {
        try {
            const { error } = await supabase
                .from('settings')
                .update({ slug, api })
                .eq('id', settings.id); // On assume que tu as un ID pour ton unique ligne de config

            if (error) throw error;
            
            setMsg({ text: 'Settings updated! UI will refresh soon.', type: 'success' });
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error(err);
            setMsg({ text: 'Update failed.', type: 'error' });
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-surface-container border-l border-white/10 z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-headline font-black text-xl text-white italic uppercase">Settings</h3>
                    <button onClick={onClose} className="material-symbols-outlined text-white/40">close</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-label text-white/40 uppercase mb-1">Challonge Tournament Slug</label>
                        <input
                            name="tournament_slug_field"
                            autoComplete="off"
                            className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-primary outline-none"
                            value={slug} 
                            onChange={(e) => setSlug(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-label text-white/40 uppercase mb-1">Challonge API Key</label>
                        <input
                            name="challonge_api_key_field"
                            type="password"
                            autoComplete="new-password"
                            className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-primary outline-none" 
                            value={api} 
                            onChange={(e) => setApi(e.target.value)} 
                        />
                    </div>
                    
                    {msg.text && <p className={`text-[10px] font-bold uppercase ${msg.type === 'success' ? 'text-primary' : 'text-error'}`}>{msg.text}</p>}

                    <button 
                        onClick={saveSettings}
                        className="w-full bg-white/5 border border-white/10 py-3 font-headline font-bold text-white text-sm uppercase hover:bg-primary hover:text-on-primary transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};