import { prisma } from './db';
import { User } from '@prisma/client';

export const getSubscription = async (userId: string) => {
  return await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
    include: {
      subscription: true,
    },
  });
};

export const getFeatureUsage = async (userId: string, feature: string) => {
  return await prisma.featureUsage.findUnique({
    where: {
      userId_feature: {
        userId,
        feature,
      },
    },
  });
};

export const checkUsage = async (userId: string, feature: string) => {
  const userSubscription = await getSubscription(userId);
  if (!userSubscription) {
    return { hasAccess: false, message: 'No subscription found' };
  }

  const featureUsage = await getFeatureUsage(userId, feature);
  const usage = featureUsage ? featureUsage.usage : 0;

  const featureLimit = (userSubscription.subscription.features as any)[feature];
  if (featureLimit === undefined) {
    return { hasAccess: true }; // No limit for this feature
  }

  if (usage >= featureLimit) {
    return { hasAccess: false, message: 'Usage limit exceeded' };
  }

  return { hasAccess: true };
};

export const incrementUsage = async (userId: string, feature: string) => {
  const featureUsage = await getFeatureUsage(userId, feature);
  if (featureUsage) {
    await prisma.featureUsage.update({
      where: {
        id: featureUsage.id,
      },
      data: {
        usage: featureUsage.usage + 1,
      },
    });
  } else {
    await prisma.featureUsage.create({
      data: {
        userId,
        feature,
        usage: 1,
      },
    });
  }
};
