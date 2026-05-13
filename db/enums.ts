// Drizzle pgEnum declarations — mirror of canonical schema §2.
// Source of truth: db/migrations/0001_initial.sql.
// Order of values is significant (Postgres preserves insertion order).

import { pgEnum } from 'drizzle-orm/pg-core';

export const resourceTypeEnum = pgEnum('resource_type', [
  'component',
  'mcp',
  'skill',
  'subagent',
  'script',
  'rule',
  'prompt',
  'plugin',
  'marketplace',
  'hook',
  'command',
  'starter',
  'tool',
  'model',
  'sandbox',
  'observability',
  'backend',
  'asset',
  'showcase',
  'docs_for_llms',
  'spec',
  'workflow',
  'eval',
  'stack',
  'guide',
  'deal',
  'news',
  'design_system',
]);

export const publishStatusEnum = pgEnum('publish_status', [
  'draft',
  'in_review',
  'published',
  'rejected',
  'archived',
]);

export const licenseKindEnum = pgEnum('license_kind', [
  'mit',
  'apache_2',
  'gpl_3',
  'agpl_3',
  'bsd_3',
  'isc',
  'cc0',
  'cc_by',
  'cc_by_sa',
  'commercial',
  'proprietary',
  'mixed',
  'unknown',
]);

export const compatStatusEnum = pgEnum('compat_status', [
  'verified',
  'partial',
  'broken',
  'unknown',
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free',
  'member',
  'pro',
]);

export const dealTierEnum = pgEnum('deal_tier', ['public', 'member', 'pro']);

export const dealStatusEnum = pgEnum('deal_status', [
  'active',
  'expired',
  'paused',
]);

export const claimStatusEnum = pgEnum('claim_status', [
  'started',
  'submitted',
  'approved',
  'rejected',
  'redeemed',
  'expired',
]);

export const newsKindEnum = pgEnum('news_kind', [
  'ecosystem',
  'release',
  'price_change',
  'tutorial',
  'op_ed',
]);

export const newsSourceKindEnum = pgEnum('news_source_kind', [
  'editorial',
  'auto_generated',
  'rss_imported',
]);

export const guideKindEnum = pgEnum('guide_kind', [
  'install',
  'quickstart',
  'usage',
  'troubleshoot',
  'migrate',
  'tutorial',
]);

export const difficultyEnum = pgEnum('difficulty', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const alertKindEnum = pgEnum('alert_kind', [
  'price_drop',
  'version_release',
  'capability_add',
  'deal_expiring',
  'resource_updated',
  'saved_search',
]);

export const alertStatusEnum = pgEnum('alert_status', [
  'active',
  'paused',
  'triggered',
  'expired',
]);

export const installMethodEnum = pgEnum('install_method', [
  'deeplink',
  'cli',
  'manual_config',
  'npm',
  'pip',
  'cargo',
  'brew',
  'docker',
  'shadcn',
]);

export const aiClientEnum = pgEnum('ai_client', [
  'cursor',
  'claude_code',
  'windsurf',
  'cline',
  'roo',
  'aider',
  'continue',
  'zed',
  'kiro',
  'codex',
  'gemini_cli',
  'claude_desktop',
  'bolt',
  'lovable',
  'v0',
  'replit_agent',
  'base44',
  'tempo',
  'emergent',
  'rosebud',
  'copilot',
  'other',
]);

export const alternativeKindEnum = pgEnum('alternative_kind', [
  'cheaper',
  'faster',
  'smarter',
  'lighter',
  'open_source',
  'self_hosted',
  'free',
  'premium',
]);

export const reviewOutcomeEnum = pgEnum('review_outcome', [
  'approved',
  'rejected',
  'needs_changes',
]);

export const notificationChannelEnum = pgEnum('notification_channel', [
  'in_app',
  'email',
  'webhook',
]);
