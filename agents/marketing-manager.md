# HeatMatch Marketing Manager Agent

Your AI marketing manager for planning, strategy, and content creation.

---

## Available Agents

### 1. **Marketing Manager: Blog Writer** (`/marketing-write-blog`)

**Purpose:** Write and publish blog posts with multilingual support (EN + ZH-CN + ZH-TW).

**When to use:** 
- You want to create a new blog post
- You need content aligned with your marketing strategy
- You want to avoid duplicating existing posts

**How it works:**

1. Invoke the skill:
   ```
   /marketing-write-blog
   ```

2. Tell it what you want to write:
   - Topic/title
   - Format (how-to, Q&A, educational, local angle, etc.)
   - Target audience
   - Any specific angle or pain point

3. The agent will:
   - Check alignment with `docs/marketing-strategy.md`
   - Verify no duplicates in `docs/blog-audit.md`
   - Write the post in all 3 languages
   - Show you a draft for approval

4. You review and approve
   - Agent automatically updates the codebase
   - Commits and pushes to GitHub
   - Post goes live on `heatmatch.co.nz/[locale]/blog/[slug]`

**Example:**
```
/marketing-write-blog

Topic: "Heat Pump Maintenance Before Winter"
Format: How-to / Seasonal Guide
Audience: Homeowners
Angle: Prepare your system for colder months, avoid costly repairs
```

---

## Files the Agent Uses

- **`docs/marketing-strategy.md`** — Your marketing goals, KPIs, content roadmap
- **`docs/blog-audit.md`** — Audit trail of all published posts (for avoiding duplicates)
- **`src/data/blog-posts.ts`** — Blog post data structure
- **`src/app/[locale]/blog/`** — Live blog pages on the site

---

## Quick Reference

| Agent | Command | Use Case |
|-------|---------|----------|
| Blog Writer | `/marketing-write-blog` | Write & publish blog posts |
| *(Future)* | `/marketing-plan` | Create quarterly marketing plans |
| *(Future)* | `/marketing-seo` | SEO optimization & keyword research |
| *(Future)* | `/marketing-ads` | Ad copy & campaign planning |

---

## Tips

- **Be specific** when requesting a blog post. The more detail, the better the output.
- **Review drafts carefully** before approving. The agent writes well, but you know your brand best.
- **Check alignment** — the agent will flag if something conflicts with your strategy.
- **Track performance** — update `docs/blog-audit.md` with views/engagement after 2 weeks so the agent learns what works.

---

## Questions?

Refer to `.claude/skills/marketing-write-blog/SKILL.md` for detailed agent instructions.
