/* ============================================
   UIKit — scratch demo / preview page (dev only)
   Icon Commerce College
   --------------------------------------------
   Composes the Phase 1.1 UI primitives so they can be eyeballed together
   and to satisfy the prompt-07 acceptance criteria. This route is only
   registered in development (see App.jsx) and is not part of the public
   site map.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Button from '../../components/common/Button/Button';
import Card, {
  IconCard,
  ImageCard,
  ProfileCard,
  StatCard,
} from '../../components/common/Card/Card';
import Accordion from '../../components/common/Accordion/Accordion';
import Tabs from '../../components/common/Tabs/Tabs';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';
import { placeholder } from '../../utils/assets';

const grid = {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const row = { display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' };

const UIKit = () => {
  useDocumentTitle('UI Kit');

  return (
    <>
      <PageHero
        eyebrow="Phase 1.1"
        title="UI Primitives & Motion"
        subtitle="A live preview of the shared building blocks every page composes from."
        image="hero-campus"
        breadcrumb={[{ label: 'UI Kit' }]}
        cta={{ label: 'Apply Now', variant: 'primary' }}
      />

      {/* Buttons */}
      <Section bg="white" eyebrow="Building blocks" title="Buttons" align="left">
        <div style={row}>
          <Button variant="primary">Primary CTA</Button>
          <Button variant="navy">Navy</Button>
          <Button variant="gold">Gold</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link" endIcon="mdi:arrow-right">Link</Button>
          <Button variant="navy" loading>Loading</Button>
          <Button variant="navy" disabled>Disabled</Button>
        </div>
      </Section>

      {/* Cards via RevealGroup (shuttle cascade) */}
      <Section
        bg="light"
        eyebrow="Surfaces"
        title="Card variants"
        subtitle="Generic cards staggered in with RevealGroup."
        align="left"
      >
        <RevealGroup as="div" style={grid}>
          <IconCard
            icon="mdi:school-outline"
            title="Qualified Faculty"
            subtitle="Experienced & research-active teachers."
          />
          <ImageCard
            image={placeholder('facility-library')}
            alt="Digital library"
            title="Digital Library"
            subtitle="Quiet study with online journals."
          />
          <ProfileCard
            image={placeholder('principal-dr-mandira-saha')}
            name="Dr. Mandira Saha"
            role="Principal"
          />
          <StatCard value="40+" label="Faculty members" icon="mdi:account-group" />
        </RevealGroup>
      </Section>

      {/* Tabs */}
      <Section bg="white" eyebrow="Navigation" title="Tabs" align="left">
        <Tabs
          tabs={[
            {
              label: 'Arts',
              icon: 'mdi:palette-outline',
              content: <p>Assamese, Economics, English, History, Political Science…</p>,
            },
            {
              label: 'Commerce',
              icon: 'mdi:finance',
              content: <p>Accountancy, Finance, Management, Business Administration…</p>,
            },
            {
              label: 'Science',
              icon: 'mdi:flask-outline',
              content: <p>Computer Application, Mathematics & Statistics, Chemistry…</p>,
            },
          ]}
        />
      </Section>

      {/* Accordion */}
      <Section bg="light" eyebrow="Disclosure" title="Accordion (FAQ)" align="left">
        <Reveal>
          <Accordion
            items={[
              {
                title: 'How do I apply for admission?',
                content:
                  'Register on the Samarth portal (College Code 842), select Icon Commerce College and your stream, then complete verification.',
              },
              {
                title: 'What are the fees?',
                content:
                  'First-semester fees range from ₹10,900 to ₹11,000 depending on the programme. GU registration / exam fees are extra.',
              },
            ]}
            defaultOpen={[0]}
          />
        </Reveal>
      </Section>

      {/* Empty state + plain Card */}
      <Section bg="white" eyebrow="States" title="Empty state" align="left">
        <EmptyState
          icon="mdi:bell-outline"
          title="No notices yet"
          description="New notices published from the admin panel will appear here."
          action={{ label: 'Back to Home', href: '/', variant: 'navy' }}
        />
        <div style={{ marginTop: '2rem' }}>
          <Card title="Plain Card" subtitle="A basic surface card with hover lift.">
            Compose any content inside the base Card.
          </Card>
        </div>
      </Section>
    </>
  );
};

export default UIKit;
