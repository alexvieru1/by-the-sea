'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Video, Clock, Calendar, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from '@/i18n/routing';
import { getTelemedicineToken } from '@/lib/actions/telemedicine';

const VideoCall = dynamic(() => import('@/components/telemedicine/video-call'), {
  ssr: false,
});

interface Booking {
  id: string;
  doctor_name: string;
  scheduled_at: string;
  status: string;
  room_name: string;
}

export default function ConsultationClient({ booking }: { booking: Booking }) {
  const t = useTranslations('telemedicine');
  const router = useRouter();
  const [callState, setCallState] = useState<'waiting' | 'joining' | 'in-call' | 'error'>('waiting');
  const [callData, setCallData] = useState<{
    token: string;
    roomName: string;
    appId: string;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const scheduledDate = new Date(booking.scheduled_at);
  const now = new Date();
  const thirtyMinBefore = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
  const canJoin = booking.status === 'confirmed' && now >= thirtyMinBefore;

  const isMobile = typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleJoin = async () => {
    setCallState('joining');
    setError('');

    const result = await getTelemedicineToken(booking.id);

    if ('error' in result) {
      setCallState('error');
      setError(result.error ?? 'unknown');
      return;
    }

    if (isMobile) {
      // iOS Safari blocks camera/mic in cross-origin iframes
      // Redirect to JaaS room directly where permissions work natively
      window.location.href = `https://8x8.vc/${result.appId}/${result.roomName}?jwt=${result.token}`;
      return;
    }

    setCallData(result);
    setCallState('in-call');
  };

  const handleCallEnd = () => {
    setCallState('waiting');
    setCallData(null);
    router.push('/profile');
  };

  if (callState === 'in-call' && callData) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900">
        <VideoCall
          jwt={callData.token}
          roomName={callData.roomName}
          appId={callData.appId}
          onCallEnd={handleCallEnd}
        />
      </div>
    );
  }

  return (
    <section className="fixed inset-0 z-[100] bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Video className="h-6 w-6 text-[#0097a7]" />
            <h1 className="text-xl font-semibold text-gray-900">
              {t('title')}
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span>{booking.doctor_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {scheduledDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {scheduledDate.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {booking.status === 'scheduled' && (
            <div className="border border-amber-200 bg-amber-50 p-4 mb-4">
              <p className="text-sm text-amber-800">{t('pendingConfirmation')}</p>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 mb-4">
              <p className="text-sm text-red-800">{t(`errors.${error}`)}</p>
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={!canJoin || callState === 'joining'}
            className="w-full bg-[#0097a7] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#00838f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Video className="h-4 w-4" />
            {callState === 'joining' ? t('joining') : canJoin ? t('joinCall') : t('notYet')}
          </button>

          {!canJoin && booking.status === 'confirmed' && (
            <p className="mt-3 text-xs text-center text-gray-500">
              {t('availableAt', {
                time: thirtyMinBefore.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              })}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
