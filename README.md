# 🎯 Admission Consulting Chatbot using Retrieval-Augmented Generation (RAG)

### 📍 Course: Foundational Thesis – College of Information and Communication Technology  
### 👨‍🏫 Supervisor: Dr. Pham The Phi  
### 🏫 Can Tho University  

---

## 👨‍💻 Author
- **Name**: Nguyen Minh Nhut  
- **Student ID**: B2205896  
- **Class**: K48 – Information Technology  
- **Institution**: College of Information and Communication Technology, Can Tho University  

---

## 📌 Project Overview
This project focuses on building an **Admission Consulting Chatbot** integrated into **Facebook Messenger**, using the **Retrieval-Augmented Generation (RAG)** approach.  
The system retrieves information from official admission documents and generates accurate and natural responses through the GPT-4o-mini model.

The chatbot is designed to help students and parents quickly access information about admission scores, programs, eligibility conditions, and application procedures.

---

## 🔧 System Implementation

### ⚙️ Environment Setup
- **Backend**: Node.js, Express.js
- **AI Models**:
  - Text Embedding Model: `text-embedding-3-small` (via OpenAI API)
  - Text Generation Model: `GPT-4o-mini` (via OpenAI API)
- **Database**: FAISS (Facebook AI Similarity Search) for vector search
- **Hosting**: Render Cloud Server
- **Messenger Integration**: Webhooks, Facebook Developer API

### 🛠 Deployment Process
1. **Data Collection**:
   - Gather official documents: admission regulations, admission schemes, score lists.

2. **Data Preprocessing**:
   - Clean and normalize text (remove noise, correct punctuation, divide into chunks 100–300 words).

3. **Embedding and Storage**:
   - Create document embeddings using OpenAI.
   - Store embeddings in FAISS database for fast vector search.

4. **Chatbot Workflow**:
   - User sends a message to Facebook Messenger.
   - Server converts the message to embedding.
   - FAISS retrieves related content.
   - GPT-4o-mini generates the final natural-language response.
   - Response is sent back to the user via Messenger.

## 📈 Results
- Integrated successfully into Facebook Messenger.
- Achieved **Precision: 0.8921**, **Recall: 0.9363**, **F1-score: 0.9130** according to **BERTScore** evaluation.
- Demonstrated high accuracy and real-time response.
- Able to answer ~500 queries within 10 minutes under load testing.

---

## 🛠 Technologies Used
- Node.js
- Express.js
- OpenAI API (Embeddings + GPT-4o-mini)
- FAISS Vector Database
- LangChain
- Facebook Messenger Webhooks(Facebook Developer)

---

## 📌 Notes
- This project is academic work completed for the Foundational Thesis.
- Future improvements include:
  - Expanding chatbot capabilities for multiple schools.
  - Adding context memory for more natural multi-turn conversations.
  - Improving error handling for better robustness.

---
