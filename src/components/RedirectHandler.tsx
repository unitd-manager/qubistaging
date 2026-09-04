/**
 * Redirect Handler Component
 * Monitors route changes and applies redirect rules
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRedirects } from '@/hooks/useRedirects';

interface RedirectHandlerProps {
  enabled?: boolean;
  onRedirect?: (from: string, to: string) => void;
  excludedPaths?: string[];
}

export const RedirectHandler = ({
  enabled = true,
  onRedirect,
  excludedPaths = [],
}: RedirectHandlerProps) => {
  const location = useLocation();
  const { checkAndApplyRedirect } = useRedirects({
    enabled,
    onRedirect,
  });

  useEffect(() => {
    if (excludedPaths.includes(location.pathname)) return;
    checkAndApplyRedirect(location.pathname);
  }, [location.pathname, checkAndApplyRedirect, excludedPaths]);

  return null; // This is a non-visual component
};
