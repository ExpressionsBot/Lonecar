import csv
from csv import field_size_limit
import sys
import logging
from typing import List, Tuple, Dict, Any
from pinecone import Pinecone
from tqdm import tqdm
import numpy as np
import time

# Configuration
API_KEY = '70bf6ca5-d523-47a1-9d5c-df18b6ce9ea0'
INDEX_NAME = 'lonestarai-02ff370'
DIMENSION = 1536  # Updated to match the Pinecone index dimension
BATCH_SIZE = 100

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def set_csv_field_size_limit():
    max_int = sys.maxsize
    decrement = True
    while decrement:
        try:
            csv.field_size_limit(max_int)
            decrement = False
        except OverflowError:
            max_int = int(max_int/10)
    return max_int

# 1. Analysis Module
def check_csv_integrity(file_path: str) -> bool:
    try:
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for _ in reader:
                pass
        return True
    except Exception as e:
        logging.error(f"CSV integrity check failed: {str(e)}")
        return False

def verify_embedding_dimensions(file_path: str) -> int:
    try:
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Skip header
            first_row = next(reader)
            embedding = eval(first_row[2])  # Assuming the embedding is in the third column
            return len(embedding)
    except Exception as e:
        logging.error(f"Failed to verify embedding dimensions: {str(e)}")
        return -1

def verify_vectors_in_index(pc: Pinecone, ids: List[str]) -> bool:
    try:
        index = pc.Index(INDEX_NAME)
        results = index.fetch(ids)
        found_count = len(results['vectors'])
        logging.info(f"Verified {found_count} out of {len(ids)} vectors in the index")
        return found_count == len(ids)
    except Exception as e:
        logging.error(f"Error verifying vectors in index: {str(e)}")
        return False

def check_and_update_index_config(pc: Pinecone) -> bool:
    try:
        index = pc.Index(INDEX_NAME)
        stats = index.describe_index_stats()
        if stats['dimension'] != DIMENSION:
            logging.warning(f"Index dimension ({stats['dimension']}) does not match DIMENSION ({DIMENSION})")
            logging.error("Index dimension mismatch. Please create a new index with the correct dimension.")
            return False
        return True
    except Exception as e:
        logging.error(f"Error checking index configuration: {str(e)}")
        return False

# 2. Data Preparation Module
def read_and_preprocess_csv(file_path: str) -> List[Tuple[str, str, List[float]]]:
    embeddings = []
    try:
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Skip header
            for row in reader:
                if len(row) != 3:
                    logging.warning(f"Skipping malformed row: {row}")
                    continue
                id, text, embedding = row
                embedding = eval(embedding)
                embeddings.append((id, text, embedding))
        return embeddings
    except Exception as e:
        logging.error(f"Failed to read and preprocess CSV: {str(e)}")
        return []

def batch_embeddings(embeddings: List[Tuple[str, str, List[float]]], batch_size: int) -> List[List[Tuple[str, str, List[float]]]]:
    return [embeddings[i:i + batch_size] for i in range(0, len(embeddings), batch_size)]

# 3. Pinecone Integration Module
def initialize_pinecone() -> Pinecone:
    try:
        pc = Pinecone(api_key=API_KEY)
        logging.info("Pinecone initialized successfully")
        return pc
    except Exception as e:
        logging.error(f"Failed to initialize Pinecone: {str(e)}")
        raise

def upload_batch(pc: Pinecone, batch: List[Tuple[str, str, List[float]]]) -> bool:
    try:
        index = pc.Index(INDEX_NAME)
        vectors = [(item[0], item[2], {"text": item[1][:1000]}) for item in batch]  # Limit text to 1000 chars
        upsert_response = index.upsert(vectors=vectors)
        logging.info(f"Batch upload response: {upsert_response}")
        return True
    except Exception as e:
        logging.error(f"Failed to upload batch: {str(e)}")
        return False

# 4. Error Correction Module
def adjust_embedding_dimensions(embeddings: List[Tuple[str, str, List[float]]], target_dim: int) -> List[Tuple[str, str, List[float]]]:
    adjusted_embeddings = []
    for id, text, embedding in embeddings:
        if len(embedding) < target_dim:
            logging.info(f"Padding embedding for ID {id} from {len(embedding)} to {target_dim} dimensions")
            adjusted_embedding = embedding + [0.0] * (target_dim - len(embedding))
        elif len(embedding) > target_dim:
            logging.info(f"Truncating embedding for ID {id} from {len(embedding)} to {target_dim} dimensions")
            adjusted_embedding = embedding[:target_dim]
        else:
            adjusted_embedding = embedding
        adjusted_embeddings.append((id, text, adjusted_embedding))
    return adjusted_embeddings

def retry_failed_uploads(pc: Pinecone, failed_batches: List[List[Tuple[str, str, List[float]]]]) -> None:
    for batch in failed_batches:
        if upload_batch(pc, batch):
            logging.info(f"Successfully retried batch upload for {len(batch)} items")
        else:
            logging.error(f"Failed to retry batch upload for {len(batch)} items")

# 5. Logging and Monitoring Module
def log_progress(stage: str, progress: float):
    logging.info(f"{stage}: {progress:.2f}% complete")

# 6. Main Pipeline Orchestrator
def run_pipeline(csv_file_path: str):
    try:
        set_csv_field_size_limit()
        
        log_progress("CSV Integrity Check", 0)
        if not check_csv_integrity(csv_file_path):
            raise ValueError("CSV file is corrupted or invalid")
        log_progress("CSV Integrity Check", 100)

        log_progress("Embedding Dimension Verification", 0)
        csv_dimension = verify_embedding_dimensions(csv_file_path)
        if csv_dimension == -1:
            raise ValueError("Failed to verify embedding dimensions")
        log_progress("Embedding Dimension Verification", 100)

        log_progress("Pinecone Initialization", 0)
        pc = initialize_pinecone()
        log_progress("Pinecone Initialization", 100)

        log_progress("Pinecone Configuration Validation", 0)
        if not validate_pinecone_config(pc):
            raise ValueError("Pinecone index configuration is invalid")
        if not check_and_update_index_config(pc):
            raise ValueError("Failed to verify or update Pinecone index configuration")
        log_progress("Pinecone Configuration Validation", 100)

        log_progress("CSV Reading and Preprocessing", 0)
        embeddings = read_and_preprocess_csv(csv_file_path)
        if not embeddings:
            raise ValueError("No valid embeddings found in CSV")
        log_progress("CSV Reading and Preprocessing", 100)

        log_progress("Dimension Adjustment", 0)
        if csv_dimension != DIMENSION:
            logging.info(f"Adjusting embedding dimensions from {csv_dimension} to {DIMENSION}")
            original_embeddings = embeddings
            embeddings = adjust_embedding_dimensions(embeddings, DIMENSION)
            logging.info(f"Sample original embedding: {original_embeddings[0][2][:5]}...")
            logging.info(f"Sample adjusted embedding: {embeddings[0][2][:5]}...")
        log_progress("Dimension Adjustment", 100)

        log_progress("Batching Embeddings", 0)
        batches = batch_embeddings(embeddings, BATCH_SIZE)
        log_progress("Batching Embeddings", 100)

        log_progress("Uploading Batches", 0)
        failed_batches = []
        for i, batch in enumerate(tqdm(batches, desc="Uploading batches")):
            if not upload_batch(pc, batch):
                failed_batches.append(batch)
            log_progress("Uploading Batches", (i + 1) / len(batches) * 100)

        if failed_batches:
            log_progress("Retrying Failed Uploads", 0)
            retry_failed_uploads(pc, failed_batches)
            log_progress("Retrying Failed Uploads", 100)

        log_progress("Verifying Uploaded Vectors", 0)
        time.sleep(5)  # Add a 5-second delay before verification
        all_ids = [item[0] for batch in batches for item in batch]
        if verify_vectors_in_index(pc, all_ids):
            logging.info("All vectors verified in the index")
        else:
            logging.warning("Not all vectors were found in the index")
        log_progress("Verifying Uploaded Vectors", 100)

        log_progress("Verifying Final Index Stats", 0)
        index = pc.Index(INDEX_NAME)
        final_stats = index.describe_index_stats()
        logging.info(f"Final index stats: {final_stats}")
        log_progress("Verifying Final Index Stats", 100)

        log_progress("Pipeline Execution", 100)
        logging.info("Pipeline completed successfully")

    except Exception as e:
        logging.error(f"Pipeline failed: {str(e)}")
        raise

if __name__ == "__main__":
    csv_file_path = r'C:\Users\Daniel\Desktop\lonestaraiproject\embeddings_output.csv'
    run_pipeline(csv_file_path)