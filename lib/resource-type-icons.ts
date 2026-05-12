import { Icon } from '@/components/icons/Icon';
import type { ResourceTypeId } from '@/lib/resource-types';

type IconComponent = (typeof Icon)[keyof typeof Icon];

const ICON_MAP: Record<ResourceTypeId, IconComponent> = {
  mcp: Icon.Package,
  model: Icon.Brain,
  skill: Icon.Zap,
  subagent: Icon.User,
  script: Icon.Play,
  rule: Icon.Lock,
  prompt: Icon.Edit,
  plugin: Icon.Plus,
  marketplace: Icon.Coins,
  hook: Icon.Bell,
  command: Icon.Command,
  starter: Icon.Rocket,
  tool: Icon.Wrench,
  sandbox: Icon.Package,
  observability: Icon.Eye,
  backend: Icon.Layers,
  asset: Icon.Layers,
  showcase: Icon.Star,
  docs_for_llms: Icon.Edit,
  spec: Icon.Edit,
  workflow: Icon.Refresh,
  eval: Icon.Check,
  stack: Icon.Layers,
  component: Icon.Layers,
};

export function iconForResourceType(typeId: ResourceTypeId): IconComponent {
  return ICON_MAP[typeId] ?? Icon.Package;
}
