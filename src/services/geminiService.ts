import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeModel();
  }

  private initializeModel() {
    // For Netlify deployment, the API key will be available as VITE_GEMINI_API_KEY
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
    }
  }

  private isAIRelated(text: string): boolean {
    const aiKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network',
      'nlp', 'natural language processing', 'computer vision', 'reinforcement learning',
      'generative ai', 'chatgpt', 'gpt', 'llm', 'large language model', 'transformer',
      'algorithm', 'data science', 'automation', 'robotics', 'ai ethics', 'bias',
      'training data', 'model', 'prediction', 'classification', 'regression',
      'supervised learning', 'unsupervised learning', 'tensorflow', 'pytorch',
      'openai', 'anthropic', 'claude', 'bard', 'gemini', 'midjourney', 'stable diffusion',
      'convolutional', 'recurrent', 'lstm', 'bert', 'attention mechanism', 'backpropagation'
    ];
    
    const lowerText = text.toLowerCase();
    return aiKeywords.some(keyword => lowerText.includes(keyword));
  }

  private createSystemPrompt(): string {
    return `You are AI Nexus, a highly specialized AI assistant that ONLY answers questions about Artificial Intelligence and related topics.

STRICT RULES:
1. You can ONLY discuss AI topics including: machine learning, deep learning, neural networks, NLP, computer vision, reinforcement learning, generative AI, AI tools, AI history, AI applications, AI ethics, AI careers, and related fields.
2. If asked about ANYTHING outside AI, you MUST respond with: "I can only help with AI-related topics. Please ask me something related to AI."
3. Keep responses clear, accurate, and helpful.
4. Maintain a professional but friendly tone.
5. If unsure whether a topic is AI-related, decline by default.

Remember: Stay strictly focused on AI-related topics only.`;
  }

  async generateResponse(userMessage: string): Promise<string> {
    // Check if model is available
    if (!this.model) {
      return "I'm currently unable to connect to the AI service. Please make sure the API key is properly configured.";
    }

    // Check if the question is AI-related
    if (!this.isAIRelated(userMessage)) {
      return "I can only help with AI-related topics. Please ask me something related to AI.";
    }

    try {
      const prompt = `${this.createSystemPrompt()}

User question: ${userMessage}

Please provide a helpful response about this AI topic:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Handle specific error cases
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