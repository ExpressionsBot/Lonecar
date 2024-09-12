import '../styles/globals.css'; // Import global CSS styles
import { useEffect } from 'react'; // Import useEffect hook from React
import { initializePinecone } from '@/utils/pineconeClient'; // Import initializePinecone function from pineconeClient

// Define the custom App component
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializePinecone().catch(console.error); // Initialize Pinecone when the app starts
  }, []);

  return <Component {...pageProps} />; // Render the current page component with its props
}

export default MyApp; // Export the custom App component as the default export