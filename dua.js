export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userSituation, duaArabic, duaMeaning, duaType } = req.body;

  if (!userSituation) {
    return res.status(400).json({ error: 'Missing user situation' });
  }

  const prompt = `You are a warm, wise Muslim companion during Ramadan. Someone has just shared what they're going through and you are providing them with a relevant dua.

Their situation: "${userSituation}"

The dua selected for them: ${duaType}
Meaning: "${duaMeaning}"

Write a SHORT, warm personal message (3-5 sentences max) that:
- Acknowledges what they're going through with genuine empathy
- Connects their situation to why this specific dua is meaningful for them
- Ends with a gentle word of encouragement or hope
- Feels like a wise, caring friend — NOT a lecture or religious sermon
- May include subtle Nigerian/African cultural warmth if appropriate
- Does NOT repeat or explain the dua again
- Is NOT preachy, does not list rules or obligations
- Speaks directly to them as "you"

Write only the personal message, nothing else. No labels, no formatting.`;

  // Try Groq first
  if (process.env.GROQ_API_KEY) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.8
        })
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const message = data.choices?.[0]?.message?.content?.trim();
        if (message) {
          return res.status(200).json({ message, source: 'groq' });
        }
      }
    } catch (err) {
      console.error('Groq error:', err.message);
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.8 }
          })
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (message) {
          return res.status(200).json({ message, source: 'gemini' });
        }
      }
    } catch (err) {
      console.error('Gemini error:', err.message);
    }
  }

  // Final fallback
  const fallbacks = [
    "Whatever you're carrying right now, know that Allah is closer to you than you realize. This dua has carried millions of believers through moments exactly like yours. Make it your anchor today.",
    "It takes courage to acknowledge what you're feeling instead of pretending everything is fine. Allah loves the heart that comes to Him honestly. This dua is for exactly this kind of moment.",
    "Some burdens feel too heavy to name, but you just did. That's already something. Ramadan is the best time for duas like this — the gates are open, and your Lord is listening."
  ];

  return res.status(200).json({
    message: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    source: 'fallback'
  });
}
