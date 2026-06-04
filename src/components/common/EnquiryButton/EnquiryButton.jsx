/* ============================================
   EnquiryButton
   Icon Commerce College
   --------------------------------------------
   Thin wrapper around the shared <Button/> primitive
   that opens the global lead drawer with a given
   preset (apply-now | enquiry | prospectus | callback
   | visit | default). Drop it anywhere a CTA needs to
   capture a lead.

   Usage:
     <EnquiryButton preset="apply-now" source="hero" />
     <EnquiryButton preset="prospectus" variant="gold">
       Download Prospectus
     </EnquiryButton>
   ============================================ */

import React from 'react';
import Button from '../Button/Button';
import { useModal } from '../../../context/ModalContext';
import { trackCTAClick } from '../../../utils/gtm';

const DEFAULT_LABELS = {
  'apply-now': 'Apply Now',
  enquiry: 'Enquire Now',
  prospectus: 'Download Prospectus',
  callback: 'Request a Callback',
  visit: 'Book a Campus Visit',
  default: 'Enquire Now',
};

const EnquiryButton = ({
  preset = 'enquiry',
  source,
  children,
  variant = 'primary',
  onClick,
  ...props
}) => {
  const { openLeadDrawer } = useModal();
  const label = children || DEFAULT_LABELS[preset] || DEFAULT_LABELS.default;

  const handleClick = (e) => {
    if (onClick) onClick(e);
    trackCTAClick(`enquiry_button_${preset}`, source || 'page', label);
    openLeadDrawer(preset, source ? { source } : {});
  };

  return (
    <Button variant={variant} onClick={handleClick} {...props}>
      {label}
    </Button>
  );
};

export default EnquiryButton;
