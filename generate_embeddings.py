import os
from openai import OpenAI

# Assuming your OPENAI_API_KEY is stored in an environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set.")
client = OpenAI(api_key=OPENAI_API_KEY)

def list_markdown_files(directory):
    """Returns a list of markdown files in the specified directory."""
    try:
        return [f for f in os.listdir(directory) if f.endswith('.md')]
    except FileNotFoundError as e:
        print(f"Error: Directory not found: {e}")
        return []

def read_markdown_file(file_path):
    """Reads the content of a markdown file and returns it as a string."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content.strip()  # Ensure no leading/trailing whitespace
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None

def is_content_valid(content):
    """Checks if the content is valid (i.e., non-empty)."""
    return bool(content)

def process_content(content):
    """Generates an embedding for the provided content using the OpenAI API."""
    max_tokens = 8192  # Maximum tokens for the model
    chunk_size = max_tokens - 100  # Leave some buffer for safety

    # Split content into chunks
    chunks = [content[i:i + chunk_size] for i in range(0, len(content), chunk_size)]
    embeddings = []

    for chunk in chunks:
        try:
            response = client.embeddings.create(
                input=chunk,
                model="text-embedding-ada-002"
            )
            embeddings.append(response.data[0].embedding)
        except Exception as e:
            print(f"Error processing content with OpenAI API: {e}")
            return None

    # Combine embeddings (e.g., by averaging)
    if embeddings:
        combined_embedding = [sum(x) / len(embeddings) for x in zip(*embeddings)]
        return combined_embedding
    else:
        return None

def create_upsert_data(directory):
    """Processes all markdown files in the directory, generating embedding data for valid files."""
    files = list_markdown_files(directory)
    upsert_data = []
    log_invalid_files = []

    for count, file in enumerate(files, 1):
        file_path = os.path.join(directory, file)
        content = read_markdown_file(file_path)
        
        if content is not None and is_content_valid(content):
            embedding = process_content(content)
            if embedding:
                upsert_data.append({
                    'id': f'doc_{count}',
                    'values': embedding,
                    'metadata': {'type': 'Content', 'filename': file}  # Added filename to metadata
                })
            else:
                log_invalid_files.append(file)
        else:
            log_invalid_files.append(file)

    if log_invalid_files:
        print(f"Files with invalid content or errors: {log_invalid_files}")

    return upsert_data

if __name__ == "__main__":
    directory = '/home/danny/chat_ui/markdown_files'
    
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"The directory {directory} does not exist.")
    
    upsert_data = create_upsert_data(directory)

    if upsert_data:
        print(f"Generated embeddings for {len(upsert_data)} files.")
        print(f"First entry of upsert data: {upsert_data[0]}")
    else:
        print("No valid upsert data generated.")