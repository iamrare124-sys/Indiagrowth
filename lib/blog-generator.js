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
];

function buildSystemPrompt() {
  return `${siteConfig.aiPersonality}

BANNED PHRASES — never use any of these:
${BANNED_PHRASES.map((p) => `- "${p}"`).join('\n')}

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

    // Detect headings: ##, #, or **Bold**
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

  // Push remaining
  if (currentSection || buffer.length > 0) {
    sections.push({
      heading: currentSection?.heading || null,
      body: buffer.join('\n').trim(),
    });
  }

  // If no headings found, split by double newlines
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

function checkQuality(generated) {
  const text = `${generated.title} ${generated.rawContent}`.toLowerCase();
  let score = 10;

  BANNED_PHRASES.forEach((phrase) => {
    if (text.includes(phrase.toLowerCase())) score -= 1;
  });

  if (!generated.title || generated.title.length < 10) score -= 3;
  if (!generated.rawContent || generated.rawContent.length < 400) score -= 3;
  if (!generated.metaDescription) score -= 1;
  if (generated.content.sections.length < 2) score -= 1;

  return score;
}

async function humanizeContent(text) {
  const groq = getGroq();
  try {
    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content:
            'You are an editor. Rewrite the text to sound more natural and human. Break long sentences. Remove any AI-sounding phrases. Keep all facts and numbers intact. Keep section headings. Return only the rewritten text.',
        },
        { role: 'user', content: text },
      ],
    });
    return res.choices[0]?.message?.content || text;
  } catch {
    return text;
  }
}

export async function generatePost(story) {
  const groq = getGroq();
  const prompt = `Write a detailed blog post about this news story for Indian startup founders and investors:

Title: ${story.title}
Source: ${story.source}
Published: ${story.pubDate}
Summary: ${story.summary}
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
      const score = checkQuality(parsed);

      if (score >= 7) {
        // Humanize pass
        if (parsed.rawContent) {
          const humanized = await humanizeContent(parsed.rawContent);
          parsed.content = { ...parsed.content, rawContent: humanized, sections: parseSections(humanized) };
          parsed.rawContent = humanized;
        }
        return parsed;
      }

      lastResult = parsed;
    } catch (err) {
      console.error(`Generation attempt ${attempt} failed:`, err.message);
    }
  }

  return lastResult;
}

export async function rewritePostInLanguage(post, language) {
  // Stub for future multi-language support
  return post;
}
