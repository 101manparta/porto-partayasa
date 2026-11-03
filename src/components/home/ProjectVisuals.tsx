import React from 'react';

interface ProjectVisualCardProps {
  slug: string;
  type: 'dashboard' | 'telemetry' | 'workflow' | 'architecture';
  title?: string;
  caption?: string;
  className?: string;
}

export const ProjectVisualCard: React.FC<ProjectVisualCardProps> = ({
  slug,
  type,
  title,
  caption,
  className = '',
}) => {
  // MLB ICON BALI UI Visual
  if (slug === 'mlb-icon-bali') {
    if (type === 'dashboard' || type === 'telemetry') {
      return (
        <div className={`w-full h-full bg-[#09090C] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between overflow-hidden shadow-2xl ${className}`}>
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="text-[11px] text-neutral-400 ml-2 font-sans font-medium">mlb-pro-olive.vercel.app</span>
            </div>
            <div className="text-[10px] text-neutral-400">PESSIMISTIC_LOCK: ACTIVE</div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
              <div className="text-[10px] text-neutral-500">PEAK INVENTORY</div>
              <div className="text-sm font-semibold text-white mt-0.5">480 / 500</div>
              <div className="text-[9px] text-neutral-400 mt-0.5">96% Capacity Lock</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
              <div className="text-[10px] text-neutral-500">REDIS LEASE TTL</div>
              <div className="text-sm font-semibold text-white mt-0.5 font-mono">08:42s</div>
              <div className="text-[9px] text-neutral-400 mt-0.5">Auto-Expiry Worker</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
              <div className="text-[10px] text-neutral-500">DOUBLE BOOKINGS</div>
              <div className="text-sm font-semibold text-white mt-0.5">0.00%</div>
              <div className="text-[9px] text-neutral-400 mt-0.5">ACID Serializable</div>
            </div>
          </div>

          {/* Reservation Matrix Visual */}
          <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-2 flex-1">
            <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/5 pb-1">
              <span>CABANA / ZONE ID</span>
              <span>LOCK STATE</span>
              <span>TX LATENCY</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-300">
              <span className="text-white">VIP-BEACH-CABANA-01</span>
              <span className="text-neutral-300">HELD_PAYMENT_PENDING</span>
              <span className="text-neutral-400 font-mono">18ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-300">
              <span className="text-white">VIP-SUNSET-DAYBED-04</span>
              <span className="text-neutral-300">CONFIRMED_SETTLED</span>
              <span className="text-neutral-400 font-mono">24ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-300">
              <span className="text-white">LOUNGE-DECK-B-12</span>
              <span className="text-neutral-400">AVAILABLE</span>
              <span className="text-neutral-400 font-mono">2ms</span>
            </div>
          </div>

          {caption && <div className="text-[10px] text-neutral-500 mt-2 truncate font-sans">{caption}</div>}
        </div>
      );
    }

    // MLB Architecture Diagram
    return (
      <div className={`w-full h-full bg-[#08080A] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between shadow-2xl ${className}`}>
        <div className="text-[11px] text-neutral-400 border-b border-white/5 pb-1.5 font-sans font-medium">
          System Architecture — Two-Phase Reservation & Locking Pipeline
        </div>
        <div className="grid grid-cols-5 gap-2 my-auto items-center py-4 text-center">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">EDGE GATEWAY</div>
            <div className="text-xs font-semibold text-white mt-1">Next.js</div>
            <div className="text-[9px] text-neutral-400 mt-1">Rate Limit / Auth</div>
          </div>
          <div className="text-neutral-600">→</div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">MEMORY TIER</div>
            <div className="text-xs font-semibold text-white mt-1">Redis SETNX</div>
            <div className="text-[9px] text-neutral-400 mt-1">10m Fast Lease</div>
          </div>
          <div className="text-neutral-600">→</div>
          <div className="bg-white/10 border border-white/20 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">PRIMARY ACID</div>
            <div className="text-xs font-semibold text-white mt-1">PostgreSQL</div>
            <div className="text-[9px] text-neutral-300 mt-1">SELECT FOR UPDATE</div>
          </div>
        </div>
        <div className="text-[10px] text-neutral-500 text-center font-sans">
          Zero double-booking guarantee via temporal exclusion & transaction isolation
        </div>
      </div>
    );
  }

  // VOLTRA — EV CHARGING INTELLIGENCE
  if (slug === 'voltra') {
    if (type === 'dashboard' || type === 'telemetry') {
      return (
        <div className={`w-full h-full bg-[#09090C] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between overflow-hidden shadow-2xl ${className}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="text-[11px] text-neutral-400 ml-2 font-sans font-medium">voltra-pi.vercel.app</span>
            </div>
            <div className="text-[10px] text-neutral-400">HUB #04 · BALI TRANSIT</div>
          </div>

          {/* Live Power Load Bar */}
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-1 text-[10px]">
              <span className="text-neutral-400">TRANSFORMER GRID HEADROOM</span>
              <span className="text-white font-semibold">184.2 kW / 200.0 kW (92%)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-neutral-500 mt-1">
              <span>Dynamic Load Balancing: ACTIVE</span>
              <span>OCPP 1.6-J Socket Stream</span>
            </div>
          </div>

          {/* Active Connector Table */}
          <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/5 pb-1">
              <span>BAY ID</span>
              <span>VEHICLE SOC</span>
              <span>RATE (A)</span>
              <span>PRIORITY</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white">CH-01 [DC-CCS]</span>
              <span className="text-neutral-300">32% (Urgent)</span>
              <span className="text-white font-mono">120A (60kW)</span>
              <span className="text-neutral-300">P1-MAX</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white">CH-02 [DC-CCS]</span>
              <span className="text-neutral-300">58% (Normal)</span>
              <span className="text-white font-mono">80A (40kW)</span>
              <span className="text-neutral-400">P2-MED</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white">CH-03 [AC-TYP2]</span>
              <span className="text-neutral-300">88% (Trickle)</span>
              <span className="text-white font-mono">16A (11kW)</span>
              <span className="text-neutral-500">P3-SHED</span>
            </div>
          </div>

          {caption && <div className="text-[10px] text-neutral-500 mt-2 truncate font-sans">{caption}</div>}
        </div>
      );
    }

    // Voltra Architecture
    return (
      <div className={`w-full h-full bg-[#08080A] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between shadow-2xl ${className}`}>
        <div className="text-[11px] text-neutral-400 border-b border-white/5 pb-1.5 font-sans font-medium">
          IoT Telemetry & Dynamic Load Shedding Architecture
        </div>
        <div className="grid grid-cols-5 gap-2 my-auto items-center py-4 text-center">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">HARDWARE EDGE</div>
            <div className="text-xs font-semibold text-white mt-1">OCPP Chargers</div>
            <div className="text-[9px] text-neutral-400 mt-1">mTLS / JSON</div>
          </div>
          <div className="text-neutral-600">→</div>
          <div className="bg-white/10 border border-white/20 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">GO INGESTION</div>
            <div className="text-xs font-semibold text-white mt-1">Goroutine Actor</div>
            <div className="text-[9px] text-neutral-300 mt-1">Max-Heap Queue</div>
          </div>
          <div className="text-neutral-600">→</div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-[10px] text-neutral-400">STORAGE TIER</div>
            <div className="text-xs font-semibold text-white mt-1">TimescaleDB</div>
            <div className="text-[9px] text-neutral-400 mt-1">Hypertable Log</div>
          </div>
        </div>
        <div className="text-[10px] text-neutral-500 text-center font-sans">
          Proportional amperage allocation computed every 5 seconds under electrical constraints
        </div>
      </div>
    );
  }

  // MEDIFLOW (Clinical Laboratory Diagnostic Platform)
  if (type === 'dashboard' || type === 'telemetry') {
    return (
      <div className={`w-full h-full bg-[#09090C] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between overflow-hidden shadow-2xl ${className}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="text-[11px] text-neutral-400 ml-2 font-sans font-medium">mediflow-solutions.netlify.app</span>
          </div>
          <div className="text-[10px] text-neutral-400">FSM CHAIN: VERIFIED</div>
        </div>

        {/* Specimen Validation Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
            <div className="text-[10px] text-neutral-500">SPECIMENS IN QUEUE</div>
            <div className="text-sm font-semibold text-white mt-0.5">142 Active</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Average TAT: 28m</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
            <div className="text-[10px] text-neutral-500">DELTA CHECK ALERTS</div>
            <div className="text-sm font-semibold text-white mt-0.5">3 Flagged</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Physician Review Req.</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
            <div className="text-[10px] text-neutral-500">QC RUN ACCURACY</div>
            <div className="text-sm font-semibold text-white mt-0.5">99.8%</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Westgard Multi-Rule</div>
          </div>
        </div>

        {/* Diagnostic Sample List */}
        <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-2 flex-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/5 pb-1">
            <span>BARCODE / TEST</span>
            <span>RESULT RANGE</span>
            <span>FSM STATUS</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white">SMP-9821 [Electrolytes]</span>
            <span className="text-neutral-300">K+: 4.1 mmol/L (Normal)</span>
            <span className="text-neutral-400 font-mono">VERIFIED</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white">SMP-9824 [Cardiac Troponin]</span>
            <span className="text-neutral-200">cTnI: 0.82 ng/mL (Critical)</span>
            <span className="text-white font-mono">FLAG_ALERT</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white">SMP-9829 [Complete Blood]</span>
            <span className="text-neutral-300">WBC: 7.4 x10^9/L</span>
            <span className="text-neutral-400 font-mono">IN_ANALYSIS</span>
          </div>
        </div>

        {caption && <div className="text-[10px] text-neutral-500 mt-2 truncate font-sans">{caption}</div>}
      </div>
    );
  }

  // Mediflow Architecture
  return (
    <div className={`w-full h-full bg-[#08080A] border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col justify-between shadow-2xl ${className}`}>
      <div className="text-[11px] text-neutral-400 border-b border-white/5 pb-1.5 font-sans font-medium">
        Clinical Diagnostic Specimen Pipeline & State Transitions
      </div>
      <div className="grid grid-cols-5 gap-2 my-auto items-center py-4 text-center">
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
          <div className="text-[10px] text-neutral-400">INTAKE STEP</div>
          <div className="text-xs font-semibold text-white mt-1">Barcode Scan</div>
          <div className="text-[9px] text-neutral-400 mt-1">Registered</div>
        </div>
        <div className="text-neutral-600">→</div>
        <div className="bg-white/10 border border-white/20 p-2.5 rounded-lg">
          <div className="text-[10px] text-neutral-400">CORE LOGIC</div>
          <div className="text-xs font-semibold text-white mt-1">FSM Validator</div>
          <div className="text-[9px] text-neutral-300 mt-1">Range Delta Check</div>
        </div>
        <div className="text-neutral-600">→</div>
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
          <div className="text-[10px] text-neutral-400">OUTPUT REPORT</div>
          <div className="text-xs font-semibold text-white mt-1">Physician EHR</div>
          <div className="text-[9px] text-neutral-400 mt-1">Signed Audit Log</div>
        </div>
      </div>
      <div className="text-[10px] text-neutral-500 text-center font-sans">
        Clinical precision & deterministic workflow guaranteeing diagnostic integrity
      </div>
    </div>
  );
};
