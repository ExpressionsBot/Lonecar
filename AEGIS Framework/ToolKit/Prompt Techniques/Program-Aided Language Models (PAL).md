# Techniques

## Program-Aided Language Models (PAL)

**Gao et al. (2022)** introduced a method that uses Large Language Models (LLMs) to read natural language problems and generate programs as intermediate reasoning steps. Coined **Program-Aided Language Models (PAL)**, this approach differs from chain-of-thought prompting by offloading the solution step to a programmatic runtime, such as a Python interpreter, instead of relying on free-form text to obtain the solution.

### Example Using LangChain and OpenAI GPT-3

Let's explore an example using **LangChain** and **OpenAI's GPT-3**. We aim to develop a simple application that interprets questions and provides answers by leveraging a Python interpreter. Specifically, we'll create functionality that enables the LLM to answer questions requiring date calculations. We'll provide the LLM with a prompt that includes several examples, adopted from [this repository](https://github.com/reasoning-machines/pal/blob/main/pal/prompt/date_understanding.txt).

#### Imports

First, import the necessary libraries:

```python
import openai
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
from langchain.llms import OpenAI
from dotenv import load_dotenv
```

#### Configuration

Configure the environment and API keys:

```python
# Load environment variables from a .env file
load_dotenv()

# Set up the OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# For LangChain
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
```

#### Setting Up the Model Instance

Create an instance of the LLM:

```python
llm = OpenAI(model_name='text-davinci-003', temperature=0)
```

#### Preparing the Prompt and Question

Define the question and the prompt with exemplars:

```python
question = "Today is 27 February 2023. I was born exactly 25 years ago. What is the date I was born in MM/DD/YYYY?"

DATE_UNDERSTANDING_PROMPT = """
# Q: 2015 is coming in 36 hours. What is the date one week from today in MM/DD/YYYY?
# If 2015 is coming in 36 hours, then today is 36 hours before 2015.
today = datetime(2015, 1, 1) - relativedelta(hours=36)
# One week from today:
one_week_from_today = today + relativedelta(weeks=1)
# The answer formatted with %m/%d/%Y is:
one_week_from_today.strftime('%m/%d/%Y')

# Q: The first day of 2019 is a Tuesday, and today is the first Monday of 2019. What is the date today in MM/DD/YYYY?
# If the first day of 2019 is a Tuesday, then today is 6 days later.
today = datetime(2019, 1, 1) + relativedelta(days=6)
today.strftime('%m/%d/%Y')

# Q: The concert was scheduled for 06/01/1943 but was delayed by one day to today. What is the date 10 days ago in MM/DD/YYYY?
# Today is one day after 06/01/1943.
today = datetime(1943, 6, 1) + relativedelta(days=1)
# Ten days ago:
ten_days_ago = today - relativedelta(days=10)
ten_days_ago.strftime('%m/%d/%Y')

# Q: It is 4/19/1969 today. What is the date 24 hours later in MM/DD/YYYY?
# Today is 4/19/1969.
today = datetime(1969, 4, 19)
# 24 hours later:
later = today + relativedelta(hours=24)
later.strftime('%m/%d/%Y')

# Q: Jane thought today is 3/11/2002, but it is actually 1 day later. What is the date 24 hours later in MM/DD/YYYY?
# Today is 1 day after 3/11/2002.
today = datetime(2002, 3, 12)
# 24 hours later:
later = today + relativedelta(hours=24)
later.strftime('%m/%d/%Y')

# Q: Jane was born on the last day of February in 2001. Today is her 16th birthday. What is the date yesterday in MM/DD/YYYY?
# Jane was born on 02/28/2001. Today is 16 years later.
today = datetime(2001, 2, 28) + relativedelta(years=16)
# Yesterday:
yesterday = today - relativedelta(days=1)
yesterday.strftime('%m/%d/%Y')

# Q: {question}
""".strip() + '\n'
```

#### Generating the LLM Output

Use the LLM to generate the code snippet:

```python
llm_out = llm(DATE_UNDERSTANDING_PROMPT.format(question=question))
print(llm_out)
```

**Output:**

```python
# If today is 27 February 2023 and I was born exactly 25 years ago, then I was born 25 years before today.
today = datetime(2023, 2, 27)
# I was born 25 years before today:
born = today - relativedelta(years=25)
# The answer formatted with %m/%d/%Y is:
born.strftime('%m/%d/%Y')
```

The `llm_out` variable contains a Python code snippet that calculates the desired date.

#### Executing the Generated Code

Now, execute the generated code to obtain the final answer:

```python
# Prepare the environment for code execution
exec_globals = {
    'datetime': datetime,
    'relativedelta': relativedelta
}

# Execute the code
exec(llm_out, exec_globals)

# Retrieve and print the answer
answer = exec_globals['born'].strftime('%m/%d/%Y')
print(f"The date I was born is: {answer}")
```

**Output:**

```
The date I was born is: 02/27/1998
```

### Explanation

- **Imports and Configuration:** We import necessary libraries and set up API keys securely.
- **Model Setup:** We create an instance of the OpenAI LLM with specified parameters.
- **Prompt Preparation:** The prompt includes several date-related questions and their corresponding Python code solutions.
- **LLM Output Generation:** The model generates Python code that solves the provided question.
- **Code Execution:** We execute the generated code in a controlled environment to obtain the answer.

### Safety Note

When using `exec()` to run code generated by an LLM, it's crucial to ensure the code is safe to execute to prevent security risks. In this example, we limit the execution environment to necessary functions only.

### References

- Gao, L., et al. (2022). **PAL: Program-Aided Language Models.** [arXiv:2211.10435](https://arxiv.org/abs/2211.10435)
- [LangChain Documentation](https://langchain.readthedocs.io/)
- [PAL Repository](https://github.com/reasoning-machines/pal)