import os
from dotenv import load_dotenv
import requests

# Configuração
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={API_KEY}"

# Validação da chave
if not API_KEY:
    raise ValueError("""
    ❌ Erro: Chave da API não encontrada.
    Solução:
    1. Crie um arquivo .env na raiz do projeto
    2. Adicione: GEMINI_API_KEY=sua_chave_aqui
    3. Nunca comite o .env no Git!
    """)

def ask_gemini(prompt, temperature=0.7, max_tokens=2000):
    """
    Envia uma solicitação para a API do Gemini
    Parâmetros:
    - prompt: Sua pergunta/instrução
    - temperature: Criatividade (0-1)
    - max_tokens: Tamanho da resposta
    """
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }

    try:
        response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=10  # Timeout em segundos
        )
        response.raise_for_status()
        
        resposta = response.json()
        if "candidates" in resposta:
            return resposta["candidates"][0]["content"]["parts"][0]["text"]
        return resposta
        
    except requests.exceptions.RequestException as e:
        error_msg = f"Erro na API: {str(e)}"
        if hasattr(e, 'response') and e.response:
            error_msg += f"\nDetalhes: {e.response.text}"
        return error_msg

# Exemplo de uso
if __name__ == "__main__":
    resposta = ask_gemini(
        "Explique como usar a API do Gemini com segurança em 50 palavras.",
        temperature=0.3
    )
    print("Resposta da API:")
    print(resposta)
