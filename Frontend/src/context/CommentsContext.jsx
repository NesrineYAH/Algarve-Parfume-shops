import { createContext, useEffect, useState } from "react";

export const CommentsContext = createContext();

export function CommentsProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/comments")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (c) =>
            c.isApproved &&
            (c.type === "brand" || c.type === "experience")
        );
        setComments(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <CommentsContext.Provider value={{ comments, loading }}>
      {children}
    </CommentsContext.Provider>
  );
}
