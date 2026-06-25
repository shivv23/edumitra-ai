"""Multimodal Agent — image analysis and text extraction via Gemini Vision.

Security: never accepts user-supplied URLs; images are always server-side stored objects.
"""

import asyncio
import logging
import base64
from typing import Any, Dict, Optional

from google.genai import types as genai_types
from agents.llm import get_gemini_client

logger = logging.getLogger(__name__)

_VISION_SYSTEM_PROMPT = (
    "You are an AI assistant that analyzes images for educational purposes. "
    "The image contains handwritten notes, diagrams, or textbook content from an Indian student. "
    "Describe what you see, extract any text content, and provide a helpful summary. "
    "If the content is in Hindi or another Indian language, respond in that language. "
    "Be concise and educational. Do NOT include HTML in your response."
)


async def analyze_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """Analyze an image (handwritten notes, textbook, diagram) and return analysis + summary.

    Args:
        image_bytes: Raw image bytes (JPEG, PNG, or WebP).
        mime_type: MIME type of the image.

    Returns:
        Dict with 'analysis' (detailed) and 'summary' (short) keys.
    """
    logger.info("Analyzing image: %d bytes, type=%s", len(image_bytes), mime_type)

    try:
        client = get_gemini_client()

        img = genai_types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=["Analyze this educational image. Extract all text and describe any diagrams.", img],
            config=genai_types.GenerateContentConfig(
                system_instruction=_VISION_SYSTEM_PROMPT,
                max_output_tokens=1000,
                temperature=0.3,
            ),
        )

        full_text = response.text or ""

        summary_response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=[f"Summarize this in 2-3 sentences:\n\n{full_text}"],
            config=genai_types.GenerateContentConfig(
                max_output_tokens=200,
                temperature=0.2,
            ),
        )

        summary = summary_response.text.strip() if summary_response.text else full_text[:200]

        return {
            "analysis": full_text,
            "summary": summary,
        }
    except Exception as e:
        logger.error("Image analysis failed: %s", e)
        return {
            "analysis": f"Image analysis encountered an issue: {str(e)}",
            "summary": "Could not analyze the image. Please try again with a clearer image.",
        }


async def extract_text_from_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Optional[str]:
    """Extract text from an image using OCR via Gemini Vision.

    Args:
        image_bytes: Raw image bytes.
        mime_type: MIME type of the image.

    Returns:
        Extracted text, or None if extraction fails.
    """
    logger.info("Extracting text from image: %d bytes", len(image_bytes))

    try:
        client = get_gemini_client()

        img = genai_types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=["Extract all text from this image. Preserve the original language. Output only the extracted text.", img],
            config=genai_types.GenerateContentConfig(
                max_output_tokens=2000,
                temperature=0.1,
            ),
        )

        return response.text.strip() if response.text else None
    except Exception as e:
        logger.error("Text extraction failed: %s", e)
        return None
