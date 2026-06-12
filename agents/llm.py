"""Shared LLM client helpers for EduMitra agents.

Loads API keys from environment or .env file once at import time.
"""

import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

_loaded = False


def _ensure_env():
    global _loaded
    if _loaded:
        return
    # Try loading .env from multiple locations
    candidates = [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
    ]
    for p in candidates:
        if p.exists():
            try:
                from dotenv import load_dotenv
                load_dotenv(p, override=False)
                logger.info("Loaded env from %s", p)
                break
            except Exception:
                pass
    _loaded = True


def get_gemini_key() -> str:
    _ensure_env()
    key = os.environ.get("GEMINI_API_KEY", "placeholder")
    return key


def get_gemini_client():
    from google import genai
    key = get_gemini_key()
    return genai.Client(api_key=key)


def get_gemini_model(model: str = "gemini-2.5-flash") -> str:
    return model


def get_claude_key() -> str:
    _ensure_env()
    key = os.environ.get("CLAUDE_API_KEY", "placeholder")
    return key


def get_claude_client():
    from anthropic import Anthropic
    key = get_claude_key()
    return Anthropic(api_key=key)


async def claude_chat(
    message: str,
    system_prompt: str = "You are EduMitra, an AI tutor for Indian students.",
    max_tokens: int = 1024,
    temperature: float = 0.5,
) -> str:
    """Send a chat message to Claude and return the response text."""
    try:
        client = get_claude_client()
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": message}],
        )
        return msg.content[0].text if msg.content else ""
    except Exception as e:
        logger.warning("Claude chat failed: %s", e)
        return ""
