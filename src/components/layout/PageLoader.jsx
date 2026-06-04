/* ============================================
   PageLoader — shared Suspense fallback
   Icon Commerce College
   --------------------------------------------
   Navy spinner shown while a lazy-loaded route
   chunk is being fetched. Kept intentionally
   lightweight so it can render before the page's
   own JavaScript has parsed.
   ============================================ */

import React, { memo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const PageLoader = memo(({ minHeight = '60vh' }) => (
  <Box
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight,
      width: '100%',
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CircularProgress
        size={44}
        thickness={3}
        sx={{ color: 'var(--color-primary, #1A2A52)' }}
      />
    </motion.div>
  </Box>
));

PageLoader.displayName = 'PageLoader';

export default PageLoader;
