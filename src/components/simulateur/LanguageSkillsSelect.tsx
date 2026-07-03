"use client";

type Level = string;
type Skills = { speaking: Level; listening: Level; reading: Level; writing: Level };

export default function LanguageSkillsSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: Skills;
  onChange: (next: Skills) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  const fields: { key: keyof Skills; label: string }[] = [
    { key: "speaking", label: "Expression orale" },
    { key: "listening", label: "Compréhension orale" },
    { key: "reading", label: "Compréhension écrite" },
    { key: "writing", label: "Expression écrite" },
  ];

  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-charcoal/55">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-[11px] text-charcoal/50">{f.label}</label>
            <select
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              className="w-full rounded-sm border border-charcoal/15 px-2 py-2 text-sm"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
