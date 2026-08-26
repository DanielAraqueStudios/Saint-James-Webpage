"use client";

import { useMemo, useState, useEffect } from "react";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

const DISPLAY_NAMES =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(code: CountryCode): string {
  return DISPLAY_NAMES?.of(code) || code;
}

const COUNTRIES: CountryCode[] = getCountries().sort((a, b) =>
  countryName(a).localeCompare(countryName(b))
);

const DEFAULT_COUNTRY: CountryCode = "US";

/**
 * Splits a stored digits-only number (e.g. "573159461469", no leading "+")
 * into a best-guess country + national number, for pre-filling the editor.
 */
function splitStoredNumber(value: string): { country: CountryCode; national: string } {
  if (!value) return { country: DEFAULT_COUNTRY, national: "" };
  const parsed = parsePhoneNumberFromString(`+${value}`);
  if (parsed && parsed.country) {
    return { country: parsed.country, national: parsed.nationalNumber };
  }
  return { country: DEFAULT_COUNTRY, national: value };
}

/** True if `value` (a stored digits-only number, or empty) is valid or unset. */
export function isValidStoredNumber(value: string): boolean {
  if (!value) return true;
  return isValidPhoneNumber(`+${value}`);
}

export function PhoneNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (digitsOnly: string) => void;
}) {
  const initial = useMemo(() => splitStoredNumber(value), [value]);
  const [country, setCountry] = useState<CountryCode>(initial.country);
  const [national, setNational] = useState(initial.national);

  // Re-sync if the parent resets `value` out from under us (e.g. Cancel).
  useEffect(() => {
    const next = splitStoredNumber(value);
    setCountry(next.country);
    setNational(next.national);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const callingCode = getCountryCallingCode(country);
  const isValid = national === "" || isValidPhoneNumber(national, country);

  function commit(nextCountry: CountryCode, nextNational: string) {
    setCountry(nextCountry);
    setNational(nextNational);
    if (!nextNational) {
      onChange("");
      return;
    }
    if (isValidPhoneNumber(nextNational, nextCountry)) {
      const parsed = parsePhoneNumberFromString(nextNational, nextCountry);
      onChange(parsed ? parsed.number.replace("+", "") : `${getCountryCallingCode(nextCountry)}${nextNational}`);
    } else {
      // Keep the raw digits flowing up so the parent's "empty vs set" logic
      // still works, even though it's not valid yet — validity is surfaced
      // via the error message below, not by silently dropping input.
      onChange(`${getCountryCallingCode(nextCountry)}${nextNational.replace(/\D/g, "")}`);
    }
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex gap-2">
        <select
          value={country}
          onChange={(e) => commit(e.target.value as CountryCode, national)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-blue-500 max-w-[9.5rem]"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {countryName(c)} (+{getCountryCallingCode(c)})
            </option>
          ))}
        </select>
        <span className="flex items-center px-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm">
          +{callingCode}
        </span>
        <input
          type="tel"
          value={national}
          onChange={(e) => commit(country, e.target.value.replace(/[^\d\s-]/g, ""))}
          placeholder="Phone number"
          className={`flex-1 bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none min-w-0 ${
            isValid ? "border-gray-700 focus:border-blue-500" : "border-red-600 focus:border-red-500"
          }`}
        />
      </div>
      {!isValid && (
        <p className="text-xs text-red-400 mt-1">
          Not a valid phone number for {countryName(country)}.
        </p>
      )}
    </div>
  );
}
