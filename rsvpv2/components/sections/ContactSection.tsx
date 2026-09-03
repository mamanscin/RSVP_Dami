"use client";

import { useI18n } from "@/components/I18nProvider";
import { wedding } from "@/lib/wedding-data";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";

export function ContactSection() {
  const { t } = useI18n();

  return (
    <div className="space-y-12">
      <header className="text-center space-y-2">
        <div className="divider-ornament" aria-hidden>
          <span>🌹</span>
          <span>✦</span>
          <span>🌿</span>
        </div>
        <h2 className="section-title">{t.contact.title}</h2>
        <p className="section-subtitle">{t.contact.subtitle}</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-12">
        <FamilyBlock
          eyebrow={t.contact.brideFamily}
          father={t.contact.brideFather}
          mother={t.contact.brideMother}
          fatherContact={wedding.bride.fatherContact}
          motherContact={wedding.bride.motherContact}
        />
        <FamilyBlock
          eyebrow={t.contact.groomFamily}
          father={t.contact.groomFather}
          mother={t.contact.groomMother}
          fatherContact={wedding.groom.fatherContact}
          motherContact={wedding.groom.motherContact}
        />
      </div>
    </div>
  );
}

function FamilyBlock({
  eyebrow,
  father,
  mother,
  fatherContact,
  motherContact,
}: {
  eyebrow: string;
  father: string;
  mother: string;
  fatherContact: string;
  motherContact: string;
}) {
  return (
    <div className="text-center space-y-4">
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--highlight)" }}
      >
        {eyebrow}
      </p>
      <div className="space-y-3" style={{ color: "var(--text-body)" }}>
        <ContactRow name={father} phone={fatherContact} />
        <p style={{ color: "var(--text-body)" }}>&amp;</p>
        <ContactRow name={mother} phone={motherContact} />
      </div>
    </div>
  );
}

function ContactRow({ name, phone }: { name: string; phone: string }) {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const whatsappNumber = cleanPhone.replace(/^\+/, "");
  return (
    <div className="flex flex-col items-center gap-2">
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          color: "var(--highlight)",
        }}
      >
        {name}
      </p>
      <div className="flex items-center justify-center gap-2">
        <a
          href={`tel:${phone}`}
          aria-label={`Call ${name}`}
          title={`Call ${name}`}
          className="btn btn-ghost !p-2 !rounded-full"
        >
          <PhoneIcon size={18} />
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${name}`}
          title={`WhatsApp ${name}`}
          className="btn btn-ghost !p-2 !rounded-full"
        >
          <WhatsAppIcon size={18} />
        </a>
      </div>
    </div>
  );
}
