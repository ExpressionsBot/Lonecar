import openai

class TheoryOfThought:
    """
    The TheoryOfThought class serves as the foundation of the EAPES system,
    interfacing directly with the OpenAI API to generate responses based on prompts.
    """

    def __init__(self, openai_api_key):
        """
        Initializes the TheoryOfThought system with the provided OpenAI API key.

        :param openai_api_key: Your OpenAI API key as a string.
        """
        openai.api_key = openai_api_key

    def generate_response(self, prompt, model="text-davinci-003", max_tokens=150, temperature=0.7, stop=None):
        """
        Generates a response from the model based on the given prompt.

        :param prompt: The input text prompt for the model.
        :param model: The OpenAI model to use.
        :param max_tokens: The maximum number of tokens in the generated response.
        :param temperature: Sampling temperature for response variability.
        :param stop: A list of stop sequences where the API will stop generating further tokens.
        :return: The model's response as a string.
        """
        try:
            response = openai.Completion.create(
                engine=model,
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
            )
            return response.choices[0].text.strip()
        except Exception as e:
            print(f"An error occurred while generating the response: {e}")
            return None

class IntelligentAutomation:
    """
    The IntelligentAutomation class encapsulates the TheoryOfThought system,
    providing higher-level automation capabilities.
    """

    def __init__(self, tot_system):
        """
        Initializes the IntelligentAutomation with the TheoryOfThought system.

        :param tot_system: An instance of the TheoryOfThought class.
        """
        self.tot_system = tot_system

class RecursiveFeedbackLoop:
    """
    The RecursiveFeedbackLoop class handles the iterative process of refining responses
    based on user feedback.
    """

    def __init__(self, automation_system):
        """
        Initializes the feedback loop with the intelligent automation system.

        :param automation_system: An instance of the IntelligentAutomation class.
        """
        self.automation_system = automation_system
        self.conversation_history = []  # For Multi-Step Memory
        self.feedback_count = 0  # For Adaptive Responses

    def process_feedback(self, feedback, model="text-davinci-003", max_tokens=150, temperature=0.7, stop=None):
        """
        Refines the model's response based on the user's feedback.

        :param feedback: Feedback provided by the user to refine the response.
        :param model: The OpenAI model to use.
        :param max_tokens: The maximum number of tokens in the generated response.
        :param temperature: Sampling temperature for response variability.
        :param stop: A list of stop sequences where the API will stop generating further tokens.
        :return: The refined response from the model.
        """
        try:
            # Update conversation history with feedback
            self.conversation_history.append(f"User Feedback: {feedback}")

            # Adjust parameters based on feedback frequency
            self.feedback_count += 1
            temperature = min(0.9, temperature + 0.05 * self.feedback_count)
            max_tokens = min(2048, max_tokens + 10 * self.feedback_count)

            # Build the conversation prompt
            conversation_prompt = "\n".join(self.conversation_history) + "\nAI:"
            
            response = self.automation_system.tot_system.generate_response(
                conversation_prompt,
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
            )

            # Update conversation history with AI response
            self.conversation_history.append(f"AI: {response}")

            return response
        except Exception as e:
            print(f"An error occurred while processing feedback: {e}")
            return None

class ReconfigurationInterface:
    """
    The ReconfigurationInterface class provides an interface for users to interact with
    the system, offering a way to provide feedback and receive updated responses.
    """

    def __init__(self, feedback_loop):
        """
        Initializes the interface with the feedback loop.

        :param feedback_loop: An instance of the RecursiveFeedbackLoop class.
        """
        self.feedback_loop = feedback_loop

    def start_interface(self, prompt):
        """
        Starts the interactive session with the user.

        :param prompt: The initial prompt from the user.
        """
        print("Welcome to the EAPES system.")
        print("Type 'exit' at any time to end the session.")

        # Initialize conversation history
        self.feedback_loop.conversation_history.append(f"User: {prompt}")

        # Generate initial response
        response = self.feedback_loop.automation_system.tot_system.generate_response(
            prompt
        )
        if response is None:
            print("Failed to generate an initial response.")
            return

        # Update conversation history with AI response
        self.feedback_loop.conversation_history.append(f"AI: {response}")

        print("\nAI Response:")
        print(response)

        while True:
            feedback = input("\nYour Feedback: ")
            if feedback.lower() == 'exit':
                print("Thank you for using the EAPES system. Goodbye!")
                break

            # Process feedback and get refined response
            response = self.feedback_loop.process_feedback(
                feedback,
                stop=["User:", "AI:"],  # Custom Stops
            )
            if response is None:
                print("Failed to process feedback and generate a refined response.")
                continue

            print("\nAI Refined Response:")
            print(response)

class EAPES:
    """
    The EAPES (Extensible Automated Programming and Explanation System) class integrates
    all components to provide a cohesive experience.
    """

    def __init__(self, openai_api_key):
        """
        Initializes the EAPES system with the provided OpenAI API key.

        :param openai_api_key: Your OpenAI API key as a string.
        """
        self.tot_system = TheoryOfThought(openai_api_key)
        self.automation_system = IntelligentAutomation(self.tot_system)
        self.feedback_loop = RecursiveFeedbackLoop(self.automation_system)
        self.reconfiguration_interface = ReconfigurationInterface(self.feedback_loop)

    def run_session(self, prompt):
        """
        Starts a full interactive session with the user.

        :param prompt: The initial prompt from the user.
        """
        self.reconfiguration_interface.start_interface(prompt)

if __name__ == "__main__":
    # Replace 'your_openai_api_key_here' with your actual OpenAI API key
    openai_api_key = "your_openai_api_key_here"
    eapes_system = EAPES(openai_api_key)

    # Initial prompt from the user
    user_prompt = "Explain the significance of machine learning in modern data analysis."

    # Start the EAPES system
    eapes_system.run_session(user_prompt)
