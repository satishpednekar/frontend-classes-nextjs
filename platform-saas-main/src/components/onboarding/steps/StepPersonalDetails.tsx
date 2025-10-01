"use client";

import React, { useMemo, useState } from "react";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { useOnboardingStore } from "@/stores/onboarding-store";

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Central Europe" },
  { value: "Asia/Kolkata", label: "India" },
  { value: "Asia/Singapore", label: "Singapore" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "zh", label: "Mandarin" },
];

export default function StepPersonalDetails() {
  const personal = useOnboardingStore((state) => state.personal);
  const updatePersonal = useOnboardingStore((state) => state.updatePersonal);
  const submitStep = useOnboardingStore((state) => state.submitStep);
  const goToNextStep = useOnboardingStore((state) => state.goToNextStep);
  const isLoading = useOnboardingStore((state) => state.isLoading);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => {
    if (personal.displayName.trim()) return personal.displayName;
    const composed = `${personal.firstName} ${personal.lastName}`.trim();
    return composed;
  }, [personal.displayName, personal.firstName, personal.lastName]);

  const isValid = useMemo(() => {
    return (
      personal.firstName.trim().length > 0 &&
      personal.lastName.trim().length > 0 &&
      displayName.trim().length > 0 &&
      personal.country.trim().length > 0 &&
      personal.timezone.trim().length > 0 &&
      personal.language.trim().length > 0
    );
  }, [personal, displayName]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      displayName: true,
      country: true,
      timezone: true,
      language: true,
    });

    if (!isValid) {
      setError("Please complete the required details to continue.");
      return;
    }

    setError(null);

    try {
      await submitStep();
      goToNextStep();
    } catch (err) {
      setError((err as Error).message || "We couldn’t save your progress");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-white">Let’s personalize your experience</h1>
        <p className="text-sm text-white/70">
          We use this information to tailor content, surface relevant insights, and keep your workspace localized.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <Label>First name *</Label>
            <Input
              placeholder="Jane"
              value={personal.firstName}
              onChange={(event) => updatePersonal({ firstName: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
              required
            />
            {touched.firstName && personal.firstName.trim().length === 0 && (
              <p className="mt-2 text-xs text-rose-300">First name is required.</p>
            )}
          </div>

          <div>
            <Label>Last name *</Label>
            <Input
              placeholder="Doe"
              value={personal.lastName}
              onChange={(event) => updatePersonal({ lastName: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
              required
            />
            {touched.lastName && personal.lastName.trim().length === 0 && (
              <p className="mt-2 text-xs text-rose-300">Last name is required.</p>
            )}
          </div>

          <div>
            <Label>Display name *</Label>
            <Input
              placeholder="Your public profile"
              value={personal.displayName}
              onChange={(event) => updatePersonal({ displayName: event.target.value })}
              onBlur={() => setTouched((prev) => ({ ...prev, displayName: true }))}
              required
            />
            {touched.displayName && displayName.trim().length === 0 && (
              <p className="mt-2 text-xs text-rose-300">Display name is required.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Label>Country *</Label>
            <Input
              placeholder="Where are you based?"
              value={personal.country}
              onChange={(event) => updatePersonal({ country: event.target.value.slice(0, 80) })}
              onBlur={() => setTouched((prev) => ({ ...prev, country: true }))}
              required
            />
            {touched.country && personal.country.trim().length === 0 && (
              <p className="mt-2 text-xs text-rose-300">Country helps us provide localized recommendations.</p>
            )}
          </div>

          <div>
            <Label>City</Label>
            <Input
              placeholder="Optional"
              value={personal.city}
              onChange={(event) => updatePersonal({ city: event.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Timezone *</Label>
              <Select
                options={TIMEZONES}
                value={personal.timezone}
                onChange={(value) => updatePersonal({ timezone: value })}
                onBlur={() => setTouched((prev) => ({ ...prev, timezone: true }))}
                className="bg-transparent"
                disabled={TIMEZONES.length === 0}
              />
              {touched.timezone && !personal.timezone && (
                <p className="mt-2 text-xs text-rose-300">Timezone helps us personalize reminders.</p>
              )}
            </div>

            <div>
              <Label>Preferred language *</Label>
              <Select
                options={LANGUAGES}
                value={personal.language}
                onChange={(value) => updatePersonal({ language: value })}
                onBlur={() => setTouched((prev) => ({ ...prev, language: true }))}
                className="bg-transparent"
              />
              {touched.language && !personal.language && (
                <p className="mt-2 text-xs text-rose-300">Language is required.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button type="submit" disabled={!isValid || isLoading} loading={isLoading} className="px-6">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}


