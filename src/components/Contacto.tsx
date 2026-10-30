import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import mapaImg from '../assets/images/mapa.webp';

const ADDRESS = 'Honduras 5123, Palermo Soho, CABA';
const PHONE = '+54 11 4832-7150';
const EMAIL = 'reservas@mesa.com.ar';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Honduras 5123, Palermo, Buenos Aires')}`;

const inputClass =
  'w-full min-h-12 bg-surface-container-lowest border border-outline-variant text-on-surface p-3 rounded-sm focus:outline-none focus:border-primary text-base sm:text-sm placeholder:text-on-surface-variant/80';

export default function Contacto() {
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSubject('');
      setMsg('');
      setEmail('');
    }, 4000);
  };

  const items = [
    { Icon: MapPin, label: 'Dirección', content: ADDRESS },
    {
      Icon: Phone,
      label: 'Teléfono',
      content: (
        <a href={`tel:${PHONE.replace(/[\s-]/g, '')}`} className="hover:text-primary transition-colors inline-flex min-h-11 items-center">
          {PHONE}
        </a>
      ),
    },
    {
      Icon: Mail,
      label: 'Email',
      content: (
        <a href={`mailto:${EMAIL}`} className="hover:text-primary transition-colors inline-flex min-h-11 items-center break-all">
          {EMAIL}
        </a>
      ),
    },
    {
      Icon: Clock,
      label: 'Horarios',
      content: (
        <>
          Martes a domingo
          <br />
          Almuerzo: 12:30 a 16:00 hs
          <br />
          Cena: 20:00 a 00:00 hs
          <span className="block text-sm text-on-surface-variant italic mt-1">Lunes cerrado.</span>
        </>
      ),
    },
  ];

  return (
    <section id="contacto" className="py-20 md:py-28 bg-surface border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <Reveal className="glass-card p-6 sm:p-8 md:p-10 rounded-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" aria-hidden="true" />

          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">Contacto</p>
              <h2 className="font-serif text-4xl md:text-5xl italic font-semibold text-on-surface">Visitanos en Palermo</h2>
            </div>

            <ul className="space-y-6">
              {items.map(({ Icon, label, content }) => (
                <li key={label} className="flex gap-4 items-start">
                  <span className="p-2.5 bg-primary/10 border border-primary/30 text-primary rounded-sm shrink-0" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">{label}</p>
                    <div className="text-on-surface text-base">{content}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-outline-variant/50 pt-8 mt-10">
            {success ? (
              <p role="status" className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-sm text-sm font-semibold">
                <CheckCircle2 size={18} aria-hidden="true" /> ¡Recibimos tu mensaje! Te respondemos en unas horas.
              </p>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3" aria-labelledby="contact-form-title">
                <p id="contact-form-title" className="text-sm text-on-surface font-semibold uppercase tracking-widest mb-2">
                  Escribinos
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ct-email" className="sr-only">Tu email</label>
                    <input id="ct-email" type="email" required autoComplete="email" placeholder="Tu email *" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="ct-subject" className="sr-only">Asunto</label>
                    <input id="ct-subject" type="text" placeholder="Asunto (opcional)" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="ct-msg" className="sr-only">Mensaje</label>
                  <textarea id="ct-msg" required rows={3} placeholder="Escribí tu mensaje… *" value={msg} onChange={(e) => setMsg(e.target.value)} className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-12 px-6 inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-colors"
                >
                  <Send size={16} aria-hidden="true" /> Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal className="relative min-h-[420px] img-placeholder rounded-md overflow-hidden border border-outline-variant/60 shadow-2xl flex flex-col justify-end">
          <img
            src={mapaImg}
            alt="Mapa ilustrado de las calles de Palermo con un pin dorado que marca la ubicación de MESA"
            width={460}
            height={460}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-8 z-10" aria-hidden="true">
            <span className="block bg-background/90 backdrop-blur-md border border-primary/40 px-3 py-1.5 rounded-sm text-xs font-bold tracking-[0.15em] text-primary uppercase shadow-md whitespace-nowrap">
              MESA · Palermo
            </span>
          </div>

          <div className="relative z-10 bg-background/90 backdrop-blur-md p-4 m-4 border border-outline-variant/60 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="space-y-0.5">
              <p className="font-semibold text-on-surface text-sm">{ADDRESS}</p>
              <p className="text-sm text-on-surface-variant">A 4 cuadras de Plaza Serrano</p>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="min-h-11 inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-widest px-5 rounded-sm transition-colors shrink-0"
            >
              Cómo llegar
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
