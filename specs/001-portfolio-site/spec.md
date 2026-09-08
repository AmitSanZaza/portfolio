# Feature Specification: Portfolio Site

**Feature Branch**: `001-portfolio-site`

**Created**: 2026-09-08

**Status**: Draft

**Input**: User description: "Site portfolio pour présenter mes projets, facilement modifiable dans le futur (ajout/modification de projets simple, sans devoir replonger dans du code complexe)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor browses the project showcase (Priority: P1)

A visitor (recruiter, client, peer) lands on the site and browses the list of projects, seeing for each one a title, image, short description, technologies used, and links to a live demo and/or source code.

**Why this priority**: This is the core value of a portfolio — without it, the site delivers nothing. It must work even before any content-management tooling exists.

**Independent Test**: Load the site with a set of sample projects already in place; confirm each project card shows its title, image, description, technology tags, and working links.

**Acceptance Scenarios**:

1. **Given** the site has one or more projects configured, **When** a visitor opens the site, **Then** they see a list of project cards each showing title, image, description, and technology tags.
2. **Given** a project has a live demo link and/or source code link, **When** the visitor clicks that link, **Then** it opens the correct destination.
3. **Given** no projects have been added yet, **When** a visitor opens the site, **Then** they see a clear "no projects yet" message instead of a broken or empty-looking page.

---

### User Story 2 - Owner manages projects without touching code (Priority: P2)

The site owner wants to add, edit, or remove a project in the future without writing or modifying code. They log into a protected admin area and use a form to manage project entries.

**Why this priority**: This is the specific pain point the owner called out — the site must stay easy to maintain over time. It builds directly on User Story 1 (the projects it manages are the ones displayed there).

**Independent Test**: Log into the admin area, create a new project through the form (title, description, image, technologies, links), and verify it appears correctly on the public project list. Then edit and delete it, verifying the public list updates accordingly.

**Acceptance Scenarios**:

1. **Given** the owner is not logged in, **When** they try to reach the admin/management area, **Then** they are required to authenticate first.
2. **Given** the owner is logged in, **When** they submit the "add project" form with a title, description, image, technologies, and links, **Then** the new project appears on the public site.
3. **Given** an existing project, **When** the owner edits its fields and saves, **Then** the public site reflects the updated information.
4. **Given** an existing project, **When** the owner deletes it, **Then** it no longer appears on the public site.
5. **Given** the owner submits the project form without a required field (title or description), **Then** the system rejects the submission and explains what's missing.

---

### User Story 3 - Visitor learns about the owner and can reach out (Priority: P3)

A visitor wants more context than the project list alone: who the owner is, what skills they bring, and how to get in touch.

**Why this priority**: Supports the primary goal (getting hired, contacted, or noticed) but the site still functions as a portfolio without it — it's an enhancement on top of Stories 1 and 2.

**Independent Test**: Navigate to the About, Skills, and Contact sections and confirm each displays the expected content and that the contact method is usable (e.g., clicking an email link opens a mail client, or a contact form can be submitted).

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** the visitor navigates to the "About" section, **Then** they see a short bio of the owner.
2. **Given** the site is loaded, **When** the visitor navigates to the "Skills" section, **Then** they see a list of the owner's skills/technologies.
3. **Given** the site is loaded, **When** the visitor navigates to the "Contact" section, **Then** they see at least one working way to reach the owner.

---

### Edge Cases

- What happens when there are no projects yet? → Show a clear empty-state message instead of a blank or broken layout (covered in US1 acceptance scenario 3).
- What happens when someone attempts to log into the admin area with wrong credentials? → Access is denied with a generic error message, without revealing whether the username or password was incorrect.
- What happens when a project's image fails to load (broken link, deleted file)? → A fallback placeholder is shown instead of a broken image icon.
- What happens when the owner submits a project with an invalid link (e.g., malformed URL)? → The system rejects the submission and explains the problem.
- How does the site behave on a small mobile screen? → Layout adapts and remains fully usable (readable text, tappable links, no horizontal scrolling).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a public list of projects, each showing a title, image, description, and technology tags.
- **FR-002**: System MUST show clickable links to a live demo and/or source code repository for each project, when configured.
- **FR-003**: System MUST display a clear empty-state message when no projects exist yet.
- **FR-004**: System MUST provide a protected admin/management area that requires the owner to authenticate before use.
- **FR-005**: System MUST allow the authenticated owner to create, edit, and delete project entries (title, description, image, technologies, links) without editing code files.
- **FR-006**: System MUST validate that required project fields (title, description) are present before saving, and MUST reject submissions with invalid data, explaining what needs to be fixed.
- **FR-007**: System MUST persist project data so it remains available across visits and site restarts, and reflect admin changes on the public site.
- **FR-008**: System MUST provide an "About" section presenting the owner's bio.
- **FR-009**: System MUST provide a "Skills" section listing the owner's skills/technologies.
- **FR-010**: System MUST provide a "Contact" section giving visitors at least one working way to reach the owner.
- **FR-011**: System MUST prevent unauthenticated users from creating, editing, or deleting project content.
- **FR-012**: System MUST remain fully usable on both desktop and mobile screen sizes.

### Key Entities

- **Project**: A showcased piece of work. Attributes: title, description, image, list of technology tags, optional live demo link, optional source code link, display order.
- **Owner Account**: The single site owner's credentials, used solely to access the project management area. No multi-user roles or permission levels are needed.
- **Profile Content**: The About bio, Skills list, and Contact information shown to visitors. Set up as part of the site content; not required to go through the same add/edit/delete workflow as Projects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can see the full list of showcased projects, with all their details, within 3 seconds of the site loading.
- **SC-002**: The owner can add a new project to the live site in under 5 minutes, without writing or editing any code.
- **SC-003**: 100% of projects that have a demo or source link configured show a working, clickable link.
- **SC-004**: The site is fully readable and usable, with no broken layout, on both desktop and mobile screen widths.
- **SC-005**: Unauthorized visitors are never able to create, edit, or delete project content — access is blocked 100% of attempts without valid owner credentials.

## Assumptions

- There is a single owner/admin of the site; no multi-user accounts or permission levels are required.
- The About, Skills, and Contact content is set up as part of building the site and changes infrequently; only Projects require the dedicated add/edit/delete management workflow described in User Story 2.
- "Contact" means giving visitors a working way to reach the owner (e.g., an email link or social links); it does not require a full message inbox or CRM.
- The site is public-facing; visitors do not need accounts or logins — only the owner authenticates, to manage projects.
- Project images are supplied by the owner; the specific storage/hosting mechanism is a technical decision left to the planning phase.
