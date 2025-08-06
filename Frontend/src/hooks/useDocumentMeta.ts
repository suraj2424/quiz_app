// hooks/useDocumentMeta.ts
import { useEffect } from 'react';

export const useDocumentMeta = () => {
  useEffect(() => {
    document.title = "Quizin' - Solve Quizzes to Learn";
    
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    setMetaTag('description', 'Interactive learning platform with engaging quizzes. Test your knowledge, track progress, and learn effectively with Quizin\'s adaptive difficulty system.');
    setMetaTag('keywords', 'quiz, learning, education, interactive, knowledge, test, study, online learning');
  }, []);
};