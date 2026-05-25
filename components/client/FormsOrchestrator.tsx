"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/constants";
import { CommonFormPage, type CommonData } from "./CommonFormPage";
import { ServiceFormPage, type ServiceData } from "./ServiceFormPage";

export type FormsData = { common: CommonData; services: Record<string, ServiceData> };

type Phase = "common" | number;

type Props = {
  services: string[];
  onConfirm: (data: FormsData) => void;
  onBack: () => void;
};

export function FormsOrchestrator({ services, onConfirm, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("common");
  const [commonData, setCommonData] = useState<CommonData>({});
  const [serviceData, setServiceData] = useState<Record<string, ServiceData>>({});
  const serviceList = SERVICES.filter((s) => services.includes(s.id));

  if (phase === "common") {
    return (
      <CommonFormPage
        onConfirm={(d) => {
          setCommonData(d);
          setPhase(0);
        }}
        onBack={onBack}
      />
    );
  }

  const step = phase;
  return (
    <ServiceFormPage
      service={serviceList[step]}
      step={step}
      total={serviceList.length}
      onConfirm={(d) => {
        const updated = { ...serviceData, [serviceList[step].id]: d };
        setServiceData(updated);
        if (step < serviceList.length - 1) {
          setPhase(step + 1);
        } else {
          onConfirm({ common: commonData, services: updated });
        }
      }}
      onBack={() => (step === 0 ? setPhase("common") : setPhase(step - 1))}
    />
  );
}
