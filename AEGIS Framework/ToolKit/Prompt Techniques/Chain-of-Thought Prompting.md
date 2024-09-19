# Techniques

## Chain-of-Thought Prompting

### Introduction

**Chain-of-Thought (CoT) Prompting** is a technique introduced by **Wei et al. (2022)** that enables large language models (LLMs) to perform complex reasoning tasks by generating intermediate reasoning steps. By encouraging the model to articulate a step-by-step thought process, CoT prompting enhances the model's ability to handle tasks that require multi-step reasoning, such as mathematical problem-solving, logical inference, and commonsense reasoning.

### How Chain-of-Thought Prompting Works

CoT prompting involves providing the model with examples that include both the question and the detailed reasoning leading to the answer. This method can be combined with **few-shot prompting**, where the prompt contains a few exemplars demonstrating the desired reasoning process.

**Example:**

*Prompt:*

```
The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
A: Adding all the odd numbers (9, 15, 1) gives 25. The answer is False.

The odd numbers in this group add up to an even number: 17, 10, 19, 4, 8, 12, 24.
A: Adding all the odd numbers (17, 19) gives 36. The answer is True.

The odd numbers in this group add up to an even number: 16, 11, 14, 4, 8, 13, 24.
A: Adding all the odd numbers (11, 13) gives 24. The answer is True.

The odd numbers in this group add up to an even number: 17, 9, 10, 12, 13, 4, 2.
A: Adding all the odd numbers (17, 9, 13) gives 39. The answer is False.

The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
A:
```

*Model Output:*

```
Adding all the odd numbers (15, 5, 13, 7, 1) gives 41. The answer is False.
```

In this example, the model follows the reasoning steps to determine whether the sum of odd numbers in a given list is even or odd. Providing the reasoning in the prompt helps the model understand how to approach the problem and arrive at the correct answer.

### Emergent Abilities in Large Language Models

The capability to perform complex reasoning tasks through CoT prompting is considered an **emergent ability** that arises in sufficiently large language models. Smaller models may struggle with such tasks, but as model size increases, they begin to exhibit advanced reasoning capabilities when guided appropriately.

### Zero-Shot Chain-of-Thought Prompting

**Kojima et al. (2022)** introduced the concept of **Zero-Shot CoT**, which involves adding a simple prompt like *"Let's think step by step."* This phrase encourages the model to generate intermediate reasoning steps even without explicit examples.

**Example:**

*Question:*

```
I went to the market and bought 10 apples. I gave 2 apples to the neighbor and 2 to the repairman. I then went and bought 5 more apples and ate 1. How many apples did I remain with?
```

*Model Output Without Zero-Shot CoT:*

```
11 apples
```

*(Incorrect answer)*

*Prompt with Zero-Shot CoT:*

```
Let's think step by step.
```

*Model Output:*

```
First, you started with 10 apples.
You gave 2 apples to the neighbor and 2 to the repairman, leaving you with 6 apples.
Then you bought 5 more apples, so you had 11 apples.
You ate 1 apple, so you remained with 10 apples.
```

*Answer:*

```
10 apples
```

By adding *"Let's think step by step,"* the model is prompted to break down the problem into smaller, manageable steps, leading to the correct answer. This approach is especially useful when few or no examples are available to guide the model.

### Automatic Chain-of-Thought (Auto-CoT)

Crafting effective and diverse examples for CoT prompting can be time-consuming and may lead to suboptimal results if not done carefully. **Zhang et al. (2022)** proposed **Automatic Chain-of-Thought (Auto-CoT)** to eliminate manual effort by leveraging LLMs to generate reasoning chains automatically.

**Auto-CoT Process:**

1. **Question Clustering:**

   - Partition the questions in a dataset into clusters based on similarity.
   - Ensures diversity among the questions selected for demonstrations.

2. **Demonstration Sampling:**

   - Select a representative question from each cluster.
   - Generate reasoning chains for these questions using Zero-Shot CoT with simple heuristics.

**Heuristics Used:**

- **Question Length:** Select questions with a moderate length (e.g., around 60 tokens) to encourage clarity.
- **Number of Reasoning Steps:** Aim for a specific number of reasoning steps (e.g., 5 steps) to ensure the reasoning chain is neither too short nor too complex.

By automating the generation of reasoning chains and carefully selecting diverse questions, Auto-CoT enhances the quality of the prompts and improves the model's performance without extensive manual intervention.

**Illustration of the Process:**

- **Stage 1:** Cluster questions to capture different types of problems.
- **Stage 2:** For each cluster, select a representative question and generate its reasoning chain automatically.
- **Result:** A set of diverse and effective demonstrations that can be used in prompts for CoT prompting.

**Code Availability:**

- The code for Auto-CoT is available on [GitHub](https://github.com/amazon-research/auto-cot).

### Conclusion

Chain-of-Thought Prompting is a powerful technique for enhancing the reasoning capabilities of large language models. By encouraging models to generate intermediate reasoning steps, CoT prompting enables more accurate and reliable performance on complex tasks. Techniques like Zero-Shot CoT and Auto-CoT further streamline the process, reducing the need for manual example crafting and making advanced reasoning more accessible.

---

**References:**

- **Wei, J., et al. (2022).** *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)

- **Kojima, T., et al. (2022).** *Large Language Models are Zero-Shot Reasoners.* [arXiv:2205.11916](https://arxiv.org/abs/2205.11916)

- **Zhang, T., et al. (2022).** *Automatic Chain of Thought Prompting in Large Language Models.* [arXiv:2210.03493](https://arxiv.org/abs/2210.03493)

