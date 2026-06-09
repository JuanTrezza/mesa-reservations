import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contacto() {
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !msg) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSubject('');
      setMsg('');
      setEmail('');
    }, 3000);
  };

  return (
    <section id="contacto" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        
        {/* Left Side: Contact Information Cards */}
        <div className="glass-card p-8 md:p-10 rounded-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          
          <div className="space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl italic text-primary">
              Contáctenos
            </h2>

            <div className="space-y-6">
              {/* Ubicación */}
              <div className="flex gap-4 items-start">
                <span className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-sm mt-1">
                  <MapPin size={18} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    Ubicación
                  </p>
                  <p className="text-on-surface text-base">
                    Calle de la Gastronomía 124, Barrio Gourmet, Madrid, España.
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex gap-4 items-start">
                <span className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-sm mt-1">
                  <Phone size={18} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    Teléfono de Contacto
                  </p>
                  <p className="text-on-surface text-base hover:text-primary transition-colors">
                    +34 912 345 678
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <span className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-sm mt-1">
                  <Mail size={18} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    Correo Electrónico
                  </p>
                  <p className="text-on-surface text-base hover:text-primary transition-colors">
                    reservas@mesarestaurante.com
                  </p>
                </div>
              </div>

              {/* Horarios */}
              <div className="flex gap-4 items-start">
                <span className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-sm mt-1">
                  <Clock size={18} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    Horarios de Apertura
                  </p>
                  <p className="text-on-surface text-base">
                    Martes a Domingo: <br />
                    13:00 - 16:30 hs &middot; Almuerzo<br />
                    20:00 - 23:30 hs &middot; Cena Elegante
                  </p>
                  <p className="text-amber-400 text-xs font-serif italic mt-1">
                    * Lunes cerrado por descanso de la plantilla.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick email dialog form at the bottom */}
          <div className="border-t border-outline-variant/20 pt-8 mt-10">
            {success ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-sm text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={16} /> ¡Su mensaje ha sido enviado! Responderemos en breves horas.
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-xs text-on-surface font-bold uppercase tracking-widest mb-1">
                  Escríbanos directamente
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/20 text-on-surface text-xs p-2.5 rounded-sm focus:outline-none focus:border-primary text-sm font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Asunto (Opcional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/20 text-on-surface text-xs p-2.5 rounded-sm focus:outline-none focus:border-primary text-sm font-sans"
                  />
                </div>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    placeholder="Escriba su mensaje aquí..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 text-on-surface text-xs p-3 rounded-sm focus:outline-none focus:border-primary resize-none text-sm font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bottom-3 text-primary hover:text-primary-container p-1 transform hover:scale-105 transition-transform cursor-pointer"
                    title="Enviar Mensaje"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Map illustration */}
        <div className="relative h-[480px] lg:h-auto bg-[#1b1713] rounded-sm overflow-hidden border border-outline-variant/35 shadow-2xl flex flex-col justify-end">
          
          {/* Aesthetic map watermark / backdrop */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#000000]/30 mix-blend-multiply"></div>
            <img
              alt="Planimetría artística de ubicación de MESA"
              className="w-full h-full object-cover grayscale brightness-[0.45] contrast-[1.1]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSIUxzHsL1dKsCgkAkGvS_aIeeKCyib4P1ZH9QiCCLHigN5Ay19VWEaPfUfmQZeBvvkROFXYieX5Gjj0WE1K9bxvbLil-sVhISZ6hVwO8oMNcUTw4wHK9aYYQJCf5pyDcXbJOOd0UZ-KYRPA7XSYrcMrZA_5LH9pDMCH8Pmz1DBnzZElXi9U80CjC3jkruV3U-qal3Gwm_0L68yc8XA5Tl-Y5xay12LG3kWvTOi5X7wKv3_D7SCuKXSgQSCDrkgoBacsZFokt-3ug"
            />
          </div>

          {/* Central location gold pulse pin marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            {/* Pulsating ring overlay effect */}
            <span className="relative flex h-14 w-14 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-[#16130b] border-2 border-primary items-center justify-center shadow-lg">
                <MapPin className="text-primary fill-primary scale-75" />
              </span>
            </span>
            <div className="mt-2 bg-background/90 backdrop-blur-md border border-primary/20 px-3 py-1 rounded text-[10px] font-sans font-bold tracking-[0.1em] text-primary uppercase shadow-md">
              MESA RESTAURANTE
            </div>
          </div>

          {/* Bottom map layout overlay legend */}
          <div className="relative z-10 bg-background/80 backdrop-blur-md p-4 m-4 border border-outline-variant/15 flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-on-surface text-[11px] uppercase tracking-wider">
                Ver en mapa interactivo
              </p>
              <p className="text-[10px] text-on-surface-variant">
                Coordenadas GPS: 40.4168° N, 3.7038° W
              </p>
            </div>
            
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="bg-primary hover:bg-primary-container text-on-primary font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-sm transition-all"
            >
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
