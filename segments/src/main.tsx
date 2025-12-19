import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ensureTestDataExists } from './utils/testDataGenerator'
import { generateExampleSegments } from './utils/generateSegments'

// Use the dedicated test data generator utility to generate fresh English test data
console.log('Starting application with fresh English test data generation...')

// Ensure fresh English test data exists (clears existing data and generates new English data)
ensureTestDataExists()

// Generate example segments using Account fields
generateExampleSegments()

console.log('Test data and segment generation completed successfully!');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
