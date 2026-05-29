export interface TableMockData {
  columns: { key: string; label: string; type: 'text' | 'number' | 'badge' | 'date' }[];
  rows: Record<string, any>[];
}

export const TABLE_MOCK_DATASETS: Record<string, TableMockData> = {
  default: {
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'qty', label: 'Quantity', type: 'number' },
      { key: 'price', label: 'Unit Price', type: 'number' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'updated', label: 'Last Updated', type: 'date' },
    ],
    rows: [
      { id: 'PROD-001', name: 'Premium Mechanical Keyboard', qty: 142, price: 129.99, status: 'In Stock', updated: '2026-05-28' },
      { id: 'PROD-002', name: 'Ergonomic Standing Desk Pro', qty: 3, price: 549.50, status: 'Low Stock', updated: '2026-05-27' },
      { id: 'PROD-003', name: 'Noise-Cancelling Headphones', qty: 0, price: 299.00, status: 'Out of Stock', updated: '2026-05-25' },
      { id: 'PROD-004', name: 'UltraWide Curved Monitor 34"', qty: 45, price: 699.99, status: 'In Stock', updated: '2026-05-29' },
      { id: 'PROD-005', name: 'USB-C Multi-Port Docking Station', qty: 180, price: 89.99, status: 'In Stock', updated: '2026-05-29' },
    ]
  },
  leads: {
    columns: [
      { key: 'name', label: 'Lead Name', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'value', label: 'Deal Value', type: 'number' },
      { key: 'stage', label: 'Pipeline Stage', type: 'badge' },
      { key: 'email', label: 'Contact Email', type: 'text' },
      { key: 'created', label: 'Created Date', type: 'date' },
    ],
    rows: [
      { name: 'Sarah Connor', company: 'Cyberdyne Systems', value: 45000, stage: 'Proposal', email: 's.connor@cyberdyne.com', created: '2026-05-12' },
      { name: 'Bruce Wayne', company: 'Wayne Enterprises', value: 125000, stage: 'Negotiation', email: 'bruce@waynecorp.com', created: '2026-05-20' },
      { name: 'Tony Stark', company: 'Stark Industries', value: 85000, stage: 'Qualified', email: 'tony@stark.id', created: '2026-05-24' },
      { name: 'Peter Parker', company: 'Daily Bugle', value: 12000, stage: 'First Contact', email: 'parker@bugle.org', created: '2026-05-28' },
      { name: 'Clark Kent', company: 'Daily Planet', value: 24000, stage: 'Negotiation', email: 'kent@planet.com', created: '2026-05-29' },
    ]
  },
  staff: {
    columns: [
      { key: 'eid', label: 'EID', type: 'text' },
      { key: 'name', label: 'Employee', type: 'text' },
      { key: 'role', label: 'Job Role', type: 'text' },
      { key: 'department', label: 'Department', type: 'badge' },
      { key: 'status', label: 'Activity Status', type: 'badge' },
      { key: 'joined', label: 'Joined Date', type: 'date' },
    ],
    rows: [
      { eid: 'EMP-402', name: 'Clara Oswald', role: 'Staff HR Generalist', department: 'People Operations', status: 'Active', joined: '2023-04-15' },
      { eid: 'EMP-108', name: 'John Smith', role: 'Principal Architect', department: 'Engineering', status: 'Active', joined: '2021-09-01' },
      { eid: 'EMP-221', name: 'Sherlock Holmes', role: 'Chief Security Officer', department: 'Operations', status: 'Active', joined: '2022-01-10' },
      { eid: 'EMP-905', name: 'Martha Jones', role: 'Medical Health Officer', department: 'Corporate Wellness', status: 'On Leave', joined: '2024-03-18' },
      { eid: 'EMP-055', name: 'Rose Tyler', role: 'UI Lead Designer', department: 'Product Design', status: 'Active', joined: '2025-07-22' },
    ]
  }
};

export const getMockDatasetForLabel = (label: string): TableMockData => {
  const normalized = label.toLowerCase();
  if (normalized.includes('lead') || normalized.includes('crm') || normalized.includes('pipeline')) {
    return TABLE_MOCK_DATASETS.leads;
  }
  if (normalized.includes('staff') || normalized.includes('employee') || normalized.includes('people') || normalized.includes('hr')) {
    return TABLE_MOCK_DATASETS.staff;
  }
  return TABLE_MOCK_DATASETS.default;
};

// Mock chart data generator for Recharts
export const getChartMockDataForLabel = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('revenue') || normalized.includes('sale') || normalized.includes('financial')) {
    return [
      { name: 'Jan', value: 4200, expenses: 2400 },
      { name: 'Feb', value: 5300, expenses: 2800 },
      { name: 'Mar', value: 6800, expenses: 3100 },
      { name: 'Apr', value: 8500, expenses: 3900 },
      { name: 'May', value: 9800, expenses: 4200 },
      { name: 'Jun', value: 12500, expenses: 5100 },
    ];
  }
  if (normalized.includes('user') || normalized.includes('customer') || normalized.includes('growth')) {
    return [
      { name: 'Q1', value: 120 },
      { name: 'Q2', value: 240 },
      { name: 'Q3', value: 480 },
      { name: 'Q4', value: 960 },
    ];
  }
  // Default general trend
  return [
    { name: 'Mon', value: 18 },
    { name: 'Tue', value: 24 },
    { name: 'Wed', value: 32 },
    { name: 'Thu', value: 21 },
    { name: 'Fri', value: 38 },
    { name: 'Sat', value: 45 },
    { name: 'Sun', value: 50 },
  ];
};
