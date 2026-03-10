'use client';

import { useEffect, useRef } from 'react';

interface VideoCallProps {
  jwt: string;
  roomName: string;
  appId: string;
  onCallEnd?: () => void;
}

export default function VideoCall({ jwt, roomName, appId, onCallEnd }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || apiRef.current) return;

    const loadJitsi = async () => {
      // Load the JaaS iframe API script
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/vpaas-magic-cookie-default/external_api.js';
      script.async = true;
      script.onload = () => {
        // @ts-expect-error JitsiMeetExternalAPI is loaded via script
        const api = new window.JitsiMeetExternalAPI('8x8.vc', {
          roomName: `${appId}/${roomName}`,
          jwt,
          parentNode: containerRef.current,
          configOverwrite: {
            startWithAudioMuted: true,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            lobby: { enabled: true },
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'fullscreen', 'hangup', 'tileview', 'settings',
            ],
          },
        });

        api.addListener('readyToClose', () => {
          onCallEnd?.();
        });

        apiRef.current = api;
      };

      document.head.appendChild(script);
    };

    loadJitsi();

    return () => {
      if (apiRef.current) {
        // @ts-expect-error dispose exists on the API
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [jwt, roomName, appId, onCallEnd]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-80px)] w-full"
    />
  );
}
