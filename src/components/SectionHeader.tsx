import Reveal from './Reveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'split';
  id?: string;
}

/** Encabezado común de sección: antetítulo dorado, título serif y bajada. */
export default function SectionHeader({ eyebrow, title, description, align = 'center', id }: SectionHeaderProps) {
  if (align === 'split') {
    return (
      <Reveal className="mb-12 md:mb-16 md:flex justify-between items-end gap-12">
        <div className="space-y-3">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">{eyebrow}</p>
          <h2 id={id} className="font-serif text-4xl md:text-5xl italic font-semibold text-on-surface leading-tight">
            {title}
          </h2>
        </div>
        {description && (
          <p className="text-on-surface-variant text-base max-w-sm mt-4 md:mt-0 leading-relaxed">{description}</p>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="text-center mb-12 md:mb-16 space-y-3 max-w-2xl mx-auto">
      <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">{eyebrow}</p>
      <h2 id={id} className="font-serif text-4xl md:text-5xl italic font-semibold text-on-surface leading-tight">
        {title}
      </h2>
      {description && <p className="text-on-surface-variant text-base max-w-lg mx-auto leading-relaxed">{description}</p>}
    </Reveal>
  );
}
