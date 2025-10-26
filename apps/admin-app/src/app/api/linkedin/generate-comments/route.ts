import OpenAI from 'openai';

export const runtime = 'nodejs';

function fallbackComments(tone: string) {
  if (tone === 'friendly') {
    return [
      "Merci pour le partage, super intéressant ! ",
      "J'adore cette perspective – très inspirant !",
      "Exactement ce dont j'avais besoin aujourd'hui, merci 🙌",
    ];
  }
  if (tone === 'playful') {
    return [
      "Wow, c’est du solide ! On imprime et on colle au mur ? 😄",
      "Je prends des notes… et un café. Super post ☕",
      "On adore ce genre d’idées qui boostent la semaine ! 🚀",
    ];
  }
  return [
    "Très bons points. Merci pour cette analyse claire.",
    "Approche pertinente et applicable au quotidien. Merci du partage.",
    "Excellente synthèse. Je rejoins vos conclusions.",
  ];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tone: 'professional' | 'friendly' | 'playful' = body.tone ?? 'professional';
    const snippet: string = body.snippet ?? '';

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return Response.json({ comments: fallbackComments(tone) });
    }

    const openai = new OpenAI({ apiKey });

    const system = `Tu es un assistant qui génère des commentaires LinkedIn en français. 
- 3 commentaires courts (1 à 2 phrases), adaptés au ton: ${tone}.
- Jamais de hashtags.
- Sans excès d'emojis (0-1 max).
- Le commentaire doit être naturel et contextuel.`;

    const user = `Extrait du post (optionnel): ${snippet || 'N/A'}\nGénère exactement un tableau JSON de 3 chaînes, rien d'autre.`;

    const resp = await openai.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    });

    const content = resp.choices[0]?.message?.content || '';
    let comments: string[] | undefined;
    try {
      const parsed = JSON.parse(content);
      // Accept either { comments: [...] } or [ ... ]
      comments = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.comments) ? parsed.comments : undefined;
    } catch {
      comments = undefined;
    }

    if (!comments || comments.length === 0) {
      comments = fallbackComments(tone);
    }

    return Response.json({ comments });
  } catch (e: any) {
    return Response.json({ comments: fallbackComments('professional'), error: e?.message }, { status: 200 });
  }
}
