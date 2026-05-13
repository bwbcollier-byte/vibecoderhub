// Drizzle ORM schema — mirror of db/migrations/0001_initial.sql.
// Source of truth is the SQL migration. Operational tables (rate_limit_buckets,
// ingestion_runs) live in db/operational/*.ts. Generated columns (tsvector
// search_vector) have their generation expression defined in SQL only; Drizzle
// sees the column shape, not the generation clause. RLS/triggers/functions/
// materialized views are not represented here.

import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  numeric,
  customType,
  primaryKey,
  index,
  uniqueIndex,
  check,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import {
  resourceTypeEnum,
  publishStatusEnum,
  licenseKindEnum,
  compatStatusEnum,
  subscriptionTierEnum,
  dealTierEnum,
  dealStatusEnum,
  claimStatusEnum,
  newsKindEnum,
  newsSourceKindEnum,
  guideKindEnum,
  difficultyEnum,
  alertKindEnum,
  alertStatusEnum,
  installMethodEnum,
  aiClientEnum,
  alternativeKindEnum,
  reviewOutcomeEnum,
  notificationChannelEnum,
} from './enums';

// ---------------------------------------------------------------------------
// Custom Postgres types
// ---------------------------------------------------------------------------
const citext = customType<{ data: string }>({ dataType: () => 'citext' });
const tsvector = customType<{ data: string }>({ dataType: () => 'tsvector' });
const vector1536 = customType<{ data: number[]; driverData: string }>({
  dataType: () => 'vector(1536)',
});

// ---------------------------------------------------------------------------
// 3. USERS & ACCOUNTS
// ---------------------------------------------------------------------------

// profiles.id references auth.users(id). Drizzle has no model for the
// Supabase auth schema, so the FK to auth.users is enforced at the DB layer
// only (see SQL migration). Here it's a plain uuid primary key.
export const profiles = pgTable('pk_profiles',
  {
    id: uuid('id').primaryKey(),
    username: citext('username').notNull().unique(),
    displayName: text('display_name'),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    githubHandle: citext('github_handle'),
    twitterHandle: citext('twitter_handle'),
    websiteUrl: text('website_url'),
    location: text('location'),
    isVerifiedAuthor: boolean('is_verified_author').default(false).notNull(),
    subscriptionTier: subscriptionTierEnum('subscription_tier').default('free').notNull(),
    stripeCustomerId: text('stripe_customer_id').unique(),
    stripeSubscriptionId: text('stripe_subscription_id').unique(),
    subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
    proStartedAt: timestamp('pro_started_at', { withTimezone: true }),
    totalResourcesPublished: integer('total_resources_published').default(0).notNull(),
    totalInstallsReferred: integer('total_installs_referred').default(0).notNull(),
    reputationScore: integer('reputation_score').default(0).notNull(),
    emailNotificationsEnabled: boolean('email_notifications_enabled').default(true).notNull(),
    weeklyDigestEnabled: boolean('weekly_digest_enabled').default(true).notNull(),
    breakingNewsEnabled: boolean('breaking_news_enabled').default(false).notNull(),
    dailyRoundupEnabled: boolean('daily_roundup_enabled').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    usernameFormat: check('username_format', sql`${t.username} ~* '^[a-z0-9_-]{2,32}$'`),
    githubFormat: check(
      'github_format',
      sql`${t.githubHandle} is null or ${t.githubHandle} ~* '^[a-z0-9-]{1,39}$'`,
    ),
  }),
);

export const userStacks = pgTable('pk_user_stacks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    slug: text('slug'),
    aiClients: aiClientEnum('ai_clients').array().default([]).notNull(),
    techStack: text('tech_stack').array().default([]).notNull(),
    hardwareProfile: jsonb('hardware_profile').default({}),
    description: text('description'),
    curatorNotes: text('curator_notes'),
    resourceIds: uuid('resource_ids').array().default([]).notNull(),
    adoptionCount: integer('adoption_count').default(0).notNull(),
    forkCount: integer('fork_count').default(0).notNull(),
    forkedFromId: uuid('forked_from_id').references((): AnyPgColumn => userStacks.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    publicNeedsSlug: check('public_needs_slug', sql`${t.isPublic} = false or ${t.slug} is not null`),
    slugFormat: check(
      'slug_format',
      sql`${t.slug} is null or ${t.slug} ~* '^[a-z0-9-]{2,64}$'`,
    ),
    userSlugUniq: uniqueIndex('user_stacks_user_slug_uniq')
      .on(t.userId, t.slug)
      .where(sql`slug is not null`),
    userIdx: index('user_stacks_user_idx')
      .on(t.userId)
      .where(sql`deleted_at is null`),
    publicIdx: index('user_stacks_public_idx')
      .on(t.isPublic, t.adoptionCount.desc())
      .where(sql`is_public = true and deleted_at is null`),
  }),
);

export const apiKeys = pgTable('pk_api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    keyPrefix: text('key_prefix').notNull(),
    keyHash: text('key_hash').notNull(),
    scopes: text('scopes').array().default(['read']).notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('api_keys_user_idx').on(t.userId),
    hashUniq: uniqueIndex('api_keys_hash_uniq').on(t.keyHash),
  }),
);

// ---------------------------------------------------------------------------
// 4. RESOURCES (the spine)
// ---------------------------------------------------------------------------

// search_vector is a generated column in the DB:
//   tsvector generated always as (to_tsvector('english', name || tagline || ...)) stored
// Drizzle types only see the column shape; the SQL migration is authoritative
// for the generation expression.
export const resources = pgTable('pk_resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    typeSlug: resourceTypeEnum('type_slug').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    tagline: text('tagline'),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),
    heroImageUrl: text('hero_image_url'),
    authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'set null' }),
    authorHandle: text('author_handle'),
    sourceUrl: text('source_url'),
    homepageUrl: text('homepage_url'),
    docsUrl: text('docs_url'),
    currentVersion: text('current_version'),
    releasedAt: timestamp('released_at', { withTimezone: true }),
    license: licenseKindEnum('license').default('unknown').notNull(),
    licenseText: text('license_text'),
    compatibleClients: aiClientEnum('compatible_clients').array().default([]).notNull(),
    stackTags: text('stack_tags').array().default([]).notNull(),
    status: publishStatusEnum('status').default('draft').notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    isOpenWeights: boolean('is_open_weights').default(false).notNull(),
    installCountTotal: integer('install_count_total').default(0).notNull(),
    installCount7d: integer('install_count_7d').default(0).notNull(),
    installCount30d: integer('install_count_30d').default(0).notNull(),
    viewCountTotal: integer('view_count_total').default(0).notNull(),
    viewCount7d: integer('view_count_7d').default(0).notNull(),
    bookmarkCount: integer('bookmark_count').default(0).notNull(),
    forkCount: integer('fork_count').default(0).notNull(),
    reviewCount: integer('review_count').default(0).notNull(),
    ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }),
    healthScore: numeric('health_score', { precision: 3, scale: 2 }),
    trendingScore: numeric('trending_score', { precision: 10, scale: 4 }).default('0').notNull(),
    intelligenceRank: integer('intelligence_rank'),
    forkedFromId: uuid('forked_from_id').references((): AnyPgColumn => resources.id, {
      onDelete: 'set null',
    }),
    isOfficial: boolean('is_official').default(false).notNull(),
    reviewedBy: uuid('reviewed_by').references(() => profiles.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    rejectionReason: text('rejection_reason'),
    searchVector: tsvector('search_vector'),
    embedding: vector1536('embedding'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    slugFormat: check(
      'slug_format',
      sql`${t.slug} ~* '^[a-z0-9][a-z0-9-]*[a-z0-9]$' or length(${t.slug}) = 1`,
    ),
    slugLength: check('slug_length', sql`length(${t.slug}) between 1 and 80`),
    nameLength: check('name_length', sql`length(${t.name}) between 1 and 200`),
    ratingRange: check(
      'rating_range',
      sql`${t.ratingAvg} is null or ${t.ratingAvg} between 0 and 5`,
    ),
    healthRange: check(
      'health_range',
      sql`${t.healthScore} is null or ${t.healthScore} between 0 and 1`,
    ),
    typeSlugUniq: uniqueIndex('resources_type_slug_uniq')
      .on(t.typeSlug, t.slug)
      .where(sql`deleted_at is null`),
    typeIdx: index('resources_type_idx')
      .on(t.typeSlug, t.status)
      .where(sql`deleted_at is null`),
    authorIdx: index('resources_author_idx')
      .on(t.authorId)
      .where(sql`deleted_at is null`),
    trendingIdx: index('resources_trending_idx')
      .on(t.typeSlug, t.trendingScore.desc())
      .where(sql`status = 'published' and deleted_at is null`),
    searchIdx: index('resources_search_idx').using('gin', t.searchVector),
    embeddingIdx: index('resources_embedding_idx').using(
      'ivfflat',
      sql`${t.embedding} vector_cosine_ops`,
    ),
    compatIdx: index('resources_compat_idx').using('gin', t.compatibleClients),
    stackIdx: index('resources_stack_idx').using('gin', t.stackTags),
    featuredIdx: index('resources_featured_idx')
      .on(t.typeSlug, t.isFeatured)
      .where(sql`is_featured = true and deleted_at is null`),
    openWeightsIdx: index('resources_open_weights_idx')
      .on(t.isOpenWeights)
      .where(sql`is_open_weights = true and deleted_at is null`),
  }),
);

export const resourceVersions = pgTable('pk_resource_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    version: text('version').notNull(),
    changelog: text('changelog'),
    releasedAt: timestamp('released_at', { withTimezone: true }).defaultNow().notNull(),
    isBreaking: boolean('is_breaking').default(false).notNull(),
    sourceUrl: text('source_url'),
    installCommand: text('install_command'),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniq: uniqueIndex('resource_versions_uniq').on(t.resourceId, t.version),
    resourceIdx: index('resource_versions_resource_idx').on(t.resourceId, t.releasedAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 5. TYPE-SPECIFIC EXTENSION TABLES
// ---------------------------------------------------------------------------

export const components = pgTable('pk_components', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  framework: text('framework').notNull(),
  styling: text('styling'),
  hasDarkMode: boolean('has_dark_mode').default(false).notNull(),
  isResponsive: boolean('is_responsive').default(false).notNull(),
  isAccessible: boolean('is_accessible').default(false).notNull(),
  sourceCode: text('source_code'),
  dependencies: jsonb('dependencies').default([]),
  variants: jsonb('variants').default([]),
  installCommand: text('install_command'),
  registryUrl: text('registry_url'),
  previewUrl: text('preview_url'),
  sandpackTemplate: text('sandpack_template').default('react'),
});

export const mcps = pgTable('pk_mcps', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  transport: text('transport').array().default(['stdio']).notNull(),
  authKind: text('auth_kind').default('none').notNull(),
  sourceLanguage: text('source_language'),
  toolCount: integer('tool_count').default(0).notNull(),
  tools: jsonb('tools').default([]),
  installConfigs: jsonb('install_configs').default({}),
  oauthScopes: text('oauth_scopes').array().default([]),
  uptimePct: numeric('uptime_pct', { precision: 5, scale: 2 }),
  p50LatencyMs: integer('p50_latency_ms'),
  p95LatencyMs: integer('p95_latency_ms'),
});

export const models = pgTable('pk_models', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  modelFamily: text('model_family'),
  contextWindowAdvertised: integer('context_window_advertised'),
  contextWindowEffective: integer('context_window_effective'),
  outputMaxTokens: integer('output_max_tokens'),
  knowledgeCutoff: date('knowledge_cutoff'),
  priceInputPerMtok: numeric('price_input_per_mtok', { precision: 10, scale: 4 }),
  priceOutputPerMtok: numeric('price_output_per_mtok', { precision: 10, scale: 4 }),
  priceCachedPerMtok: numeric('price_cached_per_mtok', { precision: 10, scale: 4 }),
  priceReasoningPerMtok: numeric('price_reasoning_per_mtok', { precision: 10, scale: 4 }),
  batchDiscountPct: numeric('batch_discount_pct', { precision: 5, scale: 2 }),
  blendedCostPerMtok: numeric('blended_cost_per_mtok', { precision: 10, scale: 4 }),
  supportsTools: boolean('supports_tools').default(false).notNull(),
  supportsParallelTools: boolean('supports_parallel_tools').default(false).notNull(),
  supportsVision: boolean('supports_vision').default(false).notNull(),
  supportsAudio: boolean('supports_audio').default(false).notNull(),
  supportsPdf: boolean('supports_pdf').default(false).notNull(),
  supportsJsonMode: boolean('supports_json_mode').default(false).notNull(),
  supportsCaching: boolean('supports_caching').default(false).notNull(),
  supportsBatch: boolean('supports_batch').default(false).notNull(),
  supportsFinetuning: boolean('supports_finetuning').default(false).notNull(),
  supportsReasoning: boolean('supports_reasoning').default(false).notNull(),
  supportsComputerUse: boolean('supports_computer_use').default(false).notNull(),
  outputTokensPerSecond: numeric('output_tokens_per_second', { precision: 8, scale: 2 }),
  ttftMs: integer('ttft_ms'),
  intelligenceIndex: numeric('intelligence_index', { precision: 5, scale: 2 }),
  parametersBillions: numeric('parameters_billions', { precision: 8, scale: 2 }),
  architecture: text('architecture'),
  tokenizer: text('tokenizer'),
  huggingfaceId: text('huggingface_id'),
  recommendedQuantization: text('recommended_quantization'),
  isHipaaCompliant: boolean('is_hipaa_compliant').default(false).notNull(),
  isSoc2Compliant: boolean('is_soc2_compliant').default(false).notNull(),
  dataRetentionDays: integer('data_retention_days'),
  availableRegions: text('available_regions').array().default([]).notNull(),
  euAiActTier: text('eu_ai_act_tier'),
});

export const modelPriceHistory = pgTable('pk_model_price_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    modelId: uuid('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    effectiveAt: timestamp('effective_at', { withTimezone: true }).notNull(),
    priceInputPerMtok: numeric('price_input_per_mtok', { precision: 10, scale: 4 }),
    priceOutputPerMtok: numeric('price_output_per_mtok', { precision: 10, scale: 4 }),
    priceCachedPerMtok: numeric('price_cached_per_mtok', { precision: 10, scale: 4 }),
    priceReasoningPerMtok: numeric('price_reasoning_per_mtok', { precision: 10, scale: 4 }),
    source: text('source'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    modelIdx: index('model_price_history_model_idx').on(t.modelId, t.effectiveAt.desc()),
  }),
);

export const modelProviders = pgTable('pk_model_providers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    modelId: uuid('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    providerName: text('provider_name').notNull(),
    providerUrl: text('provider_url'),
    priceInputPerMtok: numeric('price_input_per_mtok', { precision: 10, scale: 4 }),
    priceOutputPerMtok: numeric('price_output_per_mtok', { precision: 10, scale: 4 }),
    contextWindow: integer('context_window'),
    rateLimitRpm: integer('rate_limit_rpm'),
    rateLimitTpm: integer('rate_limit_tpm'),
    latencyMs: integer('latency_ms'),
    uptimePct: numeric('uptime_pct', { precision: 5, scale: 2 }),
    isOfficial: boolean('is_official').default(false).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniq: uniqueIndex('model_providers_uniq').on(t.modelId, t.providerName),
  }),
);

export const modelBenchmarks = pgTable('pk_model_benchmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    modelId: uuid('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    benchmarkName: text('benchmark_name').notNull(),
    score: numeric('score', { precision: 8, scale: 4 }),
    scoreKind: text('score_kind').default('percentage'),
    methodology: text('methodology'),
    sourceUrl: text('source_url'),
    confidence: integer('confidence').default(1),
    measuredAt: date('measured_at'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    modelIdx: index('model_benchmarks_model_idx').on(t.modelId),
  }),
);

export const skills = pgTable('pk_skills', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  skillMd: text('skill_md').notNull(),
  frontmatter: jsonb('frontmatter').default({}),
  allowedTools: text('allowed_tools').array().default([]),
  disableModelInvocation: boolean('disable_model_invocation').default(false).notNull(),
  triggerExamples: text('trigger_examples').array().default([]),
});

export const subagents = pgTable('pk_subagents', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  agentMd: text('agent_md').notNull(),
  frontmatter: jsonb('frontmatter').default({}),
  toolsAllowed: text('tools_allowed').array().default([]),
  modelAssignment: text('model_assignment').default('inherit'),
  useProactively: boolean('use_proactively').default(false).notNull(),
  contextIsolated: boolean('context_isolated').default(true).notNull(),
  triggerExamples: text('trigger_examples').array().default([]),
});

export const scripts = pgTable('pk_scripts', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  sourceCode: text('source_code').notNull(),
  entrypoint: text('entrypoint'),
  argsSchema: jsonb('args_schema').default([]),
  osSupport: text('os_support').array().default([]),
  permissionsRequired: jsonb('permissions_required').default([]),
  installMethod: installMethodEnum('install_method').array(),
});

export const rules = pgTable('pk_rules', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  format: text('format').notNull(),
  content: text('content').notNull(),
  scope: text('scope').default('project'),
  globs: text('globs').array().default([]),
  lineCount: integer('line_count').default(0).notNull(),
  perIdeCompatibility: jsonb('per_ide_compatibility').default({}),
});

export const prompts = pgTable('pk_prompts', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  promptTemplate: text('prompt_template').notNull(),
  variables: jsonb('variables').default([]),
  variationKind: text('variation_kind'),
  bestFor: text('best_for').array().default([]),
  exampleOutputs: jsonb('example_outputs').default([]),
});

export const plugins = pgTable('pk_plugins', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  marketplaceId: uuid('marketplace_id').references(() => resources.id, { onDelete: 'set null' }),
  bundledResources: uuid('bundled_resources').array().default([]),
  bundledSkillsCount: integer('bundled_skills_count').default(0).notNull(),
  bundledMcpsCount: integer('bundled_mcps_count').default(0).notNull(),
  bundledCommandsCount: integer('bundled_commands_count').default(0).notNull(),
  bundledHooksCount: integer('bundled_hooks_count').default(0).notNull(),
  bundledAgentsCount: integer('bundled_agents_count').default(0).notNull(),
  installCommand: text('install_command'),
});

export const marketplaces = pgTable('pk_marketplaces', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  curatorHandle: text('curator_handle'),
  githubRepo: text('github_repo').notNull(),
  addCommand: text('add_command'),
  pluginCount: integer('plugin_count').default(0).notNull(),
  subscriberCount: integer('subscriber_count').default(0).notNull(),
  philosophy: text('philosophy'),
});

export const hooks = pgTable('pk_hooks', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  event: text('event').notNull(),
  matcher: jsonb('matcher').default({}),
  language: text('language').notNull(),
  sourceCode: text('source_code').notNull(),
  configSnippet: jsonb('config_snippet'),
});

export const commands = pgTable('pk_commands', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  commandSyntax: text('command_syntax').notNull(),
  argsSchema: jsonb('args_schema').default([]),
  commandMd: text('command_md').notNull(),
  invokesSubagentId: uuid('invokes_subagent_id').references(() => resources.id, {
    onDelete: 'set null',
  }),
  sampleInvocations: text('sample_invocations').array().default([]),
});

export const starters = pgTable('pk_starters', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  framework: text('framework').notNull(),
  hasCursorrules: boolean('has_cursorrules').default(false).notNull(),
  hasClaudeMd: boolean('has_claude_md').default(false).notNull(),
  hasAgentsMd: boolean('has_agents_md').default(false).notNull(),
  rulesFileId: uuid('rules_file_id').references(() => resources.id, { onDelete: 'set null' }),
  bundledBackendKitIds: uuid('bundled_backend_kit_ids').array().default([]),
  deployTargets: text('deploy_targets').array().default([]),
  demoUrl: text('demo_url'),
  githubCloneUrl: text('github_clone_url'),
  costToRunPerMonthUsd: numeric('cost_to_run_per_month_usd', { precision: 8, scale: 2 }),
  timeToFirstDeployMedianMinutes: integer('time_to_first_deploy_median_minutes'),
  deployCount24h: integer('deploy_count_24h').default(0).notNull(),
});

export const tools = pgTable('pk_tools', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  platforms: text('platforms').array().default([]),
  pricingTiers: jsonb('pricing_tiers').default([]),
  modelsSupported: uuid('models_supported').array().default([]),
  byokSupported: boolean('byok_supported').default(false).notNull(),
  isOpenSource: boolean('is_open_source').default(false).notNull(),
  openInUrlScheme: text('open_in_url_scheme'),
  downloadUrls: jsonb('download_urls').default({}),
});

export const sandboxes = pgTable('pk_sandboxes', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  coldStartMs: integer('cold_start_ms'),
  maxSessionSeconds: integer('max_session_seconds'),
  hasGpu: boolean('has_gpu').default(false).notNull(),
  hasPersistence: boolean('has_persistence').default(false).notNull(),
  osImage: text('os_image'),
  pricingTiers: jsonb('pricing_tiers').default([]),
  useCases: text('use_cases').array().default([]),
  quickstartSnippet: text('quickstart_snippet'),
});

export const observability = pgTable('pk_observability', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  features: text('features').array().default([]),
  isSelfHostable: boolean('is_self_hostable').default(false).notNull(),
  hasFreeTier: boolean('has_free_tier').default(false).notNull(),
  pricingTiers: jsonb('pricing_tiers').default([]),
  integrations: text('integrations').array().default([]),
  complianceCerts: text('compliance_certs').array().default([]),
});

export const backendKits = pgTable('pk_backend_kits', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  hasFreeTier: boolean('has_free_tier').default(false).notNull(),
  shipsWithCursorrules: boolean('ships_with_cursorrules').default(false).notNull(),
  shipsWithClaudeMd: boolean('ships_with_claude_md').default(false).notNull(),
  shipsWithAgentsMd: boolean('ships_with_agents_md').default(false).notNull(),
  rulesFileId: uuid('rules_file_id').references(() => resources.id, { onDelete: 'set null' }),
  pricingTiers: jsonb('pricing_tiers').default([]),
  replaces: text('replaces').array().default([]),
  primaryLanguages: text('primary_languages').array().default([]),
});

export const assets = pgTable('pk_assets', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  assetCount: integer('asset_count').default(1).notNull(),
  formats: text('formats').array().default([]),
  downloadUrl: text('download_url'),
  previewUrl: text('preview_url'),
  attributionRequired: boolean('attribution_required').default(false).notNull(),
  commercialUseAllowed: boolean('commercial_use_allowed').default(true).notNull(),
});

export const showcase = pgTable('pk_showcase', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  liveUrl: text('live_url'),
  builtWithResourceIds: uuid('built_with_resource_ids').array().default([]),
  builderNotes: text('builder_notes'),
  buildTimeDays: integer('build_time_days'),
  screenshots: jsonb('screenshots').default([]),
  statsShared: boolean('stats_shared').default(false).notNull(),
  statsData: jsonb('stats_data').default({}),
});

export const docsForLlms = pgTable('pk_docs_for_llms', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  packageName: text('package_name').notNull(),
  docKind: text('doc_kind'),
  llmsTxtUrl: text('llms_txt_url').notNull(),
  totalPages: integer('total_pages'),
  totalTokens: integer('total_tokens'),
  lastCrawlAt: timestamp('last_crawl_at', { withTimezone: true }),
  crawlFrequency: text('crawl_frequency'),
  coverage: jsonb('coverage').default({}),
  provider: text('provider'),
});

export const specs = pgTable('pk_specs', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  specKind: text('spec_kind').notNull(),
  content: text('content').notNull(),
  wordCount: integer('word_count'),
  exampleFilledOut: text('example_filled_out'),
  bestFor: text('best_for').array().default([]),
});

export const workflows = pgTable('pk_workflows', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  outcome: text('outcome'),
  difficulty: difficultyEnum('difficulty').default('intermediate').notNull(),
  durationLabel: text('duration_label'),
  stepCount: integer('step_count').default(0).notNull(),
  steps: jsonb('steps').default([]),
  medianCompletionMinutes: integer('median_completion_minutes'),
  completionCount: integer('completion_count').default(0).notNull(),
});

export const evals = pgTable('pk_evals', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  benchmarkKind: text('benchmark_kind'),
  taskCount: integer('task_count'),
  isReproducible: boolean('is_reproducible').default(false).notNull(),
  leaderboardUrl: text('leaderboard_url'),
  methodology: text('methodology'),
  sampleTasks: jsonb('sample_tasks').default([]),
  reproduceCommand: text('reproduce_command'),
  critique: text('critique'),
});

// ---------------------------------------------------------------------------
// 6. SOCIAL & ENGAGEMENT
// ---------------------------------------------------------------------------

export const reviews = pgTable('pk_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    title: text('title'),
    body: text('body'),
    pros: text('pros').array().default([]),
    cons: text('cons').array().default([]),
    helpfulCount: integer('helpful_count').default(0).notNull(),
    unhelpfulCount: integer('unhelpful_count').default(0).notNull(),
    isVerifiedUser: boolean('is_verified_user').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    ratingRange: check('rating_range', sql`${t.rating} between 1 and 5`),
    resourceUserUniq: uniqueIndex('reviews_resource_user_uniq')
      .on(t.resourceId, t.userId)
      .where(sql`deleted_at is null`),
    resourceIdx: index('reviews_resource_idx')
      .on(t.resourceId, t.createdAt.desc())
      .where(sql`deleted_at is null`),
    userIdx: index('reviews_user_idx').on(t.userId),
  }),
);

export const reviewVotes = pgTable('pk_review_votes',
  {
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    reviewId: uuid('review_id').references(() => reviews.id, { onDelete: 'cascade' }),
    isHelpful: boolean('is_helpful').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.reviewId] }),
  }),
);

// comments.news_id FK and comments.parent_comment_id self-FK use lazy
// callbacks. The news FK is added by `alter table` in SQL, but Drizzle defines
// it inline via a forward reference to the `news` table below.
export const comments = pgTable('pk_comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    newsId: uuid('news_id').references((): AnyPgColumn => news.id, { onDelete: 'cascade' }),
    parentCommentId: uuid('parent_comment_id').references((): AnyPgColumn => comments.id, {
      onDelete: 'cascade',
    }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    upvoteCount: integer('upvote_count').default(0).notNull(),
    downvoteCount: integer('downvote_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    commentTarget: check(
      'comment_target',
      sql`${t.resourceId} is not null or ${t.newsId} is not null`,
    ),
    resourceIdx: index('comments_resource_idx')
      .on(t.resourceId)
      .where(sql`deleted_at is null`),
    newsIdx: index('comments_news_idx')
      .on(t.newsId)
      .where(sql`deleted_at is null`),
    userIdx: index('comments_user_idx').on(t.userId),
  }),
);

export const promptingTips = pgTable('pk_prompting_tips',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    tip: text('tip').notNull(),
    upvoteCount: integer('upvote_count').default(0).notNull(),
    isCuratorPinned: boolean('is_curator_pinned').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceIdx: index('prompting_tips_resource_idx').on(t.resourceId, t.upvoteCount.desc()),
  }),
);

// bookmarks.collection_id FK is added via `alter table` in SQL after
// collections is declared. Drizzle uses a lazy callback to the forward ref.
export const bookmarks = pgTable('pk_bookmarks',
  {
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id').references((): AnyPgColumn => collections.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.resourceId] }),
    userIdx: index('bookmarks_user_idx').on(t.userId, t.createdAt.desc()),
  }),
);

export const collections = pgTable('pk_collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false).notNull(),
    slug: text('slug'),
    resourceCount: integer('resource_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    publicNeedsSlug: check('public_needs_slug', sql`${t.isPublic} = false or ${t.slug} is not null`),
    userIdx: index('collections_user_idx')
      .on(t.userId)
      .where(sql`deleted_at is null`),
  }),
);

export const compatibilityReports = pgTable('pk_compatibility_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    client: aiClientEnum('client').notNull(),
    clientVersion: text('client_version'),
    status: compatStatusEnum('status').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceIdx: index('compatibility_reports_resource_idx').on(t.resourceId, t.client),
  }),
);

export const resourceDependencies = pgTable('pk_resource_dependencies',
  {
    parentId: uuid('parent_id').references(() => resources.id, { onDelete: 'cascade' }),
    childId: uuid('child_id').references(() => resources.id, { onDelete: 'cascade' }),
    relation: text('relation').notNull(),
    weight: numeric('weight', { precision: 5, scale: 4 }).default('1.0').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.parentId, t.childId, t.relation] }),
    childIdx: index('resource_dependencies_child_idx').on(t.childId, t.relation),
  }),
);

export const resourceAlternatives = pgTable('pk_resource_alternatives',
  {
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    alternativeId: uuid('alternative_id').references(() => resources.id, { onDelete: 'cascade' }),
    kind: alternativeKindEnum('kind').notNull(),
    deltaSummary: text('delta_summary'),
    weight: numeric('weight', { precision: 5, scale: 4 }).default('1.0').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.resourceId, t.alternativeId, t.kind] }),
    kindIdx: index('resource_alternatives_kind_idx').on(t.resourceId, t.kind, t.weight.desc()),
  }),
);

export const useCases = pgTable('pk_use_cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    heroCopy: text('hero_copy'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugFormat: check('slug_format', sql`${t.slug} ~* '^[a-z0-9-]+$'`),
  }),
);

export const bestFor = pgTable('pk_best_for',
  {
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    useCaseId: uuid('use_case_id').references(() => useCases.id, { onDelete: 'cascade' }),
    rank: integer('rank').notNull(),
    reasoning: text('reasoning'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.resourceId, t.useCaseId] }),
    useCaseIdx: index('best_for_use_case_idx').on(t.useCaseId, t.rank),
  }),
);

// ---------------------------------------------------------------------------
// 7. DEALS
// ---------------------------------------------------------------------------

export const deals = pgTable('pk_deals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    tagline: text('tagline'),
    providerName: text('provider_name').notNull(),
    providerLogoUrl: text('provider_logo_url'),
    category: text('category'),
    tier: dealTierEnum('tier').default('public').notNull(),
    status: dealStatusEnum('status').default('active').notNull(),
    valueAmountUsd: numeric('value_amount_usd', { precision: 12, scale: 2 }),
    valueLabel: text('value_label'),
    description: text('description'),
    eligibilityCriteria: jsonb('eligibility_criteria').default([]),
    approvalRatePct: numeric('approval_rate_pct', { precision: 5, scale: 2 }),
    avgApprovalDays: numeric('avg_approval_days', { precision: 5, scale: 2 }),
    applyUrl: text('apply_url').notNull(),
    referralCode: text('referral_code'),
    redemptionSteps: text('redemption_steps'),
    commonRejectionReasons: text('common_rejection_reasons').array().default([]),
    relatedResourceId: uuid('related_resource_id').references(() => resources.id, {
      onDelete: 'set null',
    }),
    claimCountTotal: integer('claim_count_total').default(0).notNull(),
    claimCount30d: integer('claim_count_30d').default(0).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    featuredUntil: timestamp('featured_until', { withTimezone: true }),
    isFeatured: boolean('is_featured').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    slugFormat: check('slug_format', sql`${t.slug} ~* '^[a-z0-9-]+$'`),
    statusIdx: index('deals_status_idx')
      .on(t.status, t.tier)
      .where(sql`deleted_at is null`),
    featuredIdx: index('deals_featured_idx')
      .on(t.isFeatured)
      .where(sql`is_featured = true and deleted_at is null`),
    categoryIdx: index('deals_category_idx')
      .on(t.category)
      .where(sql`deleted_at is null`),
    expiresIdx: index('deals_expires_idx')
      .on(t.expiresAt)
      .where(sql`status = 'active' and deleted_at is null`),
  }),
);

export const dealClaims = pgTable('pk_deal_claims',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    dealId: uuid('deal_id')
      .notNull()
      .references(() => deals.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    status: claimStatusEnum('status').default('started').notNull(),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
    approvalNotes: text('approval_notes'),
    communityReviewText: text('community_review_text'),
    communityReviewRating: integer('community_review_rating'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    ratingRange: check(
      'rating_range',
      sql`${t.communityReviewRating} is null or ${t.communityReviewRating} between 1 and 5`,
    ),
    userDealUniq: uniqueIndex('deal_claims_user_deal_uniq').on(t.userId, t.dealId),
    userIdx: index('deal_claims_user_idx').on(t.userId, t.createdAt.desc()),
    dealIdx: index('deal_claims_deal_idx').on(t.dealId, t.status),
  }),
);

// ---------------------------------------------------------------------------
// 8. NEWS
// ---------------------------------------------------------------------------

export const news = pgTable('pk_news',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    summary: text('summary'),
    body: text('body'),
    heroImageUrl: text('hero_image_url'),
    kind: newsKindEnum('kind').notNull(),
    sourceKind: newsSourceKindEnum('source_kind').notNull(),
    sourceName: text('source_name'),
    sourceUrl: text('source_url'),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
    readingTimeMinutes: integer('reading_time_minutes'),
    isBreaking: boolean('is_breaking').default(false).notNull(),
    isPinned: boolean('is_pinned').default(false).notNull(),
    pinnedUntil: timestamp('pinned_until', { withTimezone: true }),
    relatedResourceIds: uuid('related_resource_ids').array().default([]),
    topics: text('topics').array().default([]),
    viewCount: integer('view_count').default(0).notNull(),
    authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    slugFormat: check('slug_format', sql`${t.slug} ~* '^[a-z0-9-]+$'`),
    publishedIdx: index('news_published_idx')
      .on(t.publishedAt.desc())
      .where(sql`deleted_at is null`),
    kindIdx: index('news_kind_idx')
      .on(t.kind, t.publishedAt.desc())
      .where(sql`deleted_at is null`),
    breakingIdx: index('news_breaking_idx')
      .on(t.isBreaking, t.publishedAt.desc())
      .where(sql`is_breaking = true and deleted_at is null`),
    pinnedIdx: index('news_pinned_idx')
      .on(t.isPinned)
      .where(sql`is_pinned = true and deleted_at is null`),
    topicsIdx: index('news_topics_idx').using('gin', t.topics),
  }),
);

export const newsletterSubscribers = pgTable('pk_newsletter_subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: citext('email').notNull().unique(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    frequency: text('frequency').default('weekly').notNull(),
    topics: text('topics').array().default([]),
    unsubscribeToken: text('unsubscribe_token')
      .notNull()
      .unique()
      .default(sql`encode(gen_random_bytes(24), 'hex')`),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
    bounceCount: integer('bounce_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    activeIdx: index('newsletter_subscribers_active_idx')
      .on(t.frequency)
      .where(sql`unsubscribed_at is null`),
  }),
);

// ---------------------------------------------------------------------------
// 9. GUIDES
// ---------------------------------------------------------------------------

export const guides = pgTable('pk_guides',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    kind: guideKindEnum('kind').notNull(),
    difficulty: difficultyEnum('difficulty').default('beginner').notNull(),
    durationMinutes: integer('duration_minutes'),
    prerequisites: text('prerequisites'),
    osSupport: text('os_support').array().default([]),
    clientSupport: aiClientEnum('client_support').array().default([]),
    runtime: text('runtime'),
    body: text('body').notNull(),
    stepCount: integer('step_count').default(0).notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    completionCount: integer('completion_count').default(0).notNull(),
    completionRatePct: numeric('completion_rate_pct', { precision: 5, scale: 2 }),
    lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
    verifiedBy: uuid('verified_by').references(() => profiles.id, { onDelete: 'set null' }),
    isPublished: boolean('is_published').default(false).notNull(),
    authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    slugFormat: check('slug_format', sql`${t.slug} ~* '^[a-z0-9-]+$'`),
    resourceSlugUniq: uniqueIndex('guides_resource_slug_uniq')
      .on(t.resourceId, t.slug)
      .where(sql`deleted_at is null`),
    resourceIdx: index('guides_resource_idx')
      .on(t.resourceId)
      .where(sql`deleted_at is null`),
    kindIdx: index('guides_kind_idx').on(t.kind, t.difficulty),
  }),
);

export const guideSteps = pgTable('pk_guide_steps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guideId: uuid('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    stepOrder: integer('step_order').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    command: text('command'),
    verifierKind: text('verifier_kind'),
    verifierCommand: text('verifier_command'),
    verifierExpectedPattern: text('verifier_expected_pattern'),
    estimatedSeconds: integer('estimated_seconds'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniq: uniqueIndex('guide_steps_uniq').on(t.guideId, t.stepOrder),
  }),
);

export const guideCompletions = pgTable('pk_guide_completions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guideId: uuid('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    sessionId: uuid('session_id').notNull(),
    stepsCompleted: integer('steps_completed').default(0).notNull(),
    totalSteps: integer('total_steps').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    abandonedAtStep: integer('abandoned_at_step'),
    failureReason: text('failure_reason'),
    durationSeconds: integer('duration_seconds'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    guideIdx: index('guide_completions_guide_idx').on(t.guideId, t.createdAt.desc()),
    userIdx: index('guide_completions_user_idx').on(t.userId),
  }),
);

// ---------------------------------------------------------------------------
// 10. INSTALL & EVENTS
// ---------------------------------------------------------------------------

export const installEvents = pgTable('pk_install_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    sessionId: uuid('session_id'),
    client: aiClientEnum('client'),
    installMethod: installMethodEnum('install_method'),
    userStackId: uuid('user_stack_id').references(() => userStacks.id, { onDelete: 'set null' }),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    succeeded: boolean('succeeded').default(true).notNull(),
    failureReason: text('failure_reason'),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceIdx: index('install_events_resource_idx').on(t.resourceId, t.createdAt.desc()),
    userIdx: index('install_events_user_idx').on(t.userId),
    recentIdx: index('install_events_recent_idx').on(t.createdAt.desc()),
  }),
);

export const viewEvents = pgTable('pk_view_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    newsId: uuid('news_id').references(() => news.id, { onDelete: 'cascade' }),
    guideId: uuid('guide_id').references(() => guides.id, { onDelete: 'cascade' }),
    dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    sessionId: uuid('session_id'),
    referrer: text('referrer'),
    ipHash: text('ip_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    viewTarget: check(
      'view_target',
      sql`(${t.resourceId} is not null)::int + (${t.newsId} is not null)::int + (${t.guideId} is not null)::int + (${t.dealId} is not null)::int = 1`,
    ),
    resourceIdx: index('view_events_resource_idx').on(t.resourceId, t.createdAt.desc()),
    newsIdx: index('view_events_news_idx').on(t.newsId, t.createdAt.desc()),
  }),
);

export const userActivity = pgTable('pk_user_activity',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    activityKind: text('activity_kind').notNull(),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    recentIdx: index('user_activity_recent_idx').on(t.userId, t.createdAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 11. ALERTS & NOTIFICATIONS
// ---------------------------------------------------------------------------

export const alerts = pgTable('pk_alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    kind: alertKindEnum('kind').notNull(),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
    searchQuery: text('search_query'),
    searchFilters: jsonb('search_filters'),
    thresholdValue: numeric('threshold_value', { precision: 12, scale: 4 }),
    thresholdField: text('threshold_field'),
    status: alertStatusEnum('status').default('active').notNull(),
    triggeredAt: timestamp('triggered_at', { withTimezone: true }),
    triggeredCount: integer('triggered_count').default(0).notNull(),
    channels: notificationChannelEnum('channels')
      .array()
      .default(['in_app', 'email'])
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    userIdx: index('alerts_user_idx')
      .on(t.userId)
      .where(sql`status = 'active' and deleted_at is null`),
    resourceIdx: index('alerts_resource_idx')
      .on(t.resourceId)
      .where(sql`status = 'active' and deleted_at is null`),
  }),
);

export const notifications = pgTable('pk_notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    alertId: uuid('alert_id').references(() => alerts.id, { onDelete: 'set null' }),
    kind: text('kind').notNull(),
    title: text('title').notNull(),
    body: text('body'),
    linkUrl: text('link_url'),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userUnreadIdx: index('notifications_user_unread_idx')
      .on(t.userId, t.createdAt.desc())
      .where(sql`is_read = false`),
    userAllIdx: index('notifications_user_all_idx').on(t.userId, t.createdAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 12. CHANGE EVENTS
// ---------------------------------------------------------------------------

export const changeEvents = pgTable('pk_change_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(),
    fieldName: text('field_name'),
    oldValue: jsonb('old_value'),
    newValue: jsonb('new_value'),
    deltaPct: numeric('delta_pct', { precision: 8, scale: 4 }),
    isBreaking: boolean('is_breaking').default(false).notNull(),
    generatedNewsId: uuid('generated_news_id').references(() => news.id, { onDelete: 'set null' }),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceIdx: index('change_events_resource_idx').on(t.resourceId, t.createdAt.desc()),
    kindIdx: index('change_events_kind_idx').on(t.kind, t.createdAt.desc()),
    recentIdx: index('change_events_recent_idx').on(t.createdAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 13. GATEWAY
// ---------------------------------------------------------------------------

export const gatewaySecrets = pgTable('pk_gateway_secrets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    secretKind: text('secret_kind').notNull(),
    encryptedValue: text('encrypted_value').notNull(),
    encryptionKeyId: text('encryption_key_id').notNull(),
    metadata: jsonb('metadata').default({}),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => ({
    userNameUniq: uniqueIndex('gateway_secrets_user_name_uniq')
      .on(t.userId, t.name)
      .where(sql`revoked_at is null`),
    userIdx: index('gateway_secrets_user_idx')
      .on(t.userId)
      .where(sql`revoked_at is null`),
  }),
);

export const gatewaySubscriptions = pgTable('pk_gateway_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    config: jsonb('config').default({}),
    rateLimitRpm: integer('rate_limit_rpm').default(60).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    totalInvocations: integer('total_invocations').default(0).notNull(),
    lastInvocationAt: timestamp('last_invocation_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userResourceUniq: uniqueIndex('gateway_subscriptions_user_resource_uniq').on(
      t.userId,
      t.resourceId,
    ),
    userIdx: index('gateway_subscriptions_user_idx').on(t.userId),
  }),
);

export const gatewayInvocations = pgTable('pk_gateway_invocations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    client: aiClientEnum('client'),
    toolName: text('tool_name'),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    costUsd: numeric('cost_usd', { precision: 10, scale: 6 }),
    latencyMs: integer('latency_ms'),
    succeeded: boolean('succeeded').default(true).notNull(),
    failureReason: text('failure_reason'),
    requestHash: text('request_hash'),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('gateway_invocations_user_idx').on(t.userId, t.createdAt.desc()),
    resourceIdx: index('gateway_invocations_resource_idx').on(t.resourceId, t.createdAt.desc()),
    recentIdx: index('gateway_invocations_recent_idx').on(t.createdAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 14. SUBMISSIONS
// ---------------------------------------------------------------------------

export const submissions = pgTable('pk_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'set null' }),
    typeSlug: resourceTypeEnum('type_slug').notNull(),
    sourceUrl: text('source_url'),
    detectedMetadata: jsonb('detected_metadata').default({}),
    userMetadata: jsonb('user_metadata').default({}),
    status: publishStatusEnum('status').default('draft').notNull(),
    reviewedBy: uuid('reviewed_by').references(() => profiles.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewOutcome: reviewOutcomeEnum('review_outcome'),
    rejectionReason: text('rejection_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('submissions_user_idx').on(t.userId, t.createdAt.desc()),
    statusIdx: index('submissions_status_idx').on(t.status, t.createdAt.desc()),
  }),
);

// ---------------------------------------------------------------------------
// 15. SAVED SEARCHES & COMPARISONS
// ---------------------------------------------------------------------------

export const savedSearches = pgTable('pk_saved_searches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    query: text('query'),
    filters: jsonb('filters').default({}),
    alertId: uuid('alert_id').references(() => alerts.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('saved_searches_user_idx').on(t.userId),
  }),
);

export const comparisons = pgTable('pk_comparisons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    resourceIds: uuid('resource_ids').array().notNull(),
    typeSlug: resourceTypeEnum('type_slug').notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    shareToken: text('share_token').unique().default(sql`encode(gen_random_bytes(12), 'hex')`),
    viewCount: integer('view_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceCount: check(
      'resource_count',
      sql`array_length(${t.resourceIds}, 1) between 2 and 6`,
    ),
    userIdx: index('comparisons_user_idx').on(t.userId),
    tokenIdx: index('comparisons_token_idx').on(t.shareToken),
  }),
);

// ---------------------------------------------------------------------------
// 12. DESIGN SYSTEMS — Session 20
// ---------------------------------------------------------------------------
// 25th resource type. Source: Airtable base appbUpVCXkuPCOo6y. Each row pairs
// a brand's design system (tokens, typography, voice, components) with the
// canonical pk_resources spine entry (one-to-one via FK on id).

export const designSystems = pgTable('pk_design_systems', {
  id: uuid('id')
    .primaryKey()
    .references(() => resources.id, { onDelete: 'cascade' }),
  domain: text('domain'),
  industry: text('industry'),
  brandDna: text('brand_dna'),
  quickStart: text('quick_start'),
  systemPrompt: text('system_prompt'),
  designTokensJson: jsonb('design_tokens_json'),
  primaryColors: jsonb('primary_colors'),
  secondaryColors: jsonb('secondary_colors'),
  accentColors: jsonb('accent_colors'),
  gradientLibrary: text('gradient_library'),
  headingFont: text('heading_font'),
  bodyFont: text('body_font'),
  fontStack: text('font_stack'),
  typeScale: jsonb('type_scale'),
  spacingScale: jsonb('spacing_scale'),
  radiusTokens: jsonb('radius_tokens'),
  shadowTokens: jsonb('shadow_tokens'),
  motionTokens: jsonb('motion_tokens'),
  iconographyStyle: text('iconography_style'),
  imageryStyle: text('imagery_style'),
  voiceAndTone: text('voice_and_tone'),
  sampleMicrocopy: text('sample_microcopy'),
  dos: text('dos'),
  donts: text('donts'),
  spacingLayout: text('spacing_layout'),
  componentExamples: text('component_examples'),
  templateHtml: text('template_html'),
  templateReact: text('template_react'),
  accessibilityNotes: text('accessibility_notes'),
  brandfetchId: text('brandfetch_id'),
  brandfetchConfidence: numeric('brandfetch_confidence', { precision: 5, scale: 4 }),
  qualityScore: integer('quality_score'),
  employeeCount: integer('employee_count'),
  foundedYear: integer('founded_year'),
  headquarters: text('headquarters'),
});
