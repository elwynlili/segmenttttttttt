// Segment Generator Utility
// Generates example segments using Account fields

import type { Segment, Condition, Group } from '../types/segment';
import { getFromStorage, saveToStorage } from './storage';

const SEGMENT_STORAGE_KEY = 'segments';

// Generate realistic segment names
const segmentNames = [
  'Technology Enterprise Clients',
  'Small Business Healthcare Providers',
  'High Credit Limit Accounts',
  'North American Manufacturing Companies',
  'Global Financial Services Clients',
  'Retail Accounts with Large Credit Lines',
  'Technology Startups',
  'Government Accounts',
  'Energy Sector Clients',
  'Telecommunications Enterprises'
];

// Generate realistic segment descriptions
const segmentDescriptions = [
  'Enterprise clients in the technology industry with high credit limits',
  'Small businesses operating in the healthcare sector',
  'Accounts with credit limits above $200,000',
  'Manufacturing companies located in North America',
  'Financial services clients with global operations',
  'Retail accounts with credit limits exceeding $100,000',
  'Technology startups with innovative solutions',
  'Government accounts at all levels',
  'Clients operating in the energy sector',
  'Telecommunications companies with enterprise solutions'
];

// Generate random segment ID
const generateSegmentId = (): string => {
  return `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate random group ID
const generateGroupId = (): string => {
  return `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate random condition ID
const generateConditionId = (): string => {
  return `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a draft segment using Account fields
const generateDraftSegment = (index: number): Segment => {
  const now = new Date().toISOString();
  const segmentIndex = index % segmentNames.length;
  
  // Different condition combinations based on index
  let conditions: Condition[];
  let subgroup: Group[] = [];
  
  if (index % 3 === 0) {
    // Industry + Account Category
    conditions = [
      {
        id: generateConditionId(),
        attribute: 'industrycode',
        operator: '=',
        value: 'Technology'
      },
      {
        id: generateConditionId(),
        attribute: 'accountcategorycode',
        operator: '=',
        value: 'Enterprise'
      }
    ];
    subgroup = [];
  } else if (index % 3 === 1) {
    // Country + Credit Limit
    conditions = [
      {
        id: generateConditionId(),
        attribute: 'address1_country',
        operator: '=',
        value: 'United States'
      },
      {
        id: generateConditionId(),
        attribute: 'creditlimit',
        operator: '>',
        value: 50000
      }
    ];
    subgroup = [];
  } else {
    // Industry + State/Province
    conditions = [
      {
        id: generateConditionId(),
        attribute: 'industrycode',
        operator: '=',
        value: 'Healthcare'
      }
    ];
    subgroup = [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'or',
        conditions: [
          {
            id: generateConditionId(),
            attribute: 'address1_stateorprovince',
            operator: '=',
            value: 'California'
          },
          {
            id: generateConditionId(),
            attribute: 'address1_stateorprovince',
            operator: '=',
            value: 'New York'
          }
        ],
        subgroups: []
      }
    ];
  }
  
  return {
    id: generateSegmentId(),
    name: segmentNames[segmentIndex],
    source: 'Customer Insights',
    lastUpdate: now,
    createdAt: now,
    statusReason: 'Draft',
    createdBy: 'System Generated',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Draft',
    audience: 'account',
    description: segmentDescriptions[segmentIndex],
    groups: [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'and',
        conditions,
        subgroups: subgroup
      }
    ]
  };
};

// Generate a ready-to-use segment using Account fields
const generateReadySegment = (index: number): Segment => {
  const now = new Date().toISOString();
  const segmentIndex = (index + 5) % segmentNames.length;
  
  // Different complex condition combinations based on index
  let mainConditions: Condition[];
  let subgroups: Group[] = [];
  
  if (index % 4 === 0) {
    // Country + Credit Limit with Industry subgroups
    mainConditions = [
      {
        id: generateConditionId(),
        attribute: 'address1_country',
        operator: '=',
        value: 'United States'
      },
      {
        id: generateConditionId(),
        attribute: 'creditlimit',
        operator: '>',
        value: 200000
      }
    ];
    subgroups = [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'or',
        conditions: [
          {
            id: generateConditionId(),
            attribute: 'industrycode',
            operator: '=',
            value: 'Finance'
          },
          {
            id: generateConditionId(),
            attribute: 'industrycode',
            operator: '=',
            value: 'Healthcare'
          }
        ],
        subgroups: []
      }
    ];
  } else if (index % 4 === 1) {
    // Industry + Account Category + City
    mainConditions = [
      {
        id: generateConditionId(),
        attribute: 'industrycode',
        operator: '=',
        value: 'Technology'
      },
      {
        id: generateConditionId(),
        attribute: 'accountcategorycode',
        operator: '=',
        value: 'Medium Business'
      },
      {
        id: generateConditionId(),
        attribute: 'address1_city',
        operator: '=',
        value: 'New York'
      }
    ];
    subgroups = [];
  } else if (index % 4 === 2) {
    // Credit Limit Range + Industry subgroups with multiple conditions
    mainConditions = [
      {
        id: generateConditionId(),
        attribute: 'creditlimit',
        operator: '>=',
        value: 100000
      },
      {
        id: generateConditionId(),
        attribute: 'creditlimit',
        operator: '<=',
        value: 500000
      }
    ];
    subgroups = [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'or',
        conditions: [
          {
            id: generateConditionId(),
            attribute: 'industrycode',
            operator: '=',
            value: 'Technology'
          },
          {
            id: generateConditionId(),
            attribute: 'industrycode',
            operator: '=',
            value: 'Healthcare'
          },
          {
            id: generateConditionId(),
            attribute: 'industrycode',
            operator: '=',
            value: 'Finance'
          }
        ],
        subgroups: []
      }
    ];
  } else {
    // Multiple Countries + Account Category
    mainConditions = [
      {
        id: generateConditionId(),
        attribute: 'accountcategorycode',
        operator: '=',
        value: 'Medium Business'
      }
    ];
    subgroups = [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'or',
        conditions: [
          {
            id: generateConditionId(),
            attribute: 'address1_country',
            operator: '=',
            value: 'United States'
          },
          {
            id: generateConditionId(),
            attribute: 'address1_country',
            operator: '=',
            value: 'Canada'
          },
          {
            id: generateConditionId(),
            attribute: 'address1_country',
            operator: '=',
            value: 'United Kingdom'
          }
        ],
        subgroups: []
      }
    ];
  }
  
  return {
    id: generateSegmentId(),
    name: segmentNames[segmentIndex],
    source: 'Customer Insights',
    lastUpdate: now,
    createdAt: now,
    statusReason: 'Ready to use',
    createdBy: 'System Generated',
    membersCount: Math.floor(Math.random() * 20) + 0, // Random member count between 0-19
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'account',
    description: segmentDescriptions[segmentIndex],
    groups: [
      {
        id: generateGroupId(),
        type: 'attribute',
        logicalOperator: 'and',
        conditions: mainConditions,
        subgroups: subgroups
      }
    ]
  };
};

// Generate example segments and save to localStorage
const generateExampleSegments = (): void => {
  console.log('Generating example segments...');
  
  // Check if segments already exist in storage
  const existingSegments = getFromStorage<Segment[]>(SEGMENT_STORAGE_KEY, []);
  
  // Only generate new segments if there are none in storage
  if (existingSegments.length === 0) {
    // Generate new segments
    const newSegments: Segment[] = [];
    
    // Generate more draft segments with diverse conditions
    for (let i = 0; i < 4; i++) {
      newSegments.push(generateDraftSegment(i));
    }
    
    // Generate more ready-to-use segments with complex conditions
    for (let i = 0; i < 6; i++) {
      newSegments.push(generateReadySegment(i));
    }
    
    // Save segments to storage
    saveToStorage(SEGMENT_STORAGE_KEY, newSegments);
    
    console.log(`Generated ${newSegments.length} new segments. Total segments in storage: ${newSegments.length}`);
    
    console.log('New segments added:');
    newSegments.forEach(seg => {
      console.log(`- ${seg.name} (${seg.status}) - Members: ${seg.membersCount}`);
    });
  } else {
    console.log(`Segments already exist in storage. Found ${existingSegments.length} segments.`);
  }
};

export { generateExampleSegments };
