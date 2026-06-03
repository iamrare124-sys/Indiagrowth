import Groq from 'groq-sdk';
import siteConfig from '../config/site.config.js';
import slugify from 'slugify';

let _groq = null;

function getGroq() {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

const BANNED_PHRASES = [
  'Furthermore',
  'Moreover',
  'In this article',
  'It is important to note',
  'Delve into',
  'In conclusion',
  'Robust',
  'Comprehensive',
  'Leverage',
  'Utilize',
  'Paradigm',
  'Synergy',
  'Game-changer',
  'Groundbreaking',
  'It is worth noting',
  'It should be noted',
  'One must consider',
  'In light of',
  'With regard to',
  'It is important to',
  'Needless to say',
  'As previously mentioned',
  'It goes without saying',
  'In terms of',
];

const AI_PATTERNS = [
  'it is worth noting',
  'it should be noted',
  'one must consider',
  'in light of',
  'with regard to',
  'it is important to',
  'needless to say',
  'as previously mentioned',
  'it goes without saying',
  'in terms of',
];

function buildSystemPrompt() {
  return `${siteConfig.aiPersonality}

BANNED PHRASES — never use any of these:
${BANNED_PHRASES.map((p) => `- "${p}"`).join('\n')}

ANTI-AI-DETECTION RULES (follow these strictly):
1. VARY sentence length aggressively: 4 words. Then a much longer sentence that builds on the previous point with specific detail. Then medium. Never 3 sentences same length in a row.
2. USE contractions always: it's, don't, won't, here's, that's, they're
3. START 2-3 sentences with "And" or "But" — real journalists do this
4. ADD one personal aside per section: "And honestly?", "Here's the thing —", "Look,", "Real talk:"
5. INCLUDE one rhetorical question per article
6. USE em-dashes for interruptions — like this — instead of commas
7. NUMBERS in first paragraph always — specific, not vague
8. ONE opinion stated as fact: "This is the most important development in weeks."
9. ACTIVE voice always. Never passive.
10. SHORT punchy first sentence — under 10 words.

OUTPUT FORMAT (use exactly these labels, each on its own line):
TITLE: [catchy headline under 80 chars]
META_TITLE: [SEO title under 60 chars]
META_DESC: [meta description 120-155 chars]
TAGS: [tag1, tag2, tag3, tag4, tag5]
CATEGORY: [one of: funding-news, startup-stories, product-launches, founder-tips]
CONTENT:
[Write 800-1200 words. Use ## for section headings. Start with a compelling hook paragraph. Include specific Indian startup names, VCs, founder backgrounds. Use rupees/crore for amounts. Be opinionated and direct.]
FAQ:
Q1: [question]
A1: [answer 2-3 sentences]
Q2: [question]
A2: [answer 2-3 sentences]
Q3: [question]
A3: [answer 2-3 sentences]
Q4: [question]
A4: [answer 2-3 sentences]
END`;
}

function parseSections(content) {
  if (!content) return [];

  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let buffer = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      if (buffer.length > 0 || currentSection) {
        if (currentSection) {
          sections.push({ ...currentSection, body: buffer.join('\n').trim() });
        } else if (buffer.length > 0) {
          sections.push({ heading: null, body: buffer.join('\n').trim() });
        }
        buffer = [];
      }
      currentSection = {
        heading: trimmed.replace(/^#{1,3}\s+/, '').replace(/\*\*/g, ''),
      };
    } else if (trimmed.match(/^\*\*[^*]+\*\*$/) && trimmed.length < 80) {
      if (buffer.length > 0 || currentSection) {
        if (currentSection) {
          sections.push({ ...currentSection, body: buffer.join('\n').trim() });
        } else if (buffer.length > 0) {
          sections.push({ heading: null, body: buffer.join('\n').trim() });
        }
        buffer = [];
      }
      currentSection = { heading: trimmed.replace(/\*\*/g, '') };
    } else {
      if (trimmed) buffer.push(trimmed);
    }
  }

  if (currentSection || buffer.length > 0) {
    sections.push({
      heading: currentSection?.heading || null,
      body: buffer.join('\n').trim(),
    });
  }

  if (sections.length <= 1 && sections[0]?.body) {
    const paragraphs = sections[0].body
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 50);
    if (paragraphs.length > 1) {
      return paragraphs.map((p) => ({ heading: null, body: p.trim() }));
    }
  }

  return sections.filter((s) => s.body && s.body.length > 10);
}

function parseFAQ(text) {
  const faqs = [];
  const qPattern = /Q(\d+):\s*(.+?)(?=A\d+:|$)/gs;
  const aPattern = /A(\d+):\s*(.+?)(?=Q\d+:|END|$)/gs;

  const questions = [...text.matchAll(qPattern)];
  const answers = [...text.matchAll(aPattern)];

  for (let i = 0; i < Math.min(questions.length, answers.length); i++) {
    faqs.push({
      question: questions[i][2].trim(),
      answer: answers[i][2].trim(),
    });
  }
  return faqs;
}

function parseOutput(raw) {
  const extract = (label) => {
    const regex = new RegExp(`${label}:\\s*([^\\n]+)`);
    const match = raw.match(regex);
    return match ? match[1].trim() : '';
  };

  const contentMatch = raw.match(/CONTENT:\s*([\s\S]+?)(?=FAQ:|END|$)/);
  const faqMatch = raw.match(/FAQ:\s*([\s\S]+?)(?=END|$)/);

  const rawContent = contentMatch ? contentMatch[1].trim() : '';
  const sections = parseSections(rawContent);
  const faqs = faqMatch ? parseFAQ(faqMatch[1]) : [];

  const title = extract('TITLE');
  const slug = slugify(title, { lower: true, strict: true }).substring(0, 80);

  return {
    title,
    slug,
    metaTitle: extract('META_TITLE') || title,
    metaDescription: extract('META_DESC'),
    tags: extract('TAGS')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    category: extract('CATEGORY') || 'startup-stories',
    content: { hook: sections[0]?.body || '', sections, rawContent },
    faqs,
    rawContent,
  };
}

function checkQuality(generated, attempt) {
  const text = `${generated.title} ${generated.rawContent}`.toLowerCase();
  let score = 10;

  BANNED_PHRASES.forEach((phrase) => {
    if (text.includes(phrase.toLowerCase())) score -= 1;
  });

  if (!generated.title || generated.title.length < 10) score -= 3;
  if (!generated.rawContent || generated.rawContent.length < 400) score -= 3;
  if (!generated.metaDescription) score -= 1;
  if (generated.content.sections.length < 2) score -= 1;

  // AI pattern detection
  const hasAiPattern = AI_PATTERNS.some((p) =>
    text.includes(p.toLowerCase())
  );
  if (hasAiPattern) {
    console.warn(`Attempt ${attempt}: AI pattern detected, retrying`);
    score -= 2;
  }

  return score;
}

async function humanizeContent(rawContent) {
  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.9,
      messages: [
        {
          role: 'user',
          content: `Rewrite this article to sound like a real human journalist wrote it.

RULES:
1. Break long sentences into 2-3 shorter ones
2. Add 1-2 conversational asides like "And honestly?" or "Here's the thing —"
3. Use contractions: "it's", "don't", "here's", "that's"
4. Start 2-3 sentences with "And" or "But" (humans do this, AI avoids it)
5. Add one slightly informal phrase per section
6. Remove any remaining formal/academic phrasing
7. Keep all facts, numbers, and quotes EXACTLY the same
8. Keep the same structure and headings
9. Output ONLY the rewritten article, no preamble

ARTICLE:
${rawContent}`,
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || rawContent;
  } catch {
    return rawContent; // fallback to original if humanize fails
  }
}

export async function generatePost(story) {
  const groq = getGroq();
  const prompt = `Write a detailed blog post about this news story for Indian startup founders and investors:

Title: ${story.title}
Source: ${story.source}
Published: ${story.pubDate}
Summary: ${story.description || story.summary || ''}
Link: ${story.link}

Write the full blog post following the output format exactly.`;

  let lastResult = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.85,
        frequency_penalty: 0.4,
        presence_penalty: 0.3,
        max_tokens: 3000,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: prompt },
        ],
      });

      const raw = res.choices[0]?.message?.content || '';
      const parsed = parseOutput(raw);
      const score = checkQuality(parsed, attempt);

      if (score >= 7) {
        // Humanize pass
        if (parsed.rawContent) {
          const humanized = await humanizeContent(parsed.rawContent);
          parsed.content = {
            ...parsed.content,
            rawContent: humanized,
            sections: parseSections(humanized),
          };
          parsed.rawContent = humanized;
        }
        return parsed;
      }

      lastResult = parsed;
      console.warn(`Attempt ${attempt} scored ${score}/10, retrying...`);
    } catch (err) {
      console.error(`Generation attempt ${attempt} failed:`, err.message);
    }
  }

  // Return best effort even if score was low
  if (lastResult?.rawContent) {
    const humanized = await humanizeContent(lastResult.rawContent);
    lastResult.content = {
      ...lastResult.content,
      rawContent: humanized,
      sections: parseSections(humanized),
    };
    lastResult.rawContent = humanized;
  }

  return lastResult;
}

export async function rewritePostInLanguage(post, language) {
  // Stub for future multi-language support
  return post;
}
