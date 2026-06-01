"use client";

import { PageBackLink } from "@/components/onlysa/page-back-link";
import { IdentityCard } from "@/components/onlysa/identity-card";
import { JourneyModal } from "@/components/onlysa/journey-modal";
import { AppBottomNav } from "@/components/onlysa/app-bottom-nav";
import { useState } from "react";

export default function ProfilePage() {
  const [journeyOpen, setJourneyOpen] = useState(false);

  return (
    <>
      <div className="profile-page">
        <div className="profile-page-inner">
          <PageBackLink />

          <h1 className="profile-page-title">
            Your <span className="post-screen-accent">Profile</span>
          </h1>
          <p className="post-screen-sub">Anonymous identity & clout</p>

          <IdentityCard onOpenJourney={() => setJourneyOpen(true)} />
        </div>
      </div>

      <JourneyModal open={journeyOpen} onClose={() => setJourneyOpen(false)} />
      <AppBottomNav />
    </>
  );
}
