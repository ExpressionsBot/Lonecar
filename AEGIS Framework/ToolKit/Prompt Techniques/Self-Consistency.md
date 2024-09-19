# Techniques

## Self-Consistency

### Introduction

**Self-Consistency** is an advanced prompting technique proposed by **Wang et al. (2022)** to enhance the reasoning capabilities of Large Language Models (LLMs) during chain-of-thought (CoT) prompting. The primary goal is to replace naive greedy decoding with a strategy that samples multiple diverse reasoning paths. By generating a variety of reasoning chains and selecting the most consistent answer among them, self-consistency improves the performance of LLMs on tasks involving arithmetic and commonsense reasoning.

### How Self-Consistency Works

Traditional chain-of-thought prompting may lead to suboptimal results due to its reliance on a single reasoning path generated through greedy decoding. Self-consistency addresses this limitation by:

1. **Sampling Multiple Reasoning Paths**: Instead of generating a single reasoning chain, the model samples several diverse chains by introducing randomness during decoding (e.g., using temperature sampling).

2. **Aggregating Answers**: The model then aggregates the different answers derived from these reasoning paths.

3. **Selecting the Most Consistent Answer**: Finally, the answer that appears most frequently among the sampled outputs is selected as the final answer, based on the principle that the most consistent answer across diverse reasoning paths is likely the correct one.

### Example: Arithmetic Reasoning

Let's explore how self-consistency can improve the model's performance on an arithmetic problem.

**Problem:**

```
When I was 6, my sister was half my age. Now I'm 70. How old is my sister?
```

**Initial Output without Self-Consistency:**

```
35
```

*(Incorrect answer)*

**Applying Self-Consistency with Few-Shot Exemplars:**

To implement self-consistency, we provide the model with several few-shot exemplars that demonstrate detailed reasoning steps. Below are some examples adapted from Wang et al. (2022):

---

**Exemplar 1:**

**Q:** There are 15 trees in the grove. Grove workers will plant trees in the grove today. After they are done, there will be 21 trees. How many trees did the grove workers plant today?

**A:** We start with 15 trees. Later we have 21 trees. The difference is the number of trees they planted. So, they must have planted \(21 - 15 = 6\) trees. **The answer is 6.**

---

**Exemplar 2:**

**Q:** If there are 3 cars in the parking lot and 2 more cars arrive, how many cars are in the parking lot?

**A:** There are 3 cars initially. 2 more arrive. Now there are \(3 + 2 = 5\) cars. **The answer is 5.**

---

**Exemplar 3:**

**Q:** Leah had 32 chocolates and her sister had 42. If they ate 35, how many pieces do they have left in total?

**A:** Leah had 32 chocolates and her sister had 42, totaling \(32 + 42 = 74\) chocolates. They ate 35, so they have \(74 - 35 = 39\) chocolates left. **The answer is 39.**

---

*(Additional exemplars omitted for brevity.)*

---

**Now, present the target question:**

**Q:** When I was 6, my sister was half my age. Now I'm 70. How old is my sister?

**A:** *(Model generates multiple reasoning paths.)*

### Generated Reasoning Paths and Outputs

**Output 1:**

- When I was 6, my sister was half my age, so she was \(6 \div 2 = 3\) years old.
- The age difference between us is \(6 - 3 = 3\) years.
- Now I'm 70, so my sister is \(70 - 3 = 67\).
- **The answer is 67.**

---

**Output 2:**

- At age 6, my sister was half my age (\(6 \div 2 = 3\)).
- The age gap is \(6 - 3 = 3\) years.
- Now that I'm 70, my sister is \(70 - 3 = 67\).
- **The answer is 67.**

---

**Output 3:**

- When I was 6, my sister was half my age (\(6 \div 2 = 3\)).
- The age difference is 3 years.
- Now I'm 70, so my sister is \(70 \div 2 = 35\).
- **The answer is 35.**

---

### Selecting the Final Answer

By aggregating the outputs:

- **Answer 67** appears twice.
- **Answer 35** appears once.

Using self-consistency, we select **67** as the final answer because it is the most consistent answer among the generated reasoning paths.

### Explanation of Correct Reasoning

1. **Determine the Age Difference:**

   - At age 6, the sister was half the narrator's age: \(6 \div 2 = 3\).
   - The age difference is \(6 - 3 = 3\) years.

2. **Calculate Sister's Current Age:**

   - Now the narrator is 70 years old.
   - Sister's age is \(70 - 3 = 67\) years.

### Benefits of Self-Consistency

- **Improved Accuracy:** By considering multiple reasoning paths, the model reduces the likelihood of errors that might occur in a single chain of thought.
- **Enhanced Robustness:** Sampling diverse reasoning chains helps the model avoid being misled by incorrect intermediate steps.
- **Applicability to Complex Tasks:** Self-consistency is particularly effective for tasks requiring logical reasoning, arithmetic calculations, and commonsense understanding.

### Conclusion

Self-consistency enhances the performance of LLMs in chain-of-thought prompting by leveraging the consistency among multiple reasoning paths. This technique is a valuable tool for prompt engineers aiming to improve the reliability and accuracy of language models on complex reasoning tasks.

---

**References:**

- **Wang, X., et al. (2022).** *Self-Consistency Improves Chain of Thought Reasoning in Language Models.* [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)

---

**Next Steps:**

Explore other advanced prompting techniques:

- **Meta Prompting**
- **Generate Knowledge Prompting**