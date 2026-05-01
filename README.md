# MedSpeak Web

Ban web moi cho du an hoc tieng Anh cua ban, duoc viet lai theo huong:

- deploy len `Vercel`
- luu noi dung dong bang `Supabase`
- co `admin area` de ban tu them/sua noi dung ve sau
- giu lai du lieu hoc tu `medspeak-desktop/src/data`

## Stack

- `Next.js 16`
- `React 19`
- `Supabase Auth + Database`
- `Tailwind CSS 4`

## Cac collection admin

- `dailyTopics`
- `medicalSections`
- `procedures`
- `drillItems`
- `scenarios`
- `listeningLessons`

## Chay local

```bash
npm install
npm run dev
```

Neu chua co Supabase env, trang public van hien `fallback preview` tu `legacy-data/`.

## Bat admin that

1. Tao 1 project Supabase.
2. Mo SQL Editor va chay file `supabase/schema.sql`.
3. Tao file `.env.local` tu `.env.example`.
4. Dien:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=your-email@example.com
```

5. Tao user trong Supabase Auth bang email cua ban.
6. Dang nhap vao `/auth/login`.
7. Email nam trong `ADMIN_EMAILS` se tu dong duoc nhan role `admin`.

## Import du lieu cu vao Supabase

Project da copy du lieu cu vao `legacy-data/`.

Sinh file seed SQL:

```bash
npm run seed:sql
```

Sau do copy noi dung `supabase/seed.sql` va chay trong Supabase SQL Editor.

## Muc tieu tiep theo

- push repo len GitHub
- ket noi repo voi Vercel
- bo sung dashboard hoc tap, SRS va AI chat theo provider ban chon
