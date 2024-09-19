
# Pinecone Documentation

## Introduction
Pinecone is a managed, cloud-native vector database with a streamlined API and no infrastructure hassles that provides
long-term memory for high-performance AI applications.

This guide shows you how to set up and use Pinecone in minutes.

To get started in your browser, use the “Pinecone quickstart” colab notebook.

## Getting Started

### API Key
You need an API key to make calls to your Pinecone project. Connect with Pinecone to generate a key. If you don’t have a
Pinecone account, this will also sign you up for the free Starter plan.

Copy your generated key:

PINECONE_API_KEY="YOUR_API_KEY"

Alternatively, you can create an new API key in the Pinecone console.

### Installing the SDK
Pinecone exposes a simple REST API for interacting with your vector database. You can use the API directly or one of
the official Pinecone SDKs:

npm install @pinecone-database/pinecone

### Initializing a Client
Using your API key, initialize your client connection to Pinecone.

```javascript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });
```

## Index Management

### Creating an Index
An index defines the dimension of vectors to be stored and the similarity metric to be used when querying them.
Normally, you choose a dimension and similarity metric based on the embedding model used to create your vectors. For
this quickstart, however, you’ll use a configuration that makes it easy to verify your query results.

Create a serverless index named example-index that stores vectors of 2 dimensions and performs nearest-neighbor search
using the cosine similarity metric.

```javascript
const indexName = "example-index";

await pc.createIndex({
  name: indexName,
  dimension: 2,
  metric: 'cosine'
});
```

### Describing Index Stats
To check if the current vector count matches the number of vectors you upserted, use the describe_index_stats operation:

```javascript
const stats = await index.describeIndexStats();
console.log(stats);
```

### Deleting an Index
When you no longer need the “example-index” index, use the delete_index operation to delete it:

```javascript
await pc.deleteIndex(indexName);
```

## Data Management

### Upserting Vectors
Upserting data to Pinecone involves inserting data if it doesn’t already exist or updating it if it does.

```javascript
await index.upsert([{
  "id": "vec1",
  "values": [1, 2]
}]);
```

### Bulk Upsert
It is recommended to upsert records in large batches, up to 1000 records without exceeding the maximum request size of 2MB.

## Querying

### Running Similarity Search
Query each namespace in your index for the vectors that are most similar to an example query vector.

```javascript
const queryResponse = await index.query({
  topK: 3,
  vector: [1.0, 1.5],
  includeValues: true
});
```

### Query Results Explained
As you put more demands on Pinecone, you’ll see it returning low-latency, accurate results at huge scales, with indexes
of up to billions of vectors.

## Best Practices

### Performance Optimization
Ensure to batch upsert records in large batches and keep an eye on request sizes and quotas.

### Handling Errors
Handle errors gracefully by understanding Pinecone’s error codes and retrying operations where necessary.

## Clean Up

### Deleting Resources
Remember to clean up resources that are no longer needed to avoid unnecessary charges.

```javascript
await pc.deleteIndex("example-index");
```
### usage example

import { Pinecone } from "@pinecone-database/pinecone";
import logger from "../../logger";
import worker_id from "../../workerIdSingleton";

let indexSetup = false;
/** @type Pinecone */
let pinecone;
export async function getPinecone() {
	if (!pinecone) {
		pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
	}

	if (!indexSetup) {
		indexSetup = await setupIndex(pinecone, process.env.PINECONE_INDEX);
		if (!indexSetup) {
			throw new Error("Failed to set up Pinecone index");
		}
	}

	return pinecone;
}

/**
 * Create the Pinecone index if it doesn't exist.
 *
 * @param {Pinecone} pinecone
 * @param {string} indexName
 * @returns {boolean}
 */
async function setupIndex(pinecone, indexName) {
	try {
		logger.info({
			message: `Creating Pinecone index named: ${indexName} if necessary`,
			service: "frontend",
			worker_id,
			action: "creating_index",
		});

		await pinecone.createIndex({
			name: indexName,
			dimension: 384,
			metric: "cosine",
			// Don't return an error if the target Index already exists
			suppressConflicts: true,
			// Wait until the index is ready before returning success
			waitUntilReady: true,
			spec: {
				serverless: {
					cloud: "aws",
					region: process.env.AWS_REGION,
				},
			},
		});

		return true;
	} catch (err) {
		logger.error({
			message: "Error creating index",
			err: err.message,
			service: "frontend",
			worker_id,
			action: "error_creating_index",
		});

		return false;
	}
}