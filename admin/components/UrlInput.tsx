"use client";

const URL_REGEX = /https?:\/\/\S+/i;

/** Pulls the first http(s) URL out of arbitrary pasted text (e.g. a title
 * copied alongside the link), so a stray label doesn't get saved as part
 * of the link and silently turn it into a broken relative path. */
export function extractUrl(input: string): string {
  const match = input.match(URL_REGEX);
  return (match ? match[0] : input).trim();
}

/** True if `value` (already extracted) is empty or an absolute http(s) URL. */
export function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const isValid = isValidUrl(value);

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(extractUrl(e.target.value))}
        onPaste={(e) => {
          const pasted = e.clipboardData.getData("text");
          const extracted = extractUrl(pasted);
          if (extracted !== pasted.trim()) {
            e.preventDefault();
            onChange(extracted);
          }
        }}
        placeholder={placeholder || "https://…"}
        className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none ${
          isValid ? "border-gray-700 focus:border-blue-500" : "border-red-600 focus:border-red-500"
        }`}
      />
      {!isValid && (
        <p className="text-xs text-red-400 mt-1">Enter a valid link starting with http:// or https://</p>
      )}
    </div>
  );
}
