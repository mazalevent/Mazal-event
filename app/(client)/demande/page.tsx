"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { EventTypePage } from "@/components/client/EventTypePage";
import { ServicesPage } from "@/components/client/ServicesPage";
import { FormsOrchestrator, type FormsData } from "@/components/client/FormsOrchestrator";
import { SummaryPage } from "@/components/client/SummaryPage";
import type { EventType } from "@/lib/constants";
import { submitRequest } from "./actions";

type Step = "event-type" | "services" | "forms" | "summary";

const stepVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};
const stepTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

export default function DemandePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("event-type");
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [formsData, setFormsData] = useState<FormsData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnimatePresence mode="wait">
      {step === "event-type" && (
        <motion.div key="event-type" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
          <EventTypePage
            onBack={() => router.push("/")}
            onSelect={(e) => {
              setEventType(e);
              setStep("services");
            }}
          />
        </motion.div>
      )}

      {step === "services" && (
        <motion.div key="services" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
          <ServicesPage
            onBack={() => setStep("event-type")}
            onConfirm={(s) => {
              setServices(s);
              setStep("forms");
            }}
          />
        </motion.div>
      )}

      {step === "forms" && (
        <motion.div key="forms" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
          <FormsOrchestrator
            services={services}
            onBack={() => setStep("services")}
            onConfirm={(d) => {
              setFormsData(d);
              setStep("summary");
            }}
          />
        </motion.div>
      )}

      {step === "summary" && eventType && formsData && (
        <motion.div key="summary" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
