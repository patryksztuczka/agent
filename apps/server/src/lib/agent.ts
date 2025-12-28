import { AGENT_PROFILES, AgentProfile } from './agent-profiles';

export class Agent {
  private profile: AgentProfile;

  constructor(id: number) {
    const profile = AGENT_PROFILES.find((p) => p.id === id);
    if (!profile) {
      throw new Error(`Agent with id ${id} not found`);
    }
    this.profile = profile;
  }

  getProfile(): AgentProfile {
    return this.profile;
  }

  getId(): number {
    return this.profile.id;
  }

  getName(): string {
    return this.profile.name;
  }

  getSystemPrompt(): string {
    return this.profile.systemPrompt;
  }
}
