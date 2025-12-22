# Segments Builder Application

A powerful and user-friendly segment builder application for creating and managing customer segments based on various attributes and conditions.

## Features

### Segment Overview
- Display all existing segments with key information
- Search and filter segments by keyword, status, and type
- View segment details including name, source, last update, created date, status reason, created by, members count, and type
- Navigate to segment builder for creating new segments

### Segment Builder
- Create complex segment conditions using attribute-based filtering
- Support for nested groups and subgroups with logical operators (AND/OR)
- Add, edit, and delete conditions and groups
- Real-time validation of conditions
- Save segment configurations to localStorage

### Account & Contact Management
- View and manage accounts and contacts in a table format
- Edit account and contact details
- Filter and search functionality

## Technology Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety and enhanced development experience
- **Vite 4.5.0** - Build tool and development server
- **Material-UI (MUI) 7.3.6** - UI component library
- **React Router v6** - Navigation and routing
- **localStorage** - Client-side data storage

## Environment Requirements

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd segments
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create a production build:
```bash
npm run build
```

### Linting

Run ESLint checks:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── SegmentsOverview.tsx       # Main segments list view
│   ├── SegmentBuilder.tsx         # Segment creation and editing
│   ├── NewSegmentDialog.tsx       # Dialog for creating new segments
│   └── AccountContactManagement.tsx  # Account and contact management
├── types/              # TypeScript interfaces
│   └── segment.ts      # Segment-related type definitions
├── utils/              # Utility functions
│   ├── generateSegments.ts        # Example segments generator
│   ├── storage.ts                 # localStorage utilities
│   └── testDataGenerator.ts       # Test data generation
├── mock/               # Mock data
│   └── segments.ts     # Mock segment data
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── App.css             # Application-specific styles
```

## Key Components

### SegmentsOverview
The main landing page that displays all segments with filtering and search capabilities.

### SegmentBuilder
A comprehensive interface for creating and editing segments with complex condition logic.

### NewSegmentDialog
A dialog component for initiating the creation of new segments.

### AccountContactManagement
A table-based interface for managing accounts and contacts associated with segments.

## Data Structure

### Segment
```typescript
interface Segment {
  id: string;
  name: string;
  source: string;
  lastUpdate: string;
  createdAt: string;
  statusReason: string;
  createdBy: string;
  membersCount: number;
  type: 'Dynamic' | 'Static';
  status: 'Draft' | 'Ready to use' | 'Getting ready';
  audience: 'contact' | 'leads';
  description?: string;
  groups: Group[];
}
```

### Group
```typescript
interface Group {
  id: string;
  type: 'attribute' | 'behavior' | 'existing';
  logicalOperator: 'and' | 'or';
  conditions: Condition[];
  subgroups: Group[];
  memberType?: 'only_matches' | 'between_both';
}
```

### Condition
```typescript
interface Condition {
  id: string;
  attribute: string;
  operator: string;
  value: string | number | boolean;
}
```

## Performance Optimization

- Implemented `useCallback` and `useMemo` to reduce unnecessary re-renders
- Optimized recursive helper functions for better performance
- Reduced code duplication by extracting reusable logic into helper functions
- Efficient localStorage usage with proper data caching

## License

MIT License

## Contributing

Please feel free to submit issues and enhancement requests.