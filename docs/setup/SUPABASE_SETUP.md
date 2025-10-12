# Supabase Setup Guide

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: `dreamcatcher-prod` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

---

### 2. Get API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional: Enable debug mode
VITE_DEBUG_MODE=false
```

**Important**: 
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Use the example below to create your own `.env.local`

---

### 4. Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Repeat for `002_rls_policies.sql`

---

### 5. Test Connection

Run the development server:

```bash
npm run dev
```

The app should now connect to Supabase!

---

## 📋 Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_DEBUG_MODE` | Enable debug logging | `false` |

---

## 🔐 Security Notes

### What's Safe to Expose

✅ **Supabase URL** - Safe to expose in client-side code  
✅ **Anon Key** - Safe to expose, it's meant for client-side use  

### What's NOT Safe

❌ **Service Role Key** - NEVER use this in client-side code  
❌ **Database Password** - Keep this secret  
❌ **.env.local file** - Never commit this  

### Row Level Security (RLS)

All tables use Row Level Security to ensure users can only access their own data:

- ✅ Users can only see their own dreams
- ✅ Users can only see fragments from their dreams
- ✅ Users can only see their own todos
- ✅ Users can only upload/view their own documents

---

## 🧪 Testing the Setup

### Test 1: Sign Up

1. Start the dev server: `npm run dev`
2. Click **Sign Up**
3. Enter email and password
4. Check your email for confirmation link (if email confirmation is enabled)

### Test 2: Create a Dream

1. Sign in to the app
2. Click **Create Dream**
3. Fill in the details
4. Save

### Test 3: Real-time Updates

1. Open the app in two browser windows
2. Sign in with the same account in both
3. Create a dream in one window
4. Watch it appear in the other window automatically!

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

**Solution**: Double-check your `VITE_SUPABASE_ANON_KEY` in `.env.local`

### Error: "Failed to fetch"

**Solution**: Check your `VITE_SUPABASE_URL` is correct and includes `https://`

### Error: "JWT expired"

**Solution**: Sign out and sign in again

### Error: "Row Level Security policy violation"

**Solution**: Make sure you ran the RLS policies migration (`002_rls_policies.sql`)

### Dreams not saving

**Solution**: 
1. Check browser console for errors
2. Verify you're signed in
3. Check Supabase dashboard > Table Editor > dreams to see if data is there

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

*For the complete migration plan, see [SUPABASE_MIGRATION_PLAN.md](../planning/SUPABASE_MIGRATION_PLAN.md)*

