export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Manejar solicitudes preflight (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { language, code, terminalHistory, messages } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const siliconKey = process.env.SILICONFLOW_API_KEY;

    // Mensaje de sistema (System Instruction)
    const systemPrompt = `
Actúas como un Mentor de Código e Infraestructura interactivo (AI Coach). Ayudas al usuario a aprender Git, Ansible e infraestructura como código de forma práctica.

Contexto actual del Playground:
- Lenguaje / Entorno: ${language || 'General'}
- Código/Playbook actual en el editor:
\`\`\`${language || ''}
${code || '(Vacío)'}
\`\`\`
- Historial de comandos ejecutados en la consola:
${(terminalHistory || []).map(h => `$ ${h}`).join('\n') || '(Ninguno aún)'}

Responde de forma clara, instructiva y constructiva en español. Utiliza formato Markdown de manera rica (con bloques de código y explicaciones legibles). Si el usuario pide analizar su trabajo, revisa errores de sintaxis, sugiere mejores prácticas y explica brevemente por qué.
    `.trim();

    // ── Caso 1: Utilizar Google Gemini ───────────────────────
    if (geminiKey) {
      const contents = [];
      
      // Mapear el historial de chat al formato de Gemini
      if (messages && messages.length > 0) {
        messages.forEach(m => {
          contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          });
        });
      }

      // Si el último mensaje no es del usuario (o el historial está vacío), inyectar un mensaje de inicio
      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: 'Hola' }]
        });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents
      };

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const answer = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';

      return respond({ role: 'assistant', content: answer });
    }

    // ── Caso 2: Utilizar SiliconFlow (DeepSeek-V3) ───────────
    if (siliconKey) {
      const chatMessages = [
        { role: 'system', content: systemPrompt }
      ];

      if (messages && messages.length > 0) {
        messages.forEach(m => {
          chatMessages.push({
            role: m.role,
            content: m.content
          });
        });
      }

      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siliconKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3',
          messages: chatMessages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SiliconFlow API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const answer = result.choices?.[0]?.message?.content || 'No pude generar una respuesta.';

      return respond({ role: 'assistant', content: answer });
    }

    // ── Caso 3: Fallback Mockup (Modo demostración local) ───
    const lastUserMessage = messages?.[messages.length - 1]?.content || '';
    let mockAnswer = `🤖 **[Modo de Demostración]** \n\nNo has configurado ninguna clave de API (\`GEMINI_API_KEY\` o \`SILICONFLOW_API_KEY\`) en tu archivo \`.env\`. `;
    
    if (lastUserMessage.toLowerCase().includes('analizar') || lastUserMessage.toLowerCase().includes('evaluar')) {
      if (language === 'ansible') {
        mockAnswer += `\n\nAquí tienes un análisis simulado de tu playbook Ansible:\n- **Sintaxis:** Correcta. El uso de \`hosts: localhost\` es ideal para simulaciones.\n- **Sugerencia:** Asegúrate de usar siempre \`become: yes\` solo si necesitas privilegios de root para evitar brechas de seguridad.\n- **Ejemplo:**\n\`\`\`yaml\n- name: Instalar nginx\n  apt:\n    name: nginx\n    state: present\n  become: yes\n\`\`\``;
      } else {
        mockAnswer += `\n\nAquí tienes un análisis simulado de tus comandos Git:\n- **Historial:** Veo que has usado comandos de inicialización (\`git init\`, \`git add\`).\n- **Buenas Prácticas:** Recuerda realizar commits descriptivos (\`git commit -m \"feat: mensaje\"\`).\n- **Tip:** Puedes verificar el estado con \`git status\` antes de cada commit.`;
      }
    } else {
      mockAnswer += `\n\nSin embargo, el panel de chat está completamente funcional. Has preguntado: *"${lastUserMessage || 'Hola'}"*.\n\nPara interactuar con la IA real, añade tu clave en \`packages/dev-codigo/.env\` e inicia Vercel dev.`;
    }

    return respond({ role: 'assistant', content: mockAnswer });

  } catch (err) {
    console.error('[coach] Edge function error:', err);
    return respond({ error: err.message }, 500);
  }
}

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
