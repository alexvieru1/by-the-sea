'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { Link, useRouter } from '@/i18n/routing';
import { Clock, CheckCircle, ArrowRight, Video, CreditCard, XCircle } from 'lucide-react';
import { updateBookingStatus } from '@/lib/actions/telemedicine';
import type { WaitlistStatus, TelemedicineBooking } from './page';

interface WaitlistStatusBannerProps {
  status: WaitlistStatus;
  telemedicineBooking?: TelemedicineBooking | null;
}

function formatBookingDateTime(scheduledAt: string, locale: string) {
  const date = new Date(scheduledAt);
  const dateStr = date.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(locale === 'ro' ? 'ro-RO' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { dateStr, timeStr };
}

export default function WaitlistStatusBanner({ status, telemedicineBooking }: WaitlistStatusBannerProps) {
  const t = useTranslations('auth.profile.waitlistStatus');
  const locale = useLocale();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/purity -- snapshot current time on mount for cancel window check
  const [now] = useState(() => Date.now());

  const handleStatusUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
    if (!telemedicineBooking) return;
    setUpdating(true);
    setActionError(null);

    try {
      const result = await updateBookingStatus(telemedicineBooking.id, newStatus);

      if ('error' in result && result.error) {
        setActionError(result.error);
        setUpdating(false);
        return;
      }

      router.refresh();
    } catch {
      setActionError('unknown');
      setUpdating(false);
    }
  };

  if (status === 'evaluated') {
    // No telemedicine booking yet — show transitional "evaluation complete" message
    if (!telemedicineBooking) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-green-200 bg-green-50 p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">{t('evaluatedTitle')}</p>
              <p className="mt-1 text-sm text-green-700">{t('evaluatedDescription')}</p>
            </div>
          </div>
        </motion.div>
      );
    }

    const { dateStr, timeStr } = formatBookingDateTime(telemedicineBooking.scheduled_at, locale);
    const isCompleted = telemedicineBooking.status === 'completed';
    const isConfirmed = telemedicineBooking.status === 'confirmed';
    const isScheduled = telemedicineBooking.status === 'scheduled';
    const isCancelled = telemedicineBooking.status === 'cancelled';

    // Completed — success banner with advance payment
    if (isCompleted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-green-200 bg-green-50 p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                {t('telemedicine.completedTitle')}
              </p>
              <p className="mt-1 text-sm text-green-700">
                {t('telemedicine.completedDescription')}
              </p>
              <a
                href="https://epl.ro/q/NG5xvTdr93e58mNxhtRjTUUfX-xax-s="
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 bg-[#002343] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#172C33]"
              >
                <CreditCard className="h-3.5 w-3.5" />
                {t('telemedicine.advancePayment')}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      );
    }

    // Cancelled — info banner
    if (isCancelled) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-gray-200 bg-gray-50 p-5"
        >
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {t('telemedicine.title')}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t('telemedicine.cancelled')}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }

    // Scheduled — patient needs to accept or decline
    if (isScheduled) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-amber-200 bg-amber-50 p-5"
        >
          <div className="flex items-start gap-3">
            <Video className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {t('telemedicine.title')}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {t('telemedicine.scheduled', {
                  doctor: telemedicineBooking.doctor_name,
                  date: dateStr,
                  time: timeStr,
                })}
              </p>
              <p className="mt-1 text-xs text-amber-700">
                {t('telemedicine.awaitingYourConfirmation')}
              </p>
              {actionError && (
                <p className="mt-2 text-xs text-red-600">
                  {actionError === 'too_late_to_cancel'
                    ? t('telemedicine.tooLateToCancel')
                    : actionError}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate('confirmed')}
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-[#002343] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#172C33] disabled:opacity-50"
                >
                  {t('telemedicine.acceptBooking')}
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updating}
                  className="inline-flex items-center gap-2 border border-red-300 bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {t('telemedicine.declineBooking')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Confirmed — join consultation + conditional cancel
    if (isConfirmed) {
      const scheduledAt = new Date(telemedicineBooking.scheduled_at).getTime();
      const sixHoursBefore = scheduledAt - 6 * 60 * 60 * 1000;
      const canCancel = now < sixHoursBefore;

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-[#002343]/20 bg-[#F2E4D1] p-5"
        >
          <div className="flex items-start gap-3">
            <Video className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#002343]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {t('telemedicine.title')}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {t('telemedicine.confirmed', {
                  doctor: telemedicineBooking.doctor_name,
                  date: dateStr,
                  time: timeStr,
                })}
              </p>
              {actionError && (
                <p className="mt-2 text-xs text-red-600">
                  {actionError === 'too_late_to_cancel'
                    ? t('telemedicine.tooLateToCancel')
                    : actionError}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 bg-[#002343] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#172C33]"
                >
                  {t('telemedicine.action')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={updating}
                    className="inline-flex items-center gap-2 border border-red-300 bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    {t('telemedicine.cancelBooking')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
  }

  if (status === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-[#002343]/20 bg-[#F2E4D1] p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#002343]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('confirmedTitle')}</p>
            <p className="mt-1 text-sm text-gray-700">{t('confirmedDescription')}</p>
            <Link
              href="/evaluation"
              className="mt-3 inline-flex items-center gap-2 bg-gray-900 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('confirmedAction')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-amber-200 bg-amber-50 p-5"
      >
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{t('pendingTitle')}</p>
            <p className="mt-1 text-sm text-amber-700">{t('pendingDescription')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // status === 'none'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 border border-gray-200 bg-gray-50 p-5"
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">{t('noneTitle')}</p>
        <p className="mt-1 text-sm text-gray-600">{t('noneDescription')}</p>
        <Link
          href="/book"
          className="mt-3 inline-flex items-center gap-2 border border-gray-300 bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('noneAction')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
