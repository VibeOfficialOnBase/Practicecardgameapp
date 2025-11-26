
import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Section from '../components/common/Section';
import Leaderboard from './Leaderboard';

export default function Progress() {
  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <PageHeader
        title="Your Progress"
        subtitle="Track your stats and see how you stack up"
      />

      <Section title="Your Stats">
        <UserStats />
      </Section>

      <Section title="Global Leaderboards">
        <Leaderboard />
      </Section>
    </div>
  );
}
