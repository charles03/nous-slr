# Noustar Query Page Integration Guide

This guide provides step-by-step instructions for integrating the Noustar Query Page components into your existing `nous-slr` repository.

## Overview

The query page integration includes:
- **QueryPage**: Main page component with AI-powered and manual query building
- **QueryEditor**: Advanced query builder with syntax highlighting and validation
- **WorkflowSteps**: Sidebar component for systematic review workflow navigation
- **QueryModals**: Collection of modals for different query building flows
- **Router**: Simple client-side routing system
- **Services**: API services for query generation and validation
- **Types**: TypeScript definitions for query-related functionality

## File Structure

Add the following files to your existing repository:

```
src/
├── types/
│   ├── query.ts                    # Query type definitions
│   └── router.ts                   # Router type definitions
├── utils/
│   └── queryFormatter.ts           # Query formatting utilities
├── services/
│   └── queryService.ts            # Query API service layer
├── components/
│   ├── QueryEditor/
│   │   ├── QueryEditor.tsx         # Main query editor component
│   │   └── QueryEditor.css         # Query editor styles
│   ├── QueryModals/
│   │   ├── QueryModals.tsx         # Modal components
│   │   └── QueryModals.css         # Modal styles
│   ├── WorkflowSteps/
│   │   ├── WorkflowSteps.tsx       # Workflow sidebar component
│   │   └── WorkflowSteps.css       # Workflow styles
│   ├── Router/
│   │   └── SimpleRouter.tsx        # Simple routing system
│   └── ProjectList/
│       ├── ProjectList-Updated.tsx # Updated project list with navigation
│       └── ProjectList-Updated.css # Updated styles
├── pages/
│   └── QueryPage/
│       ├── QueryPage.tsx           # Main query page component
│       └── QueryPage.css           # Query page styles
└── App-with-Router.tsx             # Updated App component with routing
```

## Integration Steps

### 1. Install Dependencies

The query page uses the existing dependencies from your `package.json`. No additional npm packages are required.

### 2. Add Type Definitions

Create the new type files:

```bash
# Create directories if they don't exist
mkdir -p src/types src/utils src/services src/pages/QueryPage src/components/QueryEditor src/components/QueryModals src/components/WorkflowSteps src/components/Router
```

Copy the following files:
- `src/types/query.ts`
- `src/types/router.ts`

### 3. Add Utility Functions

Copy `src/utils/queryFormatter.ts` - This provides query formatting, validation, and manipulation utilities.

### 4. Add Service Layer

Copy `src/services/queryService.ts` - This provides API services for query generation and validation.

### 5. Add Components

Copy all component files:
- `src/components/QueryEditor/`
- `src/components/QueryModals/`
- `src/components/WorkflowSteps/`
- `src/components/Router/`

### 6. Add Pages

Copy the QueryPage:
- `src/pages/QueryPage/`

### 7. Update Existing Components

#### Option A: Replace existing ProjectList
Replace your existing `src/components/ProjectList/ProjectList.tsx` with `ProjectList-Updated.tsx` to add navigation functionality.

#### Option B: Gradual integration
Keep your existing ProjectList and integrate the navigation features gradually by:
1. Adding the router hooks
2. Adding navigation buttons
3. Updating the styles

### 8. Update Main App Component

#### Option A: Replace App.tsx
Replace your existing `src/App.tsx` with the content from `App-with-Router.tsx`.

#### Option B: Gradual integration
Add routing to your existing App.tsx:

```tsx
import { Router, Route } from './components/Router/SimpleRouter';
import QueryPage from './pages/QueryPage/QueryPage';

// Wrap your existing app with Router
function App() {
  return (
    
      
        
        
        
      
    
  );
}
```

### 9. Update Package.json (Optional)

Update your `package.json` with the enhanced description and keywords from `package-updated.json`.

## Configuration

### Environment Variables

No additional environment variables are required. The query service uses mock data by default.

### API Integration

To integrate with real APIs:

1. Update `src/services/queryService.ts`
2. Replace mock functions with actual API calls
3. Add your API base URL to environment variables
4. Update the API endpoints in the service

### Customization

#### Workflow Steps
Modify `src/components/WorkflowSteps/WorkflowSteps.tsx` to change:
- Step names and descriptions
- Colors and icons
- Number of steps

#### Query Templates
Update `src/services/queryService.ts` to modify:
- AI-generated query templates
- Query validation rules
- Mock response data

#### Styling
All components use CSS modules. Customize styles in the respective `.css` files.

## Usage

### Basic Navigation

```tsx
import { useNavigation } from './components/Router/SimpleRouter';

function MyComponent() {
  const { navigate } = useNavigation();
  
  const goToQuery = () => {
    navigate('/project/123/query');
  };
  
  return Open Query Builder;
}
```

### Query Builder Integration

```tsx
import QueryEditor from './components/QueryEditor/QueryEditor';

function MyQueryPage() {
  const [queryText, setQueryText] = useState('');
  const [formattedQuery, setFormattedQuery] = useState('');
  
  return (
    
  );
}
```

### Workflow Steps

```tsx
import WorkflowSteps from './components/WorkflowSteps/WorkflowSteps';

function MyWorkflowPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  
  return (
    <WorkflowSteps
      activeStep={activeStep}
      completedSteps={completedSteps}
      onStepClick={setActiveStep}
      isExpanded={true}
      onToggleExpanded={() => {}}
    />
  );
}
```

## Testing

### Component Testing

Test the new components using your existing test setup:

```bash
npm test QueryEditor
npm test QueryPage
npm test WorkflowSteps
```

### Integration Testing

1. Start the development server: `npm start`
2. Navigate to the home page
3. Click on a project to open the query builder
4. Test both AI-powered and manual query flows
5. Verify navigation between workflow steps

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure all new files are in the correct directories
2. **Styling issues**: Check that CSS files are properly imported
3. **Navigation not working**: Verify the Router component wraps your app
4. **Type errors**: Ensure all new type definitions are properly imported

### Performance Considerations

1. The query formatter processes text synchronously - for very large queries, consider debouncing
2. The router maintains history in memory - consider implementing persistence for production use
3. Modal components render conditionally to avoid unnecessary DOM elements

## Next Steps

After successful integration:

1. **API Integration**: Replace mock services with real backend APIs
2. **Persistence**: Add query saving and loading functionality
3. **Advanced Features**: Implement query history, favorites, and sharing
4. **Testing**: Add comprehensive unit and integration tests
5. **Documentation**: Create user guides for the query builder features

## Support

For questions or issues during integration:

1. Check the existing component documentation
2. Review the TypeScript types for expected interfaces
3. Test individual components in isolation
4. Verify CSS imports and class names

The modular design ensures you can integrate components gradually and customize them to fit your existing design system.