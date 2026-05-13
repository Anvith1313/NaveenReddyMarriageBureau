'use client'
import { useState } from 'react'

export type SignupStep =
  | 'who' | 'rel' | 'basics'
  | 'about' | 'location' | 'community' | 'career' | 'family' | 'partner' | 'account' | 'membership' | 'review'

export const MAIN_STEPS: SignupStep[] = ['about','location','community','career','family','partner','account','membership']
export const STEP_LABELS = ['About','Location','Community','Career','Family','Partner','Account','Plan']

export const INDIA_STATES = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

export const HEIGHTS = ["4'0\" (121cm)","4'1\" (124cm)","4'2\" (127cm)","4'3\" (130cm)","4'4\" (132cm)","4'5\" (135cm)","4'6\" (137cm)","4'7\" (140cm)","4'8\" (142cm)","4'9\" (145cm)","4'10\" (147cm)","4'11\" (150cm)","5'0\" (152cm)","5'1\" (155cm)","5'2\" (157cm)","5'3\" (160cm)","5'4\" (163cm)","5'5\" (165cm)","5'6\" (168cm)","5'7\" (170cm)","5'8\" (173cm)","5'9\" (175cm)","5'10\" (178cm)","5'11\" (180cm)","6'0\" (183cm)","6'1\" (185cm)","6'2\" (188cm)","6'3\" (191cm)","6'4\" (193cm)","6'5\" (196cm)","6'6\" (198cm)","6'7\" (201cm)","6'8\" (203cm)","6'9\" (206cm)","6'10\" (208cm)","6'11\" (211cm)","7'0\" (213cm)"]

export const GOTRAS = ['Motati','Gudati','Pakanati','Gone','Chittepu','Bhumanchi','Pedakanti','Velama','Gajula','Konukanula','Cherukunutla','Chegolla','Other']
export const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
export const RASHIS = ['Mesha (Aries)','Vrishabha (Taurus)','Mithuna (Gemini)','Karka (Cancer)','Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)','Dhanu (Sagittarius)','Makara (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)']

export interface SignupFormState {
  profileFor: string; relationship: string; gender: string
  name: string; email: string
  maritalStatus: string; dob: string; height: string; motherTongue: string
  complexion: string; bodyType: string; bloodGroup: string; differentlyAbled: string
  tobH: string; tobM: string; tobAP: string; placeOfBirth: string
  country: string; state: string; city: string; nativePlace: string; residentialStatus: string
  gotra: string; fatherGotra: string; nakshatra: string; rashi: string
  schoolBoard: string; schoolName: string; interCollege: string; highestQual: string
  degreeCollege: string; pgCollege: string
  employedIn: string; occupation: string; company: string
  workCountry: string; workState: string; workCity: string
  annualIncome: string; visaStatus: string
  diet: string; smoking: string; drinking: string; aboutYourself: string
  familyType: string; familyValues: string; familyStatus: string
  fatherName: string; fatherStatus: string; fatherOcc: string
  motherName: string; motherStatus: string; motherOcc: string
  parentMobile1: string; parentMobile2: string
  brothers: string; brothersMarried: string; sisters: string; sistersMarried: string
  propertyValue: string
  ppAgeFrom: string; ppAgeTo: string; ppHeight: string
  ppEducation: string; ppProfession: string; ppIncome: string
  ppLocation: string; ppNRI: string; ppNotes: string
  mobile: string; username: string; password: string
  tier: string; tcAgreed: boolean
}

export const INITIAL_STATE: SignupFormState = {
  profileFor: '', relationship: '', gender: 'Male',
  name: '', email: '',
  maritalStatus: '', dob: '', height: '', motherTongue: '', complexion: '', bodyType: '', bloodGroup: '', differentlyAbled: 'No',
  tobH: '', tobM: '', tobAP: '', placeOfBirth: '',
  country: 'India', state: '', city: '', nativePlace: '', residentialStatus: 'Permanent Resident',
  gotra: '', fatherGotra: '', nakshatra: '', rashi: '',
  schoolBoard: '', schoolName: '', interCollege: '', highestQual: '', degreeCollege: '', pgCollege: '',
  employedIn: '', occupation: '', company: '',
  workCountry: 'India', workState: '', workCity: '', annualIncome: '', visaStatus: '',
  diet: '', smoking: 'Never', drinking: 'Never', aboutYourself: '',
  familyType: 'Nuclear Family', familyValues: 'Traditional', familyStatus: '',
  fatherName: '', fatherStatus: '', fatherOcc: '',
  motherName: '', motherStatus: '', motherOcc: '',
  parentMobile1: '', parentMobile2: '',
  brothers: '0', brothersMarried: '0', sisters: '0', sistersMarried: '0', propertyValue: '',
  ppAgeFrom: '', ppAgeTo: '', ppHeight: '', ppEducation: '', ppProfession: '',
  ppIncome: '', ppLocation: '', ppNRI: 'Open to NRI', ppNotes: '',
  mobile: '', username: '', password: '',
  tier: '', tcAgreed: false,
}

export function useSignupForm() {
  const [step, setStep] = useState<SignupStep>('who')
  const [f, setF] = useState<SignupFormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof SignupFormState>(field: K, value: SignupFormState[K]) {
    setF(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  function go(s: SignupStep) {
    setStep(s)
    setError('')
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  return { step, go, f, set, loading, setLoading, error, setError }
}
