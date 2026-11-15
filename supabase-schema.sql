-- ==============================================================================
-- ElderCare+ Database Schema (PostgreSQL / Supabase)
-- Smart Elderly Care & Medication Management Platform
-- Tagline: Healthcare Without Communication or Accessibility Barriers.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('elderly', 'family', 'caregiver');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE medication_status_type AS ENUM ('pending', 'taken', 'skipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_type AS ENUM ('upcoming', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('upcoming_dose', 'missed_medication', 'doctor_appointment', 'emergency_sos', 'access_granted', 'profile_update');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status_type AS ENUM ('sent', 'failed', 'delivered', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'elderly',
    avatar_url TEXT,
    language_preference TEXT DEFAULT 'en', -- en, hi, bn
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HEALTHCARE PROFILES (Detailed Medical Data for Elderly Users)
CREATE TABLE IF NOT EXISTS public.healthcare_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    date_of_birth DATE,
    blood_group TEXT,
    medical_history TEXT[], -- Array of conditions, e.g. ['Hypertension', 'Type 2 Diabetes', 'Glaucoma']
    known_allergies TEXT[], -- Array of allergies, e.g. ['Penicillin', 'Peanuts', 'Sulfa drugs']
    chronic_conditions TEXT[],
    primary_physician_name TEXT,
    primary_physician_phone TEXT,
    hospital_preference TEXT,
    insurance_details TEXT,
    emergency_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMERGENCY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relationship TEXT NOT NULL, -- e.g. Daughter, Son, Neighbor, Primary Caregiver
    phone TEXT NOT NULL,
    email TEXT,
    is_primary BOOLEAN DEFAULT false,
    can_receive_sos_email BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACCESS PASSCODES & INVITATIONS TABLE (Mandatory Passcode-Based Access)
CREATE TABLE IF NOT EXISTS public.access_passcodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    passcode TEXT NOT NULL UNIQUE, -- e.g. 'ELDER-8492' or 6-digit secure code
    target_role user_role_type NOT NULL DEFAULT 'family', -- family or caregiver
    can_manage_medications BOOLEAN DEFAULT true,
    can_manage_appointments BOOLEAN DEFAULT true,
    can_view_medical_history BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAMILY & CAREGIVER RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.family_caregiver_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    member_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    member_role user_role_type NOT NULL, -- 'family' or 'caregiver'
    relationship_label TEXT DEFAULT 'Family Member', -- e.g. 'Son', 'Daughter', 'Nurse', 'Visiting Caregiver'
    passcode_id UUID REFERENCES public.access_passcodes(id),
    status TEXT DEFAULT 'active', -- 'active', 'pending_approval', 'revoked'
    can_manage_medications BOOLEAN DEFAULT true,
    can_manage_appointments BOOLEAN DEFAULT true,
    can_view_medical_history BOOLEAN DEFAULT true,
    notify_on_missed_dose BOOLEAN DEFAULT true,
    notify_on_sos BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(elderly_user_id, member_user_id)
);

-- 7. MEDICINES TABLE
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL, -- e.g. '500 mg', '1 tablet', '10 ml'
    form TEXT DEFAULT 'Tablet', -- 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Drops'
    color_code TEXT DEFAULT '#10B981', -- For visual identification by elderly
    frequency TEXT NOT NULL, -- 'Once Daily', 'Twice Daily', 'Three Times Daily', 'As Needed'
    schedule_times TEXT[] NOT NULL, -- ['08:00', '13:00', '20:00']
    food_instruction TEXT DEFAULT 'After Food', -- 'Before Food', 'After Food', 'With Food', 'Empty Stomach'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    prescribed_by TEXT,
    instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEDICATION SCHEDULES (Daily Dose Slots)
CREATE TABLE IF NOT EXISTS public.medication_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status medication_status_type DEFAULT 'pending',
    dose_instruction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MEDICATION ADHERENCE LOGS (Confirmation timestamps & audit)
CREATE TABLE IF NOT EXISTS public.medication_adherence_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES public.medication_schedules(id) ON DELETE SET NULL,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action_taken_by UUID REFERENCES public.user_profiles(id), -- Could be elderly person themselves, or caregiver
    status medication_status_type NOT NULL, -- 'taken', 'skipped'
    scheduled_time TIMESTAMPTZ NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    skip_reason TEXT,
    notes TEXT
);

-- 10. DOCTOR APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.doctor_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    specialty TEXT, -- e.g. 'Cardiologist', 'Neurologist', 'General Physician'
    hospital_name TEXT NOT NULL,
    hospital_address TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes TEXT,
    status appointment_status_type DEFAULT 'upcoming',
    reminder_sent BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATION LOGS (Automated Email Reminders & Alert History)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    type notification_type NOT NULL,
    subject TEXT NOT NULL,
    body_preview TEXT,
    status notification_status_type NOT NULL DEFAULT 'sent',
    error_message TEXT,
    service_provider TEXT DEFAULT 'resend',
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS (Compliance, Security & History)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.user_profiles(id),
    action TEXT NOT NULL, -- e.g. 'PASSCODE_GENERATED', 'MEDICATION_ADDED', 'SOS_TRIGGERED', 'PROFILE_UPDATED'
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_passcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_caregiver_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is elderly or authorized member
CREATE OR REPLACE FUNCTION public.is_authorized_member(elderly_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Elderly user owns the data
    IF EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = elderly_id AND auth_user_id = auth.uid()
    ) THEN
        RETURN true;
    END IF;

    -- Or user is an active family or caregiver for this elderly person
    IF EXISTS (
        SELECT 1 FROM public.family_caregiver_relations fcr
        JOIN public.user_profiles up ON up.id = fcr.member_user_id
        WHERE fcr.elderly_user_id = elderly_id
          AND up.auth_user_id = auth.uid()
          AND fcr.status = 'active'
    ) THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Policies for user_profiles
CREATE POLICY "Users can view and update their own profile"
    ON public.user_profiles FOR ALL
    USING (auth_user_id = auth.uid());

CREATE POLICY "Authorized members can view connected elderly profiles"
    ON public.user_profiles FOR SELECT
    USING (
        id IN (
            SELECT elderly_user_id FROM public.family_caregiver_relations fcr
            JOIN public.user_profiles up ON up.id = fcr.member_user_id
            WHERE up.auth_user_id = auth.uid() AND fcr.status = 'active'
        )
    );

-- Policies for medicines
CREATE POLICY "Elderly and authorized members can view medicines"
    ON public.medicines FOR SELECT
    USING (public.is_authorized_member(elderly_user_id));

CREATE POLICY "Elderly and authorized editors can modify medicines"
    ON public.medicines FOR ALL
    USING (public.is_authorized_member(elderly_user_id));

-- Policies for healthcare_profiles
CREATE POLICY "Access healthcare profile if authorized"
    ON public.healthcare_profiles FOR ALL
    USING (public.is_authorized_member(elderly_user_id));

-- Policies for access_passcodes
CREATE POLICY "Elderly can manage passcodes"
    ON public.access_passcodes FOR ALL
    USING (
        elderly_user_id IN (
            SELECT id FROM public.user_profiles WHERE auth_user_id = auth.uid()
        )
    );

-- ==============================================================================
-- SAMPLE INITIAL SEED DATA FOR DEMONSTRATION
-- ==============================================================================
-- Can be run directly in Supabase SQL Editor.
