// Sample patient & records used by the prototype
const SAMPLE_PATIENT = {
  healthId: 'NG-NODE1-9f2b3c4a-ck',
  issued: '2026-01-04',
  name: 'Adaeze Okonkwo',
  dob: '1988-03-12',
  gender: 'Female',
  allergies: ['Penicillin'],
  medications: ['Metformin', 'Lisinopril']
};

const SAMPLE_RECORDS = [
  {
    id: 'r-001',
    title: 'Outpatient Consultation',
    date: '2025-12-12',
    source: 'St. Mary Hospital',
    summary: 'Reviewed symptoms of fatigue and elevated HbA1c. Adjusted medication.',
    fhir: {
      resourceType: 'Encounter',
      status: 'finished'
    }
  },
  {
    id: 'r-002',
    title: 'Chest X-Ray Report',
    date: '2025-10-01',
    source: 'Diagnostic Lab',
    summary: 'No acute cardiopulmonary disease identified.',
    fhir: {
      resourceType: 'DiagnosticReport'
    }
  },
  {
    id: 'r-003',
    title: 'Dermatology Consult',
    date: '2025-09-03',
    source: 'Derm Clinic',
    summary: 'Left forearm lesion excised. Histology: benign.',
    fhir: {
      resourceType: 'Procedure'
    }
  }
];

const SAMPLE_APPOINTMENTS = [
  {date:'2026-02-10', with:'Dr. Aminu (General)'},
  {date:'2026-03-02', with:'Derm Clinic'}
];
