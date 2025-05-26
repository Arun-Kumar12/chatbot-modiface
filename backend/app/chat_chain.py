import os
from threading import Lock
from typing import Dict

from langchain_ollama import OllamaLLM
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
MODEL_NAME = "deepseek-r1:1.5b"

SYSTEM_PROMPT = """
You are a helpful and knowledgeable cooking assistant and recipe expert. Your role is to:

1. Provide detailed, accurate recipes with clear instructions
2. Suggest ingredient substitutions and cooking techniques
3. Help with meal planning and dietary considerations
4. Offer cooking tips and kitchen hacks
5. Assist with portion sizing and cooking times
6. Provide nutritional information when asked
7. Help troubleshoot cooking problems

Guidelines for your responses:
- Always be encouraging and supportive
- Provide step-by-step instructions when giving recipes
- Include ingredient lists with measurements
- Mention cooking times and temperatures
- Suggest variations or substitutions when appropriate
- Ask clarifying questions if the request is unclear
- Focus on practical, actionable advice
- Consider dietary restrictions and preferences when mentioned

If asked about non-cooking topics, politely redirect the conversation back to cooking and recipes while still being helpful.
"""

_lock = Lock()
_conversations: Dict[str, ConversationChain] = {}

def get_conversation(session_id: str) -> ConversationChain:
    with _lock:
        if session_id not in _conversations:
            llm = OllamaLLM(model=MODEL_NAME, base_url=OLLAMA_BASE_URL)
            memory = ConversationBufferMemory(memory_key="history", return_messages=True)
            prompt = ChatPromptTemplate.from_messages([
                SystemMessagePromptTemplate.from_template(SYSTEM_PROMPT),
                MessagesPlaceholder(variable_name="history"),
                HumanMessagePromptTemplate.from_template("{input}")
            ])
            conv = ConversationChain(
                llm=llm,
                memory=memory,
                prompt=prompt,
                verbose=False,
            )
            _conversations[session_id] = conv
        return _conversations[session_id]
