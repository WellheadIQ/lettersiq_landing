export const phoneDigits = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
};

// Keep overlong input visible and invalid; never silently change a phone number.
export const formatPhone = (value) => {
  const digits = phoneDigits(value);
  if (digits.length > 10) return value;
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const validateField = (name, value) => {
  const text = (value || "").trim();
  switch (name) {
    case "name": return text.length >= 2 ? "" : "Enter your full name.";
    case "operator": return text.length >= 2 ? "" : "Enter your operator or company name.";
    case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? "" : "Enter a valid email address.";
    case "phone": return phoneDigits(text).length === 10 ? "" : "Enter a 10-digit phone number, with an optional +1 country code.";
    default: return "";
  }
};

/** Formcarry reports application failures in JSON as well as HTTP status. */
export async function submitOperator(formData, { signal, fetchImpl = fetch } = {}) {
  const body = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value.trim()]));
  body.phone = phoneDigits(formData.phone);
  const response = await fetchImpl("https://formcarry.com/s/t84fP1_KPoq", {
    method: "POST",
    signal,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || result.code !== 200) throw new Error("Submission failed");
}
