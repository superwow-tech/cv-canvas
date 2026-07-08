## Goal
Refresh the hero bio/subtext to match the "Senior Software Engineer / AI Curious" title, and add a concise set of AI-related skills.

## Recommended approach
- **Bio format**: stacked few-liners (2–3 short sentences). This reads faster as a hero subtext and feels more creative than a single dense paragraph.
- **AI skills**: add a small, relevant set so you can trim later. Suggested additions:
  - New skill category: **AI & LLMs**
  - Skills: RAG, LLMs, Prompt Engineering, Embeddings, Vector DBs, AI SDK, LangChain, OpenAI API
  - Also add **AI SDK** and **LangChain** under Languages & Frameworks if they fit better there.

## Changes

1. **Update `src/data/portfolio-data.ts`**
   - Rewrite `personalInfo.bio` as 2–3 stacked lines, e.g.:
     ```
     Senior Software Engineer who builds and configures AI agents and related tools.
     Experienced in scalable web apps, micro-frontends, and design-system driven interfaces.
     Currently exploring the intersection of full-stack engineering and practical AI.
     ```
   - Add AI skills to `skillCategories`.

2. **Verify**
   - Run `bun run build` to confirm no TypeScript or build errors.

## Notes
- No component or styling changes needed; the existing `BioSection` already renders the bio as large text.
- Wording for AI agents will use your preference: **"build and configure AI agents"**.
- Let me know if you want the skill list shorter or grouped differently before I implement.