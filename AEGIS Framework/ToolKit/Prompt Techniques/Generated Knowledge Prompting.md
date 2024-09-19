

---

#### **Introduction:**
Large Language Models (LLMs) have seen continuous improvements, and one promising technique is incorporating external knowledge to enhance the model's predictions. But can LLMs generate knowledge themselves as part of the prompt to improve task performance, particularly for tasks like commonsense reasoning?

This approach is explored in Liu et al. (2022), where knowledge is first generated and then integrated into the prompt to help the model make better predictions.

---

#### **Example - Problem Setup:**
Let's explore a simple example where a model makes an incorrect prediction due to limited world knowledge:

**Prompt:**  
“Part of golf is trying to get a higher point total than others. Yes or No?”

**LLM Output (without knowledge generation):**  
“Yes.”

This answer is incorrect because the goal of golf is to achieve the lowest score, not the highest. The lack of detailed knowledge reveals the limitations of the model when faced with real-world reasoning tasks.

---

#### **Step 1: Generate Knowledge**
Before the model answers a question, we generate relevant "knowledge" to inform the prompt. Here’s how this looks for different inputs:

- **Input:** "Greece is larger than Mexico."  
  **Generated Knowledge:** "Greece is approximately 131,957 sq km, while Mexico is approximately 1,964,375 sq km, making Mexico 1,389% larger than Greece."

- **Input:** "Glasses always fog up."  
  **Generated Knowledge:** "Condensation occurs on eyeglass lenses when water vapor lands on a cold surface, cools, and forms tiny drops of liquid, causing fog."

- **Input:** "A fish is capable of thinking."  
  **Generated Knowledge:** "Fish have cognitive abilities comparable to some higher vertebrates, using memory and complex social relationships."

In the same manner, we generate knowledge related to golf:

- **Input:** "Part of golf is trying to get a higher point total than others."  
  **Generated Knowledge 1:** "The objective of golf is to play a set of holes in the least number of strokes. Each stroke is counted as one point, and the total number of strokes determines the winner."  
  **Generated Knowledge 2:** "Golf is a precision sport where the aim is to complete the course with the lowest score, calculated by adding up the total number of strokes taken on each hole."

---

#### **Step 2: Integrate Knowledge into the Prompt**
Once the knowledge is generated, it is integrated into the prompt to guide the model’s final prediction. We reformat the original question into a QA format, including the generated knowledge.

**Question:**  
"Part of golf is trying to get a higher point total than others. Yes or No?"

**Knowledge:**  
"The objective of golf is to play a set of holes in the least number of strokes. Each stroke is counted as one point, and the total number of strokes determines the winner."

---

#### **Step 3: Model Prediction**
With the knowledge now part of the prompt, the model provides a more informed response:

**Answer 1 (High confidence):**  
"No, the objective of golf is not to get a higher point total. The aim is to complete the course with the fewest strokes, and the player with the lowest score wins."

**Answer 2 (Lower confidence):**  
"Yes, part of golf is trying to get a higher point total. Players aim to complete the course with the lowest score, calculated by adding up strokes on each hole."

---

#### **Observations:**
In this case, the model’s first answer, backed by the generated knowledge, is more confident and accurate. The second answer, although technically correct in part, reflects a lower confidence score due to some uncertainty in the interpretation.

This experiment illustrates how **Generated Knowledge Prompting** can enhance model predictions by providing contextually relevant information, especially for tasks like commonsense reasoning where world knowledge is crucial.

---

#### **Advanced Techniques:**
The concept of **Self-Consistency** and **Prompt Chaining** are also introduced as ways to further refine and validate model predictions.  
- **Self-Consistency:** By generating multiple knowledge pieces and answers, models can choose the most consistent one.
- **Prompt Chaining:** Multiple prompts are connected, with outputs from earlier prompts informing subsequent ones, allowing for more complex reasoning paths.

---

This cleaned-up version simplifies the process while maintaining clarity, making it easier to understand the method and its significance in improving LLM performance.