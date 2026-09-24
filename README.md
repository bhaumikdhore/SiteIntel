# SiteIntel

### AI-Powered Planning-to-Execution Bridge for Infrastructure Project Management

SiteIntel is an AI-powered project progress tracking and schedule-linking platform designed to bridge the gap between project planning and real-world site execution.

Infrastructure projects generate progress information through daily reports, spreadsheets, site updates, and supervisor inputs. This information often differs from the terminology and structure used in the project's L5/L6 schedule activities. SiteIntel intelligently processes these inputs and maps them to the corresponding planned activities.

---

## Problem Statement

In large infrastructure projects, project schedules are usually maintained in structured planning systems such as Primavera or MS Project, while actual site progress is reported through multiple unstructured or semi-structured sources.

This creates a **Planning-to-Execution Gap**:

```text
Planned Schedule
      │
      │ L5/L6 Activities
      │
      ▼
   PROJECT PLAN
      │
      │
      │       ❌ Manual Reconciliation
      │
      ▼
Site Reports / Excel / Supervisor Updates
```

Manual reconciliation can be time-consuming and may lead to delayed or inconsistent progress updates.

SiteIntel addresses this gap by creating an intelligent layer between field execution data and project schedules.

---

## Solution

SiteIntel provides an intelligent workflow for:

* Capturing site progress from different input formats
* Extracting important project information
* Understanding natural-language activity descriptions
* Matching reported activities with L5/L6 schedule activities
* Generating confidence scores for matches
* Sending uncertain matches for planner validation
* Tracking actual project progress
* Maintaining an audit trail of updates
* Building structured historical execution data

### Core Workflow

```text
Site Reports / Excel / Text / Supervisor Input
                    │
                    ▼
             Data Ingestion
                    │
                    ▼
          NLP / LLM Extraction
                    │
                    ▼
        Structured Progress Event
                    │
                    ▼
       Semantic + Fuzzy Matching
                    │
                    ▼
            Confidence Score
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   High Confidence       Low Confidence
          │                   │
          ▼                   ▼
      Auto-Link          Planner Review
          │                   │
          └─────────┬─────────┘
                    ▼
          L5/L6 Schedule Activity
                    │
                    ▼
           Actual Progress
                    │
                    ▼
        Analytics & Knowledge
```

---

## Key Features

### 1. Multi-Source Data Capture

SiteIntel is designed to process information from sources such as:

* Daily progress reports
* Excel spreadsheets
* Site diaries
* Text-based updates
* Supervisor inputs

---

### 2. Intelligent Information Extraction

The system extracts relevant information from unstructured reports, including:

* Activity
* Activity status
* Start date
* End date
* Discipline
* Location
* Line / equipment identifier
* Other relevant project metadata

---

### 3. Semantic Activity Matching

Different people may describe the same activity differently.

For example:

```text
Schedule Activity:
"Erect Line 24-XX"

Site Report:
"Spool erection completed for Line 24-XX"
```

Although the wording is different, SiteIntel can identify their semantic relationship using embedding-based similarity.

---

### 4. Fuzzy Matching

Fuzzy matching helps handle:

* Spelling differences
* Abbreviations
* Formatting variations
* Word-order differences
* Minor terminology variations

The system can combine fuzzy similarity with semantic similarity and project metadata to improve matching reliability.

---

### 5. Confidence-Based Validation

Each proposed activity match receives a confidence score.

```text
High Confidence
      │
      ▼
Automatic Linking

Low Confidence
      │
      ▼
Planner Review
```

This creates a **human-in-the-loop** workflow instead of blindly trusting AI predictions.

---

### 6. Time Agent

Site supervisors can report progress using natural language.

Example:

> "Line 24 spool erection started today at 9 AM."

The system can interpret this as:

```text
Activity   : Line 24 Spool Erection
Event      : START
Time       : 9 AM
Discipline : Piping
```

The same approach can be extended to voice-based input using a speech-to-text layer.

---

### 7. Schedule Linking

Once an activity is identified and validated, the actual progress can be linked to its corresponding L5/L6 schedule activity.

Example:

```text
Activity ID : PIP-102
Activity    : Erect Line 24-XX

Planned:
Start       : 10 Sept
Finish      : 15 Sept

Actual:
Start       : 11 Sept
Finish      : 12 Sept
```

---

### 8. Audit Trail

Each automated decision can maintain information such as:

* Source of the progress information
* Extracted activity
* Matched schedule activity
* Similarity/confidence score
* Validation status
* Planner decision
* Update timestamp

This improves traceability and accountability.

---

### 9. Historical Execution Knowledge

Structured actual-progress information can be retained as historical project data.

Over time, this can support:

* Execution pattern analysis
* Delay analysis
* Performance monitoring
* Productivity analysis
* Future project planning
* Forecasting
* Institutional knowledge

---

## AI / ML Approach

SiteIntel uses a combination of AI and information-retrieval techniques.

### NLP / LLM

Used for understanding unstructured project updates and extracting structured information.

### Transformer-Based Embeddings

Reported activities and schedule activities can be converted into numerical vectors representing their semantic meaning.

### Cosine Similarity

Used to compare embedding vectors and determine semantic similarity between activities.

### Fuzzy Matching

Used to identify textual similarities despite spelling, formatting, or wording differences.

### Metadata Matching

Additional contextual information such as discipline, line number, equipment and location can be used to improve matching.

### Confidence Scoring

The different matching signals can be combined to generate an overall confidence score.

```text
Semantic Similarity
        +
Fuzzy Similarity
        +
Metadata Match
        +
Context
        │
        ▼
Final Confidence Score
        │
   ┌────┴────┐
   ▼         ▼
Auto-Link   Review
```

---

## Example

### Schedule

```text
Activity ID: PIP-102
Activity: Erect Line 24-XX
Discipline: Piping
```

### Site Report

```text
"Spool erection completed for Line 24-XX."
```

### AI Processing

```text
Extracted Activity:
Spool Erection

Line:
24-XX

Status:
Completed

Discipline:
Piping
```

### Matching

```text
PIP-102 → Erect Line 24-XX

Semantic Similarity → High
Fuzzy Similarity    → High
Metadata Match      → High

Confidence → High
```

### Result

```text
PIP-102
Actual Status → Completed
```

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │      Data Sources    │
                    │──────────────────────│
                    │ PDF / Excel / Text   │
                    │ Site Reports         │
                    │ Supervisor Input     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Ingestion Layer    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   NLP / LLM Layer    │
                    │ Information          │
                    │ Extraction           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Matching Engine       │
                    │──────────────────────│
                    │ Embeddings            │
                    │ Cosine Similarity     │
                    │ Fuzzy Matching        │
                    │ Metadata Matching     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Confidence & Review  │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              Auto-Link             Planner Review
                    │                     │
                    └──────────┬──────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Schedule / PMIS      │
                    │ Integration Layer    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Progress & Historical│
                    │ Knowledge Repository │
                    └──────────────────────┘
```

---

## Project Scope

The prototype focuses on demonstrating the core planning-to-execution bridge:

1. Ingest sample project information
2. Extract progress-related information
3. Identify reported activities
4. Match activities against L5/L6 schedule activities
5. Generate confidence scores
6. Support human validation
7. Display actual progress against planned activities

Production-level integrations such as enterprise PMIS connectivity, advanced OCR, speech recognition, and large-scale deployment can be added as future extensions.

---
## Project Demo

The SiteIntel prototype demonstrates the complete planning-to-execution workflow through an interactive project management dashboard.

### Demo Flow

```text
Dashboard
   ↓
Project Overview
   ↓
Site Progress Input
   ↓
AI Activity Extraction
   ↓
L5/L6 Activity Matching
   ↓
Confidence Score
   ↓
Planner Validation
   ↓
Actual Progress Update
   ↓
Project Analytics
```

### 1. Project Dashboard

The dashboard provides an overview of the project's current execution status, including:

* Overall project progress
* Planned vs actual progress
* Activity status
* Schedule alignment
* Delayed or at-risk activities
* Recent site updates

### 2. Site Progress Capture

The prototype allows site progress information to be entered through supported project inputs such as daily reports, structured data and supervisor updates.

Example:

```text
"Spool erection for Line 24-XX was completed today."
```

### 3. AI Processing

The system extracts important information from the input:

```text
Activity    → Spool Erection
Line        → 24-XX
Status      → Completed
Discipline  → Piping
```

### 4. Intelligent Activity Matching

The extracted activity is compared with available L5/L6 schedule activities using semantic similarity, fuzzy matching and contextual information.

```text
Reported Activity
"Spool erection for Line 24-XX"

          ↓

Candidate Activities

PIP-102  Erect Line 24-XX     → High Match
PIP-103  Erect Line 25-XX     → Medium Match
ELE-201  Cable Installation   → Low Match
```

### 5. Confidence & Validation

The system displays the proposed match along with its confidence level.

```text
┌─────────────────────────────────┐
│ Suggested Activity              │
│ PIP-102                         │
│ Erect Line 24-XX                │
│                                 │
│ Confidence: High                │
│                                 │
│ [ Approve ]     [ Review ]      │
└─────────────────────────────────┘
```

Low-confidence or unmatched activities are sent to the planner for validation instead of being automatically committed.

### 6. Progress Synchronization

After validation, the actual progress is linked to the corresponding schedule activity.

```text
Activity: PIP-102
----------------------------
Planned Start : 10 Sept
Planned Finish: 15 Sept

Actual Start  : 11 Sept
Actual Finish : 12 Sept

Status        : Completed
```

### 7. Project Analytics

The updated information is reflected in the project dashboard, allowing users to monitor:

* Planned vs actual progress
* Completed activities
* Delayed activities
* Activity-level schedule performance
* Recent execution updates

### 8. Supervisor / Time Agent Demo

The prototype can also demonstrate natural-language progress reporting.

Example:

> "Line 24 spool erection started today at 9 AM."

The system converts the statement into a structured progress event and links it with the relevant schedule activity.

### Demo Objective

The primary objective of the prototype demo is to show how SiteIntel connects **field execution data with the planned project schedule**, reducing manual reconciliation while maintaining confidence-based validation and traceability.

```text
       PLANNING
          │
    L5/L6 Schedule
          │
          ▼
     ┌──────────┐
     │ SITEINTEL │
     │ AI BRIDGE │
     └─────┬────┘
           │
           ▼
      SITE EXECUTION
           │
      Actual Progress
           │
           ▼
       ANALYTICS
```

## Benefits

### For Site Supervisors

* Easier progress reporting
* Natural-language interaction
* Less manual data entry
* Faster communication of actual progress

### For Project Planners

* Reduced manual reconciliation
* Faster identification of actual progress
* Confidence-based review
* Better traceability

### For Project Managers

* Improved visibility into execution
* Better schedule alignment
* More structured progress information
* Historical execution insights

### For Organizations

* Reduced dependency on manually reconciled reports
* Structured project execution knowledge
* Better foundation for analytics and forecasting
* Reusable institutional knowledge

---

## Future Scope

Potential future enhancements include:

* Advanced voice-based reporting
* Production-grade OCR
* Direct PMIS / Primavera integration
* Automated delay-risk detection
* Project completion forecasting
* Productivity analytics
* Cross-project execution pattern analysis
* Advanced project knowledge search
* Enterprise-scale deployment

---

## Technology Concept

```text
Frontend
   ↓
Backend / API
   ↓
AI Processing Layer
   ├── LLM / NLP
   ├── Embedding Model
   ├── Semantic Similarity
   └── Fuzzy Matching
   ↓
Matching & Validation Engine
   ↓
Project Data Repository
   ↓
Dashboard / Schedule Integration
```

---

## Why SiteIntel?

SiteIntel is designed around one central idea:

> **Connect what was planned with what actually happened at the site.**

Instead of replacing existing project-management systems, SiteIntel acts as an intelligent bridge between field execution and structured project planning.

```text
                 PLAN
                  │
             L5/L6 Schedule
                  │
                  ▼
           ┌──────────────┐
           │  SITEINTEL   │
           │  AI BRIDGE   │
           └──────┬───────┘
                  │
                  ▼
               EXECUTE
                  │
          Actual Site Progress
                  │
                  ▼
              LEARN
                  │
        Historical Knowledge
```

---

## Status

**Prototype / SIH Project**

SiteIntel is being developed as a prototype for intelligent infrastructure project progress tracking and planning-to-execution synchronization.

---

## Project

**Smart India Hackathon**

**Problem Statement:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management

**Project Name:** SiteIntel
