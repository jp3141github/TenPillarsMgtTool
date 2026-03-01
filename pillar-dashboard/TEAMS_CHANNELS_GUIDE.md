# Teams Channels — How-to Guide

Five channels, one ID convention, zero ambiguity.

---

## Channel Roles (keep them pure)

| Channel | Name | Purpose |
|---------|------|---------|
| **I** | **Noticeboard (ABCD)** | Exec-facing broadcast only — no delivery chatter |
| **II** | **ICP** | Front-door intake + triage |
| **III** | **Delivery** | Production-floor threads |
| **IV** | **QACE** | Controls + evidence links + sign-off trail |
| **V** | **ORM** | Runbooks + recovery + "how we do X" |

> ABCD is the broadcast classification used exclusively in Noticeboard.

---

## The Wiring Model (how they combine)

### One ID everywhere

Every work item gets a single ID and you reuse it in every channel.

**Example:** `ICP-0007`

Use that same ID in:

- ICP intake post
- Delivery thread title
- QACE evidence post
- ORM runbook (if relevant)
- Noticeboard update

**This one move kills 80% of chaos.**

---

## ABCD Definitions (Noticeboard only)

| Code | Meaning | When to use |
|------|---------|-------------|
| **A — Approved** | A decision or sign-off happened | Method, assumption, output, or committee approval |
| **B — Blocked** | Something is stuck | Needs escalation or air cover |
| **C — Changed** | Scope, timing, or approach changed | You are controlling the narrative |
| **D — Delivered** | Output shipped | Evidence location + next dependency documented |

---

## Minimum Templates

Copy/paste these into pinned posts in each channel.

### I — Noticeboard post template (ABCD)

```
Title: [A|B|C|D] ICP-0007 — <Deliverable> — <1-line summary>

Body:
  - Impact:    what this means (deadline, risk, stakeholders)
  - Owner:     name
  - Due:       date/time
  - Ask/Next:  what you need / what happens next
  - Links:     ICP item • Delivery thread • Evidence pack
```

**Rule:** if it is not worth exec attention, it does not go in Noticeboard.

---

### II — ICP intake template (front door)

```
Title: ICP-0007 — <Request/Deliverable>

Body:
  - Requester / Stakeholder:
  - Why / outcome needed:
  - Due date / hard deadline:
  - Priority:             P0–P3
  - Routing:              who owns delivery
  - Acceptance criteria:  what "done" means
  - Links:                (if provided)
```

**Rule:** nothing enters Delivery unless it exists as an ICP item first.

---

### III — Delivery thread template (production floor)

```
Thread title: ICP-0007 — <Deliverable>

  - Current status:    On track / At risk / Blocked
  - Today's plan:      2–3 bullets
  - Dependencies:      data, reviewers, approvals
  - Next checkpoint:   date/time
```

**Rule:** keep work chatter here — not in ICP and not in Noticeboard.

---

### IV — QACE evidence template (controls & audit trail)

```
Title: ICP-0007 — Evidence — <Control/Check>

  - Control performed:       recon / validation / review
  - Result:                  pass/fail + commentary
  - Performed by / Reviewed by:  names
  - Evidence link:           SharePoint folder / file link
  - Date/time:               stamp
```

**Rule:** "If it isn't evidenced, it didn't happen."

---

### V — ORM runbook template (runbooks & recovery)

```
Title: <Process name> — Runbook

  - Purpose / trigger
  - Inputs / systems
  - Steps (happy path)
  - Failure modes + recovery
  - Owner + backup
  - Links: templates, evidence examples, known issues
```

**Rule:** only write runbooks for recurring work or repeat failures.

---

## Week-1 Setup Steps

1. **Moderate Noticeboard** — owners post only. Keep it signal, not chat.
2. **Pin one "How to use this channel" post** in each channel with the relevant template above.
3. **Adopt the single ID convention** (`ICP-0001`…) from day one.
4. **One thread per ICP item** in Delivery — no orphan conversations.
5. **Post exactly one ABCD update** in Noticeboard whenever a decision, blocker, change, or delivery happens — with links back to the source channels.

---

## Cadence

| Frequency | Time | Actions |
|-----------|------|---------|
| **Daily** | 5 mins | ICP triage → update Delivery threads → post to Noticeboard only if A/B/C/D-worthy |
| **Weekly** | 15 mins | Prune stale ICP items, confirm owners, update ORM for anything that broke twice |

---

## Summary

This gives you a controlled comms stack:

| Channel | Function |
|---------|----------|
| **ICP** | Intake |
| **Delivery** | Execution |
| **QACE** | Proof |
| **ORM** | Resilience |
| **Noticeboard** | Narrative |
