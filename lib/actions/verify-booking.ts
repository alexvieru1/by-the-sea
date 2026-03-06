'use server';

/**
 * Verify a booking by phone number against BitManager.
 * TODO: Replace mock with real BitManager API call.
 */
export async function verifyBookingByPhone(
  phone: string
): Promise<{ confirmed: boolean }> {
  // Mock: always confirm for now
  // In production, this will call BitManager's API to check
  // if the phone number has a confirmed booking
  if (!phone) return { confirmed: false };
  return { confirmed: true };
}
