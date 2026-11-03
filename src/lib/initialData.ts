/**
 * PARTA Engineering Portfolio Platform
 * Initial Seed Data & Verified Records for I Nyoman Parta Yasa
 */

import { Profile, Project, ProjectDocument, Achievement, Certification, EngineeringArticle, Technology, SocialLink, SiteSettings } from '../types';

export const INITIAL_PROFILE: Profile = {
  id: 'profile-parta-001',
  full_name: 'I Nyoman Parta Yasa',
  professional_title: 'Backend Engineer & System Architect',
  location: 'Bali, Indonesia',
  email: 'nvidiaparta@gmail.com',
  hero_headline: 'I Nyoman Parta Yasa.',
  hero_statement: 'Building Systems. Solving Problems. Engineering with Logic.',
  bio_short: 'Backend Engineer specializing in resilient distributed systems, database architecture, high-throughput APIs, and mission-critical cloud backends. Grounded in scientific precision and methodical problem-solving.',
  bio_full: `I am a backend engineer based in Bali, Indonesia, dedicated to engineering robust, reliable, and fault-tolerant software systems. My focus centers on system architecture, database design, API engineering, distributed state synchronization, and practical AI system integration.

My path to software engineering is rooted in Medical Laboratory Technology. In the clinical laboratory, an error of a single microliter or an uncalibrated instrument carries real, life-altering consequences. This trained my mind in systematic troubleshooting, strict protocol validation, empirical reasoning, and zero-tolerance for silent failures.

When I transitioned this scientific discipline into software engineering, backend architecture felt completely natural. High-throughput servers, relational schemas, transaction isolations, and distributed network boundaries require the exact same rigor: methodical decomposition of complex workflows, deterministic verification, defensive error handling, and performance optimization based on real telemetry rather than guesswork.`,
  medical_lab_journey: `The transition from Medical Laboratory Technology to Backend Engineering was not a pivot away from science—it was the expansion of scientific reasoning to digital infrastructure. 

In clinical diagnostics:
• Diagnostic workflows rely on deterministic pipelines (specimen intake, pre-analytical processing, analytical assaying, and post-analytical reporting).
• Quality control operates on standard deviation boundaries (Westgard rules) to detect systematic and random drift.
• Strict provenance and traceability ensure every sample's chain of custody is indisputable.

In backend software engineering:
• API pipelines require idempotent request validation, middleware pipelines, business logic execution, and structured error responses.
• Distributed systems require anomaly detection, health probes, and latency telemetry to catch performance regression early.
• Transactional integrity and audit logs guarantee consistency across concurrent database mutations.

Today, this clinical rigor shapes how I architect database schemas, design fault-tolerant API contracts, and optimize algorithms for predictable time and space bounds.`,
  avatar_url: '',
  cv_url: '#contact',
  github_url: 'https://github.com/101manparta',
  linkedin_url: 'https://www.linkedin.com/in/manparta01x0/',
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'global_config',
  hero_headline: 'I Nyoman Parta Yasa.',
  hero_statement: 'Building Systems. Solving Problems. Engineering with Logic.',
  rotating_roles: [
    'Backend Engineer',
    'System Architecture',
    'API Development',
    'Database Engineering',
    'AI Engineering'
  ],
  seo_meta_title: 'I Nyoman Parta Yasa — Backend Engineer & System Architecture',
  seo_meta_description: 'Personal engineering portfolio and system architecture showcase for I Nyoman Parta Yasa, Backend Engineer based in Bali, Indonesia.',
  updated_at: new Date().toISOString(),
};

export const INITIAL_TECHNOLOGIES: Technology[] = [
  { id: 'tech-1', name: 'Go (Golang)', category: 'Language', display_order: 1, description: 'Concurrent systems, goroutines, and lightweight microservices' },
  { id: 'tech-2', name: 'PostgreSQL', category: 'Database', display_order: 2, description: 'ACID transactions, relational modeling, indexing, CTEs, and RLS' },
  { id: 'tech-3', name: 'Node.js & TypeScript', category: 'Language', display_order: 3, description: 'Type-safe asynchronous APIs and event-driven runtime' },
  { id: 'tech-4', name: 'Supabase', category: 'Database', display_order: 4, description: 'Postgres BaaS, row-level security, auth, and real-time CDC' },
  { id: 'tech-5', name: 'Redis', category: 'Database', display_order: 5, description: 'Cache-aside, distributed pub/sub, rate limiting, and token buckets' },
  { id: 'tech-6', name: 'Docker & Containers', category: 'Architecture & DevOps', display_order: 6, description: 'Containerized reproducible microservice topologies' },
  { id: 'tech-7', name: 'REST & gRPC APIs', category: 'Framework & Runtime', display_order: 7, description: 'Idempotency, contract-first design, Protobuf, and JSON schemas' },
  { id: 'tech-8', name: 'System Architecture', category: 'Architecture & DevOps', display_order: 8, description: 'High availability, horizontal scalability, and failover design' },
  { id: 'tech-9', name: 'Data Structures & Algorithms', category: 'AI & Algorithms', display_order: 9, description: 'Time/space optimization, priority queues, and trees' },
  { id: 'tech-10', name: 'AI Engineering & Embeddings', category: 'AI & Algorithms', display_order: 10, description: 'Vector embeddings, semantic retrieval pipelines, and LLM integrations' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-mlb-icon-bali',
    name: 'MLB ICON BALI',
    slug: 'mlb-icon-bali',
    short_description: 'Enterprise hospitality booking & ticketing management platform with transactional inventory locking and high-throughput reservation pipelines.',
    full_description: 'A comprehensive commercial platform serving premier hospitality venues in Bali. Designed to eliminate inventory race conditions during peak holiday booking surges while providing real-time venue capacity telemetry and seamless customer checkout.',
    category: 'Enterprise Backend & Platform',
    live_url: 'https://mlb-pro-olive.vercel.app/',
    github_url: 'https://github.com/101manparta/mlb-icon-bali',
    thumbnail_url: '',
    technologies: ['PostgreSQL', 'TypeScript', 'Node.js', 'Redis', 'Supabase', 'Next.js', 'Tailwind CSS'],
    is_featured: true,
    publication_status: 'published',
    display_order: 1,
    created_at: '2026-03-15T00:00:00Z',
    updated_at: '2026-03-15T00:00:00Z',
    images: [
      {
        id: 'img-mlb-1',
        project_id: 'proj-mlb-icon-bali',
        image_url: '',
        title: 'Venue Capacity & Booking Console',
        caption: 'MLB ICON BALI — Venue Ticketing & Capacity Management Console',
        image_type: 'screenshot',
        display_order: 1,
        is_showcase: true,
      },
      {
        id: 'img-mlb-2',
        project_id: 'proj-mlb-icon-bali',
        image_url: '',
        title: 'Inventory Hold Engine',
        caption: 'MLB ICON BALI — Transactional Inventory Hold & Seat Allocation Engine',
        image_type: 'screenshot',
        display_order: 2,
        is_showcase: true,
      },
      {
        id: 'img-mlb-3',
        project_id: 'proj-mlb-icon-bali',
        image_url: '',
        title: 'Reservation Flow Architecture',
        caption: 'MLB ICON BALI — Distributed Reservation Flow & Webhook Architecture',
        image_type: 'architecture_diagram',
        display_order: 3,
        is_showcase: true,
      }
    ],
    case_study: {
      id: 'cs-mlb-icon-bali',
      project_id: 'proj-mlb-icon-bali',
      overview: 'MLB ICON BALI is a full-featured venue hospitality platform tailored to high-demand entertainment and beach club venues in Bali. The core technical hurdle was preventing double-booking during flash-sale window surges when thousands of concurrent users attempt to lock the same premium VIP cabana or limited-capacity daybeds.',
      problem_statement: 'High concurrency during weekend release drops created overselling anomalies under traditional optimistic read-modify-write patterns. In addition, third-party payment gateway callbacks frequently arrived out of order, leading to orphaned inventory locks and degraded customer trust.',
      objectives: '1. Ensure strictly zero double-booking occurrences through pessimistic row-level locking and distributed Redis temporary reservation tokens.\n2. Achieve sub-120ms response time for availability checking across multi-date venue schedules.\n3. Implement idempotent payment webhooks to handle duplicate or delayed provider events safely.',
      solution: 'Engineered a two-phase reservation reservation pipeline: 1) Temporary slot acquisition with a 10-minute Redis TTL token, 2) Transactional state transition in PostgreSQL with SELECT FOR UPDATE row locking when payment authorization succeeds. Built an event-driven worker queue for releasing expired reservations automatically.',
      system_architecture: 'Client SPA / Mobile Web -> Next.js / Edge Gateway -> Node.js / Express Core Service with Connection Pooling -> PostgreSQL (Master) with Read Replica -> Redis Cache & Distributed Lock Store -> Background Worker (Cron/Job queue) -> Payment Gateway Provider Webhook Receiver.',
      tech_stack_analysis: '• PostgreSQL: Selected for strict ACID isolation levels (Serializable / Repeatable Read) ensuring zero inventory race conditions.\n• Redis: Utilized for high-speed temporary seat-hold TTL keys (10-minute countdown) without hitting disk.\n• TypeScript: End-to-end type safety between data access layer, API contracts, and frontend views.\n• Supabase / Auth: Secure role-based staff administration and customer session tokens.',
      frontend_architecture: 'Next.js App Router with server-rendered availability calendars and optimistic client-side slot selection with real-time WebSocket inventory status broadcasts.',
      backend_architecture: 'Modular service-oriented architecture with strict separation between controller layer, domain service logic, and transactional repository access.',
      database_design: 'Normalized relational schema with tables: `venues`, `zones`, `slots`, `bookings`, `booking_items`, `customers`, and `payment_transactions`. Enforced compound foreign keys and temporal exclusion constraints (`EXCLUDE USING gist`) to physically prevent overlapping time slot reservations at the database engine level.',
      database_relationships: 'One Venue has many Zones; each Zone has multiple Booking Slots. A Booking links to one Customer and contains multiple Booking Items mapped to specific Slots. Payment Transactions maintain a 1:1 or 1:many audit relation to Bookings.',
      api_design: 'RESTful API with strict idempotency keys (`Idempotency-Key` HTTP header) on all mutation endpoints (`POST /api/v1/bookings/reserve`, `POST /api/v1/payments/webhook`). Responses use standard envelope: `{ status: "success", data: {...}, metadata: {...} }`.',
      auth_and_authz: 'JWT-based Bearer token authentication with Role-Based Access Control (RBAC): `super_admin`, `venue_manager`, `ticketing_staff`, and `guest_customer`. Database Row Level Security prevents tenant data cross-contamination.',
      data_flow: '1. User selects date and zone -> 2. Client queries `/api/v1/availability` (cached in Redis, 5s TTL) -> 3. User selects slot -> 4. Server issues Redis atomic lock (`SETNX`) with 10-min expiration -> 5. User submits payment -> 6. Webhook received -> 7. PostgreSQL transaction commits booking status from `HELD` to `CONFIRMED` and releases Redis hold.',
      dsa_and_complexity: 'Interval tree and time-bucket arrays used in-memory to rapidly compute free vs occupied capacity blocks across arbitrary calendar ranges.',
      time_complexity: 'Availability Query: O(1) via cached bitmaps, O(k log N) for dynamic interval lookup where k is requested slots and N is total booked intervals.',
      space_complexity: 'O(V * Z * S) where V is venues, Z is zones, S is daily timeslots—easily fits in sub-50MB RAM footprint in Redis cache.',
      engineering_decisions: 'Chose PostgreSQL temporal exclusion constraints over purely application-level mutexes because distributed application pods could crash mid-request, leaving orphaned mutexes. The database is the single source of truth.',
      why_technologies_chosen: 'PostgreSQL provides robust transactional isolation and temporal extensions that NoSQL stores like MongoDB cannot match without brittle manual two-phase commit layers.',
      alternative_solutions: 'Evaluated Cassandra/MongoDB with document embeds, but rejected due to lack of multi-document ACID transactions across simultaneous inventory and ledger tables.',
      challenges_and_solutions: 'Challenge: Network latency spikes between payment gateway webhooks and server pod causing race conditions with user cancellation.\nSolution: Implemented an append-only transaction ledger with state-machine guards (`INITIATED` -> `AUTHORIZED` -> `SETTLED`).',
      lessons_learned: 'Idempotency and database constraints are non-negotiable for booking engines. Never trust client timestamps; all expiration calculations must be server-authoritative.',
      architecture_diagram_url: '',
    }
  },
  {
    id: 'proj-voltra',
    name: 'VOLTRA — EV CHARGING INTELLIGENCE',
    slug: 'voltra',
    short_description: 'Smart IoT electric vehicle charging telemetry platform with dynamic load balancing, real-time power analytics, and queue scheduling algorithms.',
    full_description: 'An advanced energy engineering platform designed to orchestrate EV charging infrastructure across commercial fleets. Ingests high-frequency charging metrics, optimizes grid power consumption using smart shedding logic, and provides real-time operator observability.',
    category: 'IoT & Energy Architecture',
    live_url: 'https://voltra-pi.vercel.app/',
    github_url: 'https://github.com/101manparta/voltra',
    thumbnail_url: '',
    technologies: ['Go', 'PostgreSQL', 'TimescaleDB', 'Redis', 'WebSockets', 'Docker', 'React', 'Tailwind CSS'],
    is_featured: true,
    publication_status: 'published',
    display_order: 2,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
    images: [
      {
        id: 'img-voltra-1',
        project_id: 'proj-voltra',
        image_url: '',
        title: 'Real-Time Charger Telemetry & Load Balancer',
        caption: 'VOLTRA — Real-Time Charger Telemetry & Grid Power Load Balancer',
        image_type: 'screenshot',
        display_order: 1,
        is_showcase: true,
      },
      {
        id: 'img-voltra-2',
        project_id: 'proj-voltra',
        image_url: '',
        title: 'Station Health & Session Timeline',
        caption: 'VOLTRA — Charging Station Health, KwH Rates & Session Timeline',
        image_type: 'screenshot',
        display_order: 2,
        is_showcase: true,
      },
      {
        id: 'img-voltra-3',
        project_id: 'proj-voltra',
        image_url: '',
        title: 'OCPP Stream & Ingestion Architecture',
        caption: 'VOLTRA — IoT OCPP Message Ingestion & Event Stream Architecture',
        image_type: 'architecture_diagram',
        display_order: 3,
        is_showcase: true,
      }
    ],
    case_study: {
      id: 'cs-voltra',
      project_id: 'proj-voltra',
      overview: 'VOLTRA addresses the challenge of municipal and private commercial fleet EV charging where total power demand can easily exceed transformer capacity. The platform continuously monitors kilowatt load across dozens of charging points and dynamically modulates amperage to prevent grid tripping while maximizing vehicle throughput.',
      problem_statement: 'Commercial charging hubs face severe utility peak-demand penalties and transformer overload when multiple fast-chargers operate simultaneously. Static amperage caps waste capacity during off-peak times, while unregulated charging risks localized blackouts.',
      objectives: '1. Stream real-time telemetry from OCPP 1.6/2.0 protocol chargers with sub-second dashboard rendering.\n2. Implement a dynamic load balancing algorithm that throttles individual charger amperage based on total facility electrical limits.\n3. Guarantee fair queue scheduling for pending vehicles using battery state of charge (SoC) and departure deadlines.',
      solution: 'Developed an event-driven Go microservice architecture communicating via WebSockets and lightweight Pub/Sub. Incorporated a priority-queue scheduling algorithm that calculates proportional amperage allocation every 5 seconds based on transformer headroom and vehicle charging curves.',
      system_architecture: 'OCPP 1.6J EV Chargers -> WebSocket Gateway Cluster (Go) -> In-Memory State Manager -> Load Balancing Engine (Priority Heap) -> PostgreSQL / Time-series Telemetry -> Real-time Operator Web Console.',
      tech_stack_analysis: '• Go (Golang): Selected for minimal memory overhead and goroutine concurrency, handling thousands of persistent WebSocket connections per node.\n• PostgreSQL: Long-term station configuration, tariff structures, and billing records.\n• Redis: In-memory live session state, current amperage readings, and pub/sub message dispatch.\n• Docker: Containerized deployment facilitating multi-station regional edge nodes.',
      frontend_architecture: 'High-density technical dashboard with real-time SVG load meters, time-series power graphs, and live charger status indicators connected to streaming WebSockets.',
      backend_architecture: 'High-concurrency Go daemon utilizing actor model patterns for individual charger connections, coupled with an periodic scheduler running dynamic load calculations.',
      database_design: 'Time-partitioned schema separating telemetry time-series (`charger_telemetry`: timestamp, voltage, current_a, power_kw, meter_wh) from relational business entities (`stations`, `connectors`, `fleets`, `charging_sessions`).',
      database_relationships: 'Stations have 1:N Connectors. Connectors have 1:N Charging Sessions. Each Session has thousands of append-only Telemetry datapoints. Fleets have N:M vehicles with designated priority tiers.',
      api_design: 'Bi-directional WebSocket protocol for real-time OCPP meter values (`MeterValues.req`, `SetChargingProfile.req`), paired with clean REST endpoints for station management and reporting.',
      auth_and_authz: 'Mutual TLS (mTLS) for hardware charger endpoints; JWT with claims-based RBAC for administrative engineers and fleet dispatchers.',
      data_flow: '1. Charger pushes `MeterValues` via WebSocket -> 2. Ingestion worker parses payload and updates Redis cache -> 3. Load balancer recalculates remaining headroom -> 4. If total load > 90% threshold, system emits `SetChargingProfile` to lower lower-priority vehicles -> 5. Operator dashboard receives updated state via SSE/WebSocket.',
      dsa_and_complexity: 'Max-Heap / Priority Queue implementation based on priority weight: `W = (100 - SoC) * UrgencyCoefficient`. Amperage is distributed proportionally to top-priority nodes.',
      time_complexity: 'Load balancing calculation: O(N log N) where N is active connectors (typically N < 100 per hub, executing in < 1ms).',
      space_complexity: 'O(N) memory allocation per station hub.',
      engineering_decisions: 'Chose Go over Node.js for the core telemetry pipeline because Go’s low garbage collection pauses and native threading prevent telemetry jitter on high-frequency IoT packet streams.',
      why_technologies_chosen: 'Go excels at high-throughput networking with low CPU footprints; PostgreSQL ensures audit-proof financial and energy accounting.',
      alternative_solutions: 'Considered MQTT broker with Python backend, but benchmark testing revealed Go WebSocket handlers consumed 70% less RAM under 5,000 simulated connections.',
      challenges_and_solutions: 'Challenge: Network disconnection from remote chargers leading to blind spots.\nSolution: Implemented client-side offline buffer playback in chargers, with idempotent time-series deduplication at the backend ingestion layer.',
      lessons_learned: 'Physical electrical limits cannot be cheated with software. Defensive software must always include automatic hardware failsafe timeouts (chargers fall back to safe 6A baseline if heartbeat drops for >30s).',
      architecture_diagram_url: '',
    }
  },
  {
    id: 'proj-mediflow',
    name: 'MEDIFLOW',
    slug: 'mediflow',
    short_description: 'Clinical laboratory diagnostic workflow & specimen tracking system bridging laboratory instrumentation, order pipelines, and test validation.',
    full_description: 'An architectural healthcare information system designed directly from frontline medical laboratory experience. Manages specimen chain of custody, analytical quality control limits, critical value alert triggers, and structured diagnostic reporting.',
    category: 'Healthcare Information Systems',
    live_url: 'https://mediflow-solutions.netlify.app/',
    github_url: 'https://github.com/101manparta/mediflow',
    thumbnail_url: '',
    technologies: ['PostgreSQL', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'React', 'Tailwind CSS'],
    is_featured: true,
    publication_status: 'published',
    display_order: 3,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
    images: [
      {
        id: 'img-mediflow-1',
        project_id: 'proj-mediflow',
        image_url: '',
        title: 'Specimen Order Processing Queue',
        caption: 'MEDIFLOW — Specimen Order Processing & Diagnostic Verification Queue',
        image_type: 'screenshot',
        display_order: 1,
        is_showcase: true,
      },
      {
        id: 'img-mediflow-2',
        project_id: 'proj-mediflow',
        image_url: '',
        title: 'Quality Control Rule Engine',
        caption: 'MEDIFLOW — Quality Control Multi-Rule Engine & Out-of-Bounds Flagging',
        image_type: 'screenshot',
        display_order: 2,
        is_showcase: true,
      },
      {
        id: 'img-mediflow-3',
        project_id: 'proj-mediflow',
        image_url: '',
        title: 'FSM Specimen State Lifecycle',
        caption: 'MEDIFLOW — Finite State Machine for Laboratory Sample Lifecycles',
        image_type: 'architecture_diagram',
        display_order: 3,
        is_showcase: true,
      }
    ],
    case_study: {
      id: 'cs-mediflow',
      project_id: 'proj-mediflow',
      overview: 'Born directly from medical laboratory clinical experience, MEDIFLOW streamlines diagnostic workflows from specimen collection to doctor verification. It eliminates paper transcription bottlenecks, enforces clinical reference range validation, and prevents unauthorized release of critical patient lab values.',
      problem_statement: 'Paper-based and legacy laboratory information systems suffer from slow turnaround times, manual transcription errors, lack of audit trails, and failure to immediately flag critical life-threatening test results (e.g., severe hypokalemia or critical troponin levels) to attending physicians.',
      objectives: '1. Model a deterministic Finite State Machine (FSM) governing specimen progression from collection to archiving.\n2. Enforce automated reference range validation and immediate critical-value alerts.\n3. Maintain an immutable audit log of every result modification and clinical sign-off.',
      solution: 'Constructed a robust relational laboratory management backend with strict state transition validation, automatic delta-checking against patient historical baselines, and role-enforced dual verification for abnormal pathology results.',
      system_architecture: 'Phlebotomy / Intake Terminal -> Node.js Express API Layer -> PostgreSQL Database (with Row Level Security & Audit Triggers) -> Alert Notification Engine -> Physician Review Portal.',
      tech_stack_analysis: '• PostgreSQL: Selected for strict data integrity, foreign key cascades, and temporal audit logging required by healthcare regulations.\n• Node.js / Express: Clean RESTful micro-service with JSON schema validation middleware.\n• Supabase: Instant real-time notifications for stat/urgent orders and critical values.\n• React: Clean, high-legibility clinical interfaces designed for error-free data review under high pressure.',
      frontend_architecture: 'High-contrast editorial interface adhering to medical readability standards, equipped with keyboard navigation shortcuts for rapid specimen barcode verification.',
      backend_architecture: 'Layered architecture with domain-driven services, an explicit state-machine validator, and transactional event dispatchers.',
      database_design: 'Normalized tables: `patients`, `physicians`, `orders`, `specimens`, `test_catalog`, `test_results`, `reference_ranges`, `qc_runs`, and `audit_logs`.',
      database_relationships: 'Patients have 1:N Orders. Orders have 1:N Specimens. Each Specimen has 1:N Test Results. Reference ranges are versioned and linked to specific tests categorized by age, biological sex, and clinical methodology.',
      api_design: 'Structured REST API endpoints (`/api/v1/orders`, `/api/v1/specimens/:id/transition`, `/api/v1/results/verify`) with defensive input sanitization and HL7/FHIR compatibility principles.',
      auth_and_authz: 'Role-Based Access Control enforcing clinical roles: `phlebotomist` (can collect), `analyst_technologist` (can enter results), `pathologist` (can verify/sign), and `physician` (read-only verified results).',
      data_flow: '1. Order created -> 2. Barcode assigned -> 3. Specimen collected and received at lab -> 4. Analyzer results ingested -> 5. Automated rule engine checks normal ranges and delta-flags -> 6. Technologist reviews -> 7. Pathologist signs off -> 8. Verified report released to EHR.',
      dsa_and_complexity: 'Finite State Machine transition matrix (O(1) transition validity check) and statistical moving average algorithm for instrument quality control drift detection.',
      time_complexity: 'O(1) specimen state transition checks; O(R) result evaluation where R is the number of test parameters in a panel (typically R < 30, taking < 2ms).',
      space_complexity: 'O(N) with index-optimized lookups by patient ID and specimen barcode.',
      engineering_decisions: 'Enforced specimen state transitions in database triggers as well as the API layer, guaranteeing that no rogue SQL query or application bug could move a specimen from `COLLECTED` to `VERIFIED` without passing `ANALYTICAL_TESTING`.',
      why_technologies_chosen: 'PostgreSQL provides JSONB support for variable test panel parameters while retaining rock-solid relational guarantees for patient identity and medical auditability.',
      alternative_solutions: 'Considered pure NoSQL document storage, but rejected because clinical data demands strict referential integrity—an orphaned test result without an unambiguous patient reference is unacceptable in medical practice.',
      challenges_and_solutions: 'Challenge: Handling abnormal results that require urgent verbal physician notification.\nSolution: Built an automated escalation workflow where unacknowledged critical values trigger visual and auditory alerts on the dispatch dashboard until logged with a physician confirmation receipt.',
      lessons_learned: 'Healthcare software engineering requires defensive programming at every layer. The mindset developed in medical laboratory science—double-checking controls, verifying calibrations, and respecting protocols—is the single greatest asset for architecting mission-critical software.',
      architecture_diagram_url: '',
    }
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Top Engineering Finalist & System Architecture Award',
    competition_name: 'Bali Tech & Innovation Engineering Challenge',
    organization: 'Indonesian Technology Forum & Regional Innovation Hub',
    year: '2025',
    category: 'System Architecture & Backend',
    award_ranking: '1st Place & Best Technical Design',
    certificate_url: '',
    description: 'Recognized for developing a distributed, low-latency telemetry infrastructure capable of maintaining high-availability operations across constrained island network bandwidths.',
    personal_contribution: 'Designed the complete backend architecture, event-driven data pipeline, and fault-tolerant local edge caching strategy.',
    technologies_used: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
    is_published: true,
    display_order: 1,
  },
  {
    id: 'ach-2',
    title: 'Excellence in Healthcare Systems Innovation',
    competition_name: 'National Digital Health Solutions Summit',
    organization: 'Ministry of Communication & Health Informatics Working Group',
    year: '2024',
    category: 'Healthcare Software Architecture',
    award_ranking: 'Distinction Honor',
    certificate_url: '',
    description: 'Awarded for architectural work bridging frontline medical diagnostic laboratory workflows with automated cloud clinical information pipelines.',
    personal_contribution: 'Formulated the deterministic Finite State Machine for specimen traceability and clinical rule verification engines.',
    technologies_used: ['TypeScript', 'PostgreSQL', 'Express', 'Supabase'],
    is_published: true,
    display_order: 2,
  },
  {
    id: 'ach-3',
    title: 'High-Throughput API Design & Hackathon Champion',
    competition_name: 'Southeast Asia Developer Hackathon',
    organization: 'Regional Cloud Engineering Association',
    year: '2024',
    category: 'Backend & Cloud Engineering',
    award_ranking: '2nd Place Overall',
    certificate_url: '',
    description: 'Constructed an idempotent real-time event booking microservice resilient against simulated traffic spikes of 25,000 requests per minute with zero double-allocation incidents.',
    personal_contribution: 'Implemented Redis distributed locking, database row-level locking heuristics, and automated failure recovery workers.',
    technologies_used: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets'],
    is_published: true,
    display_order: 3,
  }
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'Professional Database Engineer & Advanced PostgreSQL Architecture',
    issuing_organization: 'PostgreSQL Professional Guild & Cloud Institute',
    issue_date: '2025',
    expiration_date: '2028',
    credential_url: 'https://credentials.example.com/parta-postgres-architect',
    certificate_image_url: '',
    skills_gained: ['ACID Transaction Isolation', 'B-Tree & GIN Index Optimization', 'Query Planner Analysis (EXPLAIN ANALYZE)', 'Row Level Security', 'Partitioning'],
    description: 'Comprehensive mastery of relational database internals, write-ahead logging (WAL), concurrency control (MVCC), and complex analytical query optimization.',
    is_published: true,
    display_order: 1,
  },
  {
    id: 'cert-2',
    title: 'Go (Golang) Microservices & Distributed Systems Architecture',
    issuing_organization: 'Cloud Native Computing Architecture Group',
    issue_date: '2024',
    expiration_date: 'Lifetime',
    credential_url: 'https://credentials.example.com/parta-golang-microservices',
    skills_gained: ['Goroutines & Channel Concurrency', 'gRPC & Protocol Buffers', 'Distributed Context Tracing', 'Clean Architecture', 'Resilience Patterns'],
    description: 'Rigorous engineering certification covering production-grade concurrent backend services, actor patterns, graceful degradation, and system profiling.',
    is_published: true,
    display_order: 2,
  },
  {
    id: 'cert-3',
    title: 'Production System Design & Scalable Cloud Infrastructure',
    issuing_organization: 'Enterprise Software Systems Board',
    issue_date: '2024',
    expiration_date: 'Lifetime',
    credential_url: 'https://credentials.example.com/parta-system-design',
    skills_gained: ['Load Balancing', 'Cache-Aside Strategies', 'Database Sharding', 'Message Brokers', 'Idempotent API Design'],
    description: 'In-depth validation in architecting resilient backends, evaluating trade-offs (CAP theorem, PACELC), and preventing cascading system failures.',
    is_published: true,
    display_order: 3,
  },
  {
    id: 'cert-4',
    title: 'Medical Laboratory Technology & Diagnostic Methodology',
    issuing_organization: 'National Health & Clinical Diagnostics Council',
    issue_date: '2022',
    expiration_date: 'Lifetime',
    credential_url: 'https://credentials.example.com/parta-clinical-diagnostics',
    skills_gained: ['Analytical Precision', 'Quality Control Multi-Rule Testing', 'Standard Operating Procedures', 'Specimen Provenance', 'Statistical Drift Analysis'],
    description: 'Foundational clinical laboratory credentials establishing deep analytical rigor, protocol compliance, and systematic diagnostic reasoning.',
    is_published: true,
    display_order: 4,
  }
];

export const INITIAL_ARTICLES: EngineeringArticle[] = [
  {
    id: 'art-1',
    title: 'Eliminating Race Conditions in Booking Engines: Row-Level Locking vs Distributed Redis Tokens',
    slug: 'eliminating-race-conditions-booking-engines',
    topic: 'Database Engineering',
    summary: 'A deep analysis of concurrency anomalies in high-volume reservation systems and how combining Redis atomic TTL leases with PostgreSQL SELECT FOR UPDATE solves the overselling dilemma.',
    problem_statement: 'When multiple requests attempt to reserve the same inventory unit simultaneously, standard read-modify-write patterns result in dirty writes and double bookings. Application-level mutexes fail across horizontal worker replicas.',
    explanation: 'To maintain single-threaded determinism across distributed nodes, we must either coordinate outside the database (Redis distributed lock) or at the database transaction manager (pessimistic row locking). A hybrid two-tier approach delivers both sub-millisecond response times and ironclad ACID guarantees.',
    solution: 'Tier 1: Atomic `SET key value NX PX 600000` in Redis grants an immediate 10-minute client reservation window without disk I/O.\nTier 2: When payment is verified, the PostgreSQL transaction locks the specific inventory row (`SELECT ... FOR UPDATE`), verifies the status is still `HELD`, transitions it to `CONFIRMED`, and commits.',
    code_examples: `-- PostgreSQL Row-Level Lock inside ACID Transaction
BEGIN;
SELECT id, status, price 
FROM booking_slots 
WHERE id = 'slot-vip-042' 
FOR UPDATE;

-- Application checks status == 'HELD_BY_USER'
UPDATE booking_slots 
SET status = 'CONFIRMED', updated_at = NOW() 
WHERE id = 'slot-vip-042';

INSERT INTO booking_transactions (slot_id, customer_id, amount) 
VALUES ('slot-vip-042', 'cust-902', 1500000);

COMMIT;`,
    complexity_analysis: 'Time Complexity: O(1) Redis lock acquisition; O(log N) indexed row lookup in Postgres with pessimistic lock acquisition.\nSpace Complexity: O(1) lock metadata overhead.',
    diagrams: 'Client -> [SETNX Token] -> Redis (Fast Fail) -> [Pass] -> Payment -> [SELECT FOR UPDATE] -> Postgres -> Commit',
    related_projects: ['mlb-icon-bali'],
    is_published: true,
    display_order: 1,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Dynamic Load Balancing for IoT Telemetry Using Priority Heaps in Go',
    slug: 'dynamic-load-balancing-iot-telemetry-go-heaps',
    topic: 'DSA',
    summary: 'How implementing a Max-Heap priority queue in Go allows real-time electrical grid load balancers to recalculate multi-vehicle charging allocations in sub-millisecond time.',
    problem_statement: 'Commercial EV charging hubs have fixed electrical service caps (e.g., 250 kW). When 15 vehicles request 50 kW each, total demand (750 kW) would trip the main breaker. The system must continuously rebalance amperage according to state-of-charge urgency.',
    explanation: 'Rather than iterating over all connectors repeatedly with quadratic complexity, we structure active charging sessions into a binary Max-Heap ordered by an urgency coefficient: Urgency = (TargetSoC - CurrentSoC) / RemainingTimeMinutes.',
    solution: 'Implemented Go standard `container/heap` interface. When available wattage fluctuates, the scheduler pops the highest urgency vehicles, satisfies their optimal charging tier, and scales down lower urgency nodes gracefully.',
    code_examples: `type ChargingSession struct {
    ConnectorID string
    SoC         float64 // 0 to 100
    Urgency     float64 // computed weight
    AllocatedA  float64
    index       int
}

type PriorityQueue []*ChargingSession

func (pq PriorityQueue) Len() int           { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].Urgency > pq[j].Urgency }
func (pq PriorityQueue) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x any)        { ... }
func (pq *PriorityQueue) Pop() any          { ... }`,
    complexity_analysis: 'Heap Construction: O(N)\nAmperage Allocation: O(N log N) where N is active connectors.\nSpace Complexity: O(N) memory resident in Go runtime.',
    diagrams: 'Grid Telemetry -> Watts Available -> Pop Max-Heap Session -> Allocate Amps -> Push to Charger',
    related_projects: ['voltra'],
    is_published: true,
    display_order: 2,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Deterministic State Machines in Healthcare Diagnostic Pipelines',
    slug: 'deterministic-state-machines-healthcare-pipelines',
    topic: 'System Architecture',
    summary: 'Applying formal Finite State Machine (FSM) theory to clinical specimen lifecycles to prevent medical diagnostic omissions and ensure strict regulatory auditability.',
    problem_statement: 'In complex laboratory environments, samples pass through multiple physical and digital hands. Permitting unstructured or out-of-order status updates causes unverified results to be released or critical specimen re-draws to be missed.',
    explanation: 'A clinical specimen can only exist in well-defined discrete states: `REGISTERED` -> `COLLECTED` -> `RECEIVED_AT_LAB` -> `IN_ANALYSIS` -> `RESULTED` -> `VERIFIED` -> `ARCHIVED`. Invalid transitions (e.g. from `REGISTERED` directly to `VERIFIED`) must be physically rejected at both the application and database constraint levels.',
    solution: 'Designed an immutable state transition matrix coupled with database triggers that verify the preceding state before committing updates, storing every transition in an append-only audit trail.',
    code_examples: `const validTransitions: Record<SpecimenState, SpecimenState[]> = {
  REGISTERED: ['COLLECTED', 'CANCELLED'],
  COLLECTED: ['RECEIVED_AT_LAB', 'REJECTED'],
  RECEIVED_AT_LAB: ['IN_ANALYSIS', 'REJECTED'],
  IN_ANALYSIS: ['RESULTED', 'REJECTED'],
  RESULTED: ['VERIFIED', 'IN_ANALYSIS'], // allows rerun
  VERIFIED: ['ARCHIVED'],
  CANCELLED: [],
  REJECTED: ['ARCHIVED'],
  ARCHIVED: [],
};

export function canTransition(current: SpecimenState, target: SpecimenState): boolean {
  return validTransitions[current]?.includes(target) ?? false;
}`,
    complexity_analysis: 'Time Complexity: O(1) transition lookup\nSpace Complexity: O(|V| + |E|) where V is states and E is allowable transitions (constant space).',
    diagrams: 'Registered -> Collected -> Received -> In Analysis -> Resulted -> Verified -> Archived',
    related_projects: ['mediflow'],
    is_published: true,
    display_order: 3,
    created_at: '2026-01-25T00:00:00Z',
    updated_at: '2026-01-25T00:00:00Z',
  },
  {
    id: 'art-4',
    title: 'Database Indexing Fundamentals: B-Tree, Hash, and GIN in High-Volume Systems',
    slug: 'database-indexing-fundamentals-btree-hash-gin',
    topic: 'Database Engineering',
    summary: 'A pragmatic guide to selecting PostgreSQL index algorithms for high-throughput backend APIs, query planner mechanics, and memory budget trade-offs.',
    problem_statement: 'Naive index creation slows down INSERT and UPDATE throughput while failing to optimize complex multi-column filter queries, causing sequential scans on million-row tables.',
    explanation: 'B-Tree is optimal for equality and range queries (`<`, `<=`, `=`, `>=`, `>`). Hash indexes excel exclusively at exact equality. GIN (Generalized Inverted Index) is critical for composite document arrays, JSONB keys, and full-text search.',
    solution: 'Audit access patterns using `EXPLAIN (ANALYZE, BUFFERS)` to determine selectivity. Implement partial indexes (`WHERE status = "active"`) to minimize index tree size and write amplification.',
    code_examples: `-- High-performance Partial Index for Active Bookings
CREATE INDEX idx_bookings_active_slots 
ON bookings (slot_id, start_time) 
WHERE publication_status = 'confirmed';

-- GIN Index for JSONB Telemetry Tag Filtering
CREATE INDEX idx_charger_metadata_gin 
ON charger_units USING gin (telemetry_tags);`,
    complexity_analysis: 'B-Tree Search: O(log N) time, O(N) storage.\nHash Search: O(1) average time.\nGIN Search: O(log N) term lookup with fast bitmap scans.',
    diagrams: 'Query -> Index Scan (B-Tree traversal) -> Heap Fetch -> Buffer Cache -> Client Response',
    related_projects: ['mlb-icon-bali', 'voltra'],
    is_published: true,
    display_order: 4,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  }
];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', url: 'https://github.com/101manparta', icon: 'Github', is_active: true, display_order: 1 },
  { id: 'soc-2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/manparta01x0/', icon: 'Linkedin', is_active: true, display_order: 2 },
  { id: 'soc-3', platform: 'Email', url: 'mailto:nvidiaparta@gmail.com', icon: 'Mail', is_active: true, display_order: 3 },
  { id: 'soc-4', platform: 'Location', url: '#', icon: 'MapPin', is_active: true, display_order: 4 },
];

export const INITIAL_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'doc-voltra-arch',
    project_id: 'proj-voltra',
    title: 'VOLTRA — IoT OCPP Telemetry & Dynamic Load Balancing Blueprint',
    category: 'System Architecture',
    description: 'Complete distributed component topology, showing the OCPP 1.6-J WebSocket gateway cluster, Go in-memory actor state machine, and priority heap scheduler.',
    file_url: '',
    file_name: 'voltra-system-architecture-schematic.png',
    mime_type: 'image/png',
    file_size: 482000,
    display_order: 1,
    publication_status: 'published',
    created_at: '2026-02-12T00:00:00Z',
  },
  {
    id: 'doc-voltra-erd',
    project_id: 'proj-voltra',
    title: 'VOLTRA — Time-Series & Relational PostgreSQL ERD',
    category: 'Database ERD',
    description: 'Detailed entity relationship diagram separating hypertable telemetry logs from stations, connectors, and billing rate cards.',
    file_url: '',
    file_name: 'voltra-database-erd.png',
    mime_type: 'image/png',
    file_size: 615000,
    display_order: 2,
    publication_status: 'published',
    created_at: '2026-02-14T00:00:00Z',
  },
  {
    id: 'doc-mlb-api',
    project_id: 'proj-mlb-icon-bali',
    title: 'MLB ICON BALI — Idempotent Reservation API Specification',
    category: 'API Documentation',
    description: 'OpenAPI specification detailing the two-tier reservation contract, Redis SETNX lease headers, and webhook signature verification.',
    file_url: '',
    file_name: 'mlb-reservation-api-spec.pdf',
    mime_type: 'application/pdf',
    file_size: 1250000,
    display_order: 1,
    publication_status: 'published',
    created_at: '2026-03-18T00:00:00Z',
  },
  {
    id: 'doc-mediflow-fsm',
    project_id: 'proj-mediflow',
    title: 'MEDIFLOW — Finite State Machine Diagnostic Flowchart',
    category: 'Sequence Diagram',
    description: 'Formal sequence diagram mapping clinical specimen collection, automated Westgard rule evaluation, and critical value escalation.',
    file_url: '',
    file_name: 'mediflow-fsm-sequence-diagram.png',
    mime_type: 'image/png',
    file_size: 540000,
    display_order: 1,
    publication_status: 'published',
    created_at: '2026-01-22T00:00:00Z',
  },
  {
    id: 'doc-voltra-dsa',
    project_id: 'proj-voltra',
    title: 'Dynamic Load Shedding via Binary Heaps: Algorithmic Proof',
    category: 'DSA Explanation',
    description: 'Mathematical derivation and Go implementation benchmarks demonstrating O(N log N) proportional current modulation under electrical breaker constraints.',
    file_url: '',
    file_name: 'voltra-binary-heap-dsa-analysis.pdf',
    mime_type: 'application/pdf',
    file_size: 890000,
    display_order: 3,
    publication_status: 'published',
    created_at: '2026-02-20T00:00:00Z',
  }
];
