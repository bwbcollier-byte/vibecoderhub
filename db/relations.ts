// Drizzle relations — enables typed eager-loading via:
//   db.query.profiles.findFirst({ with: { authoredResources: true } })
//
// Mirrors every foreign key declared in db/schema.ts. Operational tables
// (rate_limit_buckets, ingestion_runs) are standalone and don't appear here.
//
// Multiple-FK disambiguation uses `relationName`:
//   - resources.authorId + resources.reviewedBy both → profiles
//   - guides.authorId + guides.verifiedBy both → profiles
//   - submissions.userId + submissions.reviewedBy both → profiles
//   - resourceDependencies.parentId + .childId both → resources
//   - resourceAlternatives.resourceId + .alternativeId both → resources
//
// Self-references (matching pair on the same table):
//   - userStacks.forkedFromId → userStacks.id
//   - resources.forkedFromId → resources.id
//   - comments.parentCommentId → comments.id

import { relations } from 'drizzle-orm';

import {
  alerts,
  apiKeys,
  assets,
  backendKits,
  bestFor,
  bookmarks,
  changeEvents,
  collections,
  commands,
  comments,
  comparisons,
  compatibilityReports,
  components,
  dealClaims,
  deals,
  docsForLlms,
  evals,
  gatewayInvocations,
  gatewaySecrets,
  gatewaySubscriptions,
  guideCompletions,
  guideSteps,
  guides,
  hooks,
  installEvents,
  marketplaces,
  mcps,
  modelBenchmarks,
  modelPriceHistory,
  modelProviders,
  models,
  news,
  newsletterSubscribers,
  notifications,
  observability,
  plugins,
  profiles,
  promptingTips,
  prompts,
  resourceAlternatives,
  resourceDependencies,
  resourceVersions,
  resources,
  reviewVotes,
  reviews,
  rules,
  sandboxes,
  savedSearches,
  scripts,
  showcase,
  skills,
  specs,
  starters,
  subagents,
  submissions,
  tools,
  useCases,
  userActivity,
  userStacks,
  viewEvents,
  workflows,
} from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// USERS & ACCOUNTS
// ─────────────────────────────────────────────────────────────────────────────

export const profilesRelations = relations(profiles, ({ many }) => ({
  stacks: many(userStacks),
  apiKeys: many(apiKeys),
  authoredResources: many(resources, { relationName: 'resourceAuthor' }),
  reviewedResources: many(resources, { relationName: 'resourceReviewer' }),
  reviews: many(reviews),
  reviewVotes: many(reviewVotes),
  comments: many(comments),
  promptingTips: many(promptingTips),
  bookmarks: many(bookmarks),
  collections: many(collections),
  compatibilityReports: many(compatibilityReports),
  dealClaims: many(dealClaims),
  authoredNews: many(news),
  newsletterSubscriptions: many(newsletterSubscribers),
  verifiedGuides: many(guides, { relationName: 'guideVerifier' }),
  authoredGuides: many(guides, { relationName: 'guideAuthor' }),
  guideCompletions: many(guideCompletions),
  installEvents: many(installEvents),
  viewEvents: many(viewEvents),
  userActivity: many(userActivity),
  alerts: many(alerts),
  notifications: many(notifications),
  gatewaySecrets: many(gatewaySecrets),
  gatewaySubscriptions: many(gatewaySubscriptions),
  gatewayInvocations: many(gatewayInvocations),
  submissionsMade: many(submissions, { relationName: 'submissionAuthor' }),
  submissionsReviewed: many(submissions, { relationName: 'submissionReviewer' }),
  savedSearches: many(savedSearches),
  comparisons: many(comparisons),
}));

export const userStacksRelations = relations(userStacks, ({ one, many }) => ({
  user: one(profiles, {
    fields: [userStacks.userId],
    references: [profiles.id],
  }),
  forkedFrom: one(userStacks, {
    fields: [userStacks.forkedFromId],
    references: [userStacks.id],
    relationName: 'userStackFork',
  }),
  forks: many(userStacks, { relationName: 'userStackFork' }),
  installEvents: many(installEvents),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(profiles, {
    fields: [apiKeys.userId],
    references: [profiles.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES (the spine) + per-type extension tables
// ─────────────────────────────────────────────────────────────────────────────

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  author: one(profiles, {
    fields: [resources.authorId],
    references: [profiles.id],
    relationName: 'resourceAuthor',
  }),
  reviewer: one(profiles, {
    fields: [resources.reviewedBy],
    references: [profiles.id],
    relationName: 'resourceReviewer',
  }),
  forkedFrom: one(resources, {
    fields: [resources.forkedFromId],
    references: [resources.id],
    relationName: 'resourceFork',
  }),
  forks: many(resources, { relationName: 'resourceFork' }),

  // Type-specific extension (1:1 via shared PK)
  component: one(components),
  mcp: one(mcps),
  model: one(models),
  skill: one(skills),
  subagent: one(subagents),
  script: one(scripts),
  rule: one(rules),
  prompt: one(prompts),
  plugin: one(plugins),
  marketplace: one(marketplaces),
  hook: one(hooks),
  command: one(commands),
  starter: one(starters),
  tool: one(tools),
  sandbox: one(sandboxes),
  observability: one(observability),
  backendKit: one(backendKits),
  asset: one(assets),
  showcase: one(showcase),
  docsForLlms: one(docsForLlms),
  spec: one(specs),
  workflow: one(workflows),
  eval: one(evals),

  // Versions + cross-resource references
  versions: many(resourceVersions),
  pluginsInMarketplace: many(plugins, { relationName: 'pluginsMarketplace' }),
  commandsInvokingAsSubagent: many(commands, { relationName: 'commandSubagent' }),
  startersUsingAsRules: many(starters, { relationName: 'startersRules' }),
  backendKitsUsingAsRules: many(backendKits, { relationName: 'backendKitsRules' }),

  // Social + content edges
  reviews: many(reviews),
  comments: many(comments),
  promptingTips: many(promptingTips),
  bookmarks: many(bookmarks),
  compatibilityReports: many(compatibilityReports),
  dependencyParents: many(resourceDependencies, { relationName: 'depParent' }),
  dependencyChildren: many(resourceDependencies, { relationName: 'depChild' }),
  alternativesAsBase: many(resourceAlternatives, { relationName: 'altBase' }),
  alternativesAsAlt: many(resourceAlternatives, { relationName: 'altAlt' }),
  bestFor: many(bestFor),
  relatedDeals: many(deals, { relationName: 'dealRelatedResource' }),
  guides: many(guides),
  installEvents: many(installEvents),
  viewEvents: many(viewEvents),
  userActivity: many(userActivity),
  alerts: many(alerts),
  changeEvents: many(changeEvents),
  gatewaySubscriptions: many(gatewaySubscriptions),
  gatewayInvocations: many(gatewayInvocations),
  submissions: many(submissions),
}));

export const resourceVersionsRelations = relations(resourceVersions, ({ one }) => ({
  resource: one(resources, {
    fields: [resourceVersions.resourceId],
    references: [resources.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Type-specific extension tables — all 1:1 with `resources` via shared PK
// ─────────────────────────────────────────────────────────────────────────────

export const componentsRelations = relations(components, ({ one }) => ({
  resource: one(resources, { fields: [components.id], references: [resources.id] }),
}));

export const mcpsRelations = relations(mcps, ({ one }) => ({
  resource: one(resources, { fields: [mcps.id], references: [resources.id] }),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  resource: one(resources, { fields: [models.id], references: [resources.id] }),
  priceHistory: many(modelPriceHistory),
  providers: many(modelProviders),
  benchmarks: many(modelBenchmarks),
}));

export const modelPriceHistoryRelations = relations(modelPriceHistory, ({ one }) => ({
  model: one(models, {
    fields: [modelPriceHistory.modelId],
    references: [models.id],
  }),
}));

export const modelProvidersRelations = relations(modelProviders, ({ one }) => ({
  model: one(models, {
    fields: [modelProviders.modelId],
    references: [models.id],
  }),
}));

export const modelBenchmarksRelations = relations(modelBenchmarks, ({ one }) => ({
  model: one(models, {
    fields: [modelBenchmarks.modelId],
    references: [models.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  resource: one(resources, { fields: [skills.id], references: [resources.id] }),
}));

export const subagentsRelations = relations(subagents, ({ one }) => ({
  resource: one(resources, { fields: [subagents.id], references: [resources.id] }),
}));

export const scriptsRelations = relations(scripts, ({ one }) => ({
  resource: one(resources, { fields: [scripts.id], references: [resources.id] }),
}));

export const rulesRelations = relations(rules, ({ one }) => ({
  resource: one(resources, { fields: [rules.id], references: [resources.id] }),
}));

export const promptsRelations = relations(prompts, ({ one }) => ({
  resource: one(resources, { fields: [prompts.id], references: [resources.id] }),
}));

export const pluginsRelations = relations(plugins, ({ one }) => ({
  resource: one(resources, { fields: [plugins.id], references: [resources.id] }),
  marketplace: one(resources, {
    fields: [plugins.marketplaceId],
    references: [resources.id],
    relationName: 'pluginsMarketplace',
  }),
}));

export const marketplacesRelations = relations(marketplaces, ({ one }) => ({
  resource: one(resources, { fields: [marketplaces.id], references: [resources.id] }),
}));

export const hooksRelations = relations(hooks, ({ one }) => ({
  resource: one(resources, { fields: [hooks.id], references: [resources.id] }),
}));

export const commandsRelations = relations(commands, ({ one }) => ({
  resource: one(resources, { fields: [commands.id], references: [resources.id] }),
  invokesSubagent: one(resources, {
    fields: [commands.invokesSubagentId],
    references: [resources.id],
    relationName: 'commandSubagent',
  }),
}));

export const startersRelations = relations(starters, ({ one }) => ({
  resource: one(resources, { fields: [starters.id], references: [resources.id] }),
  rulesFile: one(resources, {
    fields: [starters.rulesFileId],
    references: [resources.id],
    relationName: 'startersRules',
  }),
}));

export const toolsRelations = relations(tools, ({ one }) => ({
  resource: one(resources, { fields: [tools.id], references: [resources.id] }),
}));

export const sandboxesRelations = relations(sandboxes, ({ one }) => ({
  resource: one(resources, { fields: [sandboxes.id], references: [resources.id] }),
}));

export const observabilityRelations = relations(observability, ({ one }) => ({
  resource: one(resources, { fields: [observability.id], references: [resources.id] }),
}));

export const backendKitsRelations = relations(backendKits, ({ one }) => ({
  resource: one(resources, { fields: [backendKits.id], references: [resources.id] }),
  rulesFile: one(resources, {
    fields: [backendKits.rulesFileId],
    references: [resources.id],
    relationName: 'backendKitsRules',
  }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  resource: one(resources, { fields: [assets.id], references: [resources.id] }),
}));

export const showcaseRelations = relations(showcase, ({ one }) => ({
  resource: one(resources, { fields: [showcase.id], references: [resources.id] }),
}));

export const docsForLlmsRelations = relations(docsForLlms, ({ one }) => ({
  resource: one(resources, { fields: [docsForLlms.id], references: [resources.id] }),
}));

export const specsRelations = relations(specs, ({ one }) => ({
  resource: one(resources, { fields: [specs.id], references: [resources.id] }),
}));

export const workflowsRelations = relations(workflows, ({ one }) => ({
  resource: one(resources, { fields: [workflows.id], references: [resources.id] }),
}));

export const evalsRelations = relations(evals, ({ one }) => ({
  resource: one(resources, { fields: [evals.id], references: [resources.id] }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL — reviews, comments, bookmarks, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  resource: one(resources, { fields: [reviews.resourceId], references: [resources.id] }),
  user: one(profiles, { fields: [reviews.userId], references: [profiles.id] }),
  votes: many(reviewVotes),
}));

export const reviewVotesRelations = relations(reviewVotes, ({ one }) => ({
  user: one(profiles, { fields: [reviewVotes.userId], references: [profiles.id] }),
  review: one(reviews, { fields: [reviewVotes.reviewId], references: [reviews.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  resource: one(resources, { fields: [comments.resourceId], references: [resources.id] }),
  news: one(news, { fields: [comments.newsId], references: [news.id] }),
  user: one(profiles, { fields: [comments.userId], references: [profiles.id] }),
  parent: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'commentThread',
  }),
  replies: many(comments, { relationName: 'commentThread' }),
}));

export const promptingTipsRelations = relations(promptingTips, ({ one }) => ({
  resource: one(resources, {
    fields: [promptingTips.resourceId],
    references: [resources.id],
  }),
  user: one(profiles, { fields: [promptingTips.userId], references: [profiles.id] }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(profiles, { fields: [bookmarks.userId], references: [profiles.id] }),
  resource: one(resources, {
    fields: [bookmarks.resourceId],
    references: [resources.id],
  }),
  collection: one(collections, {
    fields: [bookmarks.collectionId],
    references: [collections.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(profiles, { fields: [collections.userId], references: [profiles.id] }),
  bookmarks: many(bookmarks),
}));

export const compatibilityReportsRelations = relations(
  compatibilityReports,
  ({ one }) => ({
    resource: one(resources, {
      fields: [compatibilityReports.resourceId],
      references: [resources.id],
    }),
    user: one(profiles, {
      fields: [compatibilityReports.userId],
      references: [profiles.id],
    }),
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-RESOURCE EDGES — dependencies, alternatives, use cases, best-for
// ─────────────────────────────────────────────────────────────────────────────

export const resourceDependenciesRelations = relations(
  resourceDependencies,
  ({ one }) => ({
    parent: one(resources, {
      fields: [resourceDependencies.parentId],
      references: [resources.id],
      relationName: 'depParent',
    }),
    child: one(resources, {
      fields: [resourceDependencies.childId],
      references: [resources.id],
      relationName: 'depChild',
    }),
  }),
);

export const resourceAlternativesRelations = relations(
  resourceAlternatives,
  ({ one }) => ({
    resource: one(resources, {
      fields: [resourceAlternatives.resourceId],
      references: [resources.id],
      relationName: 'altBase',
    }),
    alternative: one(resources, {
      fields: [resourceAlternatives.alternativeId],
      references: [resources.id],
      relationName: 'altAlt',
    }),
  }),
);

export const useCasesRelations = relations(useCases, ({ many }) => ({
  bestFor: many(bestFor),
}));

export const bestForRelations = relations(bestFor, ({ one }) => ({
  resource: one(resources, {
    fields: [bestFor.resourceId],
    references: [resources.id],
  }),
  useCase: one(useCases, {
    fields: [bestFor.useCaseId],
    references: [useCases.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// DEALS
// ─────────────────────────────────────────────────────────────────────────────

export const dealsRelations = relations(deals, ({ one, many }) => ({
  relatedResource: one(resources, {
    fields: [deals.relatedResourceId],
    references: [resources.id],
    relationName: 'dealRelatedResource',
  }),
  claims: many(dealClaims),
  viewEvents: many(viewEvents),
  alerts: many(alerts),
  changeEvents: many(changeEvents),
}));

export const dealClaimsRelations = relations(dealClaims, ({ one }) => ({
  deal: one(deals, { fields: [dealClaims.dealId], references: [deals.id] }),
  user: one(profiles, { fields: [dealClaims.userId], references: [profiles.id] }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// NEWS + NEWSLETTER
// ─────────────────────────────────────────────────────────────────────────────

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(profiles, { fields: [news.authorId], references: [profiles.id] }),
  comments: many(comments),
  viewEvents: many(viewEvents),
  changeEventsGenerated: many(changeEvents),
}));

export const newsletterSubscribersRelations = relations(
  newsletterSubscribers,
  ({ one }) => ({
    user: one(profiles, {
      fields: [newsletterSubscribers.userId],
      references: [profiles.id],
    }),
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDES
// ─────────────────────────────────────────────────────────────────────────────

export const guidesRelations = relations(guides, ({ one, many }) => ({
  resource: one(resources, {
    fields: [guides.resourceId],
    references: [resources.id],
  }),
  verifier: one(profiles, {
    fields: [guides.verifiedBy],
    references: [profiles.id],
    relationName: 'guideVerifier',
  }),
  author: one(profiles, {
    fields: [guides.authorId],
    references: [profiles.id],
    relationName: 'guideAuthor',
  }),
  steps: many(guideSteps),
  completions: many(guideCompletions),
  viewEvents: many(viewEvents),
}));

export const guideStepsRelations = relations(guideSteps, ({ one }) => ({
  guide: one(guides, { fields: [guideSteps.guideId], references: [guides.id] }),
}));

export const guideCompletionsRelations = relations(guideCompletions, ({ one }) => ({
  guide: one(guides, {
    fields: [guideCompletions.guideId],
    references: [guides.id],
  }),
  user: one(profiles, {
    fields: [guideCompletions.userId],
    references: [profiles.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS — install, view, activity
// ─────────────────────────────────────────────────────────────────────────────

export const installEventsRelations = relations(installEvents, ({ one }) => ({
  resource: one(resources, {
    fields: [installEvents.resourceId],
    references: [resources.id],
  }),
  user: one(profiles, {
    fields: [installEvents.userId],
    references: [profiles.id],
  }),
  userStack: one(userStacks, {
    fields: [installEvents.userStackId],
    references: [userStacks.id],
  }),
}));

export const viewEventsRelations = relations(viewEvents, ({ one }) => ({
  resource: one(resources, {
    fields: [viewEvents.resourceId],
    references: [resources.id],
  }),
  news: one(news, { fields: [viewEvents.newsId], references: [news.id] }),
  guide: one(guides, { fields: [viewEvents.guideId], references: [guides.id] }),
  deal: one(deals, { fields: [viewEvents.dealId], references: [deals.id] }),
  user: one(profiles, { fields: [viewEvents.userId], references: [profiles.id] }),
}));

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(profiles, {
    fields: [userActivity.userId],
    references: [profiles.id],
  }),
  resource: one(resources, {
    fields: [userActivity.resourceId],
    references: [resources.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// ALERTS + NOTIFICATIONS + CHANGE EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export const alertsRelations = relations(alerts, ({ one, many }) => ({
  user: one(profiles, { fields: [alerts.userId], references: [profiles.id] }),
  resource: one(resources, {
    fields: [alerts.resourceId],
    references: [resources.id],
  }),
  deal: one(deals, { fields: [alerts.dealId], references: [deals.id] }),
  notifications: many(notifications),
  savedSearches: many(savedSearches),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
  alert: one(alerts, {
    fields: [notifications.alertId],
    references: [alerts.id],
  }),
}));

export const changeEventsRelations = relations(changeEvents, ({ one }) => ({
  resource: one(resources, {
    fields: [changeEvents.resourceId],
    references: [resources.id],
  }),
  deal: one(deals, { fields: [changeEvents.dealId], references: [deals.id] }),
  generatedNews: one(news, {
    fields: [changeEvents.generatedNewsId],
    references: [news.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// GATEWAY (Phase 2 surface, but FKs are real today)
// ─────────────────────────────────────────────────────────────────────────────

export const gatewaySecretsRelations = relations(gatewaySecrets, ({ one }) => ({
  user: one(profiles, {
    fields: [gatewaySecrets.userId],
    references: [profiles.id],
  }),
}));

export const gatewaySubscriptionsRelations = relations(
  gatewaySubscriptions,
  ({ one }) => ({
    user: one(profiles, {
      fields: [gatewaySubscriptions.userId],
      references: [profiles.id],
    }),
    resource: one(resources, {
      fields: [gatewaySubscriptions.resourceId],
      references: [resources.id],
    }),
  }),
);

export const gatewayInvocationsRelations = relations(
  gatewayInvocations,
  ({ one }) => ({
    user: one(profiles, {
      fields: [gatewayInvocations.userId],
      references: [profiles.id],
    }),
    resource: one(resources, {
      fields: [gatewayInvocations.resourceId],
      references: [resources.id],
    }),
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// SUBMISSIONS / SAVED SEARCHES / COMPARISONS
// ─────────────────────────────────────────────────────────────────────────────

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(profiles, {
    fields: [submissions.userId],
    references: [profiles.id],
    relationName: 'submissionAuthor',
  }),
  resource: one(resources, {
    fields: [submissions.resourceId],
    references: [resources.id],
  }),
  reviewer: one(profiles, {
    fields: [submissions.reviewedBy],
    references: [profiles.id],
    relationName: 'submissionReviewer',
  }),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(profiles, {
    fields: [savedSearches.userId],
    references: [profiles.id],
  }),
  alert: one(alerts, {
    fields: [savedSearches.alertId],
    references: [alerts.id],
  }),
}));

export const comparisonsRelations = relations(comparisons, ({ one }) => ({
  user: one(profiles, {
    fields: [comparisons.userId],
    references: [profiles.id],
  }),
}));
