import React, { useEffect, useRef } from 'react';

export function Conversation({ url, onLeave, onCallFrame, style }) {
  const containerRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    // only run once per URL
    if (!url || callRef.current) return;

    const init = () => {
      // clean up any previous frame
      if (callRef.current) {
        callRef.current.destroy();
        callRef.current = null;
      }

      // 1. create the call object
      const call = window.DailyIframe.createFrame({
        showLeaveButton: false,
        iframeStyle: { width: '100%', height: '100%', border: '0' },
      });
      callRef.current = call;

      // 2. join with camera off + noise cancellation by default
      call.join({ url, startVideoOff: true });
      call.updateInputSettings({
        audio: { processor: { type: 'noise-cancellation' } },
      }).catch(() => {});  // silent failure

      // 3. once joined, double‑ensure camera off
      call.on('joined-meeting', async () => {
        // turn off camera safely
        try {
          call.setLocalVideo(false);
        } catch (err) {
          console.warn('Could not disable camera:', err);
        }
        onCallFrame?.(call);
      });

      // 4. cleanup on leave
      call.on('left-meeting', () => {
        call.destroy();
        callRef.current = null;
        onLeave?.();
      });

      // 5. mount the iframe into your container
      const iframeEl = call.iframe();
      if (iframeEl.parentNode) {
        iframeEl.parentNode.removeChild(iframeEl);
      }
      containerRef.current.appendChild(iframeEl);
    };

    // load Daily‑JS if needed, then init
    if (!window.DailyIframe) {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/@daily-co/daily-js';
      s.crossOrigin = 'anonymous';
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }

    // teardown on unmount or URL change
    return () => {
      if (callRef.current) {
        callRef.current.destroy();
        callRef.current = null;
      }
    };
  }, [url, onLeave, onCallFrame]);

  // render your container (empty until we append the iframe)
  return <div ref={containerRef} style={style} />;
}