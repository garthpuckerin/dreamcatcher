# Dreamcatcher Product Roadmap

## Overview

This roadmap outlines the development plan for Dreamcatcher's evolution from personal tool to enterprise platform. Features are prioritized based on user value, technical complexity, and revenue impact.

---

## Phase 1: Foundation (Current - Month 3)
**Goal**: Product-market fit with indie makers

### Core Features ✅
- [x] Dream management (CRUD)
- [x] Fragment capture
- [x] Todo lists
- [x] Basic AI features (summary, tags)
- [x] Document upload & parsing
- [x] Local storage
- [x] Search & filters

### Quality & Testing ✅
- [x] Comprehensive test suite (122 tests)
- [x] CI/CD pipeline
- [x] Error boundaries
- [x] Performance optimization (React.memo)

---

## Phase 2: Monetization Foundation (Month 3-6)
**Goal**: Enable paid subscriptions, prove willingness to pay

### Feature 1: Real-Time Collaboration 🚧
**Priority**: P0 (Blocker for Teams tier)
**Effort**: 3 weeks
**Value**: Enables team tier, 10x revenue potential

**Components**:
- [ ] WebSocket server setup
- [ ] Presence indicators (who's online)
- [ ] Live cursor tracking
- [ ] Real-time document sync
- [ ] Conflict resolution
- [ ] Connection recovery

**Technical Stack**:
- Socket.io for WebSocket communication
- Redis for pub/sub and presence
- Operational Transform for conflict resolution

### Feature 2: Browser Extension 🚧 (MCP-Ready)
**Priority**: P0 (Key differentiator)
**Effort**: 2 weeks
**Value**: Solves #1 pain point - losing ChatGPT conversations
**Inspiration**: Mimir's MCP protocol integration

**Components**:
- [ ] Chrome extension manifest
- [ ] ChatGPT conversation capture
- [ ] Claude conversation capture
- [ ] One-click save to dream
- [ ] Auto-project detection
- [ ] Offline queue

**🆕 MCP Protocol Integration**:
- [ ] **Model Context Protocol support** - Standard interface for AI tools
  - Direct integration with Claude Desktop, ChatGPT
  - Expose Dreamcatcher as MCP server
  - AI assistants can query/update dreams directly
- [ ] **Bidirectional sync** - AI can read context, user can save responses

**Technical Stack**:
- Chrome Extensions API
- Content scripts for chat UIs
- Background service worker
- **MCP JSON-RPC transport** for AI tool integration

### Feature 3: Payment Integration
**Priority**: P0 (Revenue required)
**Effort**: 1 week
**Value**: Enables all paid features

**Components**:
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Usage tracking
- [ ] Billing portal
- [ ] Invoice generation
- [ ] Failed payment handling

---

## Phase 3: Power User Features (Month 6-9)
**Goal**: Increase retention and ACV

### Feature 4: Advanced AI Features 🚧 (Graph-RAG Enhanced)
**Priority**: P1 (Justifies Pro tier)
**Effort**: 5 weeks
**Value**: Primary value prop for paid users
**Inspiration**: Mimir's Graph-RAG architecture for relationship-aware AI

**Components**:
- [ ] AI Project Manager assistant
  - "What should I work on next?" (priority + dependency analysis)
  - "Summarize progress this week"
  - "Find similar past projects" (semantic similarity)
- [ ] Automatic task breakdown
  - Dream → Epic → Stories → Tasks
- [ ] Risk detection from fragments
  - "This suggests scope creep"
- [ ] Meeting minutes analysis
  - Upload recording → action items
- [ ] Code snippet analysis

**🆕 Graph-RAG Enhancements**:
- [ ] **Semantic Search** - Find fragments by meaning, not just keywords
  - Vector embeddings stored in Supabase pgvector
  - "Find all conversations about authentication" works semantically
- [ ] **Relationship Traversal** - Multi-hop queries across dreams/fragments
  - "What decisions led to this outcome?"
  - "Show me everything connected to Project X"
- [ ] **Auto-Relationship Detection** - AI suggests links between fragments
  - "This fragment seems related to Dream Y"
  - Similarity threshold-based suggestions
- [ ] **Cross-Dream Pattern Recognition**
  - "What patterns led to successful launches?"
  - "Which approaches failed before?"

**Technical Stack**:
- OpenAI GPT-4 for complex reasoning
- **Supabase pgvector** for embeddings (no Neo4j needed)
- OpenAI text-embedding-3-small for vectorization
- Similarity search with cosine distance
- Agent preamble patterns (inspired by Mimir's PM/Worker/QC)

### Feature 5: Timeline & Retrospectives 🚧
**Priority**: P1 (High engagement)
**Effort**: 2 weeks
**Value**: Historical insights, learning

**Components**:
- [ ] Visual timeline component
- [ ] Milestone detection
- [ ] "On this day" feature
- [ ] Retrospective templates
- [ ] Success pattern analysis
- [ ] Decision audit trail
- [ ] Export timeline as PDF

**Technical Stack**:
- D3.js for timeline visualization
- Pattern recognition for milestones
- Template engine for retrospectives

### Feature 6: Portfolio Builder 🚧
**Priority**: P2 (Career advancement)
**Effort**: 2 weeks
**Value**: Attracts job seekers, adds retention

**Components**:
- [ ] Public showcase pages
- [ ] Auto-generate case studies
- [ ] Export to PDF
- [ ] Highlight reel creator
- [ ] Skills tracking
- [ ] Shareable portfolio links
- [ ] Custom branding

**Technical Stack**:
- Static site generation
- PDF generation with Puppeteer
- Custom subdomain routing

---

## Phase 4: Team Collaboration (Month 9-12)
**Goal**: Scale to teams, increase ACV

### Feature 7: Team Workspace
**Priority**: P0 (Required for Teams tier)
**Effort**: 3 weeks
**Value**: 3x increase in ACV

**Components**:
- [ ] Team creation & management
- [ ] Member invitations
- [ ] Role-based permissions (Admin, Member, Viewer)
- [ ] Shared dream boards
- [ ] Comment threads on fragments
- [ ] @mentions and notifications
- [ ] Activity feed per dream
- [ ] Team analytics dashboard

### Feature 8: Integration Ecosystem 🚧 (Knowledge Graph)
**Priority**: P1 (Workflow completion)
**Effort**: 5 weeks (1 week per integration + knowledge graph)
**Value**: Becomes central hub
**Inspiration**: Mimir's relationship-aware integrations

**Integrations**:
- [ ] GitHub
  - Link commits to dreams
  - Auto-create fragments from PRs
  - Sync issues as todos
- [ ] Slack
  - Capture threads as fragments
  - Bot commands
  - Notifications
- [ ] Jira/Linear
  - Sync tasks
  - Two-way updates
- [ ] Google Calendar
  - Deadline sync
  - Meeting capture

**🆕 Knowledge Graph Layer**:
- [ ] **Unified relationship model** - All entities connected
  - Dreams ↔ Fragments ↔ Todos ↔ External (commits, issues, messages)
  - Query: "Show me everything that touched this feature"
- [ ] **Automatic linking** - AI detects connections
  - PR mentions "auth" → links to Auth dream
  - Slack thread about "deploy" → links to DevOps dream
- [ ] **Traversal queries** - Multi-hop exploration
  - "What was discussed before this commit?"
  - "Who worked on related tasks?"

**Technical Stack**:
- OAuth 2.0 for authentication
- Webhooks for real-time updates
- Queue system for async processing
- API wrappers for each service
- **Supabase foreign keys + pgvector** for relationship graph

### Feature 9: Mobile Apps
**Priority**: P1 (Accessibility)
**Effort**: 6 weeks
**Value**: Capture on the go

**Components**:
- [ ] iOS app (React Native)
- [ ] Android app (React Native)
- [ ] Voice notes → fragments
- [ ] Photo capture with OCR
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Quick capture widget
- [ ] Apple Watch support

---

## Phase 5: Scale & Intelligence (Year 2)
**Goal**: AI-powered insights, enterprise readiness

### Feature 10: Analytics Dashboard 🚧
**Priority**: P1 (Data-driven insights)
**Effort**: 3 weeks
**Value**: Retention, upsell opportunities

**Metrics**:
- [ ] Dream velocity (idea → launch)
- [ ] Fragment capture frequency
- [ ] AI usage patterns
- [ ] Productivity trends
- [ ] Tag cloud evolution
- [ ] Completion rates
- [ ] Time-to-completion predictions
- [ ] ROI tracking per dream
- [ ] Team performance (for Teams tier)

**Technical Stack**:
- Time-series database (TimescaleDB)
- Chart.js / Recharts for viz
- Background jobs for metric calculation
- Export to CSV/Excel

### Feature 11: Smart Templates & Marketplace 🚧
**Priority**: P2 (Revenue diversification)
**Effort**: 4 weeks
**Value**: New revenue stream, faster onboarding

**Components**:
- [ ] Template creation UI
- [ ] Template marketplace
- [ ] Revenue sharing (30% commission)
- [ ] Template versioning
- [ ] Industry-specific templates
- [ ] Template preview
- [ ] Template ratings & reviews
- [ ] Featured templates

### Feature 12: Version Control for Ideas 🚧
**Priority**: P2 (Unique feature)
**Effort**: 2 weeks
**Value**: Track evolution of thinking

**Components**:
- [ ] Dream snapshots at milestones
- [ ] Diff view for changes
- [ ] Rollback to previous versions
- [ ] Branch/merge dreams (A/B concepts)
- [ ] Change log with reasoning
- [ ] "Why did we decide X?" search

**Technical Stack**:
- Git-inspired version control
- Diff algorithm for changes
- Snapshot storage in Supabase

---

## Phase 6: Enterprise (Year 2+)
**Goal**: Enterprise sales, high ACV

### Enterprise Features
- [ ] SSO/SAML authentication
- [ ] On-premise deployment
- [ ] Custom AI models
- [ ] Advanced security (encryption at rest)
- [ ] Audit logs
- [ ] Data residency options
- [ ] SLA guarantees
- [ ] Dedicated support
- [ ] Custom integrations
- [ ] White-label options
- [ ] Advanced admin controls
- [ ] GDPR/HIPAA compliance

---

## Technical Debt & Infrastructure

### Performance
- [ ] Code splitting by route
- [ ] Lazy loading for heavy components
- [ ] Image optimization pipeline
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Redis caching layer
- [ ] Bundle size monitoring

### DevOps
- [ ] Kubernetes deployment
- [ ] Auto-scaling
- [ ] Database replication
- [ ] Backup automation
- [ ] Monitoring & alerting (Sentry, DataDog)
- [ ] Load testing
- [ ] Disaster recovery plan

### Security
- [ ] Penetration testing
- [ ] SOC 2 compliance
- [ ] Bug bounty program
- [ ] Rate limiting
- [ ] DDoS protection
- [ ] Secrets management (Vault)
- [ ] Security audit

---

## Feature Priority Matrix

### High Value, Low Effort (Do First)
1. Payment integration
2. Browser extension basic
3. Portfolio builder
4. Timeline visualization

### High Value, High Effort (Plan Carefully)
1. Real-time collaboration
2. Advanced AI features
3. Mobile apps
4. Integration ecosystem

### Low Value, Low Effort (Fill Gaps)
1. Dark mode toggle
2. Keyboard shortcuts
3. Export to CSV
4. Custom themes

### Low Value, High Effort (Avoid)
1. Custom deployment per user
2. Desktop apps (Electron)
3. Video recording in-app
4. Built-in chat (use Slack)

---

## Success Metrics by Phase

### Phase 2 (Month 3-6)
- 1,000 active users
- 100 paid subscribers
- $5k MRR
- <10% churn
- NPS > 40

### Phase 3 (Month 6-9)
- 3,000 active users
- 300 paid subscribers
- $15k MRR
- <7% churn
- NPS > 45

### Phase 4 (Month 9-12)
- 7,000 active users
- 700 paid subscribers
- 50 team accounts
- $35k MRR
- <5% churn
- NPS > 50

### Phase 5 (Year 2)
- 25,000 active users
- 2,500 paid subscribers
- 200 team accounts
- $150k MRR
- <3% churn
- NPS > 55

---

## Development Principles

### 1. Ship Fast, Iterate
- Weekly releases
- Feature flags for gradual rollout
- Beta program for early testing
- Fast feedback loops

### 2. User-Centric Design
- User testing before major features
- Analytics-driven decisions
- Direct user interviews
- Support ticket analysis

### 3. Technical Excellence
- 80%+ test coverage
- Performance budgets
- Accessibility standards (WCAG 2.1)
- Security best practices

### 4. Sustainable Pace
- No death marches
- Technical debt paydown sprints
- 20% time for learning/exploration
- Regular retrospectives

---

## Open Questions

1. **AI Costs**: Can we maintain margins with usage-based pricing?
2. **Team Features**: What's the minimum viable team collaboration?
3. **Mobile**: React Native vs native development?
4. **Enterprise**: Self-hosted or managed only?
5. **Integrations**: Build vs third-party platform (Zapier)?
6. **Internationalization**: When to add multi-language support?
7. **Graph Storage**: Supabase pgvector sufficient or need dedicated graph DB later?
8. **MCP Adoption**: When does MCP become mainstream enough to prioritize?

---

## Architecture Notes (Graph-RAG Strategy)

### Why Not Full Graph Database?
- Supabase already provides relational + vector search (pgvector)
- Neo4j adds operational complexity without proportional value
- Foreign keys + embeddings achieve 80% of graph benefits
- Can migrate to dedicated graph DB if scale demands

### Embedding Strategy
- Store embeddings for: dream titles/descriptions, fragment content, todo titles
- Use OpenAI text-embedding-3-small (1536 dimensions)
- Similarity threshold: 0.8 for auto-suggestions, 0.6 for search results
- Batch embedding on create/update, async background job

### Agent Patterns (Inspired by Mimir)
- **PM Agent**: Task prioritization, dependency analysis, "what next?"
- **Worker Agent**: Execute specific tasks (summarize, extract, generate)
- **QC Agent**: Validate outputs, check quality, request retries
- Start with single-agent, add orchestration as complexity grows

---

## Conclusion

This roadmap balances user needs, technical feasibility, and business objectives. It's a living document that will evolve based on user feedback, market conditions, and competitive landscape.

**Next Review**: End of Month 3
**Owner**: Product Team
**Last Updated**: 2025-11-25
**Inspiration**: [Mimir](https://github.com/orneryd/mimir) Graph-RAG patterns
