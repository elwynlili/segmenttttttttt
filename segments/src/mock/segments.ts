import type { Segment } from '../types/segment';

export const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'Top Tier Recipients',
    source: 'Customer Insights',
    lastUpdate: '12/16/2025 11:12 AM',
    createdAt: '12/16/2025 11:12 AM',
    statusReason: 'Draft',
    createdBy: 'Alex Ludcke',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Draft',
    audience: 'contact',
    description: 'Customers with high purchase value and frequent engagement',
    groups: [
      {
        id: 'group-1',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-1',
            attribute: 'Purchase Amount',
            operator: '>',
            value: '1000'
          },
          {
            id: 'condition-2',
            attribute: 'Engagement Score',
            operator: '>',
            value: '80'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '2',
    name: 'All segment',
    source: 'Customer Insights',
    lastUpdate: '12/17/2025 1:56 PM',
    createdAt: '12/17/2025 1:56 PM',
    statusReason: 'Ready to use',
    createdBy: 'Alex Ludcke',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'contact',
    description: 'All contacts in the system',
    groups: []
  },
  {
    id: '3',
    name: 'Event Recipients',
    source: 'Customer Insights',
    lastUpdate: '12/18/2025 3:58 PM',
    createdAt: '12/18/2025 3:58 PM',
    statusReason: 'Ready to use',
    createdBy: 'Thomas TED',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'leads',
    description: 'Leads who have registered for upcoming events',
    groups: [
      {
        id: 'group-3',
        type: 'behavior',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-3',
            attribute: 'Event Registration',
            operator: '=',
            value: 'Upcoming'
          },
          {
            id: 'condition-4',
            attribute: 'Registration Date',
            operator: '>=',
            value: '2025-12-01'
          }
        ],
        subgroups: [
          {
            id: 'subgroup-1',
            type: 'attribute',
            logicalOperator: 'or',
            conditions: [
              {
                id: 'condition-5',
                attribute: 'Country',
                operator: '=',
                value: 'USA'
              },
              {
                id: 'condition-6',
                attribute: 'Country',
                operator: '=',
                value: 'Canada'
              }
            ],
            subgroups: []
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'LEAD',
    source: 'Customer Insights',
    lastUpdate: '12/19/2025 5:46 PM',
    createdAt: '12/19/2025 5:46 PM',
    statusReason: 'Getting ready',
    createdBy: 'Thomas TED',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Getting ready',
    audience: 'leads',
    description: 'New leads from marketing campaigns',
    groups: [
      {
        id: 'group-4',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-7',
            attribute: 'Lead Source',
            operator: '=',
            value: 'Marketing Campaign'
          },
          {
            id: 'condition-8',
            attribute: 'Lead Status',
            operator: '=',
            value: 'New'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '5',
    name: 'UK Clients',
    source: 'Customer Insights',
    lastUpdate: '12/20/2025 8:17 AM',
    createdAt: '12/20/2025 8:17 AM',
    statusReason: 'Ready to use',
    createdBy: 'Hannes Thebe',
    membersCount: 467,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'contact',
    description: 'Customers located in the United Kingdom',
    groups: [
      {
        id: 'group-5',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-9',
            attribute: 'Country',
            operator: '=',
            value: 'United Kingdom'
          },
          {
            id: 'condition-10',
            attribute: 'Customer Status',
            operator: '=',
            value: 'Active'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '6',
    name: 'Event In-Person Attendees for Q1 & Q2',
    source: 'Customer Insights',
    lastUpdate: '12/21/2025 4:15 PM',
    createdAt: '12/21/2025 4:15 PM',
    statusReason: 'Ready to use',
    createdBy: 'Lorenzo Zurbuchen',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'contact',
    description: 'Attendees of in-person events in Q1 and Q2 2025',
    groups: [
      {
        id: 'group-6',
        type: 'behavior',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-11',
            attribute: 'Event Type',
            operator: '=',
            value: 'In-Person'
          },
          {
            id: 'condition-12',
            attribute: 'Event Date',
            operator: '>=',
            value: '2025-01-01'
          },
          {
            id: 'condition-13',
            attribute: 'Event Date',
            operator: '<=',
            value: '2025-06-30'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '7',
    name: "Kathy's Beta Segment",
    source: 'Customer Insights',
    lastUpdate: '12/22/2025 9:28 AM',
    createdAt: '12/22/2025 9:28 AM',
    statusReason: 'Ready to use',
    createdBy: 'Kathy Linders',
    membersCount: 0,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'leads',
    description: 'Beta users with specific interests',
    groups: [
      {
        id: 'group-7',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-14',
            attribute: 'User Type',
            operator: '=',
            value: 'Beta'
          }
        ],
        subgroups: [
          {
            id: 'subgroup-2',
            type: 'attribute',
            logicalOperator: 'or',
            conditions: [
              {
                id: 'condition-15',
                attribute: 'Interest',
                operator: '=',
                value: 'Product A'
              },
              {
                id: 'condition-16',
                attribute: 'Interest',
                operator: '=',
                value: 'Product B'
              }
            ],
            subgroups: []
          }
        ]
      }
    ]
  },
  {
    id: '8',
    name: 'Magdeburg',
    source: 'Customer Insights',
    lastUpdate: '12/23/2025 11:31 AM',
    createdAt: '12/23/2025 11:31 AM',
    statusReason: 'Ready to use',
    createdBy: 'Lukas Mehlgarten',
    membersCount: 1,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'contact',
    description: 'Contacts located in Magdeburg',
    groups: [
      {
        id: 'group-8',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-17',
            attribute: 'City',
            operator: '=',
            value: 'Magdeburg'
          },
          {
            id: 'condition-18',
            attribute: 'Country',
            operator: '=',
            value: 'Germany'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '9',
    name: 'Booking Center - HK',
    source: 'Customer Insights',
    lastUpdate: '12/24/2025 2:47 PM',
    createdAt: '12/24/2025 2:47 PM',
    statusReason: 'Ready to use',
    createdBy: 'Long Wang',
    membersCount: 24,
    type: 'Dynamic',
    status: 'Ready to use',
    audience: 'leads',
    description: 'Leads handled by Hong Kong booking center',
    groups: [
      {
        id: 'group-9',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-19',
            attribute: 'Booking Center',
            operator: '=',
            value: 'Hong Kong'
          },
          {
            id: 'condition-20',
            attribute: 'Language Preference',
            operator: '=',
            value: 'Chinese'
          }
        ],
        subgroups: []
      }
    ]
  },
  {
    id: '10',
    name: 'VIP Customers',
    source: 'Customer Insights',
    lastUpdate: '12/25/2025 10:05 AM',
    createdAt: '12/25/2025 10:05 AM',
    statusReason: 'Ready to use',
    createdBy: 'Admin User',
    membersCount: 156,
    type: 'Static',
    status: 'Ready to use',
    audience: 'contact',
    description: 'VIP customers with exclusive benefits',
    groups: [
      {
        id: 'group-10',
        type: 'attribute',
        logicalOperator: 'and',
        conditions: [
          {
            id: 'condition-21',
            attribute: 'Customer Tier',
            operator: '=',
            value: 'VIP'
          },
          {
            id: 'condition-22',
            attribute: 'Membership Date',
            operator: '>=',
            value: '2024-01-01'
          }
        ],
        subgroups: []
      }
    ]
  }
];
