"use client";

// Section L questions page — questionnaire: age, gender, rent range, area, move-in days, tags.
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function LSection() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Tell us about you</h1>
        <p className="text-sm text-gray-500">This helps us find better places for you.</p>
        <SignedIn>
          <Questionnaire sectionKey="L" />
        </SignedIn>
        <SignedOut>
          <div className="space-y-3">
            <p className="text-sm">You must be signed in to view this page.</p>
            <SignInButton mode="modal" forceRedirectUrl="/post-auth" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

type SectionKey = "L" | "O";

function Questionnaire({ sectionKey }: { sectionKey: SectionKey }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // 1) Age, gender
  const [age, setAge] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");

  // 2) Rent range (generic scale for now)
  const [rentMin, setRentMin] = React.useState<number>(5000);
  const [rentMax, setRentMax] = React.useState<number>(25000);
  const RENT_ABS_MIN = 0;
  const RENT_ABS_MAX = 100000;

  // 3) Preferred area, map placeholder
  const [area, setArea] = React.useState<string>("");

  // 4) Preferred move-in time (days)
  const [moveInDays, setMoveInDays] = React.useState<string>("");

  // 5) Tags (optional)
  const DEFAULT_TAGS = [
    "Student",
    "Working Professional",
    "Pet-friendly",
    "Non-smoker",
    "Vegetarian",
  ];
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [userTags, setUserTags] = React.useState<string[]>([]);
  const [customTag, setCustomTag] = React.useState<string>("");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // Load any existing answers
  React.useEffect(() => {
    if (!isLoaded || !user) return;
    const section = ((user.unsafeMetadata as any)?.[sectionKey] as any) || {};
    if (section.gender) setGender(section.gender as string);
    if (section.age != null) setAge(String(section.age));
    if (section.rentMin != null) setRentMin(Number(section.rentMin));
    if (section.rentMax != null) setRentMax(Number(section.rentMax));
    if (section.area) setArea(String(section.area));
    if (section.moveInDays != null) setMoveInDays(String(section.moveInDays));
    if (Array.isArray(section.tags)) {
      const tags: string[] = section.tags as string[];
      setSelectedTags(tags);
      const lowerDefaults = DEFAULT_TAGS.map((d) => d.toLowerCase());
      const extras = Array.from(
        new Set(
          tags.filter((t) => !lowerDefaults.includes(String(t).toLowerCase()))
        )
      );
      setUserTags(extras);
    }
  }, [isLoaded, user, sectionKey]);

  // tags helpers
  function toggleTag(tag: string) {
    setSelectedTags((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );
  }
  function addCustomTag() {
    const raw = customTag.trim();
    if (!raw) return;
    // Avoid duplicates (case-insensitive) and align to canonical default label if matched
    const foundDefault = DEFAULT_TAGS.find(
      (d) => d.toLowerCase() === raw.toLowerCase()
    );
    if (foundDefault) {
      setSelectedTags((cur) =>
        cur.includes(foundDefault) ? cur : [...cur, foundDefault]
      );
      setCustomTag("");
      return;
    }

    const existsUser = userTags.some((t) => t.toLowerCase() === raw.toLowerCase());
    const canonical = existsUser
      ? userTags.find((t) => t.toLowerCase() === raw.toLowerCase())!
      : raw;
    if (!existsUser) setUserTags((cur) => [...cur, canonical]);
    setSelectedTags((cur) => (cur.includes(canonical) ? cur : [...cur, canonical]));
    setCustomTag("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Minimal validation per request: gender required; others optional for now
    if (!gender) {
      setError("Please choose a gender to continue.");
      return;
    }

    // Keep rentMin <= rentMax
    const fixedMin = Math.min(rentMin, rentMax);
    const fixedMax = Math.max(rentMin, rentMax);

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const meta = (user.unsafeMetadata as any) || {};
      const prevSection = (meta[sectionKey] as any) || {};
      const nextSection = {
        ...prevSection,
        age: age ? Number(age) : null,
        gender,
        rentMin: fixedMin,
        rentMax: fixedMax,
        area: area || null,
        moveInDays: moveInDays ? Number(moveInDays) : null,
        tags: selectedTags,
        updatedAt: new Date().toISOString(),
      };
      const nextMeta = { ...meta, [sectionKey]: nextSection };

      await user.update({ unsafeMetadata: nextMeta });
      setSaved(true);
      router.replace("/completed");
    } catch (err) {
      setError("Couldn’t save your answers. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 1. Age, Gender */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">About you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 24"
              className="w-full rounded-md border px-3 py-2 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={() => setGender("other")}
                />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Preferred rent range */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your budget</h2>
        <p className="text-sm text-gray-500">Set a budget you’re comfortable with.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Min budget</label>
            <input
              type="number"
              min={RENT_ABS_MIN}
              max={RENT_ABS_MAX}
              value={rentMin}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                const clamped = Math.min(Math.max(v, RENT_ABS_MIN), RENT_ABS_MAX);
                setRentMin(clamped);
                if (clamped > rentMax) setRentMax(clamped);
              }}
              className="w-full rounded-md border px-3 py-2 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max budget</label>
            <input
              type="number"
              min={RENT_ABS_MIN}
              max={RENT_ABS_MAX}
              value={rentMax}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                const clamped = Math.min(Math.max(v, RENT_ABS_MIN), RENT_ABS_MAX);
                setRentMax(Math.max(clamped, rentMin));
              }}
              className="w-full rounded-md border px-3 py-2 bg-transparent"
            />
          </div>
          <div className="text-sm text-gray-400">
            <div className="mb-1">Range preview</div>
            <div>
              ₹{Math.min(rentMin, rentMax)} – ₹{Math.max(rentMin, rentMax)}
            </div>
          </div>
        </div>
        {/* Single slider (Flowbite-style) controlling Max only */}
        <div className="space-y-1">
          <label className="block text-sm">Budget cap (slider)</label>
          <input
            id="rentMaxRange"
            type="range"
            min={RENT_ABS_MIN}
            max={RENT_ABS_MAX}
            step={500}
            value={Math.max(rentMax, rentMin)}
            onChange={(e) => {
              const v = Number(e.target.value);
              const clamped = Math.min(Math.max(v, RENT_ABS_MIN), RENT_ABS_MAX);
              setRentMax(Math.max(clamped, rentMin));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{RENT_ABS_MIN}</span>
            <span>₹{Math.max(rentMax, rentMin)}</span>
            <span>₹{RENT_ABS_MAX}</span>
          </div>
        </div>
        {/* Bigger thumb styling for the slider */}
        <style jsx global>{`
          /* WebKit */
          #rentMaxRange::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 22px;
            width: 22px;
            border-radius: 9999px;
            background: #6c47ff;
            border: 2px solid #ffffff;
            box-shadow: 0 0 0 2px #6c47ff;
            cursor: pointer;
            margin-top: -8px; /* align with 8px track height */
          }
          #rentMaxRange:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 4px rgba(108, 71, 255, 0.25);
          }
          #rentMaxRange::-webkit-slider-runnable-track {
            height: 8px;
            border-radius: 9999px;
          }
          /* Firefox */
          #rentMaxRange::-moz-range-thumb {
            height: 22px;
            width: 22px;
            border-radius: 9999px;
            background: #6c47ff;
            border: 2px solid #ffffff;
            cursor: pointer;
          }
          #rentMaxRange::-moz-range-track {
            height: 8px;
            border-radius: 9999px;
          }
        `}</style>
      </div>

      {/* 3. Preferred area + map placeholder */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Where do you want to live?</h2>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Neighbourhood, city…"
          className="w-full rounded-md border px-3 py-2 bg-transparent"
        />
        <div className="border rounded-md h-48 flex items-center justify-center text-sm text-gray-500">
          Map coming soon
        </div>
      </div>

      {/* 4. Move-in time (days) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">When do you plan to move?</h2>
        <div className="max-w-xs">
          <label className="block text-sm mb-1">Days from now</label>
          <input
            type="number"
            min={0}
            value={moveInDays}
            onChange={(e) => setMoveInDays(e.target.value)}
            placeholder="e.g. 30"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
          />
        </div>
      </div>

      {/* 5. Tags (optional) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Anything else? (optional)</h2>
        <div className="flex flex-wrap gap-3">
          {DEFAULT_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedTags.includes(t)
                  ? "bg-[#6c47ff] text-white border-[#6c47ff]"
                  : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {userTags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-1">
            {userTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTags.includes(t)
                    ? "bg-[#6c47ff] text-white border-[#6c47ff]"
                    : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        {selectedTags.length > 0 && (
          <div className="text-sm text-gray-400">
            Selected tags: {selectedTags.join(", ")}
          </div>
        )}
        <div className="flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="Type a tag, then press Enter"
            className="flex-1 rounded-md border px-3 py-2 bg-transparent"
          />
          <button type="button" onClick={addCustomTag} className="border rounded-md px-3 py-2">
            Add tag
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved!</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#6c47ff] text-white rounded-md px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
        <button
          type="button"
          onClick={() => router.replace("/important")}
          className="border rounded-md px-4 py-2"
        >
          Back
        </button>
      </div>
    </form>
  );
}
