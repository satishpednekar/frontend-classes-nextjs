"use client";

import React, { useMemo, useState } from "react";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { useOnboardingStore } from "@/stores/onboarding-store";

const EXPERIENCE_OPTIONS = [
  { label: "< 1 year", value: 1 },
  { label: "1-3 years", value: 2 },
  { label: "3-5 years", value: 3 },
  { label: "5-10 years", value: 4 },
  { label: "10+ years", value: 5 },
];

const DOMAINS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Design", "Data"];
const INDUSTRIES = ["SaaS", "E-commerce", "Fintech", "Healthcare", "Education", "Gaming", "Consulting"];

export default function StepProfessionalDetails() {
  const professional = useOnboardingStore((state) => state.professional);
  const updateProfessional = useOnboardingStore((state) => state.updateProfessional);
  const submitStep = useOnboardingStore((state) => state.submitStep);
  const goToNextStep = useOnboardingStore((state) => state.goToNextStep);
  const goToPrevStep = useOnboardingStore((state) => state.goToPrevStep);
  const isLoading = useOnboardingStore((state) => state.isLoading);

  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return professional.jobTitle.trim().length > 0;
  }, [professional.jobTitle]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setError("Your role helps us tailor relevant content");
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
        <h1 className="text-2xl font-semibold text-white">Tell us about your work experience</h1>
        <p className="text-sm text-white/70">
          We’ll use this to calibrate skill recommendations, connect you with relevant industry peers, and surface
          opportunities that match your context.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <Label>Current role *</Label>
            <Input
              placeholder="Lead Frontend Engineer"
              value={professional.jobTitle}
              onChange={(event) => updateProfessional({ jobTitle: event.target.value })}
              required
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              placeholder="Where do you currently work?"
              value={professional.company}
              onChange={(event) => updateProfessional({ company: event.target.value })}
            />
          </div>
          <div>
            <Label>Years of experience</Label>
            <Select
              value={String(professional.yearsExperience ?? 0)}
              onChange={(event) => updateProfessional({ yearsExperience: Number(event.target.value) })}
            >
              <option value="0">Select</option>
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Domain</Label>
              <Select
                value={professional.domain}
                onChange={(event) => updateProfessional({ domain: event.target.value })}
              >
                <option value="">Select</option>
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain.toLowerCase()}>
                    {domain}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select
                value={professional.industry}
                onChange={(event) => updateProfessional({ industry: event.target.value })}
              >
                <option value="">Select</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Label>LinkedIn URL</Label>
            <Input
              placeholder="https://linkedin.com/in/you"
              value={professional.linkedinUrl}
              onChange={(event) => updateProfessional({ linkedinUrl: event.target.value })}
            />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input
              placeholder="https://github.com/username"
              value={professional.githubUrl}
              onChange={(event) => updateProfessional({ githubUrl: event.target.value })}
            />
          </div>
          <div>
            <Label>Portfolio</Label>
            <Input
              placeholder="https://your-site.dev"
              value={professional.portfolioUrl}
              onChange={(event) => updateProfessional({ portfolioUrl: event.target.value })}
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              placeholder="Optional"
              value={professional.websiteUrl}
              onChange={(event) => updateProfessional({ websiteUrl: event.target.value })}
            />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <p>
              Add or refine these details anytime from your profile. We’ll use them to enrich insights, connect you with
              relevant peers, and personalize premium modules.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="outline" type="button" onClick={goToPrevStep} className="px-6">
          Back
        </Button>
        <Button type="submit" disabled={!isValid || isLoading} loading={isLoading} className="px-6">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}


