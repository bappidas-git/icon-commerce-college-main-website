/* ============================================
   ProspectusButton — lead-gated "Download Prospectus" CTA
   Icon Commerce College
   --------------------------------------------
   The canonical control for the prospectus download. It NEVER downloads the
   file directly — it opens the global lead drawer with the `prospectus` preset
   (UnifiedLeadForm, source `prospectus`). The actual file download is fired by
   PublicLayout only after the lead submit succeeds, so a lead is always
   captured first (prompt 23).

   Wraps the shared <Button/> primitive, so every Button prop (variant, size,
   fullWidth, …) passes straight through.

   Usage:
     <ProspectusButton />                                  // navy/gold page CTA
     <ProspectusButton variant="outline" source="hero" />
     <ProspectusButton source="course-detail-rail" programInterest="BCA" />
   ============================================ */

import React from 'react';
import Button from '../Button/Button';
import { useModal } from '../../../context/ModalContext';
import { trackCTAClick } from '../../../utils/gtm';

const ProspectusButton = ({
  source, // optional override; falls back to the preset's `prospectus` source
  programInterest, // optional program to pre-select in the drawer form
  variant = 'primary',
  startIcon = 'mdi:file-download-outline',
  children = 'Download Prospectus',
  onClick,
  ...props
}) => {
  const { openLeadDrawer } = useModal();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    trackCTAClick('prospectus_download', source || 'page', 'Download Prospectus');
    openLeadDrawer('prospectus', {
      ...(source ? { source } : {}),
      ...(programInterest ? { programInterest } : {}),
    });
  };

  return (
    <Button variant={variant} startIcon={startIcon} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

export default ProspectusButton;
