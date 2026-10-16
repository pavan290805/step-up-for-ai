export const EVENT_NAMES = {
  EVENT_REGISTRATION_CREATED: "event.registration.created",
  EVENT_REGISTRATION_CANCELLED: "event.registration.cancelled",
  EVENT_WAITLIST_PROMOTED: "event.waitlist.promoted",
  EVENT_CANCELLED: "event.cancelled",
  EVENT_REMINDER_DUE: "event.reminder.due",
  COMMUNITY_COMMENT_CREATED: "community.comment.created",
  COMMUNITY_REPLY_CREATED: "community.reply.created",
  COMMUNITY_MENTION_CREATED: "community.mention.created",
  COMMUNITY_LIKE_CREATED: "community.like.created",
  COMMUNITY_POST_CREATED: "community.post.created",
  COMMUNITY_POST_UPDATED: "community.post.updated",
  COMMUNITY_POST_DELETED: "community.post.deleted",
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];
