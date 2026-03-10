import jwt from 'jsonwebtoken';

interface JaaSTokenOptions {
  roomName: string;
  userName: string;
  userEmail: string;
  userId: string;
  isModerator: boolean;
}

export function generateJaaSToken({
  roomName,
  userName,
  userEmail,
  userId,
  isModerator,
}: JaaSTokenOptions): string {
  const appId = process.env.JAAS_APP_ID!;
  const privateKey = process.env.JAAS_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const keyId = process.env.JAAS_KEY_ID!;

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room: roomName,
    exp: now + 3 * 60 * 60, // 3 hours
    nbf: now - 10,
    context: {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        moderator: isModerator ? 'true' : 'false',
      },
      features: {
        recording: 'false',
        livestreaming: 'false',
      },
    },
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    header: {
      alg: 'RS256',
      kid: keyId,
      typ: 'JWT',
    },
  });
}
