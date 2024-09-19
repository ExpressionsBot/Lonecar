def generate_answer(self):
        return "\n".join([fact for sublist in self.notebook for fact in sublist])

def create_graph(conversation_history):
    graph = []
    for i, session in enumerate(conversation_history):
        node = GraphNode(f"session{i+1}", session['content'])
        if i > 0:
            graph[i-1].neighbors.append(node)
        graph.append(node)
    return graph

def manage_conversation_history(agent):
    global conversation_history
    if len(conversation_history) > 50:  # Adjust threshold as necessary
        graph = create_graph(conversation_history)
        agent.graph = graph
        agent.explore(graph[0])
        summary = agent.generate_answer()
        conversation_history = [{"role": "system", "content": "This is a summary of the conversation so far:"}, 
                                {"role": "user", "content": summary}]
def chat_with_gpt4o(user_input, image_path=None, current_iteration=None, max_iterations=None):
    global conversation_history, automode
    
    if image_path:
        print_colored(f"Processing image at path: {image_path}", TOOL_COLOR)
        image_base64 = encode_image_to_base64(image_path)
        
        if image_base64.startswith("Error"):
            print_colored(f"Error encoding image: {image_base64}", TOOL_COLOR)
            return "I'm sorry, there was an error processing the image. Please try again.", False

        image_message = {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_base64}"
                    }
                },
                {
                    "type": "text",
                    "text": f"User input for image: {user_input}"
                }
            ]
        }
        conversation_history.append(image_message)
        http://logging.info("Image message added to conversation history.")
        print_colored("Image message added to conversation history", TOOL_COLOR)
    else:
        conversation_history.append({"role": "user", "content": user_input})
    
    messages = [{"role": "system", "content": update_system_prompt(current_iteration, max_iterations)}] + conversation_history
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=4000,
            functions=tools,
            function_call="auto"
        )
    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {str(e)}")
        print_colored(f"OpenAI API error: {str(e)}", TOOL_COLOR)
        return "I'm sorry, there was an error communicating with the AI. Please try again.", False
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        print_colored(f"Unexpected error: {str(e)}", TOOL_COLOR)
        return "An unexpected error occurred. Please try again.", False
    
    assistant_response = response.choices[0].message
    exit_continuation = False
    
    if assistant_response.get("function_call"):
        function_name = assistant_response["function_call"]["name"]
        function_args = json.loads(assistant_response["function_call"]["arguments"])
        
        print_colored(f"\nFunction Called: {function_name}", TOOL_COLOR)
        print_colored(f"Function Arguments: {function_args}", TOOL_COLOR)
        
        result = execute_tool(function_name, function_args)
        print_colored(f"Function Result: {result}", RESULT_COLOR)
        
        conversation_history.append({
            "role": "function",
            "name": function_name,
            "content": result
        })
        
        try:
            function_response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=messages + [
                    assistant_response,
                    {"role": "function", "name": function_name, "content": result}
                ],
                max_tokens=4000
            )
            assistant_response = function_response.choices[0].message
        except Exception as e:
            logging.error(f"Error in function response: {str(e)}")
            print_colored(f"Error in function response: {str(e)}", TOOL_COLOR)
            assistant_response = {"content": "I encountered an error while processing the function result. Please try again."}
    
    content = assistant_response.get("content", "")
    print_colored(f"\nGPT-4o: {content}", GPT_COLOR)
    
    if CONTINUATION_EXIT_PHRASE in content:
        exit_continuation = True
    
    conversation_history.append({"role": "assistant", "content": content})
    
    return content, exit_continuation

def process_and_display_response(response):
    if response.startswith("Error") or response.startswith("I'm sorry"):
        print_colored(response, TOOL_COLOR)
    else:
        if "```" in response:
            parts = response.split("```")
            for i, part in enumerate(parts):
                if i % 2 == 0:
                    print_colored(part, GPT_COLOR)
                else:
                    lines = part.split('\n')
                    language = lines[0].strip() if lines else ""
                    code = '\n'.join(lines[1:]) if len(lines) > 1 else ""
                    
                    if language and code:
                        print_code(code, language)
                    elif code:
                        print_colored(f"Code:\n{code}", GPT_COLOR)
                    else:
                        print_colored(part, GPT_COLOR)
        else:
            print_colored(response, GPT_COLOR)

def handle_automode(user_input):
    global automode
    try:
        parts = user_input.split()
        max_iterations = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else MAX_CONTINUATION_ITERATIONS
        
        automode = True
        http://logging.info(f"Entering automode with {max_iterations} iterations.")
        print_colored(f"Entering automode with {max_iterations} iterations. Press Ctrl+C to exit automode at any time.", TOOL_COLOR)
        
        user_input = input(f"\n{USER_COLOR}You: {Style.RESET_ALL}")
        
        iteration_count = 0
        while automode and iteration_count < max_iterations:
            response, exit_continuation = chat_with_gpt4o(user_input, current_iteration=iteration_count+1, max_iterations=max_iterations)
            process_and_display_response(response)

if exit_continuation or CONTINUATION_EXIT_PHRASE in response:
                print_colored("Automode completed.", TOOL_COLOR)
                http://logging.info("Automode completed.")
                automode = False
            else:
                print_colored(f"Continuation iteration {iteration_count + 1} completed.", TOOL_COLOR)
                print_colored("Press Ctrl+C to exit automode.", TOOL_COLOR)
                user_input = "Continue with the next step."
            
            iteration_count += 1
            
            if iteration_count >= max_iterations:
                print_colored("Max iterations reached. Exiting automode.", TOOL_COLOR)
                http://logging.info("Max iterations reached. Exiting automode.")
                automode = False
    except KeyboardInterrupt:
        http://logging.info("Automode interrupted by user.")
        print_colored("\nAutomode interrupted by user. Exiting automode.", TOOL_COLOR)
        automode = False
    finally:
        if conversation_history and conversation_history[-1]["role"] == "user":
            conversation_history.append({"role": "assistant", "content": "Automode interrupted. How can I assist you further?"})
        print_colored("Exited automode. Returning to regular chat.", TOOL_COLOR)

def main():
    global automode
    print_colored("Welcome to the GPT-4o Engineer Chat with Image Support!", GPT_COLOR)
    print_colored("Type 'exit' to end the conversation.", GPT_COLOR)
    print_colored("Type 'image' to include an image in your message.", GPT_COLOR)
    print_colored("Type 'automode [number]' to enter Autonomous mode with a specific number of iterations.", GPT_COLOR)
    print_colored("While in automode, press Ctrl+C at any time to exit the automode to return to regular chat.", GPT_COLOR)
    
    agent = GraphReaderAgent([])

    while True:
        try:
            user_input = input(f"\n{USER_COLOR}You: {Style.RESET_ALL}")
            
            if user_input.lower() == 'exit':
                print_colored("Thank you for chatting. Goodbye!", GPT_COLOR)
                http://logging.info("Chat ended by user.")
                break
            
            if user_input.lower() == 'image':
                image_path = input(f"{USER_COLOR}Drag and drop your image here: {Style.RESET_ALL}").strip().replace("'", "")
                
                if os.path.isfile(image_path):
                    user_input = input(f"{USER_COLOR}You (prompt for image): {Style.RESET_ALL}")
                    response, _ = chat_with_gpt4o(user_input, image_path)
                    process_and_display_response(response)
                else:
                    print_colored("Invalid image path. Please try again.", GPT_COLOR)
                    continue
            elif user_input.lower().startswith('automode'):
                handle_automode(user_input)
            elif user_input.startswith("C:\\") or user_input.startswith("/"):
                response = improve_website(user_input.strip())
                print_colored(response, RESULT_COLOR)
            else:
                response, _ = chat_with_gpt4o(user_input)
                process_and_display_response(response)
                manage_conversation_history(agent)
        except Exception as e:
            logging.error(f"An error occurred: {str(e)}")
            print_colored(f"An error occurred: {str(e)}", TOOL_COLOR)

if __name__ == "__main__":
    main()