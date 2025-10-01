import { useState } from "react";
import axios from "axios";

const BiblePage = () => {
  const [reference, setReference] = useState("");
  const [translation, setTranslation] = useState("kjv");
  const [scripture, setScripture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translations = [
    { id: "kjv", name: "King James Version" },
    { id: "web", name: "World English Bible" },
    { id: "clementine", name: "Clementine Vulgate" },
    { id: "almeida", name: "Almeida" },
    { id: "rccv", name: "RCCV" },
  ];

  const fetchScripture = async (ref = reference, trans = translation) => {
    if (!ref.trim()) {
      setError("Please enter a scripture reference");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://bible-api.com/${encodeURIComponent(ref)}?translation=${trans}`
      );
      setScripture(response.data);
      setError(null);
    } catch (err) {
      setError("Scripture reference not found. Please try again.");
      setScripture(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchScripture();
  };

  const handleTranslationChange = (e) => {
    const newTranslation = e.target.value;
    setTranslation(newTranslation);
    if (reference && scripture) {
      fetchScripture(reference, newTranslation);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-light text-gray-900 text-center">
            Holy Bible
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter reference (e.g., John 3:16)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
            />
            <select
              value={translation}
              onChange={handleTranslationChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
            >
              {translations.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Scripture Display */}
        {scripture && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900 mb-2">
                {scripture.reference}
              </h2>
              <p className="text-sm text-gray-500">
                {scripture.translation_name}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {scripture.verses.map((verse) => (
                <p
                  key={`${verse.chapter}-${verse.verse}`}
                  className="text-gray-800 leading-relaxed mb-4"
                >
                  <sup className="text-gray-500 mr-1">{verse.verse}</sup>
                  {verse.text}
                </p>
              ))}
            </div>

            {scripture.translation_note && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  {scripture.translation_note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!scripture && !error && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Enter a scripture reference to begin
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Examples: John 3:16, Genesis 1:1, Psalm 23
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <a
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BiblePage;
