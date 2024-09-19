  

  

## Overview

Directional Stimulus Prompting (DSP) is a novel framework for guiding large language models (LLMs) towards producing specific outputs. By using a smaller tunable policy model (e.g., T5), DSP provides **directional stimuli**, which act as task-specific clues, to help LLMs generate the desired outputs. DSP offers a flexible and efficient alternative to directly tuning LLMs, making it more practical in scenarios where LLM parameters are inaccessible.

  

---

  

## Objectives

- **Instance-Specific Control**: Generate precise, context-dependent prompts that guide LLMs in the right direction.

- **Data-Efficient Learning**: Achieve significant performance improvement with minimal labeled data.

- **Model-Agnostic Approach**: Work with black-box LLMs like ChatGPT, Codex, and InstructGPT without direct access to their internal parameters.

  

---

  

## Core Components

  

1. **Policy Model (Tunable LM)**: A small-scale, tunable model (like T5) that generates directional stimulus prompts based on the input.

2. **Directional Stimuli**: Instance-specific tokens or hints that steer the LLM towards desired behaviors.

3. **Black-Box LLM**: Large models (e.g., ChatGPT, Codex) that produce the final output using the stimuli without being tuned.

  

---

  

## Process Workflow

  

### Step 1: Input Processing

- **Raw Input**: The original text or task provided by the user.

- **Stimulus Generation**: The tunable policy model generates task-relevant stimuli (e.g., keywords, dialogue acts) to guide the LLM.

  

### Step 2: LLM Guidance

- The input is combined with the directional stimulus.

- The black-box LLM uses this combined input to generate the desired output.

  

### Step 3: Model Optimization

- **Supervised Fine-Tuning (SFT)**: Fine-tune the policy model using labeled data to generate accurate stimuli.

- **Reinforcement Learning (RL)**: Further optimize the policy model to improve alignment between LLM output and desired results, maximizing task-specific performance metrics.

  

---

  

## Optimization Techniques

  

### 1. Supervised Fine-Tuning (SFT)

- **Objective**: Train the policy model on labeled datasets to generate directional stimuli.

- **Loss Function**: Minimize log-likelihood loss to encourage the policy model to produce relevant stimuli.

  

### 2. Reinforcement Learning (RL)

- **Goal**: Optimize the policy model's stimuli generation to achieve better task-specific outcomes.

- **Reward Function**: Use performance metrics like ROUGE or human feedback to define rewards for each stimulus-generated LLM output.

  

---

  

## Applications and Experimental Results

  

### 1. Summarization

- **Task**: Guide LLMs to produce summaries with specific keywords.

- **Results**: DSP improved ROUGE and BLEU scores by up to 13%, even with small datasets.

  

### 2. Dialogue Response Generation

- **Task**: Enhance task-oriented dialogues by providing context-specific dialogue acts.

- **Results**: Improved performance by 41.4% on dialogue success rates with minimal data.

  

### 3. Chain-of-Thought (CoT) Reasoning

- **Task**: Trigger chain-of-thought reasoning with instance-specific prompts.

- **Results**: Achieved higher reasoning accuracy compared to manually crafted prompts.

  

---

  

## Key Advantages

  

- **Fine-Grained Control**: Enables more precise outputs by injecting instance-specific stimuli.

- **Efficient and Scalable**: Reduces the need for extensive fine-tuning on large LLMs, making the process computationally efficient.

- **Broad Applicability**: Adapts to diverse tasks, from text summarization to complex reasoning and dialogue systems.

  

---

  

## Conclusion and Future Work

DSP offers a flexible and powerful approach to steer large language models in real-world applications. Future work can explore non-textual stimuli and further reinforcement learning techniques for better control over black-box LLMs.