export type EvidenceType = 'Policy' | 'Procedure' | 'Record' | 'Report' | 'Certificate';

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  relatedAudit: string;
  uploadedBy: string;
  uploadedDate: string;
  fileSize: string;
  tags: string[];
}

export const evidences: Evidence[] = [
  { id: 'E-001', title: 'Information Security Policy v3.0',       type: 'Policy',      relatedAudit: 'A-001', uploadedBy: 'Alice Chen',  uploadedDate: '2024-01-12', fileSize: '245 KB', tags: ['ISO 27001', 'Policy', 'ISMS']          },
  { id: 'E-002', title: 'Risk Assessment Register 2024',          type: 'Record',      relatedAudit: 'A-001', uploadedBy: 'Alice Chen',  uploadedDate: '2024-01-13', fileSize: '1.2 MB', tags: ['Risk', 'Register', '2024']             },
  { id: 'E-003', title: 'GDPR Data Processing Agreement',         type: 'Policy',      relatedAudit: 'A-002', uploadedBy: 'Bob Martinez', uploadedDate: '2024-02-06', fileSize: '412 KB', tags: ['GDPR', 'Legal', 'DPA']                },
  { id: 'E-004', title: 'Staff Awareness Training Records',       type: 'Record',      relatedAudit: 'A-001', uploadedBy: 'Carol Singh', uploadedDate: '2024-01-20', fileSize: '890 KB', tags: ['Training', 'Awareness', 'HR']          },
  { id: 'E-005', title: 'Penetration Testing Report Q4 2023',     type: 'Report',      relatedAudit: 'A-007', uploadedBy: 'Alice Chen',  uploadedDate: '2024-01-30', fileSize: '3.4 MB', tags: ['PenTest', 'Security', 'IT']           },
  { id: 'E-006', title: 'ISO 27001 Certificate 2023',             type: 'Certificate', relatedAudit: 'A-001', uploadedBy: 'David Lee',   uploadedDate: '2024-01-05', fileSize: '180 KB', tags: ['Certificate', 'ISO', 'Compliance']    },
  { id: 'E-007', title: 'Business Continuity Plan v2.3',          type: 'Procedure',   relatedAudit: 'A-005', uploadedBy: 'Eve Johnson', uploadedDate: '2024-01-16', fileSize: '2.1 MB', tags: ['BCP', 'Continuity', 'Operations']      },
  { id: 'E-008', title: 'Vendor Due Diligence Questionnaires',    type: 'Record',      relatedAudit: 'A-008', uploadedBy: 'Grace Kim',   uploadedDate: '2024-02-01', fileSize: '760 KB', tags: ['Vendor', 'Third-Party', 'Supply Chain']},
];
