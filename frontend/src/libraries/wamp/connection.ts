import autobahn from "autobahn";
import { getConfig } from "../config";
import { SubscriptionTopicTypes } from "./types";

let sessionPromise: Promise<autobahn.Session> | undefined;

const createSession = async (): Promise<autobahn.Session> => {
  return new Promise((resolve, reject) => {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
    const connection = new autobahn.Connection({
      url: (typeof window === "undefined"
        ? serverRuntimeConfig
        : publicRuntimeConfig
      ).wampNearExplorerUrl,
      realm: "near-explorer",
      retry_if_unreachable: true,
      max_retries: Number.MAX_SAFE_INTEGER,
      max_retry_delay: 10,
    });
    connection.onopen = (session) => {
      resolve(session);
    };
    connection.onclose = (reason) => {
      reject(reason);
      return false;
    };
    connection.open();
  });
};

export const getSession = async (): Promise<autobahn.Session> => {
  if (!sessionPromise) {
    sessionPromise = createSession();
  }
  const session = await sessionPromise;
  if (!session.isOpen) {
    sessionPromise = createSession();
  }
  return sessionPromise;
};

// We keep cache to update newly subscribed handlers immediately
let wampSubscriptionCache: Partial<
  {
    [T in keyof SubscriptionTopicTypes]: {
      subscription: autobahn.ISubscription;
      lastValue?: SubscriptionTopicTypes[T];
    };
  }
> = {};

export const subscribeTopic = async <T extends keyof SubscriptionTopicTypes>(
  topic: T,
  handler: (data: SubscriptionTopicTypes[T]) => void
): Promise<void> => {
  if (wampSubscriptionCache[topic]) {
    return;
  }
  const session = await getSession();
  wampSubscriptionCache[topic] = {
    subscription: await session.subscribe(topic, (_args, kwargs) => {
      handler(kwargs);
      const cachedTopic = wampSubscriptionCache[topic];
      if (!cachedTopic) {
        // Bail-out in case we have a race condition of this callback and unsubscription
        return;
      }
      cachedTopic.lastValue = kwargs;
    }),
    lastValue: undefined,
  };
};

export const unsubscribeTopic = async <T extends keyof SubscriptionTopicTypes>(
  topic: T
): Promise<void> => {
  const cacheItem = wampSubscriptionCache[topic];
  if (!cacheItem) {
    return;
  }
  delete wampSubscriptionCache[topic];
  await cacheItem.subscription.unsubscribe();
};

export const getLastValue = <T extends keyof SubscriptionTopicTypes>(
  topic: T
): SubscriptionTopicTypes[T] | undefined => {
  return wampSubscriptionCache[topic]?.lastValue as
    | SubscriptionTopicTypes[T]
    | undefined;
};

export async function call<T, Args extends unknown[]>(
  procedure: string,
  args: Args
): Promise<T> {
  const session = await getSession();
  const result = await session.call(procedure, args);
  return result as T;
}
