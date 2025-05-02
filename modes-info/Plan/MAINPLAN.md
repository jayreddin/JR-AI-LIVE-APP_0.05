# MAINPLAN: Multi-Mode Audit, Fix, and Documentation Plan

## Objective
Restore and optimize all core features (audio input, camera, screen share, settings, text messaging) for mobile-first and desktop, using a phase-based, multi-mode approach. Ensure all fixes are documented, cross-referenced, and PRD/Docs/Knowledgebase are kept in sync.

---

## Phase 1: Audit & Context Building
**Responsible Mode:** agent-research  
- Review all app files and compare with the working example and Gemini API docs.
- Identify missing, broken, or outdated integrations (esp. audio, camera, screen, settings, text).
- Summarize findings in `modes-info/Context/initial-context.md` and update `modes-info/Docs/research-plan.md`.
- Quiz user for clarification on unclear requirements or features.

---

## Phase 2: Issue Compilation & Planning
**Responsible Mode:** manager-project  
- Aggregate all issues (from audit, user prompt, PRD.md, Docs).
- Update/expand `modes-info/Plan/PRD.md` with new and existing issues.
- Prioritize mobile UX and critical feature restoration.
- Draft a step-by-step fix plan for each issue.
- Incorporate reviewer suggestions into implementation phases:
  - Validate toolManager existence before calling getToolDeclarations.
  - Add more granular error messages for debugging in GeminiAgent and GeminiWebsocketClient.
  - Clarify TODO in sendText regarding structure of parts.
  - Ensure audioContext and stream are always cleaned up on stop, even if errors occur in AudioRecorder.

---

## Phase 3: Feature-by-Feature Debug & Fix
**Responsible Modes:** debug, lead-frontend, lead-qa, lead-devops  
- Assign each broken feature to a mode:
  - Audio input/voice: debug, lead-frontend
  - Camera/video: debug, lead-frontend
  - Screen share: debug, lead-frontend
  - Settings popup: debug, lead-frontend
  - Text messaging: debug, lead-frontend
- Each mode:
  - Audits code, compares with working example, references API docs.
  - Implements and tests fixes (mobile-first).
  - Documents changes in `modes-info/Docs/` and links to Knowledgebase.
  - Marks completion with a ✅ in this plan.

---

## Phase 4: Review, 2nd Opinion & QA
**Responsible Modes:** util-reviewer, util-second-opinion, lead-qa  
- Review all fixes for completeness, correctness, and mobile/desktop compatibility.
- Ensure no features or code are missing.
- Compile a summary of changes and lessons learned.
- Mark each reviewed phase/step with a ✅.

---

## Phase 5: Documentation & Knowledgebase Sync
**Responsible Modes:** util-writer, agent-context-resolver  
- Update all relevant docs in `modes-info/Docs/` and Knowledgebase.
- Ensure MAINPLAN.md, PRD.md, and Docs are cross-referenced and up to date.
- Add links to API docs, working example, and implementation notes.

---

## Phase 6: Final User Review & Approval
**Responsible:** user  
- User reviews MAINPLAN.md and all docs.
- Approves or requests changes.
- Once approved, implementation is considered complete.

---

## References
- [Working Example App](../Knowledgebase/Working_similar-app.example/)
- [Gemini API Docs](../Knowledgebase/gemini.api.docs.english/)
- [PRD](./PRD.md)
- [Research Plan](../Docs/research-plan.md)

---

## Progress Tracker

| Phase | Step | Responsible Mode | Status |
|-------|------|------------------|--------|
| 1     | Audit & Context Building | agent-research | ⬜ |
| 2     | Issue Compilation & Planning | manager-project | ⬜ |
| 3     | Audio Input/Voice Fix | debug, lead-frontend | ⬜ |
| 3     | Camera/Video Fix | debug, lead-frontend | ✅ |
| 3     | Screen Share Fix | debug, lead-frontend | ⬜ |
| 3     | Settings Popup Fix | debug, lead-frontend | ✅ |
| 3     | Text Messaging Fix | debug, lead-frontend | ✅ |
| 4     | Review & QA | util-reviewer, util-second-opinion, lead-qa | ⬜ |
| 5     | Documentation Sync | util-writer, agent-context-resolver | ⬜ |
| 6     | Final User Review | user | ⬜ |

---

**All modes must document their work, reference the Knowledgebase, and quiz the user for clarity as needed. Each phase/step is marked with a ✅ when complete.**