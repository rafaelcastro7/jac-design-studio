create type public.app_role as enum ('admin','staff');
create type public.order_status as enum ('nuevo','confirmado','produccion','listo','entregado','cancelado');
create type public.request_status as enum ('nuevo','en_proceso','cerrado');

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','staff'));
$$;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));

create policy "user_roles_select_own_or_admin" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "user_roles_admin_manage" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- new user: profile + first user becomes admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  cat text not null,
  price_cad numeric(10,2) not null default 0,
  image_key text,
  image_url text,
  popular boolean not null default false,
  published boolean not null default true,
  rating numeric(2,1) not null default 5,
  review_count integer not null default 0,
  dimensions text,
  lead text not null default 'd23',
  sort_order integer not null default 0,
  stock integer,
  name_en text not null,
  name_fr text,
  name_es text,
  tag_en text,
  tag_fr text,
  tag_es text,
  desc_en text,
  desc_fr text,
  desc_es text,
  material_en text,
  material_fr text,
  material_es text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products_public_read" on public.products for select to anon using (published = true);
create policy "products_auth_read" on public.products for select to authenticated
  using (published = true or public.is_staff(auth.uid()));
create policy "products_admin_insert" on public.products for insert to authenticated
  with check (public.has_role(auth.uid(),'admin'));
create policy "products_admin_update" on public.products for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "products_admin_delete" on public.products for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));
create trigger products_updated_at before update on public.products
  for each row execute function public.update_updated_at_column();

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default 'JD-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  notes text,
  lang text not null default 'en',
  total_cad numeric(10,2) not null default 0,
  status public.order_status not null default 'nuevo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.orders to anon;
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders_public_insert" on public.orders for insert to anon with check (true);
create policy "orders_auth_insert" on public.orders for insert to authenticated with check (true);
create policy "orders_staff_read" on public.orders for select to authenticated using (public.is_staff(auth.uid()));
create policy "orders_staff_update" on public.orders for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "orders_admin_delete" on public.orders for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at_column();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid references public.products on delete set null,
  product_slug text,
  name text not null,
  unit_price_cad numeric(10,2) not null default 0,
  qty integer not null default 1,
  created_at timestamptz not null default now()
);
grant insert on public.order_items to anon;
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order_items_public_insert" on public.order_items for insert to anon with check (true);
create policy "order_items_auth_insert" on public.order_items for insert to authenticated with check (true);
create policy "order_items_staff_read" on public.order_items for select to authenticated using (public.is_staff(auth.uid()));
create policy "order_items_admin_delete" on public.order_items for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- quotes
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  file_name text,
  material text,
  infill text,
  quality text,
  color text,
  qty integer not null default 1,
  volume_cm3 numeric(10,2),
  estimate_cad numeric(10,2),
  notes text,
  status public.request_status not null default 'nuevo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.quotes to anon;
grant select, insert, update, delete on public.quotes to authenticated;
grant all on public.quotes to service_role;
alter table public.quotes enable row level security;
create policy "quotes_public_insert" on public.quotes for insert to anon with check (true);
create policy "quotes_auth_insert" on public.quotes for insert to authenticated with check (true);
create policy "quotes_staff_read" on public.quotes for select to authenticated using (public.is_staff(auth.uid()));
create policy "quotes_staff_update" on public.quotes for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "quotes_admin_delete" on public.quotes for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger quotes_updated_at before update on public.quotes
  for each row execute function public.update_updated_at_column();

-- contact messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  body text not null,
  lang text not null default 'en',
  status public.request_status not null default 'nuevo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "messages_public_insert" on public.messages for insert to anon with check (true);
create policy "messages_auth_insert" on public.messages for insert to authenticated with check (true);
create policy "messages_staff_read" on public.messages for select to authenticated using (public.is_staff(auth.uid()));
create policy "messages_staff_update" on public.messages for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "messages_admin_delete" on public.messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger messages_updated_at before update on public.messages
  for each row execute function public.update_updated_at_column();

create index products_cat_idx on public.products (cat);
create index orders_created_idx on public.orders (created_at desc);
create index order_items_order_idx on public.order_items (order_id);