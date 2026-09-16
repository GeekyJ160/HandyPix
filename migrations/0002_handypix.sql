create table if not exists profiles (
  user_id text primary key,
  role text not null default 'homeowner',
  display_name text not null default '',
  city text not null default 'Dallas',
  zip text not null default '75201',
  bio text not null default '',
  trades text not null default '[]',
  hourly_rate_cents int not null default 0,
  rating_x10 int not null default 0,
  jobs_completed int not null default 0,
  wallet_cents int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists seed_pros (
  id text primary key,
  display_name text not null,
  city text not null,
  zip text not null,
  trades text not null,
  bio text not null,
  hourly_rate_cents int not null,
  rating_x10 int not null,
  jobs_completed int not null,
  years_exp int not null
);

create table if not exists diagnoses (
  id text primary key,
  user_id text not null,
  job_id text,
  photo_url text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists diagnoses_user_id_idx on diagnoses (user_id);

create table if not exists jobs (
  id text primary key,
  homeowner_id text not null,
  poster_name text not null,
  title text not null,
  description text not null default '',
  category text not null,
  photo_url text not null default '',
  diagnosis jsonb,
  status text not null default 'open',
  urgency text not null default 'soon',
  zip text not null,
  budget_min_cents int not null default 0,
  budget_max_cents int not null default 0,
  awarded_bid_id text,
  is_seed boolean not null default false,
  auto_award boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists jobs_homeowner_id_idx on jobs (homeowner_id);
create index if not exists jobs_status_idx on jobs (status);
create index if not exists jobs_category_idx on jobs (category);

create table if not exists bids (
  id text primary key,
  job_id text not null,
  pro_id text not null,
  amount_cents int not null,
  message text not null default '',
  eta_days int not null default 2,
  materials_included boolean not null default true,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists bids_job_id_idx on bids (job_id);
create index if not exists bids_pro_id_idx on bids (pro_id);

create table if not exists payments (
  id text primary key,
  job_id text not null,
  payer_id text not null,
  payee_id text not null,
  amount_cents int not null,
  fee_cents int not null,
  status text not null default 'escrowed',
  created_at timestamptz not null default now(),
  released_at timestamptz
);
create index if not exists payments_job_id_idx on payments (job_id);
create index if not exists payments_payer_id_idx on payments (payer_id);
create index if not exists payments_payee_id_idx on payments (payee_id);

create table if not exists wallet_events (
  id text primary key,
  user_id text not null,
  amount_cents int not null,
  kind text not null,
  job_id text,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists wallet_events_user_id_idx on wallet_events (user_id);

create table if not exists reviews (
  id text primary key,
  job_id text not null,
  from_id text not null,
  to_id text not null,
  rating int not null,
  comment text not null default '',
  created_at timestamptz not null default now()
);

insert into seed_pros (id, display_name, city, zip, trades, bio, hourly_rate_cents, rating_x10, jobs_completed, years_exp) values
  ('seed:luis', 'Luis Ortega', 'Dallas', '75204', '["plumbing"]', 'Licensed plumber. Fixtures, leaks, and water heaters — same-day when I can.', 9500, 49, 214, 12),
  ('seed:priya', 'Priya Shah', 'Plano', '75024', '["electrical"]', 'Master electrician. Panels, outlets, and lighting. Clean work, code-first.', 11000, 48, 176, 9),
  ('seed:marcus', 'Marcus Hale', 'Fort Worth', '76104', '["hvac"]', 'NATE-certified HVAC. Diagnostics before parts. No upsell theater.', 10500, 47, 143, 11),
  ('seed:elena', 'Elena Voss', 'Dallas', '75206', '["painting"]', 'Interior painting and drywall repair. Dust-light, sharp lines.', 7500, 50, 198, 8),
  ('seed:jamal', 'Jamal Wright', 'Arlington', '76010', '["carpentry"]', 'Finish carpentry, decks, and drywall. Built-ins on request.', 8500, 46, 121, 10),
  ('seed:sofia', 'Sofia Kim', 'Irving', '75038', '["appliance"]', 'Appliance repair across most residential brands. Honest go/no-go.', 9000, 48, 167, 7),
  ('seed:nate', 'Nate Brooks', 'Dallas', '75201', '["roofing"]', 'Roof leaks and flashing. I find the water path before I quote.', 12000, 45, 89, 14),
  ('seed:riley', 'Riley Chen', 'Dallas', '75219', '["plumbing","carpentry","other"]', 'General handyman. Small jobs done right, no runaround.', 8000, 49, 256, 6)
on conflict (id) do nothing;

insert into jobs (
  id, homeowner_id, poster_name, title, description, category, photo_url, diagnosis,
  status, urgency, zip, budget_min_cents, budget_max_cents, is_seed, auto_award
) values
(
  'job-faucet', 'seed:h:maya', 'Maya C.',
  'Kitchen faucet will not stop dripping',
  'Drip is constant from the spout. Handle feels loose. Started last week.',
  'plumbing', '/jobs/leaky-faucet.jpg',
  $diag${"issue":"Leaking kitchen faucet cartridge","category":"plumbing","severity":"medium","summary":"The faucet is dripping from the spout with a loose handle, typical of a worn cartridge or O-rings. This is a common, contained leak — not a supply-line failure.","likely_cause":"Worn ceramic cartridge and loosened handle set screw.","diy_possible":true,"diy_difficulty":"moderate","diy_steps":["Shut off the supply valves under the sink.","Remove the handle and trim to expose the cartridge.","Pull the cartridge and inspect O-rings.","Install a matching replacement cartridge.","Reassemble and check for drip at full pressure."],"tools_needed":["Allen key","cartridge puller or pliers","adjustable wrench"],"parts":[{"name":"Faucet cartridge","est_cost_cents":2800},{"name":"O-ring kit","est_cost_cents":800}],"safety_notes":["Water supply must be off before disassembly."],"when_to_call_pro":"Call a plumber if the shutoffs freeze, the body is corroded, or you cannot match the cartridge.","est_labor_hours":1.5,"est_cost_min_cents":14000,"est_cost_max_cents":28000,"confidence":86}$diag$::jsonb,
  'open', 'soon', '75204', 14000, 28000, true, true
),
(
  'job-outlet', 'seed:h:derek', 'Derek P.',
  'Hallway outlet is scorched and warm',
  'Faceplate is discolored. Plug feels warm after a few minutes. Kids use this hall.',
  'electrical', '/jobs/outlet.jpg',
  $diag${"issue":"Overheating receptacle with heat damage","category":"electrical","severity":"emergency","summary":"Scorch marks and a warm plug point to a failing receptacle or a loose hot connection arcing under load. This is a fire risk and should be treated as urgent.","likely_cause":"Loose terminal or failing receptacle creating high-resistance heat.","diy_possible":false,"diy_difficulty":"pro-only","diy_steps":[],"tools_needed":["voltage tester","wire stripper"],"parts":[{"name":"15A or 20A receptacle","est_cost_cents":600},{"name":"New faceplate","est_cost_cents":300}],"safety_notes":["Do not use this outlet.","Kill the breaker for that circuit.","If you smell burning, leave and call immediately."],"when_to_call_pro":"Call a licensed electrician today. Heat damage is not a wait-and-see issue.","est_labor_hours":1.25,"est_cost_min_cents":16000,"est_cost_max_cents":42000,"confidence":91}$diag$::jsonb,
  'open', 'emergency', '75024', 16000, 42000, true, true
),
(
  'job-drywall', 'seed:h:ana', 'Ana R.',
  'Spider crack opening on living-room wall',
  'Crack grew after a cold snap. Paint is peeling at the corner.',
  'carpentry', '/jobs/cracked-drywall.jpg',
  $diag${"issue":"Settling crack in interior drywall","category":"carpentry","severity":"low","summary":"A diagonal corner crack with peeling paint is typical of seasonal movement or a taped joint that lost mud. Cosmetic unless it keeps widening or you see moisture.","likely_cause":"Joint tape failure and minor framing movement.","diy_possible":true,"diy_difficulty":"moderate","diy_steps":["Score and remove loose paint and tape.","Embed new mesh tape in setting compound.","Feather two additional coats.","Sand, prime, and paint."],"tools_needed":["6-inch knife","sanding sponge","setting compound"],"parts":[{"name":"Mesh tape","est_cost_cents":700},{"name":"Joint compound","est_cost_cents":1400},{"name":"Primer and paint touch-up","est_cost_cents":1800}],"safety_notes":["Wear a dust mask when sanding."],"when_to_call_pro":"Call a pro if the crack is stepped along masonry, keeps reopening, or you suspect a leak behind it.","est_labor_hours":3,"est_cost_min_cents":18000,"est_cost_max_cents":45000,"confidence":80}$diag$::jsonb,
  'open', 'flexible', '75201', 18000, 45000, true, false
),
(
  'job-hvac', 'seed:h:chris', 'Chris M.',
  'AC condenser is filthy and not cooling',
  'Unit runs all day. House sits at 78 with the stat at 72. Standing water around the pad.',
  'hvac', '/jobs/hvac.jpg',
  $diag${"issue":"Dirty outdoor condenser with restricted airflow","category":"hvac","severity":"high","summary":"Matted coils, rusted fins, and standing water around the condenser usually mean the outdoor unit cannot reject heat. Cooling suffers and the compressor works too hard.","likely_cause":"Impacted coil fins plus possible condensate overflow at the pad.","diy_possible":true,"diy_difficulty":"easy","diy_steps":["Kill power at the disconnect.","Gently rinse coils from the inside out.","Clear debris from the pad and drain path.","Replace a clogged filter indoors.","Restore power and check supply-air temperature after 15 minutes."],"tools_needed":["garden hose with gentle nozzle","fin comb","new filter"],"parts":[{"name":"Pleated filter","est_cost_cents":1800}],"safety_notes":["Never hose a unit while it is powered.","Do not bend fins aggressively."],"when_to_call_pro":"Call HVAC if it still blows warm air, the breaker trips, or ice forms on the lines.","est_labor_hours":1.75,"est_cost_min_cents":22000,"est_cost_max_cents":78000,"confidence":77}$diag$::jsonb,
  'open', 'soon', '76104', 22000, 78000, true, false
),
(
  'job-ceiling', 'seed:h:pri', 'Priya N.',
  'Brown ring spreading on guest-room ceiling',
  'Stain grew after heavy rain. Ceiling looks a little soft in the center.',
  'plumbing', '/jobs/ceiling-stain.jpg',
  $diag${"issue":"Active ceiling leak with stained, softening drywall","category":"plumbing","severity":"high","summary":"A spreading brown ring and sag suggests water from a roof, bath, or supply line above. The stain is the symptom — the source has to be found before any cosmetic repair.","likely_cause":"Roof flashing leak or a plumbing line above the ceiling.","diy_possible":false,"diy_difficulty":"pro-only","diy_steps":[],"tools_needed":["moisture meter","drop cloth"],"parts":[{"name":"Drywall patch","est_cost_cents":2500},{"name":"Stain-blocking primer","est_cost_cents":1600}],"safety_notes":["If the ceiling is sagging, stay out from under it.","Place a bucket and slit a small drain hole only if collapse is imminent."],"when_to_call_pro":"Call a plumber or roofer now to find the water path. Do not paint over an active leak.","est_labor_hours":4,"est_cost_min_cents":32000,"est_cost_max_cents":140000,"confidence":74}$diag$::jsonb,
  'open', 'soon', '75206', 32000, 140000, true, false
),
(
  'job-deck', 'seed:h:owen', 'Owen L.',
  'Splintered deck board on the back steps',
  'Board is cracked through. Guests keep catching it. Need it safe this weekend.',
  'carpentry', '/jobs/deck.jpg',
  $diag${"issue":"Failed deck board at stair nosing","category":"carpentry","severity":"medium","summary":"A cracked, splintered board with rusty fasteners is a trip and puncture hazard. Neighboring boards should be checked for the same rot pattern.","likely_cause":"Weathered lumber and fastener corrosion at a high-traffic nosing.","diy_possible":true,"diy_difficulty":"moderate","diy_steps":["Pull the failed board and inspect joists.","Cut a matching replacement board.","Fasten with coated screws, not rusty nails.","Treat cut ends."],"tools_needed":["circular saw","pry bar","drill"],"parts":[{"name":"Pressure-treated board","est_cost_cents":2200},{"name":"Coated deck screws","est_cost_cents":900}],"safety_notes":["Wear gloves — splinters and rusty nails.","Check the joist for rot before closing it up."],"when_to_call_pro":"Call a carpenter if multiple boards or the joists are soft.","est_labor_hours":2,"est_cost_min_cents":16000,"est_cost_max_cents":38000,"confidence":88}$diag$::jsonb,
  'open', 'soon', '76010', 16000, 38000, true, false
)
on conflict (id) do nothing;

insert into bids (id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status) values
  ('bid-faucet-luis', 'job-faucet', 'seed:luis', 18500, 'I will replace the cartridge with the OEM match and check both shutoffs. Same-day if I can get the part by noon.', 1, true, 'pending'),
  ('bid-faucet-riley', 'job-faucet', 'seed:riley', 16000, 'Quick faucet rebuild. If the body is pitted I will text you before swapping the whole fixture.', 1, true, 'pending'),
  ('bid-outlet-priya', 'job-outlet', 'seed:priya', 24000, 'I will kill the circuit, replace the receptacle, and inspect the box for heat damage. If the wire insulation is cooked we stop and rewire that run.', 1, true, 'pending'),
  ('bid-outlet-riley', 'job-outlet', 'seed:riley', 19500, 'Emergency slot today. I am not an electrician — I will replace the device only if the conductors are clean. Otherwise I will refer.', 1, false, 'pending'),
  ('bid-drywall-jamal', 'job-drywall', 'seed:jamal', 32000, 'Tape, three coats, prime, and paint the whole wall so the patch does not flash.', 3, true, 'pending'),
  ('bid-drywall-elena', 'job-drywall', 'seed:elena', 28500, 'I repair drywall and paint for a living. Includes color match on the wall, not just the crack.', 2, true, 'pending'),
  ('bid-hvac-marcus', 'job-hvac', 'seed:marcus', 36000, 'Coil clean, amp draw, and a full cooling check. If refrigerant is low I will quote that separately before adding any.', 2, true, 'pending'),
  ('bid-ceiling-nate', 'job-ceiling', 'seed:nate', 78000, 'I start on the roof: flashing, pipe boots, then confirm it is not a bath leak. Ceiling patch after the source is dry.', 4, true, 'pending'),
  ('bid-ceiling-luis', 'job-ceiling', 'seed:luis', 64000, 'I will camera the bath above and the supply lines first. If it is plumbing I fix it; if it is roof I hand you off with photos.', 3, true, 'pending'),
  ('bid-deck-jamal', 'job-deck', 'seed:jamal', 22000, 'Replace the nosing board, check the stringer, and sister anything soft. Weekend window is open.', 2, true, 'pending')
on conflict (id) do nothing;
