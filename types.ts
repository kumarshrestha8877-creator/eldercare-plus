// ElderCare+ TypeScript Type Definitions

export type UserRole = 'elderly' | 'family' | 'caregiver';

export type MedicationStatus = 'pending' | 'taken' | 'skipped';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export type NotificationType = 
  | 'upcoming_dose' 
  | 'missed_medication' 
  | 'doctor_appointment' 
  | 'emergency_sos' 
  | 'access_granted' 
  | 'profile_update';

export type NotificationStatus = 'sent' | 'delivered' | 'failed' | 'pending';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  languagePreference?: 'en' | 'hi' | 'bn';
  relationshipLabel?: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  relationshipLabel?: string;
  languagePreference?: 'en' | 'hi' | 'bn';
}


export interface EmergencyContact {
  id: string;
  elderlyUserId: string;
  contactName: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  canReceiveSosEmail: boolean;
}

export interface HealthcareProfile {
  id: string;
  elderlyUserId: string;
  dateOfBirth?: string;
  bloodGroup: string;
  medicalHistory: string[];
  knownAllergies: string[];
  chronicConditions: string[];
  primaryPhysicianName: string;
  primaryPhysicianPhone: string;
  hospitalPreference: string;
  insuranceDetails?: string;
  emergencyNotes?: string;
  updatedAt: string;
}

export interface Medicine {
  id: string;
  elderlyUserId: string;
  name: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Drops';
  colorCode: string;
  frequency: 'Once Daily' | 'Twice Daily' | 'Three Times Daily' | 'Four Times Daily' | 'As Needed';
  scheduleTimes: string[]; // e.g. ["08:00", "13:00", "20:00"]
  foodInstruction: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'Anytime';
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MedicationScheduleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  form: string;
  colorCode: string;
  foodInstruction: string;
  scheduledTime: string; // "08:00 AM" or "08:00"
  status: MedicationStatus;
  takenAt?: string;
  skippedReason?: string;
  instructions?: string;
}

export interface MedicationAdherenceLog {
  id: string;
  medicineId: string;
  medicineName: string;
  elderlyUserId: string;
  actionTakenBy: string; // Name or ID
  actionRole: UserRole;
  status: MedicationStatus;
  scheduledTime: string;
  recordedAt: string;
  skipReason?: string;
  notes?: string;
}

export interface DoctorAppointment {
  id: string;
  elderlyUserId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  hospitalAddress?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  notes?: string;
  status: AppointmentStatus;
  reminderSent: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AccessPasscode {
  id: string;
  elderlyUserId: string;
  passcode: string; // e.g. "CARE-9281" or "784912"
  targetRole: 'family' | 'caregiver';
  label: string; // e.g. "For daughter Priya", "For Nurse Anjali"
  canManageMedications: boolean;
  canManageAppointments: boolean;
  canViewMedicalHistory: boolean;
  expiresAt: string;
  isRevoked: boolean;
  maxUses: number;
  usedCount: number;
  createdAt: string;
}

export interface FamilyCaregiverRelation {
  id: string;
  elderlyUserId: string;
  elderlyName: string;
  memberUserId: string;
  memberName: string;
  memberEmail: string;
  memberRole: UserRole;
  relationshipLabel: string;
  status: 'active' | 'pending_approval' | 'revoked';
  canManageMedications: boolean;
  canManageAppointments: boolean;
  canViewMedicalHistory: boolean;
  notifyOnMissedDose: boolean;
  notifyOnSos: boolean;
  joinedAt: string;
}

export interface NotificationLog {
  id: string;
  elderlyUserId: string;
  recipientEmail: string;
  recipientName: string;
  type: NotificationType;
  subject: string;
  bodyPreview: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt: string;
}

export interface AuditLog {
  id: string;
  elderlyUserId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface AccessibilitySettings {
  fontSizeScale: 100 | 125 | 150 | 175;
  highContrast: boolean;
  nightBlindnessMode: boolean; // Specialized scotopic amber contrast & glare-elimination
  voiceAssistanceEnabled: boolean;
  speechRate: number; // 0.8 to 1.2
  soundEffects: boolean;
  language: 'en' | 'hi' | 'bn';
  silentMode: boolean;
}

export interface AACPhrase {
  id: string;
  iconName: string;
  labelEn: string;
  labelHi: string;
  labelBn: string;
  speechTextEn: string;
  speechTextHi: string;
  speechTextBn: string;
  color: string;
  isUrgent?: boolean;
}
