# Techniques

## Active-Prompt

### Introduction

Chain-of-thought (CoT) prompting methods typically rely on a fixed set of human-annotated exemplars to guide the reasoning process of Large Language Models (LLMs). However, these fixed exemplars may not always be the most effective examples for different tasks, leading to suboptimal performance. To address this limitation, **Diao et al. (2023)** proposed a new prompting approach called **Active-Prompt**. This method adapts LLMs to various tasks by selecting task-specific example prompts annotated with human-designed CoT reasoning.

### How Active-Prompt Works

Active-Prompt operates through an iterative process involving both the LLM and human annotators:

1. **Initial Querying**:

   - The LLM is queried with or without a few initial CoT examples.
   - For a set of training questions, the model generates multiple possible answers (denoted as *k* answers), resulting in a diverse set of responses.

2. **Uncertainty Estimation**:

   - An uncertainty metric is calculated based on the generated answers.
   - The metric often involves measuring the disagreement among the *k* answers produced by the model.
   - Questions with the highest uncertainty (i.e., those where the model's answers vary the most) are identified.

3. **Human Annotation**:

   - The most uncertain questions are selected for annotation by human experts.
   - Human annotators provide high-quality CoT reasoning for these questions, creating new exemplars that can guide the model more effectively.

4. **Model Updating**:

   - The newly annotated exemplars are added to the existing set of prompts.
   - The LLM is then re-queried using the updated set of exemplars.
   - This process helps the model to refine its reasoning and improve its answers for the remaining questions.

5. **Iterative Refinement**:

   - Steps 1 to 4 are repeated as needed.
   - Each iteration aims to reduce uncertainty and enhance the model's performance by incorporating additional high-quality exemplars.

### Illustration of the Approach

The process can be visualized as follows:

1. **Initial Model Predictions**:

   - The LLM generates multiple answers for each question.
   - For example, for Question 1, the model might produce Answers A, B, and C.

2. **Uncertainty Calculation**:

   - The level of disagreement among the answers is assessed.
   - High disagreement indicates high uncertainty.

3. **Selection of Uncertain Questions**:

   - Questions with the highest uncertainty are selected.
   - For instance, if Question 2 has the most varied answers, it is chosen for annotation.

4. **Human Annotation**:

   - Expert annotators provide detailed CoT reasoning for the selected questions.
   - These annotations serve as new exemplars.

5. **Model Re-Querying**:

   - The LLM is re-queried using the updated prompt that includes the new exemplars.
   - The model's performance is expected to improve on both annotated and unannotated questions.

### Benefits of Active-Prompt

- **Adaptive Example Selection**: Instead of relying on a fixed set of exemplars, Active-Prompt dynamically selects the most informative examples based on the model's performance.

- **Improved Performance**: By focusing on uncertain questions, the method targets areas where the model is weakest, leading to significant improvements.

- **Efficiency**: Reduces the amount of human annotation required by prioritizing only the most uncertain or challenging questions.

- **Task-Specific Customization**: Allows the model to adapt to different tasks by incorporating task-specific reasoning examples.

### Comparison with Other Methods

Unlike traditional CoT methods that use a static set of examples, Active-Prompt leverages active learning principles to select and annotate the most informative examples. This approach is more efficient and adaptable, especially for tasks where the optimal exemplars are not known in advance.

### Conclusion

Active-Prompt presents a novel way to enhance the reasoning capabilities of LLMs by actively selecting and annotating task-specific examples. By focusing human annotation efforts on the most uncertain questions, it efficiently improves the model's performance while minimizing the annotation workload.

---

**References**

- Diao, S., Su, W., Zhong, Y., Yu, Z., Wang, T., Chen, H., & Sun, M. (2023). *Active Prompting with Chain-of-Thought for Large Language Models*. [arXiv:2304.04198](https://arxiv.org/abs/2304.04198)

---

**Next Steps**

Explore related techniques:

- **Automatic Prompt Engineer**: Automating the generation and selection of effective prompts for LLMs.
- **Self-Consistency**: Improving reasoning by aggregating multiple reasoning paths.
