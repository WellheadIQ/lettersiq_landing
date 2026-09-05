import test from "node:test";
import assert from "node:assert/strict";
import { formatPhone, phoneDigits, validateField, submitOperator } from "../src/lib/contact.js";
import { lockPageScroll } from "../src/lib/scrollLock.js";

const form = { operator: " Example Operating ", name: " Test User ", email: " test@example.com ", phone: "+1 (512) 555-0134" };

test("pasted US country code preserves all ten subscriber digits", () => {
  assert.equal(formatPhone(form.phone), "(512) 555-0134");
  assert.equal(phoneDigits(form.phone), "5125550134");
  assert.equal(validateField("phone", form.phone), "");
});

test("overlong phone numbers stay visible and fail validation", () => {
  const input = "512555013499";
  assert.equal(formatPhone(input), input);
  assert.notEqual(validateField("phone", input), "");
  assert.notEqual(validateField("phone", "512"), "");
});

test("partial input and deleting digits remain editable", () => {
  assert.equal(formatPhone(""), "");
  assert.equal(formatPhone("512"), "512");
  assert.equal(formatPhone("5125"), "(512) 5");
  assert.equal(formatPhone("(512) 555-013"), "(512) 555-013");
});

test("required fields reject blank and malformed contact details", () => {
  for (const field of ["operator", "name", "email", "phone"]) assert.notEqual(validateField(field, "  "), "");
  assert.notEqual(validateField("email", "test@"), "");
  assert.equal(validateField("email", " test@example.com "), "");
});

test("confirmed submissions trim fields and pass the abort signal", async () => {
  const controller = new AbortController();
  await submitOperator(form, { signal: controller.signal, fetchImpl: async (url, options) => {
    assert.equal(url, "https://formcarry.com/s/t84fP1_KPoq");
    assert.equal(options.signal, controller.signal);
    assert.deepEqual(JSON.parse(options.body), { operator: "Example Operating", name: "Test User", email: "test@example.com", phone: "5125550134" });
    return { ok: true, json: async () => ({ code: 200 }) };
  } });
});

test("HTTP 200 with an application error does not show success", async () => {
  await assert.rejects(submitOperator(form, { fetchImpl: async () => ({ ok: true, json: async () => ({ code: 422 }) }) }));
});

test("HTTP failures, invalid replies, and network failures reject", async () => {
  for (const fetchImpl of [
    async () => ({ ok: false, json: async () => ({ code: 200 }) }),
    async () => ({ ok: true, json: async () => { throw new Error("Invalid JSON"); } }),
    async () => { throw new Error("Offline"); },
  ]) await assert.rejects(submitOperator(form, { fetchImpl }));
});

test("overlapping scroll locks restore only after the last release", () => {
  globalThis.document = { documentElement: { style: { overflow: "auto" } } };
  const first = lockPageScroll();
  const second = lockPageScroll();
  first();
  assert.equal(document.documentElement.style.overflow, "hidden");
  first();
  assert.equal(document.documentElement.style.overflow, "hidden");
  second();
  assert.equal(document.documentElement.style.overflow, "auto");
  delete globalThis.document;
});

test("scroll locking is safe during server rendering", () => {
  assert.doesNotThrow(() => lockPageScroll()());
});
