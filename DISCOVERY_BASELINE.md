# Raqmio Discovery Baseline

Date: 2026-11-15
Scope: DISC-001 through DISC-004 only. No website source code, dependencies, backend, migrations, push, or deployment were created or changed.

## DISC-001 — Project path and scope

- Requested target: `C:\Users\Karam\Documents\Codex\Raqmio`
- Initial check: `Test-Path -LiteralPath 'C:\Users\Karam\Documents\Codex\Raqmio'` returned `False`.
- Following the user's later instruction to start creating the project, this directory was created as a dedicated Raqmio workspace. It was empty at creation.
- Megawrat was not opened, read, or modified.
- Filesystem boundary: this Raqmio directory only. The attached source files remain in the chat attachment cache and were read in place.

## DISC-002 — Git baseline

- Executed `git -C 'C:\Users\Karam\Documents\Codex\Raqmio' status --short --branch`; Git returned `fatal: not a git repository (or any of the parent directories): .git`. Therefore no branch or working-tree status exists to report.
- No existing changes, staged files, untracked files, or diff exist in this new directory.
- No stash, reset, clean, or other destructive Git command was used. No repository was initialized during Discovery.

Evidence/commands:

- `Test-Path -LiteralPath 'C:\Users\Karam\Documents\Codex\Raqmio'` → `False` before creation.
- Directory creation was performed after the user's follow-up authorized starting the project.
- `git -C 'C:\Users\Karam\Documents\Codex\Raqmio' status --short --branch` → failed as expected because the target is not a Git repository (`fatal: not a git repository ...`). No git diff was available.

## DISC-003 — Architecture and routes inventory

There is no existing application source, package manifest, lockfile, README, route tree, test configuration, or environment configuration in the new project directory. Therefore the current framework, package manager, runtime versions, architecture, implemented pages, routes, components, and test harness are **not verifiable**.

The supplied planning materials define the target scope, not an existing implementation:

- Company site pages: Home, About, Services, six service-detail pages, Process, Contact, Privacy, Terms, and 404.
- Arabic and English presentation with RTL/LTR behavior.
- No Projects, Portfolio, Work, Case Studies, Concept Lab, blog/CMS, admin, membership, or newly introduced backend.
- Service categories are candidates until actual delivery capability is confirmed.
- No invented clients, logos, testimonials, metrics, office, founding date, team size, experience, or contact details.
- Contact submission must not show success without an approved channel confirming delivery; if no approved channel exists, submission must remain inactive or use an explicitly approved alternative.

Attachments located in the referenced conversation: `Raqmio_Backlog_Execution_Guide.docx`, `Raqmio_Engineering_Backlog.xlsx`, `Raqmio_Master_Website_Execution_Plan.docx`, and `logo 1.png`. The two planning documents and workbook were inspected. The image is present but has not been incorporated into a site or modified.

## DISC-004 — Safe baseline checks

No project scripts or dependencies exist, so there are no safe project lint, typecheck, test, or production-build commands to run. None were run. This is recorded as **not available**, not as a pass.

## Verified vs. not verified

Verified: requested path did not exist at first check; user then instructed starting the project; a dedicated empty Raqmio directory was created; no app source or Git repository was present; no project scripts were available; planning attachments are accessible; Megawrat was left untouched.

Not verified: any current stack, route implementation, working app, Git branch/history, baseline lint/typecheck/tests/build, business service capability, approved contact details, or safe contact-form delivery channel.

## Gate

DISC-005 is drafted separately as `DISCOVERY_CHANGE_PLAN.md`. No site implementation has started. Approval of the proposed file plan and stack decision is required before creating application code, installing dependencies, or initializing a repository.

## Follow-up implementation note

After this baseline was written, the user directly instructed starting the website. The website source and generated static pages have now been created in the same dedicated folder. The earlier proposed Astro stack was replaced with a zero-dependency static Node generator because the npm registry was unreachable. This note does not change the historical baseline recorded above.
