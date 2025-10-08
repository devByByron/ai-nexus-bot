
import { GoogleGenerativeAI } from '@google/generative-ai';

// Enhanced AI topic detection with misspelling tolerance
function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

function isAIRelated(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  
  // Comprehensive AI terms including common variations and misspellings
  const aiTerms = [
    // Core AI terms
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network',
    'nlp', 'natural language processing', 'computer vision', 'reinforcement learning',
    'generative ai', 'chatgpt', 'gpt', 'llm', 'large language model', 'transformer',
    'algorithm', 'data science', 'automation', 'robotics', 'ai ethics', 'bias',
    'training data', 'model', 'prediction', 'classification', 'regression',
    'supervised learning', 'unsupervised learning', 'tensorflow', 'pytorch',
    'openai', 'anthropic', 'claude', 'bard', 'gemini', 'midjourney', 'stable diffusion',
    'convolutional', 'recurrent', 'lstm', 'bert', 'attention mechanism', 'backpropagation',
    'neural', 'cognitive', 'intelligent', 'smart', 'learning', 'training',
    
    // Additional comprehensive terms
    'ai applications', 'artificial neural networks', 'machine intelligence', 'computational intelligence',
    'expert systems', 'knowledge graphs', 'semantic analysis', 'sentiment analysis',
    'image recognition', 'speech recognition', 'voice ai', 'conversational ai',
    'ai agents', 'intelligent agents', 'ai models', 'ai algorithms', 'ai systems',
    'ai technology', 'ai tools', 'ai software', 'ai development', 'ai research',
    'ai history', 'ai future', 'ai trends', 'ai careers', 'ai jobs',
    'prompt engineering', 'fine tuning', 'transfer learning', 'federated learning',
    'gan', 'generative adversarial networks', 'diffusion models', 'variational autoencoders',
    'rnn', 'cnn', 'attention', 'self attention', 'multi head attention',
    'artificial neuron', 'perceptron', 'multilayer perceptron', 'gradient descent',
    'ai safety', 'ai alignment', 'ai governance', 'explainable ai', 'xai',
    'automated machine learning', 'automl', 'neural architecture search',
    'edge ai', 'tinyml', 'quantum machine learning', 'neuromorphic computing'
  ];

  // Check for direct matches
  for (const term of aiTerms) {
    if (lowerText.includes(term)) {
      return true;
    }
  }

  // Check for misspellings with tolerance (edit distance)
  const words = lowerText.split(/\s+/);
  const commonMisspellings = {
    'ai': ['ay', 'aI', 'AI'],
    'artificial': ['artifical', 'artficial', 'artificail'],
    'intelligence': ['inteligence', 'intellegence', 'intelligance', 'inteligance'],
    'machine': ['machien', 'machin', 'mashine'],
    'learning': ['learining', 'learing', 'learnign'],
    'neural': ['neurl', 'nueral', 'neurall'],
    'network': ['netwrok', 'netowrk', 'netowork'],
    'deep': ['dep', 'deap', 'deeep'],
    'algorithm': ['algoritm', 'algorith', 'algorithem'],
    'model': ['modle', 'modell', 'mdoel'],
    'training': ['trainig', 'traning', 'trainging'],
    'generative': ['generativ', 'genarative', 'generetive'],
    'natural': ['natral', 'naturel', 'natrual'],
    'language': ['languag', 'langauge', 'languge'],
    'processing': ['procesing', 'proccessing', 'processsing'],
    'computer': ['compuer', 'computr', 'comuter'],
    'vision': ['vison', 'visoin', 'viison'],
    'reinforcement': ['reinforcment', 'reinforcemnt', 'reinforsement']
  };

  // Check for misspellings
  for (const word of words) {
    // Skip very short words to avoid false positives
    if (word.length < 3) continue;
    
    for (const [correct, misspellings] of Object.entries(commonMisspellings)) {
      if (misspellings.includes(word) || (word.length >= 3 && calculateLevenshteinDistance(word, correct) <= 2)) {
        return true;
      }
    }
  }

  // Enhanced pattern matching for AI-related questions
  const aiPatterns = [
    // Basic AI questions
    /what\s+is\s+ai/i,
    /what\s+is\s+artificial\s+intelligence/i,
    /how\s+does\s+ai\s+work/i,
    /what\s+are\s+ai/i,
    /define\s+ai/i,
    /explain\s+ai/i,
    /tell\s+me\s+about\s+ai/i,
    
    // Machine learning patterns
    /machine\s+learning/i,
    /deep\s+learning/i,
    /neural\s+network/i,
    /supervised\s+learning/i,
    /unsupervised\s+learning/i,
    /reinforcement\s+learning/i,
    
    // AI applications and tools
    /ai\s+(model|algorithm|system|tool|application|technology)/i,
    /types\s+of\s+ai/i,
    /ai\s+applications/i,
    /future\s+of\s+ai/i,
    /history\s+of\s+ai/i,
    /ai\s+trends/i,
    /ai\s+ethics/i,
    /ai\s+safety/i,
    
    // Specific AI technologies
    /natural\s+language\s+processing/i,
    /computer\s+vision/i,
    /generative\s+ai/i,
    /large\s+language\s+model/i,
    /transformer/i,
    /attention\s+mechanism/i,
    
    // Common AI tools and frameworks
    /chatgpt/i,
    /gpt/i,
    /claude/i,
    /bard/i,
    /gemini/i,
    /tensorflow/i,
    /pytorch/i,
    /openai/i,
    /anthropic/i,
    
    // Misspelling patterns
    /artifical\s+intelligence/i,
    /machien\s+learning/i,
    /dep\s+learning/i,
    /neurl\s+network/i,
    /naturel\s+language/i
  ];

  for (const pattern of aiPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeModel();
  }

  private initializeModel() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
    }
  }

  private createSystemPrompt(): string {
    return `You are AI Nexus, a highly specialized and comprehensive AI assistant that ONLY answers questions about Artificial Intelligence and related topics.

CORE MISSION:
- Provide expansive, detailed, and educational responses about all aspects of AI
- Make AI concepts accessible to users of all technical levels
- Be forgiving of misspellings and interpret user intent correctly
- Expand on topics to provide comprehensive understanding

STRICT RULES:
1. You can ONLY discuss AI topics including: machine learning, deep learning, neural networks, NLP, natural language processing, computer vision, reinforcement learning, generative AI, AI tools, AI history, AI applications, AI ethics, AI careers, AI research, AI safety, AI alignment, prompt engineering, and all related fields.

2. If asked about ANYTHING outside AI, you MUST respond with: "I can only help with AI-related topics. Please ask me something related to AI."

3. MISSPELLING TOLERANCE: If you detect common misspellings of AI terms (like "artifical intelligence", "machien learning", "dep learning", "neurl network", etc.), interpret them correctly and provide the response as if they were spelled correctly.

4. COMPREHENSIVE RESPONSES: Always provide detailed, well-structured responses that:
   - Define key terms and concepts clearly
   - Include practical examples when relevant
   - Explain both basic and advanced aspects
   - Connect related concepts
   - Provide context and background information
   - Include current trends and developments when appropriate

5. EDUCATIONAL APPROACH: Structure responses to be educational by:
   - Starting with fundamental concepts
   - Building up to more complex ideas
   - Using analogies for difficult concepts
   - Providing real-world applications
   - Mentioning key researchers, companies, or breakthroughs when relevant

6. ADAPTIVE RESPONSES: Tailor your response depth to the question complexity while always being comprehensive.

7. Maintain a professional but engaging and enthusiastic tone about AI topics.

RESPONSE STRUCTURE (when appropriate):
- Brief definition/overview
- Key concepts and components
- How it works (technical explanation adapted to question complexity)
- Applications and examples
- Current state and future prospects
- Related concepts or further reading suggestions

FORMATTING GUIDELINES:
- Use **bold text** for key terms and important concepts
- Structure responses with clear sections using descriptive headers followed by colons
- Use numbered lists for step-by-step explanations
- Use bullet points for feature lists or examples
- Keep paragraphs concise and well-spaced for readability
- Use backticks around technical terms, code, or specific AI model names
- End with a brief summary or key takeaway when appropriate`;
  }

  async generateResponse(userMessage: string): Promise<string> {
    if (!this.model) {
      return "I'm currently unable to connect to the AI service. Please make sure the API key is properly configured.";
    }

    // Check if the question is AI-related
    if (!isAIRelated(userMessage)) {
      return "I can only help with AI-related topics. Please ask me something related to AI.";
    }

    try {
      const prompt = `${this.createSystemPrompt()}

User question: "${userMessage}"

INSTRUCTIONS FOR THIS RESPONSE:
1. If the user's question contains misspellings of AI terms, interpret them correctly and respond as if they were spelled properly.
2. Provide a comprehensive, educational response that expands on the AI concept(s) mentioned.
3. Structure your response to be informative and accessible.
4. Include relevant examples, applications, and context.
5. If the question is basic (like "what is AI"), provide a thorough introduction that covers multiple aspects.

Please provide a detailed and comprehensive response about this AI topic:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API error:', error);

      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          return "There's an issue with the API configuration. Please check that your Gemini API key is valid.";
        }
        if (error.message.includes('QUOTA_EXCEEDED')) {
          return "The AI service is currently at capacity. Please try again later.";
        }
        if (error.message.includes('SAFETY')) {
          return "I can only provide information about AI topics in a safe and helpful manner. Please rephrase your question.";
        }
      }

      return "I encountered an error while processing your request. Please try asking your AI question again.";
    }
  }

  isAvailable(): boolean {
    return this.model !== null;
  }
}

export const geminiService = new GeminiService();

