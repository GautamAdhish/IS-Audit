export type ChecklistStatus = 'Compliant' | 'Non-Compliant' | 'Partial' | 'N/A';

export interface ChecklistItem {
  id: string;
  clause: string;
  title: string;
  description: string;
  status: ChecklistStatus;
  evidence: string;
  auditor: string;
}

export const isoChecklist: ChecklistItem[] = [
  { id: 'CL-001', clause: '4.1',  title: 'Understanding the organisation and its context',   description: 'Organisation has identified internal and external issues relevant to its purpose.', status: 'Compliant',     evidence: 'Context analysis document v2.1',       auditor: 'Alice Chen'  },
  { id: 'CL-002', clause: '4.2',  title: 'Understanding needs and expectations of parties',  description: 'Interested parties and their requirements have been identified and documented.',    status: 'Compliant',     evidence: 'Stakeholder register 2024',            auditor: 'Alice Chen'  },
  { id: 'CL-003', clause: '5.1',  title: 'Leadership and commitment',                        description: 'Top management demonstrates leadership and commitment to the ISMS.',                status: 'Partial',       evidence: 'Meeting minutes Q1 2024',              auditor: 'Bob Martinez'},
  { id: 'CL-004', clause: '5.2',  title: 'Information security policy',                      description: 'An IS policy has been established, approved, and communicated.',                   status: 'Compliant',     evidence: 'IS Policy v3.0 signed',                auditor: 'Bob Martinez'},
  { id: 'CL-005', clause: '6.1',  title: 'Actions to address risks and opportunities',       description: 'Risk assessment and treatment processes have been defined and implemented.',        status: 'Non-Compliant', evidence: 'No formal risk register found',        auditor: 'Carol Singh' },
  { id: 'CL-006', clause: '6.2',  title: 'Information security objectives',                  description: 'IS objectives are established and plans exist to achieve them.',                   status: 'Partial',       evidence: 'Objectives doc missing KPIs',          auditor: 'Carol Singh' },
  { id: 'CL-007', clause: '7.2',  title: 'Competence',                                       description: 'Staff performing IS work are competent and records are maintained.',               status: 'Compliant',     evidence: 'Training records 2023-2024',           auditor: 'David Lee'   },
  { id: 'CL-008', clause: '8.1',  title: 'Operational planning and control',                 description: 'Processes needed to meet IS requirements have been planned and controlled.',       status: 'Compliant',     evidence: 'Operations manual v1.4',               auditor: 'David Lee'   },
  { id: 'CL-009', clause: '9.1',  title: 'Monitoring, measurement, analysis and evaluation', description: 'Performance and effectiveness of the ISMS is monitored and evaluated.',           status: 'Non-Compliant', evidence: 'No monitoring metrics established',    auditor: 'Eve Johnson' },
  { id: 'CL-010', clause: '9.2',  title: 'Internal audit',                                   description: 'Internal audits are conducted at planned intervals.',                              status: 'Compliant',     evidence: 'Audit schedule 2024 approved',         auditor: 'Eve Johnson' },
  { id: 'CL-011', clause: '10.1', title: 'Nonconformity and corrective action',               description: 'Nonconformities are identified and corrective actions taken.',                    status: 'Partial',       evidence: 'CAPA log — 3 items past due',          auditor: 'Frank Wu'    },
  { id: 'CL-012', clause: '10.2', title: 'Continual improvement',                             description: 'Organisation continually improves the suitability and effectiveness of ISMS.',   status: 'Compliant',     evidence: 'Management review minutes Jan 2024',   auditor: 'Frank Wu'    },
];
