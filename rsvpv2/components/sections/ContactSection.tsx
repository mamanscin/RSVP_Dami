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
          fatherRelation={t.contact.fatherRelation}
          motherRelation={t.contact.motherRelation}
          third={t.contact.brideThird}
          thirdRelation={t.contact.brideThirdRelation}
          fatherContact={wedding.bride.fatherContact}
          motherContact={wedding.bride.motherContact}
          thirdContact={wedding.bride.thirdContact}
        />
        <FamilyBlock
          eyebrow={t.contact.groomFamily}
          father={t.contact.groomFather}
          mother={t.contact.groomMother}
          fatherRelation={t.contact.fatherRelation}
          motherRelation={t.contact.motherRelation}
          third={t.contact.groomThird}
          thirdRelation={t.contact.groomThirdRelation}
          fatherContact={wedding.groom.fatherContact}
          motherContact={wedding.groom.motherContact}
          thirdContact={wedding.groom.thirdContact}
        />
      </div>
    </div>
  );
}

function FamilyBlock({
  eyebrow,
  father,
  mother,
  fatherRelation,
  motherRelation,
  third,
  thirdRelation,
  fatherContact,
  motherContact,
  thirdContact,
}: {
  eyebrow: string;
  father: string;
  mother: string;
  fatherRelation: string;
  motherRelation: string;
  third: string;
  thirdRelation: string;
  fatherContact: string;
  motherContact: string;
  thirdContact: string;
}) {
  return (
    <div className="text-center space-y-4">
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--highlight)" }}
      >
        {eyebrow}
      </p>
      <div className="grid gap-8" style={{ color: "var(--text-body)" }}>
        <ContactRow name={father} relation={fatherRelation} phone={fatherContact} />
        <ContactRow name={mother} relation={motherRelation} phone={motherContact} />
        <ContactRow name={third} relation={thirdRelation} phone={thirdContact} />
      </div>
    </div>
  );
}

function ContactRow({ name, relation, phone }: { name: string; relation: string; phone: string }) {
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
      <p className="text-sm italic" style={{ color: "var(--text-body)" }}>
        {relation}
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
