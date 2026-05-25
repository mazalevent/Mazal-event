"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventTypePage } from "@/components/client/EventTypePage";
import { ServicesPage } from "@/components/client/ServicesPage";
import { FormsOrchestrator, type FormsData } from "@/components/client/FormsOrchestrator";
import { SummaryPage } from "@/components/client/SummaryPage";
import type { EventType } from "@/lib/constants";
import { submitRequest } from "./actions";

type Step = "event-type" | "services" | "forms" | "summary";

export default function DemandePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("event-type");
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [formsData, setFormsData] = useState<FormsData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (step === "event-type") {
    return (
      <EventTypePage
        onBack={() => router.push("/")}
        onSelect={(e) => {
          setEventType(e);
          setStep("services");
        }}
      />
    );
  }

  if (step === "services") {
    return (
      <ServicesPage
        onBack={() => setStep("event-type")}
        onConfirm={(s) => {
          setServices(s);
          setStep("forms");
        }}
      />
    );
  }

  if (step === "forms") {
    return (
      <FormsOrchestrator
        services={services}
        onBack={() => setStep("services")}
        onConfirm={(d) => {
          setFormsData(d);
          setStep("summary");
        }}
      />
    );
  }

  // summary
  if (!eventType || !formsData) {
    // Defensive : on ne devrait pas pouvoir arriver ici sans eventType/formsData
    return null;
  }

  return (
    <SummaryPage
      eventType={eventType}
      services={services}
      formsData={formsData}
      onBack={() => setStep("forms")}
      submitting={submitting}
      error={error}
      onSubmit={async () => {
        setSubmitting(true);
        setError(null);
        const result = await submitRequest({ eventType, services, formsData });
        if (result.ok) {
          router.push("/demande/merci");
        } else {
          setError(result.error);
          setSubmitting(false);
        }
      }}
    />
  );
}
