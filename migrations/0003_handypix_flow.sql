-- HandyPix v2 flow: scheduling, bid breakdown, job timeline, messages,
-- change orders, disputes, and verification fields.

alter table jobs add column if not exists preferred_date date;
alter table jobs add column if not exists time_window text not null default 'flexible';
alter table jobs add column if not exists budget_band text not null default 'unknown';
alter table jobs add column if not exists awarded_at timestamptz;
alter table jobs add column if not exists on_the_way_at timestamptz;
alter table jobs add column if not exists started_at timestamptz;
alter table jobs add column if not exists work_performed text not null default '';
alter table jobs add column if not exists after_photo_url text not null default '';

alter table diagnoses add column if not exists photo_urls jsonb not null default '[]'::jsonb;

alter table bids add column if not exists labor_cents int not null default 0;
alter table bids add column if not exists materials_cents int not null default 0;
alter table bids add column if not exists warranty_days int not null default 30;
alter table bids add column if not exists duration_minutes int not null default 60;
alter table bids add column if not exists available_window text not null default '';
alter table bids add column if not exists distance_miles numeric not null default 3.0;

alter table seed_pros add column if not exists identity_verified boolean not null default true;
alter table seed_pros add column if not exists insurance boolean not null default true;
alter table seed_pros add column if not exists background_check boolean not null default true;
alter table seed_pros add column if not exists distance_miles numeric not null default 3.0;
alter table seed_pros add column if not exists reviews jsonb not null default '[]'::jsonb;

alter table reviews add column if not exists tags text not null default '[]';

create table if not exists messages (
  id text primary key,
  job_id text not null,
  from_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_job_id_idx on messages (job_id, created_at);

create table if not exists change_orders (
  id text primary key,
  job_id text not null,
  pro_id text not null,
  reason text not null,
  labor_cents int not null,
  materials_cents int not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists change_orders_job_id_idx on change_orders (job_id);

create table if not exists disputes (
  id text primary key,
  job_id text not null,
  opened_by text not null,
  reason text not null,
  details text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists disputes_job_id_idx on disputes (job_id);

update seed_pros set distance_miles = 3.1, reviews = $r$[
  {"author":"Maya C.","rating":5,"comment":"Arrived on time and fixed the leak.","tags":["on_time","quality"]},
  {"author":"Owen L.","rating":5,"comment":"Very professional. Explained the gasket before swapping it.","tags":["professional","communication"]}
]$r$::jsonb where id = 'seed:luis';

update seed_pros set distance_miles = 5.8, reviews = $r$[
  {"author":"Derek P.","rating":5,"comment":"Made the circuit safe the same afternoon.","tags":["on_time","quality"]}
]$r$::jsonb where id = 'seed:priya';

update seed_pros set distance_miles = 8.2, reviews = $r$[
  {"author":"Chris M.","rating":5,"comment":"Honest diagnosis. No upsell.","tags":["fair_pricing","professional"]}
]$r$::jsonb where id = 'seed:marcus';

update seed_pros set distance_miles = 2.4, reviews = $r$[
  {"author":"Ana R.","rating":5,"comment":"Patch disappeared after paint.","tags":["quality","professional"]}
]$r$::jsonb where id = 'seed:elena';

update seed_pros set distance_miles = 4.1, reviews = $r$[
  {"author":"Owen L.","rating":5,"comment":"Replaced the nosing and checked the stringer.","tags":["quality","on_time"]}
]$r$::jsonb where id = 'seed:jamal';

update seed_pros set distance_miles = 6.0 where id = 'seed:sofia';
update seed_pros set distance_miles = 5.2, reviews = $r$[
  {"author":"Priya N.","rating":4,"comment":"Found the water path on the roof first.","tags":["professional","communication"]}
]$r$::jsonb where id = 'seed:nate';

update seed_pros set distance_miles = 2.8, reviews = $r$[
  {"author":"Maya C.","rating":5,"comment":"Fast and fair on a small faucet job.","tags":["on_time","fair_pricing"]}
]$r$::jsonb where id = 'seed:riley';

update bids set
  labor_cents = round(amount_cents * 0.78),
  materials_cents = amount_cents - round(amount_cents * 0.78),
  warranty_days = case
    when id like '%elena%' then 90
    when id like '%priya%' then 90
    when id like '%riley%' then 14
    when id like '%nate%' then 90
    else 30
  end,
  duration_minutes = case
    when amount_cents >= 50000 then 180
    when amount_cents >= 25000 then 90
    else 60
  end,
  available_window = case
    when id like '%luis%' then 'Saturday 9:00–11:00 AM'
    when id like '%riley%' then 'Saturday 10:00 AM–12:00 PM'
    when id like '%priya%' then 'Today 2:00–5:00 PM'
    when id like '%elena%' then 'Saturday 8:00–10:00 AM'
    else 'This week, flexible'
  end
where labor_cents = 0;

update bids b set distance_miles = coalesce(
  (select p.distance_miles from seed_pros p where p.id = b.pro_id),
  3.0
);
